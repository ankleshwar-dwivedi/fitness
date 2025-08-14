import loggingService from '../logging/logging.service.js';
import dashboardService from '../dashboard/dashboard.service.js';
import fitnessService from '../fitness/fitness.service.js';

const conversationStates = {
  INITIAL: {
    message: (ctx) => `Hi ${ctx.userName}! I'm your AI assistant. How can I help?`,
    options: ["Log Activity", "View Today's Summary", "Check My Fitness Plan"],
  },
  LOG_ACTIVITY: {
    message: () => "What would you like to log?",
    options: ["Meal", "Workout", "Water"],
  },
  LOG_MEAL_PROMPT: {
    message: () => "What did you eat? For example: 'An apple and a glass of milk'",
    expectsUserInput: true,
    action: "handleMealLogging",
  },
  LOG_WORKOUT_PROMPT: {
    message: () => "Describe your workout and duration. For example: '30 min run'",
    expectsUserInput: true,
    action: "handleWorkoutLogging",
  },
  LOG_WATER_PROMPT: {
    message: () => "How much water did you drink (in ml)?",
    expectsUserInput: true,
    action: "handleWaterLogging",
  },
};

class ChatbotService {
  async handleConversation(context) {
    const { currentState = 'INITIAL', selectedOption, userInput } = context;
    let response;

    // State transition based on selected option
    if (selectedOption) {
      if (currentState === 'INITIAL') {
        if (selectedOption === "Log Activity") response = this.buildResponse('LOG_ACTIVITY', context);
        else if (selectedOption === "View Today's Summary") response = await this.getTodaySummary(context);
        else if (selectedOption === "Check My Fitness Plan") response = await this.getFitnessPlan(context);
      } else if (currentState === 'LOG_ACTIVITY') {
        if (selectedOption === "Meal") response = this.buildResponse('LOG_MEAL_PROMPT', context);
        else if (selectedOption === "Workout") response = this.buildResponse('LOG_WORKOUT_PROMPT', context);
        else if (selectedOption === "Water") response = this.buildResponse('LOG_WATER_PROMPT', context);
      }
    } 
    // Action based on user text input
    else if (userInput) {
      const stateDefinition = conversationStates[currentState];
      if (stateDefinition && stateDefinition.action) {
        response = await this[stateDefinition.action](context);
      }
    }
    // Default to initial state
    else {
      response = this.buildResponse('INITIAL', context);
    }
    return response;
  }

  buildResponse(stateKey, context, messageOverride = null) {
    const state = conversationStates[stateKey];
    return {
      newState: stateKey,
      message: messageOverride || (typeof state.message === 'function' ? state.message(context) : state.message),
      options: state.options || [],
      expectsUserInput: !!state.expectsUserInput,
    };
  }
  
  // --- Action Handlers ---

  async handleMealLogging(context) {
    await loggingService.createMealLog(context.userId, context.userInput, 'snack'); // default mealType
    return this.buildResponse('INITIAL', context, `I've logged "${context.userInput}". Anything else?`);
  }

  async handleWorkoutLogging(context) {
    const durationMatch = context.userInput.match(/(\d+)\s*min/);
    const durationMin = durationMatch ? parseInt(durationMatch[1], 10) : 30; // default 30 min
    const description = context.userInput.replace(/(\d+)\s*min/,'').trim();
    await loggingService.createWorkoutLog(context.userId, description, durationMin);
    return this.buildResponse('INITIAL', context, `Great workout! I've logged "${description}" for ${durationMin} minutes. What's next?`);
  }
  
  async handleWaterLogging(context) {
    const amount = parseInt(context.userInput, 10);
    if (isNaN(amount)) return this.buildResponse('LOG_WATER_PROMPT', context, "That doesn't seem like a valid number. Please enter the amount in ml.");
    await loggingService.createWaterLog(context.userId, amount);
    return this.buildResponse('INITIAL', context, `Awesome! Logged ${amount}ml of water. Keep it up!`);
  }

  async getTodaySummary(context) {
    const summary = await dashboardService.generateTodaySummary(context.userId);
    const message = `Today's Summary:\n- Calories: ${summary.caloriesConsumed} / ${summary.calorieGoal} kcal\n- Water: ${summary.waterConsumed} / ${summary.waterGoal} ml\nWhat else can I help with?`;
    return this.buildResponse('INITIAL', context, message);
  }

  async getFitnessPlan(context) {
    const plan = await fitnessService.getPlanByUserId(context.userId);
    const message = `Your Fitness Plan:\n- Goal: ${plan.goal}\n- Target Calories: ${plan.tdee} kcal/day\n- Activity Level: ${plan.activityLevel.replace('_', ' ')}\nHow else can I assist?`;
    return this.buildResponse('INITIAL', context, message);
  }
}

export default new ChatbotService();