import React, { useState } from 'react';

const DeleteAccountModal = ({ onClose, onConfirm, showToast }) => {
    const [confirmationText, setConfirmationText] = useState('');
    const [password, setPassword] = useState('');
    const [pin, setPin] = useState('');
    const [agreeToDelete, setAgreeToDelete] = useState(false);

    const CONFIRMATION_PHRASE = "Yes, I want to delete my account";
    const isConfirmationValid = confirmationText === CONFIRMATION_PHRASE;
    const isPasswordValid = password === 'password123';
    const isPinValid = pin === '1234';

    const handleConfirm = () => {
        if (!isPasswordValid) {
            showToast('Incorrect password. Please try again.', 'error');
        } else if (!isPinValid) {
            showToast('Incorrect PIN. Please try again.', 'error');
        } else if (!isConfirmationValid) {
            showToast('Confirmation phrase is incorrect.', 'error');
        } else if (!agreeToDelete) {
            showToast('You must agree to the terms to proceed.', 'warning');
        } else {
            onConfirm();
            onClose();
        }
    };

    const isFormValid = isConfirmationValid && password && pin.length === 4 && agreeToDelete;

    return (
        <div className="modal-overlay delete-account-modal" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-content-inner">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                        <h2 style={{ margin: 0 }}>Delete Your Account</h2>
                        <button 
                            className="confirm-btn-gold" 
                            onClick={handleConfirm}
                            disabled={!isFormValid}
                            style={{ margin: 0 }}
                        >
                            ⚠️ Confirm
                        </button>
                    </div>
                    
                    <p>This is a critical action. Deleting your account will permanently erase all your data, including transactions, budgets, and logs. This cannot be undone.</p>
                    
                    <div className="form-group">
                        <label htmlFor="delete-confirmation">To confirm, please type: "<code>{CONFIRMATION_PHRASE}</code>"</label>
                        <input
                            type="text"
                            id="delete-confirmation"
                            value={confirmationText}
                            onChange={(e) => setConfirmationText(e.target.value)}
                            placeholder="Type the phrase here..."
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="delete-password">Enter Account Password (Hint: password123)</label>
                        <input
                            type="password"
                            id="delete-password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your password"
                        />
                    </div>

                     <div className="form-group">
                        <label htmlFor="delete-pin">4-Digit PIN (Hint: 1234)</label>
                        <input
                            type="password"
                            id="delete-pin"
                            value={pin}
                            onChange={(e) => setPin(e.target.value)}
                            placeholder="Enter 4-digit PIN"
                            maxLength="4"
                        />
                    </div>

                    <div className="checkbox-group">
                        <input 
                            type="checkbox" 
                            id="agree-delete" 
                            checked={agreeToDelete} 
                            onChange={(e) => setAgreeToDelete(e.target.checked)} 
                        />
                        <label htmlFor="agree-delete">I agree that my account and all related information will be erased permanently.</label>
                    </div>

                    <div className="modal-actions">
                        <button className="cancel-btn" onClick={onClose}>Cancel</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DeleteAccountModal;