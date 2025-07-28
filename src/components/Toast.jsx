import React, { useEffect } from 'react';

const Toast = ({ message, type = 'success', onClose }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 3000);

        return () => {
            clearTimeout(timer);
        };
    }, [onClose]);

    return (
        <div className={`toast toast-${type}`}>
            <div className="toast-message">{message}</div>
            <button className="toast-close-btn" onClick={onClose}>&times;</button>
        </div>
    );
};

export default Toast;

