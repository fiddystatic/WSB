const LOGS_STORAGE_KEY = 'swiftBudgetLogs';

const getDeviceInfo = () => {
    const ua = navigator.userAgent;
    let os = "Unknown OS";
    if (ua.indexOf("Win") != -1) os = "Windows";
    if (ua.indexOf("Mac") != -1) os = "MacOS";
    if (ua.indexOf("Linux") != -1) os = "Linux";
    if (ua.indexOf("Android") != -1) os = "Android";
    if (ua.indexOf("like Mac") != -1) os = "iOS";
    
    const browser = (ua.match(/Chrome|Firefox|Safari|Opera|Edg/i) || ["Unknown Browser"])[0];
    
    return {
        browser: browser,
        os: os,
        device: navigator.platform
    };
};

export const logAction = (type, details, userName = 'Anonymous') => {
    try {
        const logs = getLogs();
        const newLog = {
            id: Date.now(),
            timestamp: new Date().toISOString(),
            type,
            details: `User: ${userName} ${details}`,
            ...getDeviceInfo()
        };
        logs.unshift(newLog); // Add to the beginning of the array
        localStorage.setItem(LOGS_STORAGE_KEY, JSON.stringify(logs.slice(0, 200))); // Store max 200 logs
    } catch (error) {
        console.error("Error saving log to localStorage", error);
    }
};

export const getLogs = () => {
    try {
        const stored = localStorage.getItem(LOGS_STORAGE_KEY);
        return stored ? JSON.parse(stored) : [];
    } catch (error) {
        console.error("Error retrieving logs from localStorage", error);
        return [];
    }
};

export const clearLogs = () => {
    try {
        localStorage.removeItem(LOGS_STORAGE_KEY);
        logAction('Logs Cleared', 'All activity logs have been deleted.', 'System');
    } catch (error) {
        console.error("Error clearing logs from localStorage", error);
    }
};