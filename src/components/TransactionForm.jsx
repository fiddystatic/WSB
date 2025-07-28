import React, { useState } from 'react';

const TransactionForm = ({ addTransaction, expenseCategories, incomeCategories, showToast }) => {
    const [type, setType] = useState('expense');
    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState('');
    const [category, setCategory] = useState('Food');
    const [date, setDate] = useState(new Date().toISOString().slice(0, 10));

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!description || !amount || !date) {
            showToast('Please fill in all fields.', 'warning');
            return;
        }

        addTransaction({
            type,
            description,
            amount: parseFloat(amount),
            category: type === 'income' ? category : category,
            date
        });

        // Reset form
        setDescription('');
        setAmount('');
        setCategory(type === 'expense' ? 'Food' : 'Salary');
    };

    const handleTypeChange = (newType) => {
        setType(newType);
        setCategory(newType === 'expense' ? 'Food' : 'Salary');
    };

    return (
        <div className="card" id="add-transaction">
            <h2>Add New Transaction</h2>
            <form className="transaction-form" onSubmit={handleSubmit}>
                <div className="type-toggle">
                    <button type="button" className={`income ${type === 'income' ? 'active' : ''}`} onClick={() => handleTypeChange('income')}>Income</button>
                    <button type="button" className={`expense ${type === 'expense' ? 'active' : ''}`} onClick={() => handleTypeChange('expense')}>Expense</button>
                </div>
                <div className="form-group">
                    <label htmlFor="description">Description</label>
                    <input
                        type="text"
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="e.g., Coffee, Salary..."
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="amount">Amount</label>
                    <input
                        type="number"
                        id="amount"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="0.00"
                        required
                        min="0.01"
                        step="0.01"
                    />
                </div>
                 <div className="form-group">
                    <label htmlFor="category">Category</label>
                    <select id="category" value={category} onChange={(e) => setCategory(e.target.value)}>
                        {(type === 'expense' ? expenseCategories : incomeCategories).map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                </div>
                <div className="form-group">
                    <label htmlFor="date">Date</label>
                    <input
                        type="date"
                        id="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className="submit-btn">Add Transaction</button>
            </form>
        </div>
    );
};

export default TransactionForm;