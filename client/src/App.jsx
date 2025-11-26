import React, { useState } from 'react';
import DishSearch from './components/DishSearch';
import DishList from './components/DishList';
import ShoppingList from './components/ShoppingList';

function App() {
  const [dishes, setDishes] = useState([]);
  const [shoppingList, setShoppingList] = useState([]);

  const extractIngredients = (meal) => {
    const ingredients = [];
    for (let i = 1; i <= 20; i++) {
      const ingredient = meal[`strIngredient${i}`];
      if (ingredient && ingredient.trim() !== "") {
        ingredients.push(ingredient.trim());
      }
    }
    return ingredients;
  };

  const addDish = (meal) => {
    if (dishes.some(d => d.name.toLowerCase() === meal.strMeal.toLowerCase())) {
      alert("You've already added this dish!");
      return;
    }

    const ingredients = extractIngredients(meal);
    setDishes([...dishes, {
      name: meal.strMeal,
      ingredients: ingredients,
      image: meal.strMealThumb
    }]);
  };

  const removeDish = (dishName) => {
    setDishes(dishes.filter(d => d.name !== dishName));
    setShoppingList([]); // Clear list on change
  };

  const generateShoppingList = () => {
    const ingredientsSet = new Set();
    dishes.forEach(dish => {
      dish.ingredients.forEach(ing => ingredientsSet.add(ing));
    });
    setShoppingList(Array.from(ingredientsSet).sort());
  };

  return (
    <div className="app-container">
      <header>
        <h1>Grocify</h1>
        <p>Enter your dishes, get your shopping list.</p>
      </header>

      <main>
        <DishSearch onAddDish={addDish} />

        <section className="content-grid">
          <DishList
            dishes={dishes}
            onRemoveDish={removeDish}
            onGenerate={generateShoppingList}
            canGenerate={dishes.length > 0}
          />
          <ShoppingList items={shoppingList} />
        </section>
      </main>
    </div>
  );
}

export default App;
