import React, { useState } from 'react';

const Auth = ({ onLogin, onSignup, showToast, logAction }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showInfo, setShowInfo] = useState(false);

    const toggleForm = () => {
        setIsLogin(!isLogin);
        // Clear fields on switch
        setName('');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsLoading(true);

        if (isLogin) {
            // --- MOCK LOGIN ---
            setTimeout(() => {
                const users = JSON.parse(localStorage.getItem('swiftBudgetUsers') || '{}');
                const collaborators = JSON.parse(localStorage.getItem('swiftBudgetCollaborators') || '[]');
                
                // Check if it's the owner
                const storedUser = Object.values(users).find(u => u.email === email && u.password === password);
                
                // Check if it's a collaborator
                const isCollaborator = collaborators.includes(email) && password === 'collaborator123';
                
                if (storedUser) {
                    onLogin({ ...storedUser, role: 'owner' });
                } else if (isCollaborator) {
                    onLogin({ email, name: email.split('@')[0], role: 'collaborator' });
                } else {
                    showToast('Invalid email or password.', 'error');
                }
                setIsLoading(false);
            }, 1000);
        } else {
            // --- MOCK SIGNUP ---
            if (password !== confirmPassword) {
                showToast('Passwords do not match.', 'warning');
                setIsLoading(false);
                return;
            }
            if (password.length < 6) {
                showToast('Password must be at least 6 characters long.', 'warning');
                setIsLoading(false);
                return;
            }
            setTimeout(() => {
                const newUser = { name, email, password, role: 'owner' };
                const users = JSON.parse(localStorage.getItem('swiftBudgetUsers') || '{}');
                
                // Check if user already exists
                if (Object.values(users).find(u => u.email === email)) {
                     showToast('An account with this email already exists.', 'error');
                     setIsLoading(false);
                     return;
                }

                users[email] = newUser;
                localStorage.setItem('swiftBudgetUsers', JSON.stringify(users));
                onSignup({ ...newUser, role: 'owner' });
                logAction('Account Created', `New account registered for ${email}.`);
                setIsLoading(false);
            }, 1000);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h1>Wolferonic SwiftBudget</h1>
                <h2>{isLogin ? 'Welcome Back!' : 'Create an Account'}</h2>
                <form onSubmit={handleSubmit}>
                    {!isLogin && (
                        <div className="form-group">
                            <label htmlFor="name">Full Name</label>
                            <input
                                type="text"
                                id="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Enter your full name"
                                required
                            />
                        </div>
                    )}
                    <div className="form-group">
                        <label htmlFor="email">Email Address</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="you@example.com"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your password"
                            required
                        />
                    </div>
                    {!isLogin && (
                        <div className="form-group">
                            <label htmlFor="confirm-password">Confirm Password</label>
                            <input
                                type="password"
                                id="confirm-password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="Confirm your password"
                                required
                            />
                        </div>
                    )}
                    <button type="submit" className="submit-btn" disabled={isLoading}>
                        {isLoading ? 'Processing...' : (isLogin ? 'Sign In' : 'Sign Up')}
                    </button>
                </form>
                <div className="auth-switch">
                    {isLogin ? "Don't have an account?" : "Already have an account?"}
                    <button onClick={toggleForm}>
                        {isLogin ? 'Sign Up' : 'Sign In'}
                    </button>
                </div>
                {isLogin && (
                    <div className="login-info-container">
                         <button type="button" className="info-icon" onMouseEnter={() => setShowInfo(true)} onMouseLeave={() => setShowInfo(false)}>
                            <i className="material-icons">info_outline</i>
                        </button>
                        {isLogin && !showInfo && (
                            <div className="pulse-bubble">
                                Important Detail
                            </div>
                        )}
                        {showInfo && (
                            <div className="info-bubble">
                                <strong>Login Credentials</strong>
                                <p>Owner: <span>user@example.com</span></p>
                                <p>Password: <span>password123</span></p>
                                <p>Collaborator: <span>any@email.com</span></p>
                                <p>Password: <span>collaborator123</span></p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Auth;