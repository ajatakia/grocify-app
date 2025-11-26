import React from 'react';

const DishList = ({ dishes, onRemoveDish, onGenerate, canGenerate }) => {
    return (
        <div className="card dish-card">
            <h2>Your Menu</h2>
            <ul className="list-group">
                {dishes.length === 0 ? (
                    <li className="empty-state">No dishes added yet.</li>
                ) : (
                    dishes.map((dish) => (
                        <li key={dish.name} className="dish-item">
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                {dish.image && (
                                    <img
                                        src={dish.image}
                                        alt={dish.name}
                                        style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }}
                                    />
                                )}
                                <span>{dish.name}</span>
                            </div>
                            <button
                                className="remove-btn"
                                onClick={() => onRemoveDish(dish.name)}
                            >
                                Remove
                            </button>
                        </li>
                    ))
                )}
            </ul>
            <button
                className="action-btn"
                onClick={onGenerate}
                disabled={!canGenerate}
            >
                Generate Shopping List
            </button>
        </div>
    );
};

export default DishList;
