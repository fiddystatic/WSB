import React, { useState } from 'react';

const ClearDataModal = ({ onClose, onConfirm, showToast }) => {
    const [period, setPeriod] = useState('day');
    const [confirmationText, setConfirmationText] = useState('');
    const [password, setPassword] = useState('');

    const CONFIRMATION_PHRASE = "yes delete my finance record track";
    const isConfirmationValid = confirmationText === CONFIRMATION_PHRASE;
    // Using a simple placeholder as there's no backend auth
    const isPasswordValid = password === 'password123'; 

    const handleConfirm = () => {
        if (isConfirmationValid && isPasswordValid) {
            onConfirm(period);
            onClose();
        } else if (!isPasswordValid) {
             showToast('Incorrect password. Please try again.', 'error');
        } else {
            showToast('Confirmation phrase is incorrect.', 'error');
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <h2>Clear Financial Records</h2>
                <p>This action is irreversible. Please proceed with caution.</p>
                
                <div className="form-group">
                    <label htmlFor="period">Select Period to Clear:</label>
                    <select id="period" value={period} onChange={(e) => setPeriod(e.target.value)}>
                        <option value="day">Today</option>
                        <option value="week">This Week</option>
                        <option value="month">This Month</option>
                        <option value="year">This Year</option>
                        <option value="all">All Time</option>
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="confirmation">To confirm, please type: "<code>{CONFIRMATION_PHRASE}</code>"</label>
                    <input
                        type="text"
                        id="confirmation"
                        value={confirmationText}
                        onChange={(e) => setConfirmationText(e.target.value)}
                        placeholder="Type the phrase here..."
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="password">Enter Account Password (Hint: password123)</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                    />
                </div>

                <div className="modal-actions">
                    <button className="cancel-btn" onClick={onClose}>Cancel</button>
                    <button 
                        className="confirm-btn" 
                        onClick={handleConfirm}
                        disabled={!isConfirmationValid || !password}
                    >
                        Confirm Deletion
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ClearDataModal;