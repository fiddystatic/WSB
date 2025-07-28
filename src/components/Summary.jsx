import React from 'react';

const Summary = ({ income, expenses, balance }) => {
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
    };

    return (
        <section className="summary-container">
            <div className="summary-card income">
                <h3>Total Income</h3>
                <p className="income">{formatCurrency(income)}</p>
            </div>
            <div className="summary-card expense">
                <h3>Total Expenses</h3>
                <p className="expense">{formatCurrency(expenses)}</p>
            </div>
            <div className="summary-card balance">
                <h3>Current Balance</h3>
                <p className="balance">{formatCurrency(balance)}</p>
            </div>
        </section>
    );
};

export default Summary;

