//backend/scripts/seedExercises.js
import mongoose from "mongoose";
import dotenv from "dotenv";
import Exercise from "../src/api/v0/library/exercise.model.js";
import WorkoutTemplate from "../src/api/v0/planners/workoutTemplate.model.js";
dotenv.config({ path: "./.env" });
const exercises = [
  // Chest
  {
    name: "Barbell Bench Press",
    muscleGroup: "Chest",
    metValue: 5.0,
    equipment: "Barbell",
  },
  {
    name: "Dumbbell Bench Press",
    muscleGroup: "Chest",
    metValue: 5.0,
    equipment: "Dumbbell",
  },
  {
    name: "Incline Dumbbell Press",
    muscleGroup: "Chest",
    metValue: 5.0,
    equipment: "Dumbbell",
  },
  {
    name: "Push-up",
    muscleGroup: "Chest",
    metValue: 8.0,
    equipment: "Bodyweight",
  },
  {
    name: "Chest Dip",
    muscleGroup: "Chest",
    metValue: 8.0,
    equipment: "Bodyweight",
  },
  {
    name: "Cable Crossover",
    muscleGroup: "Chest",
    metValue: 4.0,
    equipment: "Cable",
  },
  // Back
  {
    name: "Pull-up",
    muscleGroup: "Back",
    metValue: 8.0,
    equipment: "Bodyweight",
  },
  {
    name: "Chin-up",
    muscleGroup: "Back",
    metValue: 8.0,
    equipment: "Bodyweight",
  },
  {
    name: "Barbell Bent-Over Row",
    muscleGroup: "Back",
    metValue: 6.0,
    equipment: "Barbell",
  },
  {
    name: "Dumbbell Row",
    muscleGroup: "Back",
    metValue: 6.0,
    equipment: "Dumbbell",
  },
  {
    name: "Lat Pulldown",
    muscleGroup: "Back",
    metValue: 4.0,
    equipment: "Cable",
  },
  {
    name: "Seated Cable Row",
    muscleGroup: "Back",
    metValue: 4.0,
    equipment: "Cable",
  },
  {
    name: "Deadlift",
    muscleGroup: "Back",
    metValue: 8.5,
    equipment: "Barbell",
  },
  // Legs
  {
    name: "Barbell Squat",
    muscleGroup: "Legs",
    metValue: 5.0,
    equipment: "Barbell",
  },
  {
    name: "Goblet Squat",
    muscleGroup: "Legs",
    metValue: 5.0,
    equipment: "Dumbbell",
  },
  {
    name: "Lunge",
    muscleGroup: "Legs",
    metValue: 3.8,
    equipment: "Bodyweight",
  },
  {
    name: "Dumbbell Lunge",
    muscleGroup: "Legs",
    metValue: 4.0,
    equipment: "Dumbbell",
  },
  {
    name: "Leg Press",
    muscleGroup: "Legs",
    metValue: 5.0,
    equipment: "Machine",
  },
  {
    name: "Romanian Deadlift",
    muscleGroup: "Legs",
    metValue: 6.0,
    equipment: "Barbell",
  },
  {
    name: "Leg Extension",
    muscleGroup: "Legs",
    metValue: 3.0,
    equipment: "Machine",
  },
  {
    name: "Leg Curl",
    muscleGroup: "Legs",
    metValue: 3.0,
    equipment: "Machine",
  },
  {
    name: "Calf Raise",
    muscleGroup: "Legs",
    metValue: 3.0,
    equipment: "Bodyweight",
  },
  // Shoulders
  {
    name: "Overhead Press (Barbell)",
    muscleGroup: "Shoulders",
    metValue: 4.5,
    equipment: "Barbell",
  },
  {
    name: "Seated Dumbbell Press",
    muscleGroup: "Shoulders",
    metValue: 4.0,
    equipment: "Dumbbell",
  },
  {
    name: "Lateral Raise",
    muscleGroup: "Shoulders",
    metValue: 3.0,
    equipment: "Dumbbell",
  },
  {
    name: "Front Raise",
    muscleGroup: "Shoulders",
    metValue: 3.0,
    equipment: "Dumbbell",
  },
  {
    name: "Face Pull",
    muscleGroup: "Shoulders",
    metValue: 3.0,
    equipment: "Cable",
  },
  {
    name: "Arnold Press",
    muscleGroup: "Shoulders",
    metValue: 4.0,
    equipment: "Dumbbell",
  },
  // Arms
  {
    name: "Barbell Bicep Curl",
    muscleGroup: "Arms",
    metValue: 4.0,
    equipment: "Barbell",
  },
  {
    name: "Dumbbell Bicep Curl",
    muscleGroup: "Arms",
    metValue: 4.0,
    equipment: "Dumbbell",
  },
  {
    name: "Hammer Curl",
    muscleGroup: "Arms",
    metValue: 4.0,
    equipment: "Dumbbell",
  },
  {
    name: "Tricep Pushdown",
    muscleGroup: "Arms",
    metValue: 3.0,
    equipment: "Cable",
  },
  {
    name: "Skull Crusher",
    muscleGroup: "Arms",
    metValue: 4.0,
    equipment: "Barbell",
  },
  {
    name: "Tricep Dip (Bench)",
    muscleGroup: "Arms",
    metValue: 7.0,
    equipment: "Bodyweight",
  },
  // Core
  {
    name: "Plank",
    muscleGroup: "Core",
    metValue: 2.8,
    equipment: "Bodyweight",
  },
  {
    name: "Crunch",
    muscleGroup: "Core",
    metValue: 3.8,
    equipment: "Bodyweight",
  },
  {
    name: "Leg Raise",
    muscleGroup: "Core",
    metValue: 3.8,
    equipment: "Bodyweight",
  },
  {
    name: "Russian Twist",
    muscleGroup: "Core",
    metValue: 3.8,
    equipment: "Bodyweight",
  },
  {
    name: "Cable Crunch",
    muscleGroup: "Core",
    metValue: 4.0,
    equipment: "Cable",
  },
  // Cardio
  {
    name: "Running (6 mph / 10 kmh)",
    muscleGroup: "Cardio",
    metValue: 9.8,
    equipment: "Cardio",
  },
  {
    name: "Jogging (5 mph / 8 kmh)",
    muscleGroup: "Cardio",
    metValue: 8.0,
    equipment: "Cardio",
  },
  {
    name: "Walking (3.5 mph / 5.6 kmh)",
    muscleGroup: "Cardio",
    metValue: 3.8,
    equipment: "Cardio",
  },
  {
    name: "Cycling (moderate pace)",
    muscleGroup: "Cardio",
    metValue: 7.5,
    equipment: "Cardio",
  },
  {
    name: "Jump Rope",
    muscleGroup: "Cardio",
    metValue: 11.0,
    equipment: "Cardio",
  },
  {
    name: "StairMaster",
    muscleGroup: "Cardio",
    metValue: 9.0,
    equipment: "Cardio",
  },
  {
    name: "Rowing Machine (moderate)",
    muscleGroup: "Cardio",
    metValue: 7.0,
    equipment: "Cardio",
  },
  {
    name: "Swimming (freestyle)",
    muscleGroup: "Cardio",
    metValue: 8.0,
    equipment: "Cardio",
  },
  {
    name: "Elliptical Trainer",
    muscleGroup: "Cardio",
    metValue: 5.0,
    equipment: "Cardio",
  },
  {
    name: "HIIT (High-Intensity Interval Training)",
    muscleGroup: "Cardio",
    metValue: 12.0,
    equipment: "Cardio",
  },
];

const seedDB = async () => {
  if (!process.env.MONGO_URI) {
    console.error("MONGO_URI not found in .env file. Seeding cannot proceed.");
    process.exit(1);
  }
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log("MongoDB Connected for seeding...");

    await Exercise.deleteMany({});
    console.log("Cleared existing exercises.");
    const createdExercises = await Exercise.insertMany(exercises);
    console.log(`${createdExercises.length} sample exercises added!`);

    const ex = createdExercises.reduce((acc, curr) => {
      acc[curr.name] = curr._id;
      return acc;
    }, {});

    await WorkoutTemplate.deleteMany({});
    console.log("Cleared existing workout templates.");

    const templates = [
      {
        name: "Beginner Full Body Strength",
        goal: "gain_muscle",
        level: "beginner",
        schedule: [
          {
            day: "Day 1 (A)",
            focus: "Full Body Strength",
            exercises: [
              { exercise: ex["Barbell Squat"], sets: 3, reps: "8-12" },
              { exercise: ex["Barbell Bench Press"], sets: 3, reps: "8-12" },
              { exercise: ex["Barbell Bent-Over Row"], sets: 3, reps: "8-12" },
              { exercise: ex["Plank"], sets: 3, reps: "30-60 sec" },
            ],
          },
          {
            day: "Day 2 (B)",
            focus: "Full Body Strength",
            exercises: [
              { exercise: ex["Deadlift"], sets: 3, reps: "5-8" },
              {
                exercise: ex["Overhead Press (Barbell)"],
                sets: 3,
                reps: "8-12",
              },
              { exercise: ex["Pull-up"], sets: 3, reps: "To Failure" },
              { exercise: ex["Leg Raise"], sets: 3, reps: "15-20" },
            ],
          },
        ],
      },
      {
        name: "Beginner Weight Loss",
        goal: "lose_weight",
        level: "beginner",
        schedule: [
          {
            day: "Day 1",
            focus: "Full Body & Cardio",
            exercises: [
              { exercise: ex["Goblet Squat"], sets: 3, reps: "12-15" },
              { exercise: ex["Push-up"], sets: 3, reps: "To Failure" },
              { exercise: ex["Dumbbell Row"], sets: 3, reps: "12-15" },
              {
                exercise: ex["Jogging (5 mph / 8 kmh)"],
                sets: 1,
                reps: "20 min",
              },
            ],
          },
          {
            day: "Day 2",
            focus: "Full Body & HIIT",
            exercises: [
              {
                exercise: ex["Dumbbell Lunge"],
                sets: 3,
                reps: "10-12 per leg",
              },
              { exercise: ex["Seated Dumbbell Press"], sets: 3, reps: "12-15" },
              { exercise: ex["Lat Pulldown"], sets: 3, reps: "12-15" },
              {
                exercise: ex["Jump Rope"],
                sets: 5,
                reps: "1 min on, 1 min off",
              },
            ],
          },
        ],
      },
    ];

    await WorkoutTemplate.create(templates);
    console.log(`${templates.length} workout templates added!`);
  } catch (error) {
    console.error(`❌ Error during exercise seeding: ${error.message}`);
    process.exit(1);
  } finally {
    mongoose.connection.close();
    console.log("MongoDB connection closed.");
  }
};

seedDB();
