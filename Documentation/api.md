https://rapidapi.com/spoonacular/api/recipe-food-nutrition/playground/apiendpoint_ac6a3792-59cc-4795-9176-04611f959a8b

tmann@byupathway.edu
?

recipe information with the ability to search ingredients or nutrition using the following 3 APIs

    'https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/complexSearch?query=side%20salad&diet=vegetarian&intolerances=gluten&includeIngredients=cheese%2Cnuts&excludeIngredients=eggs&instructionsRequired=true&fillIngredients=false&addRecipeInformation=false&addRecipeInstructions=false&addRecipeNutrition=false&maxReadyTime=45&ignorePantry=true&sort=max-used-ingredients&offset=0&number=10';

    'https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/findByIngredients?ingredients=apples%2Cflour%2Csugar&number=5&ignorePantry=true&ranking=1';

    'https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/%7Bid%7D/similar';

const url = 'https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/random?tags=vegetarian%2Cdessert&number=1';
const options = {
method: 'GET',
headers: {
'x-rapidapi-key': '60d2f14485msh8a7e691ea7305bdp15c9bajsn5dec4b103f1c',
'x-rapidapi-host': 'spoonacular-recipe-food-nutrition-v1.p.rapidapi.com'
}
};

try {
const response = await fetch(url, options);
const result = await response.text();
console.log(result);
} catch (error) {
console.error(error);
}

{
"recipes": [
{
"vegetarian": false,
"vegan": false,
"glutenFree": true,
"dairyFree": true,
"veryHealthy": false,
"cheap": false,
"veryPopular": false,
"sustainable": false,
"weightWatcherSmartPoints": 4,
"gaps": "no",
"lowFodmap": false,
"ketogenic": false,
"whole30": false,
"servings": 8,
"preparationMinutes": 5,
"cookingMinutes": 10,
"sourceUrl": "http://www.dizzybusyandhungry.com/ramen-noodle-coleslaw/",
"spoonacularSourceUrl": "https://spoonacular.com/ramen-noodle-coleslaw-556177",
"aggregateLikes": 221,
"creditText": "Dizzy Busy and Hungry",
"sourceName": "Dizzy Busy and Hungry",
"extendedIngredients": [
{
"id": 12061,
"aisle": "Nuts",
"image": "https://spoonacular.com/cdn/ingredients_100x100/almonds.jpg",
"name": "almonds",
"amount": 0.25,
"unit": "cup",
"unitShort": "c",
"unitLong": "cups",
"originalString": "¼ cup sliced almonds",
"metaInformation": [
"sliced"
]
},
{
"id": 10011109,
"aisle": "Produce",
"image": "https://spoonacular.com/cdn/ingredients_100x100/coleslaw.png",
"name": "coleslaw mix",
"amount": 1,
"unit": "bag",
"unitShort": "bag",
"unitLong": "bag",
"originalString": "1 bag shredded cabbage/coleslaw mix",
"metaInformation": [
"shredded"
]
},
{
"id": 6016,
"aisle": "Canned and Jarred",
"image": "https://spoonacular.com/cdn/ingredients_100x100/cream-of-chicken-soup.jpg",
"name": "cream of chicken soup",
"amount": 1,
"unit": "package",
"unitShort": "pkg",
"unitLong": "package",
"originalString": "1 package chicken flavor ramen noodle soup",
"metaInformation": []
},
{
"id": 11291,
"aisle": "Produce",
"image": "https://spoonacular.com/cdn/ingredients_100x100/green-onion.jpg",
"name": "green onions",
"amount": 5,
"unit": "",
"unitShort": "",
"unitLong": "",
"originalString": "5 green onions, chopped",
"metaInformation": [
"green",
"chopped"
]
},
{
"id": 4053,
"aisle": "Oil, Vinegar, Salad Dressing",
"image": "https://spoonacular.com/cdn/ingredients_100x100/olive-oil.jpg",
"name": "olive oil",
"amount": 2,
"unit": "tablespoons",
"unitShort": "T",
"unitLong": "tablespoons",
"originalString": "2 tablespoons olive oil",
"metaInformation": []
},
{
"id": 1002030,
"aisle": "Spices and Seasonings",
"image": "https://spoonacular.com/cdn/ingredients_100x100/pepper.jpg",
"name": "pepper",
"amount": 0.5,
"unit": "teaspoon",
"unitShort": "t",
"unitLong": "teaspoons",
"originalString": "½ teaspoon pepper",
"metaInformation": []
},
{
"id": 2047,
"aisle": "Spices and Seasonings",
"image": "https://spoonacular.com/cdn/ingredients_100x100/salt.jpg",
"name": "salt",
"amount": 0.5,
"unit": "teaspoon",
"unitShort": "t",
"unitLong": "teaspoons",
"originalString": "½ teaspoon salt",
"metaInformation": []
},
{
"id": 12023,
"aisle": "Ethnic Foods",
"image": "https://spoonacular.com/cdn/ingredients_100x100/sesame-seeds.jpg",
"name": "sesame seeds",
"amount": 3,
"unit": "tablespoons",
"unitShort": "T",
"unitLong": "tablespoons",
"originalString": "3 tablespoons sesame seeds",
"metaInformation": []
},
{
"id": 19335,
"aisle": "Baking",
"image": "https://spoonacular.com/cdn/ingredients_100x100/white-sugar.jpg",
"name": "sugar",
"amount": 3,
"unit": "tablespoons",
"unitShort": "T",
"unitLong": "tablespoons",
"originalString": "3 tablespoons sugar",
"metaInformation": []
},
{
"id": 2053,
"aisle": "Oil, Vinegar, Salad Dressing",
"image": "https://spoonacular.com/cdn/ingredients_100x100/vinegar-(white).jpg",
"name": "vinegar",
"amount": 3,
"unit": "tablespoons",
"unitShort": "T",
"unitLong": "tablespoons",
"originalString": "3 tablespoons vinegar",
"metaInformation": []
}
],
"id": 556177,
"title": "Ramen Noodle Coleslaw",
"readyInMinutes": 15,
"image": "https://spoonacular.com/recipeImages/Ramen-Noodle-Coleslaw-556177.jpg",
"imageType": "jpg",
"instructions": "Toast the sesame seeds, about 350 degrees in the oven for about 10-15 minutes. Keep an eye on them to make sure they don't burn.Mix together the following to make the dressing: olive oil, vinegar, sugar, salt, pepper, green onions, chicken flavor packet from the ramen noodle package.Crush the ramen noodles until there are no large chunks (small chunks are OK).Combine the shredded cabbage and ramen noodles in a large bowl.Pour the dressing on the cabbage/noodle mixture and toss to coat.Top with the toasted sesame seeds and almonds."
}
]
}

const url = 'https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/complexSearch?query=side%20salad&diet=vegetarian&intolerances=gluten&includeIngredients=cheese%2Cnuts&excludeIngredients=eggs&instructionsRequired=true&fillIngredients=false&addRecipeInformation=false&addRecipeInstructions=false&addRecipeNutrition=false&maxReadyTime=45&ignorePantry=true&sort=max-used-ingredients&offset=0&number=10';
const options = {
method: 'GET',
headers: {
'x-rapidapi-key': '60d2f14485msh8a7e691ea7305bdp15c9bajsn5dec4b103f1c',
'x-rapidapi-host': 'spoonacular-recipe-food-nutrition-v1.p.rapidapi.com'
}
};

try {
const response = await fetch(url, options);
const result = await response.text();
console.log(result);
} catch (error) {
console.error(error);
}

{
"results": [
{
"id": 1098388,
"usedIngredientCount": 2,
"missedIngredientCount": 3,
"likes": 0,
"title": "Watermelon Salad with Feta, Walnut & Nigella Seeds",
"image": "https://img.spoonacular.com/recipes/1098388-312x231.jpg",
"imageType": "jpg"
},
{
"id": 664912,
"usedIngredientCount": 2,
"missedIngredientCount": 3,
"likes": 0,
"title": "Waldorf Salad With Fresh Goat Cheese",
"image": "https://img.spoonacular.com/recipes/664912-312x231.jpg",
"imageType": "jpg"
},
{
"id": 655438,
"usedIngredientCount": 2,
"missedIngredientCount": 6,
"likes": 0,
"title": "Pear Salad With Walnuts and Blue Cheese",
"image": "https://img.spoonacular.com/recipes/655438-312x231.jpg",
"imageType": "jpg"
},
{
"id": 661431,
"usedIngredientCount": 2,
"missedIngredientCount": 8,
"likes": 0,
"title": "Spring Salad with Radishes and Beets",
"image": "https://img.spoonacular.com/recipes/661431-312x231.jpg",
"imageType": "jpg"
},
{
"id": 632862,
"usedIngredientCount": 2,
"missedIngredientCount": 8,
"likes": 0,
"title": "Asian Pear and Gorgonzola Salad With Pomegranate Vinaigrette",
"image": "https://img.spoonacular.com/recipes/632862-312x231.jpg",
"imageType": "jpg"
},
{
"id": 658087,
"usedIngredientCount": 2,
"missedIngredientCount": 8,
"likes": 0,
"title": "Red Quinoa and Roasted Cauliflower Salad",
"image": "https://img.spoonacular.com/recipes/658087-312x231.jpg",
"imageType": "jpg"
},
{
"id": 655783,
"usedIngredientCount": 2,
"missedIngredientCount": 9,
"likes": 0,
"title": "Persimmon, Pomegranate, and Goat Cheese Salad",
"image": "https://img.spoonacular.com/recipes/655783-312x231.jpg",
"imageType": "jpg"
},
{
"id": 634767,
"usedIngredientCount": 2,
"missedIngredientCount": 10,
"likes": 0,
"title": "Beet and Blue Cheese Salad with Citrus Vinaigrette Dressing",
"image": "https://img.spoonacular.com/recipes/634767-312x231.jpg",
"imageType": "jpg"
},
{
"id": 640798,
"usedIngredientCount": 2,
"missedIngredientCount": 14,
"likes": 0,
"title": "Crisp Winter Salad with Maple Gorgonzola Dressing",
"image": "https://img.spoonacular.com/recipes/640798-312x231.jpg",
"imageType": "jpg"
},
{
"id": 663638,
"usedIngredientCount": 1,
"missedIngredientCount": 4,
"likes": 0,
"title": "Tomato Stack Salad",
"image": "https://img.spoonacular.com/recipes/663638-312x231.jpg",
"imageType": "jpg"
}
],
"offset": 0,
"number": 10,
"totalResults": 45
}

const url = 'https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/479101/information';
const options = {
method: 'GET',
headers: {
'x-rapidapi-key': '60d2f14485msh8a7e691ea7305bdp15c9bajsn5dec4b103f1c',
'x-rapidapi-host': 'spoonacular-recipe-food-nutrition-v1.p.rapidapi.com'
}
};

try {
const response = await fetch(url, options);
const result = await response.text();
console.log(result);
} catch (error) {
console.error(error);
}

const url = 'https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/findByNutrients?minProtein=0&minVitaminC=0&minSelenium=0&maxFluoride=50&maxVitaminB5=50&maxVitaminB3=50&maxIodine=50&minCarbs=0&maxCalories=250&minAlcohol=0&maxCopper=50&maxCholine=50&maxVitaminB6=50&minIron=0&maxManganese=50&minSodium=0&minSugar=0&maxFat=20&minCholine=0&maxVitaminC=50&maxVitaminB2=50&minVitaminB12=0&maxFolicAcid=50&minZinc=0&offset=0&maxProtein=100&minCalories=0&minCaffeine=0&minVitaminD=0&maxVitaminE=50&minVitaminB2=0&minFiber=0&minFolate=0&minManganese=0&maxPotassium=50&maxSugar=50&maxCaffeine=50&maxCholesterol=50&maxSaturatedFat=50&minVitaminB3=0&maxFiber=50&maxPhosphorus=50&minPotassium=0&maxSelenium=50&maxCarbs=100&minCalcium=0&minCholesterol=0&minFluoride=0&maxVitaminD=50&maxVitaminB12=50&minIodine=0&maxZinc=50&minSaturatedFat=0&minVitaminB1=0&maxFolate=50&minFolicAcid=0&maxMagnesium=50&minVitaminK=0&maxSodium=50&maxAlcohol=50&maxCalcium=50&maxVitaminA=50&maxVitaminK=50&minVitaminB5=0&maxIron=50&minCopper=0&maxVitaminB1=50&number=10&minVitaminA=0&minPhosphorus=0&minVitaminB6=0&minFat=5&minVitaminE=0';
const options = {
method: 'GET',
headers: {
'x-rapidapi-key': '60d2f14485msh8a7e691ea7305bdp15c9bajsn5dec4b103f1c',
'x-rapidapi-host': 'spoonacular-recipe-food-nutrition-v1.p.rapidapi.com'
}
};

try {
const response = await fetch(url, options);
const result = await response.text();
console.log(result);
} catch (error) {
console.error(error);
}
[
{
"id": 2,
"title": "Anchovies With Breadcrumbs & Scallions",
"image": "https://spoonacular.com/recipeImages/anchovies_with_breadcrumbs_scallions-2.jpg",
"imageType": "jpg",
"calories": 38,
"protein": "4g",
"fat": "2g",
"carbs": "0g"
},
{
"id": 111567,
"title": "Fish Tagine With Tomatoes, Capers, and Cinnamon",
"image": "https://spoonacular.com/recipeImages/fish-tagine-with-tomatoes-capers-and-cinnamon-2-111567.jpg",
"imageType": "jpg",
"calories": 319,
"protein": "36g",
"fat": "17g",
"carbs": "8g"
},
{
"id": 196932,
"title": "Seared Chicken with Avocado",
"image": "https://spoonacular.com/recipeImages/seared-chicken-with-avocado-196932.jpg",
"imageType": "jpg",
"calories": 226,
"protein": "25g",
"fat": "11g",
"carbs": "7g"
},
{
"id": 247018,
"title": "Lamb Shank Stew with Root Vegetables",
"image": "https://spoonacular.com/recipeImages/Lamb-Shank-Stew-with-Root-Vegetables-247018.jpg",
"imageType": "jpg",
"calories": 829,
"protein": "81g",
"fat": "28g",
"carbs": "51g"
},
{
"id": 358838,
"title": "Southwestern Chicken Salad",
"image": "https://spoonacular.com/recipeImages/Southwestern-Chicken-Salad-358838.jpg",
"imageType": "jpg",
"calories": 204,
"protein": "15g",
"fat": "9g",
"carbs": "18g"
},
{
"id": 362913,
"title": "Chili I",
"image": "https://spoonacular.com/recipeImages/Chili-I-362913.gif",
"imageType": "gif",
"calories": 451,
"protein": "39g",
"fat": "16g",
"carbs": "39g"
},
{
"id": 457747,
"title": "Cream Cake with Bing Cherry Sauce",
"image": "https://spoonacular.com/recipeImages/Cream-Cake-with-Bing-Cherry-Sauce-457747.png",
"imageType": "png",
"calories": 582,
"protein": "7g",
"fat": "31g",
"carbs": "71g"
},
{
"id": 551315,
"title": "More Power Gingerbread Smoothie",
"image": "https://spoonacular.com/recipeImages/More-Power-Gingerbread-Smoothie-551315.jpg",
"imageType": "jpg",
"calories": 645,
"protein": "37g",
"fat": "14g",
"carbs": "99g"
},
{
"id": 573776,
"title": "Slow Cooker Red Lentil Dal",
"image": "https://spoonacular.com/recipeImages/Slow-Cooker-Red-Lentil-Dal-573776.jpg",
"imageType": "jpg",
"calories": 363,
"protein": "19g",
"fat": "2g",
"carbs": "69g"
},
{
"id": 707586,
"title": "Browned Butter and Lemon Brussels Sprouts",
"image": "https://spoonacular.com/recipeImages/browned-butter-and-lemon-brussels-sprouts-707586.jpg",
"imageType": "jpg",
"calories": 169,
"protein": "8g",
"fat": "8g",
"carbs": "22g"
}
]

const url = 'https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/findByIngredients?ingredients=apples%2Cflour%2Csugar&number=5&ignorePantry=true&ranking=1';
const options = {
method: 'GET',
headers: {
'x-rapidapi-key': '60d2f14485msh8a7e691ea7305bdp15c9bajsn5dec4b103f1c',
'x-rapidapi-host': 'spoonacular-recipe-food-nutrition-v1.p.rapidapi.com'
}
};

try {
const response = await fetch(url, options);
const result = await response.text();
console.log(result);
} catch (error) {
console.error(error);
}

[
{
"id": 641803,
"title": "Easy & Delish! ~ Apple Crumble",
"image": "https://spoonacular.com/recipeImages/Easy---Delish--Apple-Crumble-641803.jpg",
"usedIngredientCount": 3,
"missedIngredientCount": 4,
"likes": 1
},
{
"id": 645152,
"title": "Grandma's Apple Crisp",
"image": "https://spoonacular.com/recipeImages/Grandmas-Apple-Crisp-645152.jpg",
"usedIngredientCount": 3,
"missedIngredientCount": 6,
"likes": 1
},
{
"id": 657563,
"title": "Quick Apple Ginger Pie",
"image": "https://spoonacular.com/recipeImages/Quick-Apple-Ginger-Pie-657563.jpg",
"usedIngredientCount": 3,
"missedIngredientCount": 6,
"likes": 1
},
{
"id": 639487,
"title": "Cinnamon Sugar Fried Apples",
"image": "https://spoonacular.com/recipeImages/Cinnamon-Sugar-Fried-Apples-639487.jpg",
"usedIngredientCount": 3,
"missedIngredientCount": 8,
"likes": 46
},
{
"id": 643426,
"title": "Fresh Apple Cake With Caramel Sauce",
"image": "https://spoonacular.com/recipeImages/Fresh-Apple-Cake-With-Caramel-Sauce-643426.jpg",
"usedIngredientCount": 3,
"missedIngredientCount": 12,
"likes": 9
}
]

const url = 'https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/1003464/equipmentWidget.json';
const options = {
method: 'GET',
headers: {
'x-rapidapi-key': '60d2f14485msh8a7e691ea7305bdp15c9bajsn5dec4b103f1c',
'x-rapidapi-host': 'spoonacular-recipe-food-nutrition-v1.p.rapidapi.com'
}
};

try {
const response = await fetch(url, options);
const result = await response.text();
console.log(result);
} catch (error) {
console.error(error);
}

{
"equipment": [
{
"name": "oven",
"image": "oven.jpg"
},
{
"name": "pie form",
"image": "pie-pan.png"
},
{
"name": "bowl",
"image": "bowl.jpg"
},
{
"name": "frying pan",
"image": "pan.png"
}
]
}

const url = 'https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/%7Bid%7D/equipmentWidget.json';
const options = {
method: 'GET',
headers: {
'Content-Type': 'application/json'
}
};

try {
const response = await fetch(url, options);
const result = await response.text();
console.log(result);
} catch (error) {
console.error(error);
}

{
"sweetness": 28.79,
"saltiness": 26.74,
"sourness": 6.22,
"bitterness": 12.38,
"savoriness": 11.8,
"fattiness": 100,
"spiciness": 0
}

const url = 'https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/1003464/priceBreakdownWidget.json';
const options = {
method: 'GET',
headers: {
'x-rapidapi-key': '60d2f14485msh8a7e691ea7305bdp15c9bajsn5dec4b103f1c',
'x-rapidapi-host': 'spoonacular-recipe-food-nutrition-v1.p.rapidapi.com'
}
};

try {
const response = await fetch(url, options);
const result = await response.text();
console.log(result);
} catch (error) {
console.error(error);
}

{
"ingredients": [
{
"name": "blueberries",
"image": "blueberries.jpg",
"price": 174.43,
"amount": {
"metric": {
"value": 222,
"unit": "g"
},
"us": {
"value": 1.5,
"unit": "cups"
}
}
},
{
"name": "egg white",
"image": "egg-white.jpg",
"price": 18.21,
"amount": {
"metric": {
"value": 1,
"unit": ""
},
"us": {
"value": 1,
"unit": ""
}
}
},
{
"name": "flour",
"image": "flour.png",
"price": 2,
"amount": {
"metric": {
"value": 2,
"unit": "Tbsps"
},
"us": {
"value": 2,
"unit": "Tbsps"
}
}
},
{
"name": "granulated sugar",
"image": "sugar-in-bowl.png",
"price": 20.67,
"amount": {
"metric": {
"value": 150,
"unit": "g"
},
"us": {
"value": 0.75,
"unit": "cup"
}
}
},
{
"name": "fresh lemon juice",
"image": "lemon-juice.jpg",
"price": 3.39,
"amount": {
"metric": {
"value": 1,
"unit": "tsp"
},
"us": {
"value": 1,
"unit": "tsp"
}
}
},
{
"name": "nutmeg",
"image": "ground-nutmeg.jpg",
"price": 7.39,
"amount": {
"metric": {
"value": 1,
"unit": "pinch"
},
"us": {
"value": 1,
"unit": "pinch"
}
}
},
{
"name": "pie dough round",
"image": "pie-crust.jpg",
"price": 364.29,
"amount": {
"metric": {
"value": 2,
"unit": ""
},
"us": {
"value": 2,
"unit": ""
}
}
},
{
"name": "quick cooking tapioca",
"image": "tapioca-pearls.png",
"price": 50.89,
"amount": {
"metric": {
"value": 2,
"unit": "Tbsps"
},
"us": {
"value": 2,
"unit": "Tbsps"
}
}
},
{
"name": "trimmed rhubarb",
"image": "rhubarb.jpg",
"price": 185.18,
"amount": {
"metric": {
"value": 305,
"unit": "g"
},
"us": {
"value": 2.5,
"unit": "cups"
}
}
},
{
"name": "unsalted butter",
"image": "butter-sliced.jpg",
"price": 6,
"amount": {
"metric": {
"value": 0.5,
"unit": "Tbsps"
},
"us": {
"value": 0.5,
"unit": "Tbsps"
}
}
}
],
"totalCost": 832.45,
"totalCostPerServing": 104.06
}

const url = 'https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/1003464/ingredientWidget.json';
const options = {
method: 'GET',
headers: {
'x-rapidapi-key': '60d2f14485msh8a7e691ea7305bdp15c9bajsn5dec4b103f1c',
'x-rapidapi-host': 'spoonacular-recipe-food-nutrition-v1.p.rapidapi.com'
}
};

try {
const response = await fetch(url, options);
const result = await response.text();
console.log(result);
} catch (error) {
console.error(error);
}

{
"ingredients": [
{
"name": "blueberries",
"image": "blueberries.jpg",
"amount": {
"metric": {
"value": 222,
"unit": "g"
},
"us": {
"value": 1.5,
"unit": "cups"
}
}
},
{
"name": "egg white",
"image": "egg-white.jpg",
"amount": {
"metric": {
"value": 1,
"unit": ""
},
"us": {
"value": 1,
"unit": ""
}
}
},
{
"name": "flour",
"image": "flour.png",
"amount": {
"metric": {
"value": 2,
"unit": "Tbsps"
},
"us": {
"value": 2,
"unit": "Tbsps"
}
}
},
{
"name": "granulated sugar",
"image": "sugar-in-bowl.png",
"amount": {
"metric": {
"value": 150,
"unit": "g"
},
"us": {
"value": 0.75,
"unit": "cup"
}
}
},
{
"name": "fresh lemon juice",
"image": "lemon-juice.jpg",
"amount": {
"metric": {
"value": 1,
"unit": "tsp"
},
"us": {
"value": 1,
"unit": "tsp"
}
}
},
{
"name": "nutmeg",
"image": "ground-nutmeg.jpg",
"amount": {
"metric": {
"value": 1,
"unit": "pinch"
},
"us": {
"value": 1,
"unit": "pinch"
}
}
},
{
"name": "pie dough round",
"image": "pie-crust.jpg",
"amount": {
"metric": {
"value": 2,
"unit": ""
},
"us": {
"value": 2,
"unit": ""
}
}
},
{
"name": "quick cooking tapioca",
"image": "tapioca-pearls.png",
"amount": {
"metric": {
"value": 2,
"unit": "Tbsps"
},
"us": {
"value": 2,
"unit": "Tbsps"
}
}
},
{
"name": "trimmed rhubarb",
"image": "rhubarb.jpg",
"amount": {
"metric": {
"value": 305,
"unit": "g"
},
"us": {
"value": 2.5,
"unit": "cups"
}
}
},
{
"name": "salt",
"image": "salt.jpg",
"amount": {
"metric": {
"value": 0.333,
"unit": "tsps"
},
"us": {
"value": 0.333,
"unit": "tsps"
}
}
},
{
"name": "unsalted butter",
"image": "butter-sliced.jpg",
"amount": {
"metric": {
"value": 0.5,
"unit": "Tbsps"
},
"us": {
"value": 0.5,
"unit": "Tbsps"
}
}
}
]
}

const url = 'https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/1003464/nutritionWidget.json';
const options = {
method: 'GET',
headers: {
'x-rapidapi-key': '60d2f14485msh8a7e691ea7305bdp15c9bajsn5dec4b103f1c',
'x-rapidapi-host': 'spoonacular-recipe-food-nutrition-v1.p.rapidapi.com'
}
};

try {
const response = await fetch(url, options);
const result = await response.text();
console.log(result);
} catch (error) {
console.error(error);
}

{
"ingredients": [
{
"amount": {
"metric": {
"unit": "g",
"value": 222
},
"us": {
"unit": "cups",
"value": 1.5
}
},
"image": "blueberries.jpg",
"name": "blueberries"
},
{
"amount": {
"metric": {
"unit": "",
"value": 1
},
"us": {
"unit": "",
"value": 1
}
},
"image": "egg-white.jpg",
"name": "egg white"
},
{
"amount": {
"metric": {
"unit": "Tbsps",
"value": 2
},
"us": {
"unit": "Tbsps",
"value": 2
}
},
"image": "flour.png",
"name": "flour"
},
{
"amount": {
"metric": {
"unit": "g",
"value": 150
},
"us": {
"unit": "cup",
"value": 0.75
}
},
"image": "sugar-in-bowl.png",
"name": "granulated sugar"
},
{
"amount": {
"metric": {
"unit": "tsp",
"value": 1
},
"us": {
"unit": "tsp",
"value": 1
}
},
"image": "lemon-juice.jpg",
"name": "fresh lemon juice"
},
{
"amount": {
"metric": {
"unit": "pinch",
"value": 1
},
"us": {
"unit": "pinch",
"value": 1
}
},
"image": "ground-nutmeg.jpg",
"name": "nutmeg"
},
{
"amount": {
"metric": {
"unit": "",
"value": 2
},
"us": {
"unit": "",
"value": 2
}
},
"image": "pie-crust.jpg",
"name": "pie dough round"
},
{
"amount": {
"metric": {
"unit": "Tbsps",
"value": 2
},
"us": {
"unit": "Tbsps",
"value": 2
}
},
"image": "tapioca-pearls.png",
"name": "quick cooking tapioca"
},
{
"amount": {
"metric": {
"unit": "g",
"value": 305
},
"us": {
"unit": "cups",
"value": 2.5
}
},
"image": "rhubarb.jpg",
"name": "trimmed rhubarb"
},
{
"amount": {
"metric": {
"unit": "tsps",
"value": 0.333
},
"us": {
"unit": "tsps",
"value": 0.333
}
},
"image": "salt.jpg",
"name": "salt"
},
{
"amount": {
"metric": {
"unit": "Tbsps",
"value": 0.5
},
"us": {
"unit": "Tbsps",
"value": 0.5
}
},
"image": "butter-sliced.jpg",
"name": "unsalted butter"
}
]
}

const url = 'https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/324694/analyzedInstructions?stepBreakdown=true';
const options = {
method: 'GET',
headers: {
'x-rapidapi-key': '60d2f14485msh8a7e691ea7305bdp15c9bajsn5dec4b103f1c',
'x-rapidapi-host': 'spoonacular-recipe-food-nutrition-v1.p.rapidapi.com'
}
};

try {
const response = await fetch(url, options);
const result = await response.text();
console.log(result);
} catch (error) {
console.error(error);
}

[
{
"name": "",
"steps": [
{
"number": 1,
"step": "Preheat the oven to 200 degrees F.",
"ingredients": [],
"equipment": [
{
"id": 404784,
"name": "oven",
"localizedName": "oven",
"image": "https://spoonacular.com/cdn/equipment_100x100/oven.jpg",
"temperature": {
"number": 200,
"unit": "Fahrenheit"
}
}
]
},
{
"number": 2,
"step": "Whisk together the flour, pecans, granulated sugar, light brown sugar, baking powder, baking soda, and salt in a medium bowl.",
"ingredients": [
{
"id": 19334,
"name": "light brown sugar",
"localizedName": "light brown sugar",
"image": "light-brown-sugar.jpg"
},
{
"id": 10719335,
"name": "granulated sugar",
"localizedName": "granulated sugar",
"image": "sugar-in-bowl.png"
},
{
"id": 18369,
"name": "baking powder",
"localizedName": "baking powder",
"image": "white-powder.jpg"
},
{
"id": 18372,
"name": "baking soda",
"localizedName": "baking soda",
"image": "white-powder.jpg"
},
{
"id": 12142,
"name": "pecans",
"localizedName": "pecans",
"image": "pecans.jpg"
},
{
"id": 20081,
"name": "all purpose flour",
"localizedName": "all purpose flour",
"image": "flour.png"
},
{
"id": 2047,
"name": "salt",
"localizedName": "salt",
"image": "salt.jpg"
}
],
"equipment": [
{
"id": 404661,
"name": "whisk",
"localizedName": "whisk",
"image": "https://spoonacular.com/cdn/equipment_100x100/whisk.png"
},
{
"id": 404783,
"name": "bowl",
"localizedName": "bowl",
"image": "https://spoonacular.com/cdn/equipment_100x100/bowl.jpg"
}
]
},
{
"number": 3,
"step": "Whisk together the eggs, buttermilk, butter and vanilla extract and vanilla bean in a small bowl.",
"ingredients": [
{
"id": 2050,
"name": "vanilla extract",
"localizedName": "vanilla extract",
"image": "vanilla-extract.jpg"
},
{
"id": 93622,
"name": "vanilla bean",
"localizedName": "vanilla bean",
"image": "vanilla.jpg"
},
{
"id": 1230,
"name": "buttermilk",
"localizedName": "buttermilk",
"image": "buttermilk.jpg"
},
{
"id": 1001,
"name": "butter",
"localizedName": "butter",
"image": "butter-sliced.jpg"
},
{
"id": 1123,
"name": "egg",
"localizedName": "egg",
"image": "egg.png"
}
],
"equipment": [
{
"id": 404661,
"name": "whisk",
"localizedName": "whisk",
"image": "https://spoonacular.com/cdn/equipment_100x100/whisk.png"
},
{
"id": 404783,
"name": "bowl",
"localizedName": "bowl",
"image": "https://spoonacular.com/cdn/equipment_100x100/bowl.jpg"
}
]
},
{
"number": 4,
"step": "Add the egg mixture to the dry mixture and gently mix to combine. Do not overmix.",
"ingredients": [
{
"id": 1123,
"name": "egg",
"localizedName": "egg",
"image": "egg.png"
}
],
"equipment": []
},
{
"number": 5,
"step": "Let the batter sit at room temperature for at least 15 minutes and up to 30 minutes before using.",
"ingredients": [],
"equipment": [],
"length": {
"number": 15,
"unit": "minutes"
}
},
{
"number": 6,
"step": "Heat a cast iron or nonstick griddle pan over medium heat and brush with melted butter. Once the butter begins to sizzle, use 2 tablespoons of the batter for each pancake and cook until the bubbles appear on the surface and the bottom is golden brown, about 2 minutes, flip over and cook until the bottom is golden brown, 1 to 2 minutes longer.",
"ingredients": [
{
"id": 1001,
"name": "butter",
"localizedName": "butter",
"image": "butter-sliced.jpg"
}
],
"equipment": [
{
"id": 404645,
"name": "frying pan",
"localizedName": "frying pan",
"image": "https://spoonacular.com/cdn/equipment_100x100/pan.png"
}
],
"length": {
"number": 3,
"unit": "minutes"
}
},
{
"number": 7,
"step": "Transfer the pancakes to a platter and keep warm in a 200 degree F oven.",
"ingredients": [],
"equipment": [
{
"id": 404784,
"name": "oven",
"localizedName": "oven",
"image": "https://spoonacular.com/cdn/equipment_100x100/oven.jpg",
"temperature": {
"number": 200,
"unit": "Fahrenheit"
}
}
]
},
{
"number": 8,
"step": "Serve 6 pancakes per person, top each with some of the bourbon butter.",
"ingredients": [
{
"id": 10014037,
"name": "bourbon",
"localizedName": "bourbon",
"image": "bourbon.png"
},
{
"id": 1001,
"name": "butter",
"localizedName": "butter",
"image": "butter-sliced.jpg"
}
],
"equipment": []
},
{
"number": 9,
"step": "Drizzle with warm maple syrup and dust with confectioners' sugar.",
"ingredients": [
{
"id": 19336,
"name": "powdered sugar",
"localizedName": "powdered sugar",
"image": "powdered-sugar.jpg"
},
{
"id": 19911,
"name": "maple syrup",
"localizedName": "maple syrup",
"image": "https://spoonacular.com/cdn/ingredients_100x100/maple-syrup.png"
}
],
"equipment": []
},
{
"number": 10,
"step": "Garnish with fresh mint sprigs and more toasted pecans, if desired.",
"ingredients": [
{
"id": 2064,
"name": "fresh mint",
"localizedName": "fresh mint",
"image": "mint.jpg"
},
{
"id": 12142,
"name": "pecans",
"localizedName": "pecans",
"image": "pecans.jpg"
}
],
"equipment": []
}
]
},
{
"name": "Bourbon Molasses Butter",
"steps": [
{
"number": 1,
"step": "Combine the bourbon and sugar in a small saucepan and cook over high heat until reduced to 3 tablespoons, remove and let cool.",
"ingredients": [
{
"id": 10014037,
"name": "bourbon",
"localizedName": "bourbon",
"image": "bourbon.png"
},
{
"id": 19335,
"name": "sugar",
"localizedName": "sugar",
"image": "sugar-in-bowl.png"
}
],
"equipment": [
{
"id": 404669,
"name": "sauce pan",
"localizedName": "sauce pan",
"image": "https://spoonacular.com/cdn/equipment_100x100/sauce-pan.jpg"
}
]
},
{
"number": 2,
"step": "Put the butter, molasses, salt and cooled bourbon mixture in a food processor and process until smooth.",
"ingredients": [
{
"id": 19304,
"name": "molasses",
"localizedName": "molasses",
"image": "molasses.jpg"
},
{
"id": 10014037,
"name": "bourbon",
"localizedName": "bourbon",
"image": "bourbon.png"
},
{
"id": 1001,
"name": "butter",
"localizedName": "butter",
"image": "butter-sliced.jpg"
},
{
"id": 2047,
"name": "salt",
"localizedName": "salt",
"image": "salt.jpg"
}
],
"equipment": [
{
"id": 404771,
"name": "food processor",
"localizedName": "food processor",
"image": "https://spoonacular.com/cdn/equipment_100x100/food-processor.png"
}
]
},
{
"number": 3,
"step": "Scrape into a bowl, cover with plastic wrap and refrigerate for at least 1 hour to allow the flavors to meld.",
"ingredients": [
{
"id": 10018364,
"name": "wrap",
"localizedName": "wrap",
"image": "flour-tortilla.jpg"
}
],
"equipment": [
{
"id": 404730,
"name": "plastic wrap",
"localizedName": "plastic wrap",
"image": "https://spoonacular.com/cdn/equipment_100x100/plastic-wrap.jpg"
},
{
"id": 404783,
"name": "bowl",
"localizedName": "bowl",
"image": "https://spoonacular.com/cdn/equipment_100x100/bowl.jpg"
}
],
"length": {
"number": 60,
"unit": "minutes"
}
},
{
"number": 4,
"step": "Remove from the refrigerator about 30 minutes before using to soften.",
"ingredients": [],
"equipment": [],
"length": {
"number": 30,
"unit": "minutes"
}
}
]
}
]
