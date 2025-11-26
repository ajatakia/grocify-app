import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const DishSearch = ({ onAddDish }) => {
    const [input, setInput] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const suggestionsRef = useRef(null);

    useEffect(() => {
        const timer = setTimeout(async () => {
            if (input.trim().length > 0) {
                try {
                    const response = await axios.get(`/api/search?q=${input}`);
                    if (response.data.meals) {
                        setSuggestions(response.data.meals.slice(0, 5));
                        setSelectedIndex(-1); // Reset selection on new search
                    } else {
                        setSuggestions([]);
                    }
                } catch (error) {
                    console.error("Error fetching suggestions:", error);
                }
            } else {
                setSuggestions([]);
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [input]);

    const handleAdd = async (mealToAdd = null) => {
        if (!mealToAdd && !input) return;

        setLoading(true);
        try {
            let meal = mealToAdd;
            if (!meal) {
                const response = await axios.get(`/api/dish/${input}`);
                meal = response.data.meals ? response.data.meals[0] : null;
            }

            if (meal) {
                onAddDish(meal);
                setInput('');
                setSuggestions([]);
                setSelectedIndex(-1);
            } else {
                alert("Dish not found!");
            }
        } catch (error) {
            console.error("Error adding dish:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyDown = (e) => {
        if (suggestions.length === 0) {
            if (e.key === 'Enter') {
                e.preventDefault();
                handleAdd();
            }
            return;
        }

        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setSelectedIndex(prev => (prev < suggestions.length - 1 ? prev + 1 : prev));
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setSelectedIndex(prev => (prev > 0 ? prev - 1 : -1));
        } else if (e.key === 'Enter') {
            e.preventDefault();
            if (selectedIndex >= 0) {
                const selectedMeal = suggestions[selectedIndex];
                setInput(selectedMeal.strMeal);
                setSuggestions([]);
                handleAdd(selectedMeal);
            } else {
                handleAdd();
            }
        } else if (e.key === 'Escape') {
            setSuggestions([]);
            setSelectedIndex(-1);
        }
    };

    return (
        <section className="input-section">
            <div className="input-group">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="e.g., Spaghetti Bolognese"
                    aria-label="Dish name"
                />
                <button onClick={() => handleAdd()} disabled={loading}>
                    {loading ? 'Searching...' : 'Add Dish'}
                </button>
            </div>
            {suggestions.length > 0 && (
                <div className="suggestions" ref={suggestionsRef}>
                    {suggestions.map((meal, index) => (
                        <div
                            key={meal.idMeal}
                            className={`suggestion-item ${index === selectedIndex ? 'selected' : ''}`}
                            style={{ backgroundColor: index === selectedIndex ? '#f3f4f6' : 'transparent', color: index === selectedIndex ? '#6366f1' : 'inherit' }}
                            onClick={() => {
                                setInput(meal.strMeal);
                                setSuggestions([]);
                                handleAdd(meal);
                            }}
                            onMouseEnter={() => setSelectedIndex(index)}
                        >
                            {meal.strMeal}
                        </div>
                    ))}
                </div>
            )}
        </section>
    );
};

export default DishSearch;
