import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
    getStoredTransactions, storeTransactions, 
    getStoredBudgets, storeBudgets, 
    getStoredTheme, storeTheme, 
    getStoredExpenseCategories, storeExpenseCategories,
    getStoredIncomeCategories, storeIncomeCategories,
    getStoredUserProfile, storeUserProfile,
    getStoredCollaborators, storeCollaborators,
    getStoredUser, storeUser, clearUser,
    clearAllData
} from '../utils/localStorage.js';
import { logAction, getLogs, clearLogs as clearLogsUtil } from '../utils/logger.js';

const AppContext = createContext(null);

export const useAppContext = () => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error('useAppContext must be used within an AppProvider');
    }
    return context;
};

export const AppProvider = ({ children }) => {
    const DEFAULT_EXPENSE_CATEGORIES = ['Food', 'Transport', 'Bills', 'Entertainment', 'Health', 'Shopping', 'Accessories', 'Rent', 'Other'];
    const DEFAULT_INCOME_CATEGORIES = ['Salary', 'Bonus', 'Gift', 'Investment', 'Freelance Job', 'Hustle', 'Other'];
    
    const [transactions, setTransactions] = useState(getStoredTransactions());
    const [theme, setTheme] = useState(getStoredTheme());
    const [isClearModalOpen, setIsClearModalOpen] = useState(false);
    const [isDeleteAccountModalOpen, setIsDeleteAccountModalOpen] = useState(false);
    const [expenseCategories, setExpenseCategories] = useState(() => getStoredExpenseCategories() || DEFAULT_EXPENSE_CATEGORIES);
    const [incomeCategories, setIncomeCategories] = useState(() => getStoredIncomeCategories() || DEFAULT_INCOME_CATEGORIES);
    const [toast, setToast] = useState({ message: '', type: 'success' });
    const [isLogsModalOpen, setIsLogsModalOpen] = useState(false);
    
    const DEFAULT_BUDGETS = DEFAULT_EXPENSE_CATEGORIES.reduce((acc, cat) => {
        acc[cat] = 500;
        return acc;
    }, {});

    const [budgets, setBudgets] = useState(() => {
        const storedBudgets = getStoredBudgets();
        if (storedBudgets) {
            const updatedBudgets = { ...storedBudgets };
            expenseCategories.forEach(cat => {
                if (!(cat in updatedBudgets)) {
                    updatedBudgets[cat] = 0;
                }
            });
            return updatedBudgets;
        }
        return DEFAULT_BUDGETS;
    });
    const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false);
    const [isIncomeCategoryModalOpen, setIsIncomeCategoryModalOpen] = useState(false);
    const [isProfileSettingsModalOpen, setIsProfileSettingsModalOpen] = useState(false);
    const [currentUser, setCurrentUser] = useState(() => getStoredUser());
    const [isAuthenticated, setIsAuthenticated] = useState(!!currentUser);

    const [userProfile, setUserProfile] = useState(() => getStoredUserProfile() || {
        name: currentUser ? currentUser.name : 'Default User',
        email: currentUser ? currentUser.email : 'user@example.com',
        phone: '',
        profileImageUrl: null,
    });
    const [collaborators, setCollaborators] = useState(() => getStoredCollaborators() || []);
    
    useEffect(() => {
        if (isAuthenticated) {
            logAction('Login', 'User session started.', currentUser?.name);
        }
    }, [isAuthenticated]);

    useEffect(() => { storeTransactions(transactions); }, [transactions]);
    useEffect(() => { storeBudgets(budgets); }, [budgets]);
    useEffect(() => { storeExpenseCategories(expenseCategories); }, [expenseCategories]);
    useEffect(() => { storeIncomeCategories(incomeCategories); }, [incomeCategories]);
    useEffect(() => { storeUserProfile(userProfile); }, [userProfile]);
    useEffect(() => { storeCollaborators(collaborators); }, [collaborators]);
    useEffect(() => {
        document.body.className = theme;
        storeTheme(theme);
    }, [theme]);

    const showToast = (message, type = 'success') => {
        setToast({ message, type });
    };

    const closeToast = () => {
        setToast({ message: '' });
    };

    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        logAction('Theme Change', `Theme changed to ${newTheme}`, currentUser?.name);
    };

    const addTransaction = (transaction) => {
        setTransactions([...transactions, { ...transaction, id: Date.now() }]);
        logAction('Add Transaction', `added ${transaction.type}: ${transaction.description} ($${transaction.amount})`, currentUser?.name || 'Unknown');
        showToast('Transaction added successfully!', 'success');
    };
    
    const deleteTransaction = (id) => {
        const transactionToDelete = transactions.find(t => t.id === id);
        setTransactions(transactions.filter(t => t.id !== id));
        if (transactionToDelete) {
             logAction('Delete Transaction', `removed: ${transactionToDelete.description} ($${transactionToDelete.amount})`, currentUser?.name || 'Unknown');
             showToast('Transaction deleted successfully.', 'success');
        }
    };
    
    const updateBudgets = (newBudgets) => {
        setBudgets(newBudgets);
        logAction('Set Category Budget Limit', 'Budgets updated.', currentUser?.name);
        showToast('Budgets saved successfully!', 'success');
    };

    const addCustomExpenseCategory = (categoryName, budget) => {
        if (expenseCategories.includes(categoryName)) {
            showToast('This category already exists.', 'warning');
            return;
        }
        const newCategory = categoryName.trim();
        if (newCategory) {
            setExpenseCategories(prev => [...prev, newCategory]);
            setBudgets(prev => ({...prev, [newCategory]: budget || 0}));
            logAction('Add Custom Expense Category', `added category: ${newCategory} with budget $${budget || 0}`, currentUser?.name || 'Unknown');
            showToast('Custom expense category added!', 'success');
        }
    };

    const deleteCustomExpenseCategory = (categoryToDelete) => {
        if (DEFAULT_EXPENSE_CATEGORIES.includes(categoryToDelete)) {
            showToast("Default categories cannot be deleted.", 'error');
            return;
        }
        setExpenseCategories(prev => prev.filter(cat => cat !== categoryToDelete));
        setBudgets(prev => {
            const newBudgets = {...prev};
            delete newBudgets[categoryToDelete];
            return newBudgets;
        });
        logAction('Delete Custom Expense Category', `deleted category: ${categoryToDelete}`, currentUser?.name || 'Unknown');
        showToast('Custom expense category removed.', 'success');
    };

    const addCustomIncomeCategory = (categoryName) => {
        if (incomeCategories.includes(categoryName)) {
            showToast('This income category already exists.', 'warning');
            return;
        }
        const newCategory = categoryName.trim();
        if (newCategory) {
            setIncomeCategories(prev => [...prev, newCategory]);
            logAction('Add Custom Income Category', `added category: ${newCategory}`, currentUser?.name || 'Unknown');
            showToast('Custom income category added!', 'success');
        }
    };

    const deleteCustomIncomeCategory = (categoryToDelete) => {
        if (DEFAULT_INCOME_CATEGORIES.includes(categoryToDelete)) {
            showToast("Default income categories cannot be deleted.", 'error');
            return;
        }
        setIncomeCategories(prev => prev.filter(cat => cat !== categoryToDelete));
        logAction('Delete Custom Income Category', `deleted category: ${categoryToDelete}`, currentUser?.name || 'Unknown');
        showToast('Custom income category removed.', 'success');
    };

    const handleUpdateProfile = (newProfile) => {
        const changes = [];
        if (userProfile.name !== newProfile.name) changes.push('Name');
        if (userProfile.email !== newProfile.email) changes.push('Email');
        if (userProfile.phone !== newProfile.phone) changes.push('Phone');
        if (userProfile.profileImageUrl !== newProfile.profileImageUrl) changes.push('Profile Picture');

        setUserProfile(p => ({ ...p, ...newProfile }));

        if (currentUser && newProfile.email !== currentUser.email) {
            const updatedUser = { ...currentUser, email: newProfile.email };
            setCurrentUser(updatedUser);
            storeUser(updatedUser);
        }
        if (currentUser && newProfile.name !== currentUser.name) {
            const updatedUser = { ...currentUser, name: newProfile.name };
            setCurrentUser(updatedUser);
            storeUser(updatedUser);
        }

        if (changes.length > 0) {
            logAction('Profile Updated', `profile updated: ${changes.join(', ')}`, currentUser?.name || 'Unknown');
        }
        showToast('Profile updated successfully!', 'success');
    };
    
    const handleAddCollaborator = (email) => {
        if (!email.trim() || !/^\S+@\S+\.\S+$/.test(email)) {
            showToast('Please enter a valid email address.', 'warning');
            return;
        }
        if (collaborators.includes(email)) {
            showToast('This collaborator already exists.', 'warning');
            return;
        }
        setCollaborators(prev => [...prev, email]);
        logAction('Collaborator Added', `added collaborator: ${email}`, currentUser?.name || 'Unknown');
        showToast('Collaborator added successfully!', 'success');
    };
    
    const handleRemoveCollaborator = (emailToRemove) => {
        setCollaborators(prev => prev.filter(email => email !== emailToRemove));
        logAction('Collaborator Removed', `removed collaborator: ${emailToRemove}`, currentUser?.name || 'Unknown');
        showToast('Collaborator removed.', 'success');
    };

    const handleResetCollaboratorPassword = (email) => {
        logAction('Collaborator Password Reset', `password reset initiated for: ${email}`, currentUser?.name || 'Unknown');
        showToast(`Password reset link sent to ${email}.`, 'info');
    };

    const handleLogin = (user) => {
        storeUser(user); // This now acts as session storage
        setCurrentUser(user);
        const storedProfile = getStoredUserProfile();
        setUserProfile({
            ...storedProfile,
            name: user.name,
            email: user.email,
        });
        setIsAuthenticated(true);
        logAction('Login', 'session started', user.name);
        showToast(`Welcome back, ${user.name}!`, 'success');
    };
    
    const handleSignup = (user) => {
        handleLogin(user);
    };

    const handleLogout = () => {
        logAction('Logout', 'session has ended', currentUser?.name || 'Unknown');
        showToast('Logging out...', 'info');
        setTimeout(() => {
            clearUser(); // Clears the session user, not the "database"
            setIsAuthenticated(false);
            setCurrentUser(null);
        }, 1500);
    };

    const clearTransactions = (period) => {
        logAction('Clear Financial Records', `cleared records for period: ${period}`, currentUser?.name || 'Unknown');

        if (period === 'all') {
            setTransactions([]);
            showToast('All transaction records have been cleared.', 'success');
            return;
        }

        const now = new Date();
        let startDate;

        switch (period) {
            case 'day':
                startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
                break;
            case 'week':
                startDate = new Date(now.setDate(now.getDate() - now.getDay()));
                startDate.setHours(0, 0, 0, 0);
                break;
            case 'month':
                startDate = new Date(now.getFullYear(), now.getMonth(), 1);
                break;
            case 'year':
                startDate = new Date(now.getFullYear(), 0, 1);
                break;
            default:
                return;
        }
        
        const filteredTransactions = transactions.filter(t => new Date(t.date) < startDate);
        setTransactions(filteredTransactions);
        showToast(`Records for the selected period have been cleared.`, 'success');
    };

    const handleDeleteAccount = () => {
        logAction('Account Deleted', 'user has deleted their account and all data', currentUser?.name || 'Unknown');
        clearAllData();
        showToast('Account and all data successfully deleted. The application will now reload.', 'success');
        setTimeout(() => {
            window.location.reload();
        }, 3000);
    };

    const clearLogs = () => {
        clearLogsUtil();
        setIsLogsModalOpen(false);
        showToast('Logs cleared successfully!', 'success');
    };

    const income = transactions.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0);
    const expenses = transactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0);
    const balance = income - expenses;

    const value = {
        transactions, addTransaction, deleteTransaction, clearTransactions,
        theme, toggleTheme,
        isClearModalOpen, setIsClearModalOpen,
        isDeleteAccountModalOpen, setIsDeleteAccountModalOpen,
        expenseCategories, addCustomExpenseCategory, deleteCustomExpenseCategory,
        incomeCategories, addCustomIncomeCategory, deleteCustomIncomeCategory,
        toast, showToast, closeToast,
        isLogsModalOpen, setIsLogsModalOpen,
        budgets, updateBudgets,
        isBudgetModalOpen, setIsBudgetModalOpen,
        isIncomeCategoryModalOpen, setIsIncomeCategoryModalOpen,
        isProfileSettingsModalOpen, setIsProfileSettingsModalOpen,
        currentUser, isAuthenticated, handleLogin, handleSignup, handleLogout,
        userProfile, handleUpdateProfile,
        collaborators, handleAddCollaborator, handleRemoveCollaborator, handleResetCollaboratorPassword,
        handleDeleteAccount,
        logAction, getLogs, clearLogs,
        income, expenses, balance,
        DEFAULT_EXPENSE_CATEGORIES,
        DEFAULT_INCOME_CATEGORIES
    };

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};