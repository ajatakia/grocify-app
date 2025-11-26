// State
let dishes = []; // Array of { name: string, ingredients: string[] }
let shoppingList = [];

// DOM Elements
const dishInput = document.getElementById('dish-input');
const addDishBtn = document.getElementById('add-dish-btn');
const dishListEl = document.getElementById('dish-list');
const generateBtn = document.getElementById('generate-btn');
const shoppingListEl = document.getElementById('shopping-list');
const suggestionsEl = document.getElementById('suggestions');

// Event Listeners
addDishBtn.addEventListener('click', addDish);
dishInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addDish();
});
generateBtn.addEventListener('click', generateShoppingList);

// Debounce function
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Autocomplete
dishInput.addEventListener('input', debounce(showSuggestions, 300));

// Functions
async function showSuggestions() {
    const input = dishInput.value.trim();
    suggestionsEl.innerHTML = '';

    if (!input) {
        suggestionsEl.classList.add('hidden');
        return;
    }

    try {
        const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${encodeURIComponent(input)}`);
        const data = await response.json();

        if (data.meals) {
            // Filter out already added dishes
            const availableMeals = data.meals.filter(meal =>
                !dishes.some(d => d.name === meal.strMeal)
            ).slice(0, 5); // Limit to 5 suggestions

            if (availableMeals.length > 0) {
                availableMeals.forEach(meal => {
                    const div = document.createElement('div');
                    div.className = 'suggestion-item';
                    div.textContent = meal.strMeal;
                    div.onclick = () => {
                        dishInput.value = meal.strMeal;
                        suggestionsEl.classList.add('hidden');
                        addDish();
                    };
                    suggestionsEl.appendChild(div);
                });
                suggestionsEl.classList.remove('hidden');
            } else {
                suggestionsEl.classList.add('hidden');
            }
        } else {
            suggestionsEl.classList.add('hidden');
        }
    } catch (error) {
        console.error("Error fetching suggestions:", error);
        suggestionsEl.classList.add('hidden');
    }
}

async function fetchDish(dishName) {
    try {
        const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${encodeURIComponent(dishName)}`);
        const data = await response.json();
        return data.meals ? data.meals[0] : null;
    } catch (error) {
        console.error("Error fetching dish:", error);
        return null;
    }
}

function extractIngredients(meal) {
    const ingredients = [];
    for (let i = 1; i <= 20; i++) {
        const ingredient = meal[`strIngredient${i}`];
        const measure = meal[`strMeasure${i}`];

        if (ingredient && ingredient.trim() !== "") {
            // Optional: Include measure? For now just ingredient name as per original design
            // ingredients.push(`${measure ? measure + ' ' : ''}${ingredient}`); 
            ingredients.push(ingredient.trim());
        }
    }
    return ingredients;
}

async function addDish() {
    const dishNameInput = dishInput.value.trim();

    if (!dishNameInput) return;

    addDishBtn.disabled = true;
    addDishBtn.textContent = "Searching...";

    try {
        // Check if already added
        if (dishes.some(d => d.name.toLowerCase() === dishNameInput.toLowerCase())) {
            alert("You've already added this dish!");
            dishInput.value = '';
            return;
        }

        const meal = await fetchDish(dishNameInput);

        if (!meal) {
            alert(`Sorry, we couldn't find a recipe for "${dishNameInput}". Please try another dish.`);
            return;
        }

        const ingredients = extractIngredients(meal);

        dishes.push({
            name: meal.strMeal,
            ingredients: ingredients,
            image: meal.strMealThumb // Bonus: we have an image now!
        });

        dishInput.value = '';
        suggestionsEl.classList.add('hidden');
        renderDishList();
        updateGenerateButton();

    } finally {
        addDishBtn.disabled = false;
        addDishBtn.textContent = "Add Dish";
    }
}

function removeDish(dishName) {
    dishes = dishes.filter(d => d.name !== dishName);
    renderDishList();
    updateGenerateButton();
    // Clear shopping list to force regeneration
    shoppingList = [];
    renderShoppingList();
}

function renderDishList() {
    dishListEl.innerHTML = '';

    if (dishes.length === 0) {
        dishListEl.innerHTML = '<li class="empty-state">No dishes added yet.</li>';
        return;
    }

    dishes.forEach(dish => {
        const li = document.createElement('li');
        li.className = 'dish-item';
        // Added a small image thumbnail if available, or just text
        li.innerHTML = `
            <div style="display:flex; align-items:center; gap:10px;">
                ${dish.image ? `<img src="${dish.image}" alt="${dish.name}" style="width:40px; height:40px; border-radius:50%; object-fit:cover;">` : ''}
                <span>${dish.name}</span>
            </div>
            <button class="remove-btn" onclick="removeDish('${dish.name.replace(/'/g, "\\'")}')">Remove</button>
        `;
        dishListEl.appendChild(li);
    });
}

function updateGenerateButton() {
    generateBtn.disabled = dishes.length === 0;
}

function generateShoppingList() {
    const ingredientsSet = new Set();

    dishes.forEach(dish => {
        dish.ingredients.forEach(ing => ingredientsSet.add(ing));
    });

    shoppingList = Array.from(ingredientsSet).sort();
    renderShoppingList();
}

function renderShoppingList() {
    shoppingListEl.innerHTML = '';

    if (shoppingList.length === 0) {
        shoppingListEl.innerHTML = '<li class="empty-state">Add dishes to generate list.</li>';
        return;
    }

    shoppingList.forEach(item => {
        const li = document.createElement('li');
        li.className = 'ingredient-item';
        li.innerHTML = `
            <label class="ingredient-item">
                <input type="checkbox" onchange="toggleCheck(this)">
                <span>${item}</span>
            </label>
        `;
        shoppingListEl.appendChild(li);
    });
}

// Global scope for inline onclick handlers
window.removeDish = removeDish;
window.toggleCheck = function (checkbox) {
    const span = checkbox.nextElementSibling;
    if (checkbox.checked) {
        checkbox.parentElement.classList.add('checked');
    } else {
        checkbox.parentElement.classList.remove('checked');
    }
};
