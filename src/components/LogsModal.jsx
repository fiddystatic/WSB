import React, { useState } from 'react';

const LogItem = ({ log }) => {
    const { timestamp, type, details, browser, os } = log;
    
    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const getLogTypeClass = (logType) => {
        const lowerType = logType.toLowerCase();
        if (lowerType.includes('login') || lowerType.includes('profile updated') || lowerType.includes('theme change')) {
            return 'info';
        }
        if (lowerType.startsWith('add') || lowerType.endsWith('add') || lowerType.endsWith('added')) {
            return 'success';
        }
        if (lowerType.startsWith('delete') || lowerType.includes('clear') || lowerType.endsWith('deleted') || lowerType.includes('remove')) {
            return 'danger';
        }
        if (lowerType.includes('logout')) {
            return 'warning';
        }
        if (lowerType.includes('collaborator')) {
            return 'collaborator';
        }
        return 'default'; // purple
    };
    
    const logClass = getLogTypeClass(type);

    return (
        <li className="log-item">
            <div className="log-item-header">
                <span className={`log-type log-type-${logClass}`}>{type}</span>
                <span className="log-timestamp">{formatDate(timestamp)}</span>
            </div>
            <p className="log-details">{details}</p>
            <div className="log-meta">
                <span>{os}</span>
                <span>{browser}</span>
            </div>
        </li>
    );
};

const LogsModal = ({ onClose, logs, clearLogs, showToast }) => {
    const [password, setPassword] = useState('');
    const [pin, setPin] = useState('');
    const [showConfirmClear, setShowConfirmClear] = useState(false);
    const [agreeToClear, setAgreeToClear] = useState(false);

    const handleClearLogs = () => {
        // Simple placeholder validation
        const isPasswordValid = password === 'password123';
        const isPinValid = pin === '1234';

        if (isPasswordValid && isPinValid && agreeToClear) {
            clearLogs();
        } else if (!agreeToClear) {
            showToast('You must agree to the terms to proceed.', 'warning');
        } else {
            showToast('Incorrect password or PIN. Please try again.', 'error');
        }
    };

    const resetClearState = () => {
        setShowConfirmClear(false);
        setPassword('');
        setPin('');
        setAgreeToClear(false);
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                {!showConfirmClear ? (
                    <>
                        <h2>Activity Logs</h2>
                        <p>Here is a record of all actions taken in your account.</p>
                        
                        <div className="logs-container">
                            {logs.length > 0 ? (
                                <ul>
                                    {logs.map(log => <LogItem key={log.id} log={log} />)}
                                </ul>
                            ) : (
                                <p className="no-logs">No activity has been logged yet.</p>
                            )}
                        </div>
                        <div className="modal-actions">
                            <button className="cancel-btn" onClick={onClose}>Close</button>
                            <button 
                                className="clear-logs-btn" 
                                onClick={() => setShowConfirmClear(true)}
                                disabled={logs.length === 0}
                            >
                                Clear All Logs
                            </button>
                        </div>
                    </>
                ) : (
                    <>
                        <h2>Confirm Log Deletion</h2>
                        <p>This action is permanent and cannot be undone. Please confirm you want to proceed.</p>

                        <div className="clear-logs-confirmation">
                            <h4>Authentication Required</h4>
                            <div className="form-group">
                                <label htmlFor="log-password">Password (Hint: password123)</label>
                                <input
                                    type="password"
                                    id="log-password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Enter your password"
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="log-pin">4-Digit PIN (Hint: 1234)</label>
                                <input
                                    type="password"
                                    id="log-pin"
                                    value={pin}
                                    onChange={(e) => setPin(e.target.value)}
                                    placeholder="Enter 4-digit PIN"
                                    maxLength="4"
                                />
                            </div>
                            <div className="checkbox-group">
                                <input 
                                    type="checkbox" 
                                    id="agree-clear-logs" 
                                    checked={agreeToClear} 
                                    onChange={(e) => setAgreeToClear(e.target.checked)} 
                                />
                                <label htmlFor="agree-clear-logs">I agree to permanently clear logs.</label>
                            </div>
                        </div>

                        <div className="modal-actions">
                             <button className="cancel-btn" onClick={resetClearState}>Back</button>
                            <button 
                                className="confirm-btn" 
                                onClick={handleClearLogs}
                                disabled={!password || pin.length !== 4 || !agreeToClear}
                            >
                                Confirm Deletion
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default LogsModal;