import React, { useEffect, useRef } from 'react';

const ChartComponent = ({ transactions, budgets, type, title }) => {
    const chartRef = useRef(null);
    const chartInstance = useRef(null);

    const relevantTransactions = transactions.filter(t => t.type === type);

    const dataByCategory = relevantTransactions.reduce((acc, transaction) => {
        const { category, amount } = transaction;
        if (!acc[category]) {
            acc[category] = 0;
        }
        acc[category] += amount;
        return acc;
    }, {});

    const budgetAlerts =
        type === 'expense'
            ? Object.keys(budgets)
                  .map(category => {
                      const spent = dataByCategory[category] || 0;
                      const budget = budgets[category];
                      if (budget <= 0) return null;

                      const percentage = (spent / budget) * 100;
                      if (percentage >= 80) {
                          return {
                              category,
                              spent,
                              budget,
                              percentage,
                              level: percentage >= 100 ? 'danger' : 'warning',
                          };
                      }
                      return null;
                  })
                  .filter(Boolean)
            : [];

    useEffect(() => {
        if (chartRef.current) {
            const ctx = chartRef.current.getContext('2d');
            
            const labels = Object.keys(dataByCategory);
            const data = Object.values(dataByCategory);
            
            const incomeColors = [
                '#2ecc71', '#3498db', '#9b59b6', '#f1c40f',
                '#e67e22', '#1abc9c', '#34495e'
            ];
            const expenseColors = [
                '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', 
                '#9966FF', '#FF9F40', '#C9CBCF', '#e74c3c'
            ];

            const backgroundColors = type === 'income' ? incomeColors : expenseColors;

            if (chartInstance.current) {
                chartInstance.current.destroy();
            }

            chartInstance.current = new Chart(ctx, {
                type: 'doughnut',
                data: {
                    labels: labels,
                    datasets: [{
                        label: `${type.charAt(0).toUpperCase() + type.slice(1)} by Category`,
                        data: data,
                        backgroundColor: backgroundColors.slice(0, labels.length),
                        hoverOffset: 4
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'top',
                        },
                        title: {
                            display: false
                        }
                    }
                }
            });
        }
    }, [dataByCategory, type]);
    
    return (
        <div className="card" id={type === 'income' ? 'income-breakdown' : 'expense-breakdown'}>
            <h2>{title}</h2>
            <div className="chart-container">
                 <canvas ref={chartRef}></canvas>
            </div>
            {type === 'expense' && budgetAlerts.length > 0 && (
                <div className="budget-alerts">
                    <h3>Budget Alerts</h3>
                    {budgetAlerts.map(alert => (
                        <div key={alert.category} className={`alert ${alert.level}`}>
                            <span className="alert-icon">{alert.level === 'danger' ? '🚨' : '⚠️'}</span>
                            <div>
                                <strong>{alert.category}:</strong> You've spent ${alert.spent.toFixed(2)} of your ${alert.budget} budget ({alert.percentage.toFixed(0)}%).
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ChartComponent;