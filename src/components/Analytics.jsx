import React, { useState, useEffect, useRef } from 'react';
import { marked } from "marked";
import DOMPurify from "dompurify";

const Analytics = ({ transactions, income, expenses, showToast }) => {
    const [aiResponse, setAiResponse] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const monthlySummaryChartRef = useRef(null);
    const balanceTrendChartRef = useRef(null);
    const spendingTrendChartRef = useRef(null);
    const monthlySummaryChartInstance = useRef(null);
    const balanceTrendChartInstance = useRef(null);
    const spendingTrendChartInstance = useRef(null);

    // Helper to destroy charts
    const destroyChart = (chartInstance) => {
        if (chartInstance.current) {
            chartInstance.current.destroy();
            chartInstance.current = null;
        }
    };

    // Monthly Income vs Expense (Bar Chart)
    useEffect(() => {
        if (!monthlySummaryChartRef.current || transactions.length === 0) return;

        const dataByMonth = transactions.reduce((acc, t) => {
            const month = new Date(t.date + 'T00:00:00').toLocaleString('default', { month: 'short', year: '2-digit' });
            if (!acc[month]) {
                acc[month] = { income: 0, expense: 0 };
            }
            acc[month][t.type] += t.amount;
            return acc;
        }, {});

        const sortedMonths = Object.keys(dataByMonth).sort((a, b) => {
            const dateA = new Date(`01 ${a}`);
            const dateB = new Date(`01 ${b}`);
            return dateA - dateB;
        });

        const labels = sortedMonths;
        const incomeData = sortedMonths.map(month => dataByMonth[month].income);
        const expenseData = sortedMonths.map(month => dataByMonth[month].expense);

        destroyChart(monthlySummaryChartInstance);

        const ctx = monthlySummaryChartRef.current.getContext('2d');
        monthlySummaryChartInstance.current = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'Income',
                        data: incomeData,
                        backgroundColor: '#2ecc71',
                    },
                    {
                        label: 'Expense',
                        data: expenseData,
                        backgroundColor: '#FF6384',
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: { beginAtZero: true }
                }
            }
        });

    }, [transactions]);
    
    // Balance Over Time (Line Chart)
    useEffect(() => {
        if (!balanceTrendChartRef.current || transactions.length === 0) return;

        const sorted = [...transactions].sort((a, b) => new Date(a.date) - new Date(b.date));
        let runningBalance = 0;
        const balanceData = sorted.map(t => {
            runningBalance += t.type === 'income' ? t.amount : -t.amount;
            return { x: new Date(t.date + 'T00:00:00'), y: runningBalance };
        });

        destroyChart(balanceTrendChartInstance);
        const ctx = balanceTrendChartRef.current.getContext('2d');
        balanceTrendChartInstance.current = new Chart(ctx, {
            type: 'line',
            data: {
                datasets: [{
                    label: 'Balance',
                    data: balanceData,
                    borderColor: '#4a90e2',
                    fill: false,
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: {
                        type: 'time',
                        time: {
                            unit: 'day',
                            tooltipFormat: 'PP'
                        },
                        title: { display: true, text: 'Date' }
                    }
                }
            }
        });

    }, [transactions]);
    
    // Daily Spending Trend (Spline Chart)
    useEffect(() => {
        if (!spendingTrendChartRef.current || transactions.length === 0) return;

        const expensesByDay = transactions
            .filter(t => t.type === 'expense')
            .reduce((acc, t) => {
                const day = t.date;
                acc[day] = (acc[day] || 0) + t.amount;
                return acc;
            }, {});

        const sortedDays = Object.keys(expensesByDay).sort((a,b) => new Date(a) - new Date(b));

        const spendingData = sortedDays.map(day => ({
            x: new Date(day + 'T00:00:00'),
            y: expensesByDay[day]
        }));
        
        destroyChart(spendingTrendChartInstance);
        const ctx = spendingTrendChartRef.current.getContext('2d');
        spendingTrendChartInstance.current = new Chart(ctx, {
            type: 'line',
            data: {
                datasets: [{
                    label: 'Daily Spending',
                    data: spendingData,
                    borderColor: '#f5a623',
                    tension: 0.4, // This creates the spline effect
                    fill: false
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                 scales: {
                    x: {
                        type: 'time',
                        time: {
                            unit: 'day',
                            tooltipFormat: 'PP'
                        },
                         title: { display: true, text: 'Date' }
                    }
                }
            }
        });
    }, [transactions]);

    const generateExpenseSummary = () => {
        const expenseByCategory = transactions
            .filter(t => t.type === 'expense')
            .reduce((acc, t) => {
                acc[t.category] = (acc[t.category] || 0) + t.amount;
                return acc;
            }, {});

        let summary = `Total Income: $${income.toFixed(2)}\n`;
        summary += `Total Expenses: $${expenses.toFixed(2)}\n`;
        summary += `Current Balance: $${(income - expenses).toFixed(2)}\n\n`;
        summary += "Expense Breakdown by Category:\n";
        
        if (Object.keys(expenseByCategory).length === 0) {
            summary += "- No expenses recorded yet.\n";
        } else {
            for (const [category, amount] of Object.entries(expenseByCategory)) {
                summary += `- ${category}: $${amount.toFixed(2)}\n`;
            }
        }
        
        return summary;
    };

    const getAiSuggestions = async () => {
        if (transactions.length === 0) {
            showToast("Please add some transactions first to get AI suggestions.", "warning");
            return;
        }
        setIsLoading(true);
        setAiResponse('');
        // logAction('AI Suggestion Requested', 'User requested financial tips.');

        try {
            // MOCK AI RESPONSE GENERATION
            const generateMockResponse = () => {
                const expenseByCategory = transactions
                    .filter(t => t.type === 'expense')
                    .reduce((acc, t) => {
                        acc[t.category] = (acc[t.category] || 0) + t.amount;
                        return acc;
                    }, {});
                
                let tips = [];
                const sortedExpenses = Object.entries(expenseByCategory).sort(([,a],[,b]) => b-a);
                const largestExpenseCategory = sortedExpenses.length > 0 ? sortedExpenses[0][0] : null;
                const savingsRate = income > 0 ? ((income - expenses) / income) * 100 : 0;

                let response = `### Your Financial Snapshot\n\n`;
                response += `Great job tracking your finances! With a total income of **$${income.toFixed(2)}** and expenses of **$${expenses.toFixed(2)}**, you're maintaining a positive balance. Let's see how we can optimize it further!\n\n`;
                response += `***Note:** This is a placeholder for our upcoming AI analysis feature. The real AI, coming soon, will provide even more personalized and deeper insights based on your spending patterns.*\n\n`;

                if (largestExpenseCategory) {
                    tips.push(`Your highest spending category is **${largestExpenseCategory}**. Consider reviewing transactions here to find potential savings. Could you find cheaper alternatives or reduce frequency?`);
                }

                if (expenses > income) {
                    tips.push(`It looks like your expenses are higher than your income this period. Let's focus on cutting back on non-essential spending or exploring new income streams to get back in the green.`);
                } else {
                     if (savingsRate < 10 && savingsRate >= 0) {
                        tips.push(`Your savings rate is around **${savingsRate.toFixed(1)}%**. A great starting goal is 10-20%. Let's try to increase that! Setting up a small, automatic transfer to a savings account on payday can be a powerful first step.`);
                    } else if (savingsRate >= 10) {
                        tips.push(`You have a healthy savings rate of **${savingsRate.toFixed(1)}%**! Keep up the great work. To boost it even more, consider allocating any unexpected income (like a bonus) directly to your savings.`);
                    }
                }

                const foodSpending = expenseByCategory['Food'] || 0;
                if (foodSpending > 0) {
                    tips.push(`You spent **$${foodSpending.toFixed(2)}** on **Food**. Planning meals for the week or trying a "no-spend" day on takeaways could significantly reduce this amount.`);
                }
                
                if (transactions.filter(t => t.type === 'expense').length >= 10) {
                     tips.push(`You're doing a great job logging your purchases! The first step to managing money is knowing where it goes. Keep this amazing habit up!`);
                }

                response += '### Actionable Savings Tips\n\n';
                
                if (tips.length > 0) {
                    tips.slice(0, 3).forEach(tip => {
                        response += `- ${tip}\n`;
                    });
                } else {
                    response += `- Keep logging your transactions to get personalized tips here!\n`;
                }


                return { content: response };
            };

            const completion = generateMockResponse();
            const sanitizedHtml = DOMPurify.sanitize(marked.parse(completion.content));
            setAiResponse(sanitizedHtml);
            // logAction('AI Suggestion Received', 'Successfully generated financial tips.');
        } catch (error) {
            console.error("Error fetching AI suggestions:", error);
            setAiResponse('<p>Sorry, I was unable to generate suggestions at this time. Please try again later.</p>');
            showToast("Could not get AI suggestions. Please check the console for errors.", "error");
            // logAction('AI Suggestion Failed', `Error: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="card" id="analytics">
            <h2>Analytics & AI Suggestions</h2>
            <p>Get AI-powered insights and visualize your financial journey with dynamic comparison charts.</p>
            <br />
            <button 
                onClick={getAiSuggestions} 
                className="submit-btn"
                disabled={isLoading}
            >
                {isLoading ? 'Generating Insights...' : 'Get AI Savings Tips'}
            </button>

            {(isLoading || aiResponse) && (
                <div className="ai-response">
                    {isLoading && <div className="spinner-small-container"><div className="spinner-small"></div><p>Thinking...</p></div>}
                    {aiResponse && <div dangerouslySetInnerHTML={{ __html: aiResponse }} />}
                </div>
            )}
            
            <div className="comparison-charts">
                {transactions.length > 0 ? (
                    <>
                        <div className="analytics-chart-container">
                             <h3>Monthly Income vs. Expense</h3>
                            <div className="chart-wrapper">
                                <canvas ref={monthlySummaryChartRef}></canvas>
                            </div>
                        </div>
                        <div className="analytics-chart-container">
                             <h3>Balance Over Time</h3>
                            <div className="chart-wrapper">
                                <canvas ref={balanceTrendChartRef}></canvas>
                            </div>
                        </div>
                         <div className="analytics-chart-container">
                             <h3>Daily Spending Trend</h3>
                             <div className="chart-wrapper">
                                <canvas ref={spendingTrendChartRef}></canvas>
                             </div>
                        </div>
                    </>
                ) : (
                    <div className="no-data-analytics">
                        <p>Add some transactions to see your financial analytics here!</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Analytics;