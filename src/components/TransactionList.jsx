import React from 'react';

const TransactionItem = ({ transaction, deleteTransaction }) => {
    const { id, type, description, amount, category, date } = transaction;

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
    };

    return (
        <li>
            <div className="transaction-details">
                <div className={`type-indicator ${type}`}></div>
                <div className="desc-category">
                    <div className="desc">{description}</div>
                    <div className="category">{category}</div>
                </div>
            </div>
            <div className="amount-date">
                <div className={`amount ${type}`}>
                    {type === 'income' ? '+' : '-'} {formatCurrency(amount)}
                </div>
                <div className="date">{new Date(date + 'T00:00:00').toLocaleDateString()}</div>
            </div>
            <button onClick={() => deleteTransaction(id)} className="delete-btn">
                &times;
            </button>
        </li>
    );
};


const TransactionList = ({ transactions, deleteTransaction }) => {
     const sortedTransactions = [...transactions].sort((a, b) => b.id - a.id);
    return (
        <div className="card transaction-list" id="history">
            <h2>History</h2>
            {sortedTransactions.length > 0 ? (
                <ul>
                    {sortedTransactions.map(transaction => (
                        <TransactionItem key={transaction.id} transaction={transaction} deleteTransaction={deleteTransaction} />
                    ))}
                </ul>
            ) : <p>No transactions yet. Add one above!</p>}
        </div>
    );
};

export default TransactionList;