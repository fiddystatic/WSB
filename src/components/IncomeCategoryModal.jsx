import React, { useState } from 'react';

const IncomeCategoryModal = ({
    onClose,
    categories,
    defaultCategories,
    onAddCategory,
    onDeleteCategory,
    showToast
}) => {
    const [showCustomForm, setShowCustomForm] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState('');

    const handleAddCustomCategory = () => {
        if (!newCategoryName.trim()) {
            showToast('Please enter a category name.', 'warning');
            return;
        }
        onAddCategory(newCategoryName);
        setNewCategoryName('');
        setShowCustomForm(false);
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <h2>Manage Income Categories</h2>
                <p>Add or remove custom categories for your income sources.</p>
                
                <div className="budget-inputs-modal">
                    {categories.map(category => {
                        const isCustom = !defaultCategories.includes(category);
                        return (
                            <div key={category} className="form-group budget-input-item">
                                <label>{category}</label>
                                <div className="budget-input-wrapper">
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
                            <h3>New Custom Income Category</h3>
                            <div className="form-group">
                                <label htmlFor="new-category-name">Category Name</label>
                                <input 
                                    type="text"
                                    id="new-category-name"
                                    value={newCategoryName}
                                    onChange={(e) => setNewCategoryName(e.target.value)}
                                    placeholder="e.g., Freelance Work"
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
                    <button className="cancel-btn" onClick={onClose}>Done</button>
                </div>
            </div>
        </div>
    );
};

export default IncomeCategoryModal;

