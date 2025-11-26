import React, { useState } from 'react';

const ShoppingList = ({ items }) => {
    // We can manage checked state locally here or in parent.
    // Local is easier for UI only.
    const [checkedItems, setCheckedItems] = useState({});

    const toggleCheck = (item) => {
        setCheckedItems(prev => ({
            ...prev,
            [item]: !prev[item]
        }));
    };

    return (
        <div className="card list-card">
            <h2>Shopping List</h2>
            <ul className="list-group">
                {items.length === 0 ? (
                    <li className="empty-state">Add dishes to generate list.</li>
                ) : (
                    items.map((item) => (
                        <li key={item} className="ingredient-item">
                            <label className={`ingredient-item ${checkedItems[item] ? 'checked' : ''}`}>
                                <input
                                    type="checkbox"
                                    checked={!!checkedItems[item]}
                                    onChange={() => toggleCheck(item)}
                                />
                                <span>{item}</span>
                            </label>
                        </li>
                    ))
                )}
            </ul>
        </div>
    );
};

export default ShoppingList;
