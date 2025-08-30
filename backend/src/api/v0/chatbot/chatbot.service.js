import loggingService from "../logging/logging.service.js";
import dashboardService from "../dashboard/dashboard.service.js";
import Food from "../library/food.model.js";
import Exercise from "../library/exercise.model.js";

const conversationStates = {
  INITIAL: {
    message: (ctx) =>
      `Hi ${ctx.userName}! I'm your AI assistant. How can I help?`,
    options: ["Log Activity", "View Today's Summary", "Check My Fitness Plan"],
  },
  LOG_ACTIVITY: {
    message: () => "What would you like to log?",
    options: ["Meal", "Workout", "Water"],
  },
  // MEAL LOGGING FLOW
  LOG_MEAL_SEARCH: {
    message: () => "What food would you like to log? Start typing to search...",
    expectsUserInput: true,
    action: "searchFoods",
  },
  LOG_MEAL_QUANTITY: {
    message: (ctx) =>
      `How much "${ctx.selectedItem.name}" did you have (in grams)?`,
    expectsUserInput: true,
    action: "logMealItem",
  },
  // WORKOUT LOGGING FLOW
  LOG_WORKOUT_SEARCH: {
    message: () => "What exercise did you perform? Start typing to search...",
    expectsUserInput: true,
    action: "searchExercises",
  },
  LOG_WORKOUT_PERFORMANCE: {
    message: (ctx) => `For "${ctx.selectedItem.name}", enter your performance.\n- For strength: sets,reps,weight (e.g., 3,10,50)\n- For cardio: duration (e.g., 30 min)`,
    expectsUserInput: true,
    action: "logWorkoutItem",
  },
  //water
  LOG_WATER_PROMPT: {
    message: () => "How much water did you drink (in ml)?",
    expectsUserInput: true,
    action: "handleWaterLogging",
  },
};

class ChatbotService {
  async handleConversation(context) {
    const { currentState = "INITIAL", selectedOption, userInput } = context;
    let response;

    if (selectedOption) {
      // Handle option selections
      response = await this.handleOptionSelection(
        currentState,
        selectedOption,
        context
      );
    } else if (userInput) {
      // Handle text input
      const stateDefinition = conversationStates[currentState];
      if (stateDefinition?.action) {
        response = await this[stateDefinition.action](context);
      }
    } else {
      response = this.buildResponse("INITIAL", context);
    }
    return response || this.buildResponse("INITIAL", context);
  }

  buildResponse(
    stateKey,
    context,
    messageOverride = null,
    optionsOverride = null
  ) {
    const state = conversationStates[stateKey];
    return {
      newState: stateKey,
      message: messageOverride || state.message(context),
      options: optionsOverride || state.options || [],
      expectsUserInput: !!state.expectsUserInput,
    };
  }

  async handleOptionSelection(currentState, selectedOption, context) {
    if (currentState === "INITIAL") {
      if (selectedOption === "Log Activity")
        return this.buildResponse("LOG_ACTIVITY", context);
      if (selectedOption === "View Today's Summary")
        return this.getTodaySummary(context);
    } else if (currentState === "LOG_ACTIVITY") {
      if (selectedOption === "Meal")
        return this.buildResponse("LOG_MEAL_SEARCH", context);
      if (selectedOption === "Workout")
        return this.buildResponse("LOG_WORKOUT_SEARCH", context);
      if (selectedOption === "Water")
        return this.buildResponse("LOG_WATER_PROMPT", context);
    } else if (
      currentState === "LOG_MEAL_SEARCH" ||
      currentState === "LOG_WORKOUT_SEARCH"
    ) {
      // This is when user clicks a food/exercise from the search results
      const [name, id] = selectedOption.split("|");
      context.selectedItem = { name, id };
      const nextStateKey =
        currentState === "LOG_MEAL_SEARCH"
          ? "LOG_MEAL_QUANTITY"
          : "LOG_WORKOUT_PERFORMANCE";
      return this.buildResponse(nextStateKey, context);
    }
  }

  // --- Action Handlers ---

  async searchFoods(context) {
    const foods = await Food.find({
      $text: { $search: context.userInput },
    }).limit(5);
    if (foods.length === 0)
      return this.buildResponse(
        "LOG_MEAL_SEARCH",
        context,
        `I couldn't find any foods matching "${context.userInput}". Try another search?`
      );
    const foodOptions = foods.map((f) => `${f.name}|${f._id}`); // Format for easy parsing later
    return this.buildResponse(
      "LOG_MEAL_SEARCH",
      context,
      "Here's what I found. Please select one:",
      foodOptions
    );
  }

  async searchExercises(context) {
    const exercises = await Exercise.find({
      $text: { $search: context.userInput },
    }).limit(5);
    if (exercises.length === 0)
      return this.buildResponse(
        "LOG_WORKOUT_SEARCH",
        context,
        `I couldn't find any exercises matching "${context.userInput}". Try again?`
      );
    const exOptions = exercises.map((e) => `${e.name}|${e._id}`);
    return this.buildResponse(
      "LOG_WORKOUT_SEARCH",
      context,
      "Found these exercises. Which one did you do?",
      exOptions
    );
  }

  async logMealItem(context) {
    const quantity = parseInt(context.userInput, 10);
    if (isNaN(quantity))
      return this.buildResponse(
        "LOG_MEAL_QUANTITY",
        context,
        "That's not a valid number. Please enter the quantity in grams."
      );

    const items = [{ foodId: context.selectedItem.id, quantity }];
    await loggingService.createMealLog(context.userId, items, "snack"); // default mealType
    return this.buildResponse(
      "INITIAL",
      context,
      `Got it! Logged ${quantity}g of ${context.selectedItem.name}. What's next?`
    );
  }

  async logWorkoutItem(context) {
    const userInput = context.userInput.toLowerCase();
    let performanceData;

    // **THE FIX:** Differentiate between strength and cardio logging.
    // This is a simple heuristic; a real app might use NLP.
    if (userInput.includes("min") || userInput.includes("hour")) {
      // Assume cardio
      const durationMatch = userInput.match(/(\d+)\s*(min|hour)/);
      if (!durationMatch)
        return this.buildResponse(
          "LOG_WORKOUT_PERFORMANCE",
          context,
          "Please specify a duration (e.g., '30 min')."
        );

      let durationMin = parseInt(durationMatch[1], 10);
      if (durationMatch[2] === "hour") {
        durationMin *= 60;
      }
      performanceData = { durationMin };
    } else {
      // Assume strength
      const parts = userInput.split(",").map((p) => parseInt(p.trim(), 10));
      if (parts.length !== 3 || parts.some(isNaN))
        return this.buildResponse(
          "LOG_WORKOUT_PERFORMANCE",
          context,
          "For strength, use the format: sets,reps,weight (e.g., 3,10,50)"
        );
      const [sets, reps, weightKg] = parts;
      performanceData = {
        sets: Array(sets).fill({ reps, weightKg }),
      };
    }

    await loggingService.createWorkoutLog(context.userId, {
      exerciseId: context.selectedItem.id,
      performance: performanceData,
    });
    return this.buildResponse(
      "INITIAL",
      context,
      `Awesome! Logged the workout. What else?`
    );
  }

  async handleWaterLogging(context) {
    const amount = parseInt(context.userInput, 10);
    if (isNaN(amount))
      return this.buildResponse(
        "LOG_WATER_PROMPT",
        context,
        "That doesn't seem like a valid number. Please enter the amount in ml."
      );
    await loggingService.createWaterLog(context.userId, amount);
    return this.buildResponse(
      "INITIAL",
      context,
      `Awesome! Logged ${amount}ml of water. Keep it up!`
    );
  }

   async getTodaySummary(context) {
        const summary = await dashboardService.generateTodaySummary(context.userId);
        
        // *THE FIX IS HERE: Create a more dynamic and helpful message to hadle inputs
        const caloriesLeft = summary.calorieGoal - summary.caloriesConsumed;
        let calorieMessage;

        if (caloriesLeft > 0) {
            calorieMessage = `You have ${caloriesLeft} kcal remaining.`;
        } else {
            calorieMessage = `You are ${Math.abs(caloriesLeft)} kcal over your goal.`;
        }

        const message = `Today's Summary:\n- Calories: ${summary.caloriesConsumed} / ${summary.calorieGoal} kcal. ${calorieMessage}\n- Water: ${summary.waterConsumed} / ${summary.waterGoal} ml\n\nWhat else can I help with?`;
        
        return this.buildResponse("INITIAL", context, message);
    }

  async getFitnessPlan(context) {
    const plan = await fitnessService.getPlanByUserId(context.userId);
    const message = `Your Fitness Plan:\n- Goal: ${
      plan.goal
    }\n- Target Calories: ${
      plan.tdee
    } kcal/day\n- Activity Level: ${plan.activityLevel.replace(
      "_",
      " "
    )}\nHow else can I assist?`;
    return this.buildResponse("INITIAL", context, message);
  }
}

export default new ChatbotService();
