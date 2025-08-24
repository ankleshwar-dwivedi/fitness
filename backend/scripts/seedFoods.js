import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Food from '../src/api/v0/library/food.model.js';

dotenv.config({ path: './.env' });

const sampleFoods = [
  // Fruits
  { name: 'Apple, medium', calories: 95, protein: 0.5, carbs: 25, fat: 0.3, tags: ['snack', 'fruit'] },
  { name: 'Banana, medium', calories: 105, protein: 1.3, carbs: 27, fat: 0.4, tags: ['snack', 'fruit', 'breakfast'] },
  { name: 'Orange, medium', calories: 62, protein: 1.2, carbs: 15, fat: 0.2, tags: ['snack', 'fruit'] },
  { name: 'Strawberries (100g)', calories: 32, protein: 0.7, carbs: 8, fat: 0.3, tags: ['snack', 'fruit'] },
  { name: 'Blueberries (100g)', calories: 57, protein: 0.7, carbs: 14, fat: 0.3, tags: ['snack', 'fruit'] },
  { name: 'Avocado (100g)', calories: 160, protein: 2, carbs: 9, fat: 15, tags: ['snack', 'fat-source'] },

  // Vegetables
  { name: 'Broccoli (100g)', calories: 34, protein: 2.8, carbs: 7, fat: 0.4, tags: ['lunch', 'dinner', 'veg'] },
  { name: 'Spinach (100g)', calories: 23, protein: 2.9, carbs: 4, fat: 0.4, tags: ['lunch', 'dinner', 'veg'] },
  { name: 'Carrots (100g)', calories: 41, protein: 0.9, carbs: 10, fat: 0.2, tags: ['snack', 'lunch', 'dinner', 'veg'] },
  { name: 'Bell Pepper (100g)', calories: 20, protein: 0.9, carbs: 4.6, fat: 0.2, tags: ['lunch', 'dinner', 'veg'] },
  { name: 'Cucumber (100g)', calories: 15, protein: 0.7, carbs: 4, fat: 0.1, tags: ['lunch', 'dinner', 'veg'] },
  { name: 'Sweet Potato (100g)', calories: 86, protein: 1.6, carbs: 20, fat: 0.1, tags: ['lunch', 'dinner', 'carb-source'] },

  // Grains & Carbs
  { name: 'White Rice (100g cooked)', calories: 130, protein: 2.7, carbs: 28, fat: 0.3, tags: ['lunch', 'dinner', 'carb-source'] },
  { name: 'Brown Rice (100g cooked)', calories: 123, protein: 2.7, carbs: 26, fat: 1, tags: ['lunch', 'dinner', 'carb-source'] },
  { name: 'Quinoa (100g cooked)', calories: 120, protein: 4.4, carbs: 21, fat: 1.9, tags: ['lunch', 'dinner', 'carb-source', 'high-protein'] },
  { name: 'Oats (50g dry)', calories: 190, protein: 6.5, carbs: 34, fat: 3.2, tags: ['breakfast', 'carb-source'] },
  { name: 'Whole Wheat Bread (1 slice)', calories: 81, protein: 4, carbs: 14, fat: 1, tags: ['breakfast', 'snack', 'carb-source'] },
  { name: 'Pasta, cooked (100g)', calories: 131, protein: 5, carbs: 25, fat: 1.1, tags: ['dinner', 'carb-source'] },

  // Proteins
  { name: 'Chicken Breast, grilled (100g)', calories: 165, protein: 31, carbs: 0, fat: 3.6, tags: ['lunch', 'dinner', 'high-protein'] },
  { name: 'Salmon, baked (100g)', calories: 206, protein: 22, carbs: 0, fat: 12, tags: ['lunch', 'dinner', 'high-protein', 'fat-source'] },
  { name: 'Tuna, canned in water (100g)', calories: 116, protein: 26, carbs: 0, fat: 1, tags: ['lunch', 'snack', 'high-protein'] },
  { name: 'Lean Ground Beef 90/10, cooked (100g)', calories: 217, protein: 26, carbs: 0, fat: 12, tags: ['lunch', 'dinner', 'high-protein'] },
  { name: 'Large Egg, boiled', calories: 78, protein: 6, carbs: 0.6, fat: 5, tags: ['breakfast', 'snack', 'high-protein'] },
  { name: 'Tofu, firm (100g)', calories: 76, protein: 8, carbs: 2, fat: 5, tags: ['lunch', 'dinner', 'high-protein', 'veg'] },
  { name: 'Lentils, cooked (100g)', calories: 116, protein: 9, carbs: 20, fat: 0.4, tags: ['lunch', 'dinner', 'high-protein', 'veg', 'carb-source'] },
  { name: 'Chickpeas, cooked (100g)', calories: 139, protein: 7.5, carbs: 22, fat: 2.5, tags: ['lunch', 'dinner', 'high-protein', 'veg', 'carb-source'] },

  // Dairy & Alternatives
  { name: 'Milk, 2% (1 cup)', calories: 122, protein: 8, carbs: 12, fat: 5, tags: ['breakfast'] },
  { name: 'Greek Yogurt, plain (100g)', calories: 59, protein: 10, carbs: 3.6, fat: 0.4, tags: ['breakfast', 'snack', 'high-protein'] },
  { name: 'Cheddar Cheese (30g)', calories: 120, protein: 7, carbs: 1, fat: 10, tags: ['snack', 'fat-source'] },
  { name: 'Almond Milk, unsweetened (1 cup)', calories: 30, protein: 1, carbs: 1, fat: 2.5, tags: ['breakfast'] },

  // Nuts, Seeds & Fats
  { name: 'Almonds (30g)', calories: 170, protein: 6, carbs: 6, fat: 15, tags: ['snack', 'fat-source'] },
  { name: 'Walnuts (30g)', calories: 190, protein: 4, carbs: 4, fat: 18, tags: ['snack', 'fat-source'] },
  { name: 'Peanut Butter (2 tbsp)', calories: 190, protein: 7, carbs: 8, fat: 16, tags: ['snack', 'fat-source'] },
  { name: 'Chia Seeds (2 tbsp)', calories: 138, protein: 4.7, carbs: 12, fat: 9, tags: ['breakfast'] },
  { name: 'Olive Oil (1 tbsp)', calories: 119, protein: 0, carbs: 0, fat: 14, tags: ['fat-source'] },

  // Supplements
  { name: 'Whey Protein Powder (1 scoop)', calories: 120, protein: 24, carbs: 3, fat: 1, tags: ['snack', 'high-protein', 'supplement'] },

  // --- Meals & Combos ---

  // Breakfast
  { name: 'Oatmeal with Berries and Nuts', calories: 450, protein: 15, carbs: 65, fat: 18, tags: ['breakfast', 'combo'] },
  { name: 'Scrambled Eggs (3) with Spinach and Toast (2 slices)', calories: 450, protein: 26, carbs: 30, fat: 25, tags: ['breakfast', 'combo', 'high-protein'] },
  { name: 'Greek Yogurt Bowl with Granola and Honey', calories: 400, protein: 25, carbs: 50, fat: 12, tags: ['breakfast', 'combo', 'high-protein'] },
  { name: 'Avocado Toast (2 slices) with Egg (1)', calories: 380, protein: 14, carbs: 35, fat: 22, tags: ['breakfast', 'combo'] },
  { name: 'Protein Smoothie (Whey, Banana, Almond Milk)', calories: 350, protein: 30, carbs: 35, fat: 10, tags: ['breakfast', 'snack', 'combo', 'high-protein'] },

  // Lunch
  { name: 'Grilled Chicken Salad with Vinaigrette', calories: 500, protein: 40, carbs: 20, fat: 30, tags: ['lunch', 'combo', 'high-protein'] },
  { name: 'Quinoa Bowl with Chickpeas and Veggies', calories: 550, protein: 20, carbs: 80, fat: 18, tags: ['lunch', 'combo', 'veg', 'high-protein'] },
  { name: 'Tuna Salad Sandwich on Whole Wheat', calories: 450, protein: 30, carbs: 40, fat: 18, tags: ['lunch', 'combo'] },
  { name: 'Turkey Wrap with Hummus and Veggies', calories: 480, protein: 35, carbs: 50, fat: 15, tags: ['lunch', 'combo'] },
  { name: 'Lentil Soup with a side of Bread', calories: 400, protein: 20, carbs: 70, fat: 5, tags: ['lunch', 'combo', 'veg'] },
  { name: 'Burrito Bowl with Rice, Beans, and Salsa', calories: 600, protein: 25, carbs: 90, fat: 15, tags: ['lunch', 'combo'] },

  // Dinner
  { name: 'Baked Salmon with Asparagus and Sweet Potato', calories: 650, protein: 40, carbs: 45, fat: 35, tags: ['dinner', 'combo', 'high-protein'] },
  { name: 'Spaghetti with Lean Ground Beef Sauce', calories: 700, protein: 35, carbs: 80, fat: 25, tags: ['dinner', 'combo'] },
  { name: 'Chicken and Broccoli Stir-fry with Brown Rice', calories: 600, protein: 45, carbs: 60, fat: 20, tags: ['dinner', 'combo', 'high-protein'] },
  { name: 'Tofu Curry with Coconut Milk and Veggies', calories: 550, protein: 20, carbs: 40, fat: 35, tags: ['dinner', 'combo', 'veg'] },
  { name: 'Steak (150g) with a Side Salad', calories: 500, protein: 40, carbs: 10, fat: 35, tags: ['dinner', 'combo', 'high-protein'] },
  { name: 'Homemade Pizza Slice (Cheese)', calories: 285, protein: 12, carbs: 36, fat: 10, tags: ['dinner', 'combo'] },
  { name: 'Chicken Fajitas with Peppers and Onions', calories: 580, protein: 40, carbs: 45, fat: 25, tags: ['dinner', 'combo'] },

  // Snacks
  { name: 'Handful of Mixed Nuts', calories: 200, protein: 6, carbs: 7, fat: 18, tags: ['snack'] },
  { name: 'Protein Bar', calories: 220, protein: 20, carbs: 25, fat: 8, tags: ['snack', 'high-protein'] },
  { name: 'Hummus with Carrot Sticks', calories: 180, protein: 5, carbs: 20, fat: 9, tags: ['snack', 'veg'] },
  { name: 'Cottage Cheese with Pineapple', calories: 150, protein: 20, carbs: 12, fat: 2, tags: ['snack', 'high-protein'] },
  { name: 'Rice Cakes (2) with Peanut Butter', calories: 250, protein: 8, carbs: 28, fat: 13, tags: ['snack'] },

  // More Single Items
  { name: 'Greek Yogurt, flavored (100g)', calories: 95, protein: 8, carbs: 12, fat: 1.5, tags: ['breakfast', 'snack'] },
  { name: 'Potato, baked (medium)', calories: 161, protein: 4.3, carbs: 37, fat: 0.2, tags: ['dinner', 'carb-source'] },
  { name: 'Shrimp, cooked (100g)', calories: 99, protein: 24, carbs: 0.2, fat: 0.3, tags: ['dinner', 'high-protein'] },
  { name: 'Edamame, shelled (100g)', calories: 121, protein: 11, carbs: 9, fat: 5, tags: ['snack', 'veg', 'high-protein'] },
  { name: 'Dark Chocolate (30g)', calories: 170, protein: 2, carbs: 13, fat: 12, tags: ['snack'] },
  { name: 'Pork Chop, grilled (100g)', calories: 221, protein: 26, carbs: 0, fat: 12, tags: ['dinner', 'high-protein'] },
  { name: 'Black Beans, cooked (100g)', calories: 132, protein: 8, carbs: 24, fat: 0.5, tags: ['lunch', 'dinner', 'veg', 'carb-source'] },
  { name: 'Whole Milk (1 cup)', calories: 149, protein: 8, carbs: 12, fat: 8, tags: ['breakfast'] },
  { name: 'Sourdough Bread (1 slice)', calories: 120, protein: 4, carbs: 22, fat: 1, tags: ['breakfast', 'snack'] },
  { name: 'Onion (100g)', calories: 40, protein: 1.1, carbs: 9, fat: 0.1, tags: ['lunch', 'dinner', 'veg'] },
  { name: 'Tomato (100g)', calories: 18, protein: 0.9, carbs: 4, fat: 0.2, tags: ['lunch', 'dinner', 'veg'] },
  { name: 'Lettuce, Romaine (100g)', calories: 17, protein: 1.2, carbs: 3.3, fat: 0.3, tags: ['lunch', 'dinner', 'veg'] },
  { name: 'Mushroom (100g)', calories: 22, protein: 3.1, carbs: 3.3, fat: 0.3, tags: ['lunch', 'dinner', 'veg'] },
  { name: 'Zucchini (100g)', calories: 17, protein: 1.2, carbs: 3.1, fat: 0.3, tags: ['lunch', 'dinner', 'veg'] },
  { name: 'Cashews (30g)', calories: 160, protein: 5, carbs: 9, fat: 13, tags: ['snack', 'fat-source'] },
  { name: 'Pistachios (30g)', calories: 160, protein: 6, carbs: 8, fat: 13, tags: ['snack', 'fat-source'] },
  { name: 'Sunflower Seeds (30g)', calories: 175, protein: 6, carbs: 6, fat: 15, tags: ['snack', 'fat-source'] },
  { name: 'Canola Oil (1 tbsp)', calories: 124, protein: 0, carbs: 0, fat: 14, tags: ['fat-source'] },
  { name: 'Butter (1 tbsp)', calories: 102, protein: 0.1, carbs: 0, fat: 12, tags: ['fat-source'] },
  { name: 'Honey (1 tbsp)', calories: 64, protein: 0.1, carbs: 17, fat: 0, tags: ['breakfast'] },
  { name: 'Maple Syrup (1 tbsp)', calories: 52, protein: 0, carbs: 13, fat: 0, tags: ['breakfast'] },
  { name: 'Cod, baked (100g)', calories: 105, protein: 23, carbs: 0, fat: 0.9, tags: ['dinner', 'high-protein'] },
  { name: 'Scallops, cooked (100g)', calories: 111, protein: 21, carbs: 0, fat: 1.3, tags: ['dinner', 'high-protein'] },
  { name: 'Lamb Chop, grilled (100g)', calories: 282, protein: 25, carbs: 0, fat: 20, tags: ['dinner', 'high-protein'] },
  { name: 'Turkey Breast, roasted (100g)', calories: 135, protein: 30, carbs: 0, fat: 1, tags: ['lunch', 'dinner', 'high-protein'] },
  { name: 'Bison, ground, cooked (100g)', calories: 143, protein: 28, carbs: 0, fat: 3, tags: ['lunch', 'dinner', 'high-protein'] },
  { name: 'Popcorn, air-popped (1 cup)', calories: 31, protein: 1, carbs: 6, fat: 0.4, tags: ['snack'] },
  { name: 'Pretzels (30g)', calories: 110, protein: 3, carbs: 23, fat: 1, tags: ['snack'] },
  { name: 'Kefir, plain (1 cup)', calories: 104, protein: 9, carbs: 12, fat: 2.5, tags: ['breakfast', 'snack'] },
];

const seedDB = async () => {
  if (!process.env.MONGO_URI) {
    console.error("MONGO_URI not found in .env file. Seeding cannot proceed.");
    process.exit(1);
  }

  try {
    // **THE FIX IS HERE:** Add connection options
    await mongoose.connect(process.env.MONGO_URI, {
        serverSelectionTimeoutMS: 5000 // Timeout after 5s instead of 30s
    });
    console.log('MongoDB Connected for seeding...');
  
    await Food.deleteMany({});
    console.log('Cleared existing foods.');
  
    await Food.insertMany(sampleFoods);
    console.log('✅ Sample foods have been added!');
  
  } catch (error) {
    console.error(`❌ Error during food seeding: ${error.message}`);
    process.exit(1);
  } finally {
    mongoose.connection.close();
    console.log('MongoDB connection closed.');
  }
};

seedDB();