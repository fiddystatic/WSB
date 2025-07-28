import React from 'react';

const Settings = ({ openBudgetModal, openIncomeCategoryModal }) => {
    return (
        <div className="card settings-card left-edge-style" id="settings">
            <h2>Budget Settings</h2>
            <p>Manage your expense budgets and customize your income categories to better suit your needs.</p>
            <br />
            <div className="settings-actions">
                <button onClick={openBudgetModal} className="set-budget-btn">
                    Set Budget Limits
                </button>
                <button onClick={openIncomeCategoryModal} className="submit-btn">
                    Manage Income Categories
                </button>
            </div>
        </div>
    );
};

export default Settings;