import React, { useState, useEffect } from 'react';

const BudgetModal = ({
    onClose,
    onSave,
    initialBudgets,
    categories,
    defaultCategories,
    onAddCategory,
    onDeleteCategory,
    showToast
}) => {
    const [budgets, setBudgets] = useState(initialBudgets);
    const [showCustomForm, setShowCustomForm] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState('');
    const [newCategoryBudget, setNewCategoryBudget] = useState('');

    useEffect(() => {
        setBudgets(initialBudgets);
    }, [initialBudgets]);

    const handleBudgetChange = (category, value) => {
        const newBudgets = {
            ...budgets,
            [category]: parseFloat(value) || 0,
        };
        setBudgets(newBudgets);
    };

    const handleSave = () => {
        onSave(budgets);
        onClose();
    };

    const handleAddCustomCategory = () => {
        if (!newCategoryName.trim()) {
            showToast('Please enter a category name.', 'warning');
            return;
        }
        onAddCategory(newCategoryName, parseFloat(newCategoryBudget) || 0);
        setNewCategoryName('');
        setNewCategoryBudget('');
        setShowCustomForm(false);
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <h2>Set Category Budgets</h2>
                <p>Set a monthly spending limit for each expense category to stay on track.</p>
                
                <div className="budget-inputs-modal">
                    {categories.map(category => {
                        const isCustom = !defaultCategories.includes(category);
                        return (
                            <div key={category} className="form-group budget-input-item">
                                <label htmlFor={`budget-modal-${category}`}>{category}</label>
                                <div className="budget-input-wrapper">
                                    <input
                                        type="number"
                                        id={`budget-modal-${category}`}
                                        value={budgets[category] || ''}
                                        onChange={(e) => handleBudgetChange(category, e.target.value)}
                                        placeholder="0.00"
                                        min="0"
                                        step="10"
                                    />
                                    {isCustom && (
                                        <button 
                                            className="delete-category-btn"
                                            onClick={() => onDeleteCategory(category)}
                                            title={`Delete ${category} category`}
                                        >
                                            <span className="material-symbols-outlined">delete</span>
                                        </button>
                                    )}
                                </div>
                            </div>
                        )
                    })}
                </div>

                <div className="custom-category-section">
                    {!showCustomForm && (
                         <button className="add-category-btn" onClick={() => setShowCustomForm(true)}>
                            Add Custom Category
                        </button>
                    )}
                   
                    {showCustomForm && (
                        <div className="custom-category-form">
                            <h3>New Custom Category</h3>
                            <div className="form-group">
                                <label htmlFor="new-category-name">Category Name</label>
                                <input 
                                    type="text"
                                    id="new-category-name"
                                    value={newCategoryName}
                                    onChange={(e) => setNewCategoryName(e.target.value)}
                                    placeholder="e.g., Subscriptions"
                                />
                            </div>
                             <div className="form-group">
                                <label htmlFor="new-category-budget">Budget Limit (Optional)</label>
                                <input 
                                    type="number"
                                    id="new-category-budget"
                                    value={newCategoryBudget}
                                    onChange={(e) => setNewCategoryBudget(e.target.value)}
                                    placeholder="0.00"
                                    min="0"
                                    step="10"
                                />
                            </div>
                            <div className="custom-form-actions">
                                <button className="cancel-btn-small" onClick={() => setShowCustomForm(false)}>Cancel</button>
                                <button className="submit-btn-small" onClick={handleAddCustomCategory}>Add</button>
                            </div>
                        </div>
                    )}
                </div>

                <div className="modal-actions">
                    <button className="cancel-btn" onClick={onClose}>Cancel</button>
                    <button 
                        className="submit-btn"
                        onClick={handleSave}
                    >
                        Save Budgets
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BudgetModal;