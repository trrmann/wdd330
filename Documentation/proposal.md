WDD 330 Final Web Application Proposal

"Chow Planner"

Overview
This web application is designed to help users discover, plan, and share creative meal ideas based on available ingredients and dietary preferences. By leveraging the Spoonacular API and robust local storage and API access modules, the platform enables users to search for recipes, generate meal plans, and manage shopping lists, making meal preparation more efficient and enjoyable. The application aims to reduce food waste, accommodate dietary needs, and inspire culinary exploration.

Target Audience
The application is intended for:

Home cooks seeking inspiration for meals using what they have on hand.
Individuals or families with dietary restrictions or preferences.
Busy users who want to streamline meal planning and grocery shopping.
Major Functions
Ingredient-Based Recipe Search: Search for recipes by entering available ingredients, dietary preferences, and exclusions. Results can be filtered by cuisine, preparation time, and nutrition. Powered by the API Access Module.
Meal Plan Generator: Automatically generate meal plans (breakfast, lunch, dinner) for a selected number of days, tailored to user preferences and dietary needs. Uses both API Access and Local Storage Modules for dynamic and persistent planning.
Shopping List Creation: Generate and organize shopping lists based on selected recipes or meal plans. Lists are categorized by grocery section (produce, dairy, etc.) and can be edited by the user. Managed with the Local Storage Module.
Recipe Details View: View detailed recipe information, including ingredients, instructions, nutrition facts, and images. Users can also see similar recipes and suggested pairings, all retrieved via the API Access Module.
Favorites and History Management: Users can save favorite recipes and meal plans for quick access, and view a history of recently viewed or cooked meals. All data is managed with the Local Storage Module.
Nutrition and Dietary Analysis: Display nutrition information for recipes and meal plans, and provide alerts for allergens or dietary conflicts. Data is fetched and analyzed using the API Access Module.
Save and Share: Save favorite recipes and meal plans, and share them via social media or device-native sharing with formatted shopping lists and meal details. Saved data is managed with the Local Storage Module.
Responsive Design: Optimized for both desktop and mobile devices, ensuring a seamless experience across platforms.
CSS Animations: Smooth transitions, loading indicators, and interactive UI elements to enhance user engagement.
Wireframes
Mobile view

Designed for small screens (e.g., smartphones).
Features a compact, vertically stacked layout for easy thumb navigation.
Header and menu are full-width, with a hamburger icon for expandable navigation.
Menu items are listed vertically for quick access.
Search bar, meal plan summary, recipe cards, and shopping list button are arranged in a single column.
Footer navigation is simple and easily accessible at the bottom.
Tablet View

Optimized for medium-sized screens (e.g., tablets).
Layout is more spacious, with a horizontal header and menu row.
Menu items are split into two columns for better use of screen width.
Action buttons (meal plan, shopping list) are placed side by side.
Recipe cards are displayed in a 2x2 grid, balancing content and whitespace.
Laptop View

Tailored for large screens (e.g., laptops and desktops).
Uses a wide, horizontal layout with a prominent header and menu bar.
Menu items are arranged in a single horizontal row for quick navigation.
Search bar and action buttons are aligned for a professional look.
Recipe cards are presented in a 3x3 grid, maximizing content visibility and organization.
External Data
Spoonacular Complex Search API:
Endpoint: https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/complexSearch

Used for advanced recipe search by keyword, dietary preferences, intolerances, included/excluded ingredients, max ready time, and more. Supports Ingredient-Based Recipe Search, Meal Plan Generator, and Nutrition and Dietary Analysis features.

Spoonacular Find By Ingredients API:
Endpoint: https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/findByIngredients

Finds recipes based on a list of ingredients the user has on hand. Supports Ingredient-Based Recipe Search, Shopping List Creation, and Reduce Food Waste features.

Spoonacular Similar Recipes API:
Endpoint: https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/{id}/similar

Fetches similar recipes to a selected one, for inspiration and variety. Supports Recipe Details View and Meal Plan Generator features.

Spoonacular Random Recipe API:
Endpoint: https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/random

Returns a random recipe (optionally filtered by tags like vegetarian, dessert, etc.). Supports Meal Plan Generator, Surprise Me feature, and Inspiration for users.

Data Storage
Saved recipes, meal plans, and shopping lists are managed using the Local Storage Module for persistent, client-side storage.
Module List
Home Module: Introduction and navigation to main features.
Recipe Search Module: Interfaces with Spoonacular to fetch and display recipes.
Meal Plan Module: Generates and displays meal plans.
Shopping List Module: Creates and manages shopping lists.
Local Storage Module: Handles saving, retrieving, and managing meal plans, recipes, and shopping lists in the browser's localStorage, supporting persistent user data and offline access.
API Access Module: Manages all communication with external APIs, including constructing requests, handling responses, and error management for recipe and nutrition data, ensuring reliable and secure data flow.
Responsive Layout Module: Ensures UI adapts to all screen sizes.
Graphic Identity
Colors:
Primary: #4B5320 (Army Green)
Secondary: #C2B280 (Khaki)
Neutral: #F5F5DC (Beige), #2D2D2D (Charcoal)
Typography:
Heading: "Oswald" (Condensed Sans-serif, bold, military-inspired)
Body: "Source Sans Pro" (Sans-serif, clean and utilitarian)
Icon Design:
A stylized food tray with food compartments.
Timeline (Weeks 5-7)
Week 5
Finalize wireframes and graphic identity.
Implement homepage and navigation.
Set up API integration and fetch sample data.
Week 6
Develop recipe search and meal plan modules.
Implement responsive layouts and shopping list module.
Week 7
Complete user profile and sharing features.
Refine UI, add animations, and conduct testing.
Project Planning
A Trello board will track:

Wireframe and UI design tasks
API integration
Module development
Responsiveness and animation testing
Usability testing and final polish
