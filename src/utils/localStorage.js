const STORAGE_KEY = 'swiftBudgetTransactions';
const BUDGET_STORAGE_KEY = 'swiftBudgetBudgets';
const THEME_STORAGE_KEY = 'swiftBudgetTheme';
const EXPENSE_CATEGORIES_STORAGE_KEY = 'swiftBudgetCategories';
const INCOME_CATEGORIES_STORAGE_KEY = 'swiftBudgetIncomeCategories';
const LOGS_STORAGE_KEY = 'swiftBudgetLogs';
const USER_PROFILE_STORAGE_KEY = 'swiftBudgetProfile';
const COLLABORATORS_STORAGE_KEY = 'swiftBudgetCollaborators';
const AUTH_USER_KEY = 'swiftBudgetAuthUser'; // This represents the currently logged-in user (session)
const USER_DB_KEY = 'swiftBudgetUsers'; // This is our mock user "database"

const ALL_KEYS = [
    STORAGE_KEY,
    BUDGET_STORAGE_KEY,
    THEME_STORAGE_KEY,
    EXPENSE_CATEGORIES_STORAGE_KEY,
    INCOME_CATEGORIES_STORAGE_KEY,
    LOGS_STORAGE_KEY,
    USER_PROFILE_STORAGE_KEY,
    COLLABORATORS_STORAGE_KEY,
    AUTH_USER_KEY,
    USER_DB_KEY
];

export const getStoredTransactions = () => {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        return stored ? JSON.parse(stored) : [];
    } catch (error) {
        console.error("Error retrieving from localStorage", error);
        return [];
    }
};

export const storeTransactions = (transactions) => {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
    } catch (error) {
        console.error("Error saving to localStorage", error);
    }
};

export const getStoredBudgets = () => {
    try {
        const stored = localStorage.getItem(BUDGET_STORAGE_KEY);
        return stored ? JSON.parse(stored) : null;
    } catch (error) {
        console.error("Error retrieving budgets from localStorage", error);
        return null;
    }
};

export const storeBudgets = (budgets) => {
    try {
        localStorage.setItem(BUDGET_STORAGE_KEY, JSON.stringify(budgets));
    } catch (error) {
        console.error("Error saving budgets to localStorage", error);
    }
};

export const getStoredTheme = () => {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    return stored || 'light';
};

export const storeTheme = (theme) => {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
};

export const getStoredExpenseCategories = () => {
    try {
        const stored = localStorage.getItem(EXPENSE_CATEGORIES_STORAGE_KEY);
        return stored ? JSON.parse(stored) : null;
    } catch (error) {
        console.error("Error retrieving expense categories from localStorage", error);
        return null;
    }
};

export const storeExpenseCategories = (categories) => {
    try {
        localStorage.setItem(EXPENSE_CATEGORIES_STORAGE_KEY, JSON.stringify(categories));
    } catch (error) {
        console.error("Error saving expense categories to localStorage", error);
    }
};

export const getStoredIncomeCategories = () => {
    try {
        const stored = localStorage.getItem(INCOME_CATEGORIES_STORAGE_KEY);
        return stored ? JSON.parse(stored) : null;
    } catch (error) {
        console.error("Error retrieving income categories from localStorage", error);
        return null;
    }
};

export const storeIncomeCategories = (categories) => {
    try {
        localStorage.setItem(INCOME_CATEGORIES_STORAGE_KEY, JSON.stringify(categories));
    } catch (error) {
        console.error("Error saving income categories to localStorage", error);
    }
};

export const getStoredUserProfile = () => {
    try {
        const stored = localStorage.getItem(USER_PROFILE_STORAGE_KEY);
        return stored ? JSON.parse(stored) : null;
    } catch (error) {
        console.error("Error retrieving user profile from localStorage", error);
        return null;
    }
};

export const storeUserProfile = (profile) => {
    try {
        localStorage.setItem(USER_PROFILE_STORAGE_KEY, JSON.stringify(profile));
    } catch (error) {
        console.error("Error saving user profile to localStorage", error);
    }
};

export const getStoredCollaborators = () => {
    try {
        const stored = localStorage.getItem(COLLABORATORS_STORAGE_KEY);
        return stored ? JSON.parse(stored) : [];
    } catch (error) {
        console.error("Error retrieving collaborators from localStorage", error);
        return [];
    }
};

export const storeCollaborators = (collaborators) => {
    try {
        localStorage.setItem(COLLABORATORS_STORAGE_KEY, JSON.stringify(collaborators));
    } catch (error) {
        console.error("Error saving collaborators to localStorage", error);
    }
};

export const getStoredUser = () => {
    try {
        const stored = localStorage.getItem(AUTH_USER_KEY);
        return stored ? JSON.parse(stored) : null;
    } catch (error) {
        console.error("Error retrieving user from localStorage", error);
        return null;
    }
};

export const storeUser = (user) => {
    try {
        localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
    } catch (error) {
        console.error("Error saving user to localStorage", error);
    }
};

export const clearUser = () => {
    try {
        localStorage.removeItem(AUTH_USER_KEY);
    } catch (error) {
        console.error("Error clearing user from localStorage", error);
    }
};

export const clearAllData = () => {
    try {
        ALL_KEYS.forEach(key => {
            localStorage.removeItem(key);
        });
    } catch (error) {
        console.error("Error clearing all data from localStorage", error);
    }
};