import React, { useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { AppProvider, useAppContext } from './contexts/AppContext.jsx';
import Navbar from './components/Navbar.jsx';
import Summary from './components/Summary.jsx';
import TransactionForm from './components/TransactionForm.jsx';
import TransactionList from './components/TransactionList.jsx';
import Chart from './components/Chart.jsx';
import Settings from './components/Settings.jsx';
import Analytics from './components/Analytics.jsx';
import Footer from './components/Footer.jsx';
import ClearDataModal from './components/ClearDataModal.jsx';
import DeleteAccountModal from './components/DeleteAccountModal.jsx';
import BudgetModal from './components/BudgetModal.jsx';
import IncomeCategoryModal from './components/IncomeCategoryModal.jsx';
import LogsModal from './components/LogsModal.jsx';
import Toast from './components/Toast.jsx';
import ProfileSettingsModal from './components/ProfileSettingsModal.jsx';
import Auth from './components/Auth.jsx';

const AppContent = () => {
    const {
        toast, closeToast, isAuthenticated, handleLogin, handleSignup, logAction, showToast,
        theme, toggleTheme, setIsProfileSettingsModalOpen, handleLogout,
        income, expenses, balance,
        transactions, addTransaction, deleteTransaction, clearTransactions,
        expenseCategories, addCustomExpenseCategory, deleteCustomExpenseCategory,
        incomeCategories, addCustomIncomeCategory, deleteCustomIncomeCategory,
        budgets, updateBudgets,
        isClearModalOpen, setIsClearModalOpen,
        isDeleteAccountModalOpen, setIsDeleteAccountModalOpen, handleDeleteAccount,
        isBudgetModalOpen, setIsBudgetModalOpen,
        isIncomeCategoryModalOpen, setIsIncomeCategoryModalOpen,
        isLogsModalOpen, setIsLogsModalOpen, getLogs, clearLogs,
        isProfileSettingsModalOpen, userProfile, handleUpdateProfile, collaborators, handleAddCollaborator, handleRemoveCollaborator, handleResetCollaboratorPassword,
        DEFAULT_EXPENSE_CATEGORIES, DEFAULT_INCOME_CATEGORIES,
        currentUser
    } = useAppContext();

    const userRole = currentUser?.role || 'collaborator';

    useEffect(() => {
        const preloader = document.getElementById('preloader');
        
        // Initialize default user if not present
        const users = JSON.parse(localStorage.getItem('swiftBudgetUsers') || '{}');
        if (!users['user@example.com']) {
            users['user@example.com'] = { 
                name: 'Demo User', 
                email: 'user@example.com', 
                password: 'password123' 
            };
            localStorage.setItem('swiftBudgetUsers', JSON.stringify(users));
        }

        if (preloader) {
            setTimeout(() => {
                 preloader.style.opacity = '0';
                 preloader.addEventListener('transitionend', () => preloader.remove());
            }, 500);
        }
    }, []);

    return React.createElement(React.Fragment, null,
        toast.message && React.createElement(Toast, { message: toast.message, type: toast.type, onClose: closeToast }),
        !isAuthenticated ? 
            React.createElement(Auth, { onLogin: handleLogin, onSignup: handleSignup, showToast: showToast, logAction: logAction }) :
            React.createElement('div', { className: 'app-container' },
                React.createElement(Navbar, { theme: theme, toggleTheme: toggleTheme, openProfileSettings: () => setIsProfileSettingsModalOpen(true), onLogout: handleLogout, userRole: userRole }),
                React.createElement('div', { id: 'balances' },
                    React.createElement(Summary, { income: income, expenses: expenses, balance: balance })
                ),
                React.createElement('main', { className: 'main-content' },
                    React.createElement('div', { className: 'transactions-section' },
                        React.createElement(TransactionForm, { addTransaction: addTransaction, expenseCategories: expenseCategories, incomeCategories: incomeCategories, showToast: showToast}),
                        React.createElement(TransactionList, { transactions: transactions, deleteTransaction: deleteTransaction })
                    ),
                    React.createElement('div', { className: 'visuals-section' },
                        React.createElement('div', { className: 'charts-container' },
                            React.createElement(Chart, { transactions: transactions, type: 'expense', title: 'Expense Breakdown', budgets: budgets }),
                            React.createElement(Chart, { transactions: transactions, type: 'income', title: 'Income Breakdown', budgets: {} })
                        ),
                        React.createElement(Analytics, { transactions: transactions, income: income, expenses: expenses, showToast: showToast }),
                        React.createElement(Settings, { 
                            openBudgetModal: () => setIsBudgetModalOpen(true),
                            openIncomeCategoryModal: () => setIsIncomeCategoryModalOpen(true)
                        }),
                        
                        userRole === 'owner' && React.createElement(React.Fragment, null,
                            React.createElement('div', { className: 'card left-edge-style', id: 'system-logs' },
                                React.createElement('h2', null, 'System Logs'),
                                React.createElement('p', null, 'View a read-only log of all activities and system events.'),
                                React.createElement('br'),
                                React.createElement('button', { className: 'view-logs-btn', onClick: () => setIsLogsModalOpen(true) }, 'View Activity Logs')
                            ),
                            React.createElement('div', { className: 'card clear-data-section' },
                                React.createElement('h2', null, 'Danger Zone'),
                                React.createElement('p', null, 'Permanently delete your financial records. This action cannot be undone.'),
                                React.createElement('br'),
                                React.createElement('div', { className: 'settings-actions' },
                                    React.createElement('button', { className: 'clear-data-btn', onClick: () => setIsClearModalOpen(true) }, 'Clear Financial Records')
                                )
                            )
                        )
                    )
                ),
                React.createElement(Footer, null),
                isClearModalOpen && userRole === 'owner' && 
                    React.createElement(ClearDataModal, { onClose: () => setIsClearModalOpen(false), onConfirm: clearTransactions, showToast: showToast }),
                isDeleteAccountModalOpen && 
                    React.createElement(DeleteAccountModal, { onClose: () => setIsDeleteAccountModalOpen(false), onConfirm: handleDeleteAccount, showToast: showToast }),
                isBudgetModalOpen && 
                    React.createElement(BudgetModal, { onClose: () => setIsBudgetModalOpen(false), onSave: updateBudgets, initialBudgets: budgets, categories: expenseCategories, defaultCategories: DEFAULT_EXPENSE_CATEGORIES, onAddCategory: addCustomExpenseCategory, onDeleteCategory: deleteCustomExpenseCategory, showToast: showToast }),
                isIncomeCategoryModalOpen && 
                    React.createElement(IncomeCategoryModal, { onClose: () => setIsIncomeCategoryModalOpen(false), categories: incomeCategories, defaultCategories: DEFAULT_INCOME_CATEGORIES, onAddCategory: addCustomIncomeCategory, onDeleteCategory: deleteCustomIncomeCategory, showToast: showToast }),
                isLogsModalOpen && userRole === 'owner' && 
                    React.createElement(LogsModal, { onClose: () => setIsLogsModalOpen(false), logs: getLogs(), clearLogs: clearLogs, showToast: showToast }),
                isProfileSettingsModalOpen && 
                    React.createElement(ProfileSettingsModal, { onClose: () => setIsProfileSettingsModalOpen(false), userProfile: userProfile, onUpdateProfile: handleUpdateProfile, collaborators: collaborators, onAddCollaborator: handleAddCollaborator, onRemoveCollaborator: handleRemoveCollaborator, onResetPassword: handleResetCollaboratorPassword, showToast: showToast, openDeleteAccountModal: () => { setIsProfileSettingsModalOpen(false); setIsDeleteAccountModalOpen(true); }, logAction: logAction, onLogout: handleLogout })
            )
    );
};

const App = () => {
    return React.createElement(AppProvider, null,
        React.createElement(AppContent, null)
    );
}

const root = createRoot(document.getElementById('root'));
root.render(React.createElement(App, null));

export default App;