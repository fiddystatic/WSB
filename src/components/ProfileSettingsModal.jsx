import React, { useState, useRef } from 'react';

const ProfileSettingsModal = ({ 
    onClose, 
    userProfile, 
    onUpdateProfile, 
    collaborators,
    onAddCollaborator,
    onRemoveCollaborator,
    onResetPassword,
    showToast,
    openDeleteAccountModal,
    logAction,
    onLogout
}) => {
    const [activeTab, setActiveTab] = useState('profile');
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

    // Profile Info State
    const [name, setName] = useState(userProfile.name);
    const [email, setEmail] = useState(userProfile.email);
    const [phone, setPhone] = useState(userProfile.phone);
    const [profileImageUrl, setProfileImageUrl] = useState(userProfile.profileImageUrl);
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef(null);

    // Security State
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [currentPin, setCurrentPin] = useState('');
    const [newPin, setNewPin] = useState('');
    const [confirmPin, setConfirmPin] = useState('');

    // Collaborators State
    const [newCollaboratorEmail, setNewCollaboratorEmail] = useState('');
    const [isDeleteEnabled, setIsDeleteEnabled] = useState(false);

    const handleProfileImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setIsUploading(true);
        try {
            // In a real app, you'd upload this to a server. Here we'll simulate.
            // For websim environment, we can use websim.upload
            if (window.websim && typeof window.websim.upload === 'function') {
                const url = await window.websim.upload(file);
                setProfileImageUrl(url);
            } else {
                // Fallback for local dev: use a data URL (not ideal for production)
                const reader = new FileReader();
                reader.onloadend = () => {
                    setProfileImageUrl(reader.result);
                };
                reader.readAsDataURL(file);
            }
            showToast('Profile image updated!', 'success');
        } catch (error) {
            console.error('Error uploading image:', error);
            showToast('Image upload failed. Please try again.', 'error');
        } finally {
            setIsUploading(false);
        }
    };

    const handleSaveChanges = () => {
        onUpdateProfile({ name, email, phone, profileImageUrl });
        
        // Handle password change
        if (newPassword && newPassword === confirmPassword) {
            showToast('Password updated successfully!', 'success');
            // Reset fields
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } else if (newPassword && newPassword !== confirmPassword) {
            showToast('New passwords do not match.', 'warning');
        }
        
        // Handle PIN change
        if (newPin && newPin.length === 4 && newPin === confirmPin) {
             showToast('PIN updated successfully!', 'success');
             setCurrentPin('');
             setNewPin('');
             setConfirmPin('');
        } else if (newPin && (newPin.length !== 4 || newPin !== confirmPin)) {
            showToast('PINs must be 4 digits and match.', 'warning');
        }

        onClose();
    };

    const handleAddCollaborator = () => {
        onAddCollaborator(newCollaboratorEmail);
        setNewCollaboratorEmail('');
    };

    const handleLogout = () => {
        onLogout();
    };

    const selectTab = (tab) => {
        setActiveTab(tab);
        setIsProfileMenuOpen(false);
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content profile-settings-modal" onClick={(e) => e.stopPropagation()}>
                <div className="profile-settings-header">
                    <h2>Profile Settings</h2>
                     <button className="profile-menu-toggle" onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}>
                        <span className="material-symbols-outlined">
                            {isProfileMenuOpen ? 'close' : 'menu'}
                        </span>
                    </button>
                </div>

                <div className={`profile-tabs ${isProfileMenuOpen ? 'open' : ''}`}>
                    <button className={`tab-btn ${activeTab === 'profile' ? 'active' : ''}`} onClick={() => selectTab('profile')}>Profile</button>
                    <button className={`tab-btn ${activeTab === 'security' ? 'active' : ''}`} onClick={() => selectTab('security')}>Security</button>
                    <button className={`tab-btn ${activeTab === 'collaborators' ? 'active' : ''}`} onClick={() => selectTab('collaborators')}>Collaborators</button>
                    <button className={`tab-btn ${activeTab === 'logout' ? 'active' : ''}`} onClick={() => selectTab('logout')}>Logout</button>
                    <button className={`tab-btn ${activeTab === 'account' ? 'active' : ''}`} onClick={() => selectTab('account')}>Account</button>
                </div>

                <div className="tab-content">
                    {activeTab === 'profile' && (
                        <div className="profile-info-tab">
                            <div className="profile-pic-uploader">
                                <img src={profileImageUrl || './default-avatar.png'} alt="Profile" className="profile-pic" />
                                <input type="file" ref={fileInputRef} onChange={handleProfileImageUpload} style={{ display: 'none' }} accept="image/*" />
                                <button className="mid-btn" onClick={() => fileInputRef.current.click()} disabled={isUploading}>
                                    {isUploading ? 'Uploading...' : 'Change Picture'}
                                </button>
                            </div>
                             <div className="form-group">
                                <label htmlFor="profile-name">Full Name</label>
                                <input type="text" id="profile-name" value={name} onChange={e => setName(e.target.value)} placeholder="Enter your full name" />
                            </div>
                            <div className="form-group">
                                <label htmlFor="profile-email">Email Address</label>
                                <input type="email" id="profile-email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Enter your email" />
                            </div>
                            <div className="form-group">
                                <label htmlFor="profile-phone">Phone Number (Optional)</label>
                                <input type="tel" id="profile-phone" value={phone} onChange={e => setPhone(e.target.value)} placeholder="Enter your phone number" />
                            </div>
                        </div>
                    )}
                    {activeTab === 'security' && (
                        <div className="security-tab">
                             <h3>Change Password</h3>
                             <div className="form-group">
                                <label htmlFor="current-password">Current Password</label>
                                <input type="password" id="current-password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} />
                            </div>
                             <div className="form-group">
                                <label htmlFor="new-password">New Password</label>
                                <input type="password" id="new-password" value={newPassword} onChange={e => setNewPassword(e.target.value)} />
                            </div>
                             <div className="form-group">
                                <label htmlFor="confirm-password">Confirm New Password</label>
                                <input type="password" id="confirm-password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />
                            </div>
                            <hr />
                            <h3>Change PIN</h3>
                             <div className="form-group">
                                <label htmlFor="current-pin">Current 4-Digit PIN</label>
                                <input type="password" id="current-pin" maxLength="4" value={currentPin} onChange={e => setCurrentPin(e.target.value)} />
                            </div>
                             <div className="form-group">
                                <label htmlFor="new-pin">New 4-Digit PIN</label>
                                <input type="password" id="new-pin" maxLength="4" value={newPin} onChange={e => setNewPin(e.target.value)} />
                            </div>
                             <div className="form-group">
                                <label htmlFor="confirm-pin">Confirm New PIN</label>
                                <input type="password" id="confirm-pin" maxLength="4" value={confirmPin} onChange={e => setConfirmPin(e.target.value)} />
                            </div>
                        </div>
                    )}
                    {activeTab === 'collaborators' && (
                        <div className="collaborators-tab">
                            <h3>Add Collaborator</h3>
                            <p>Collaborators can view transactions, history, breakdowns, and analytics, but cannot access or clear financial logs.</p>
                            <div className="add-collaborator-form">
                                <input 
                                    type="email"
                                    value={newCollaboratorEmail}
                                    onChange={e => setNewCollaboratorEmail(e.target.value)}
                                    placeholder="Enter collaborator's email" 
                                />
                                <button className="mid-btn" onClick={handleAddCollaborator}>Add</button>
                            </div>
                            <hr/>
                            <h3>Manage Collaborators</h3>
                            <div className="collaborator-list">
                                {collaborators.length > 0 ? collaborators.map(c_email => (
                                    <div className="collaborator-item" key={c_email}>
                                        <span>{c_email}</span>
                                        <div className="collaborator-actions">
                                            <button className="action-btn" onClick={() => onResetPassword(c_email)}>
                                                <span className="material-symbols-outlined">lock_reset</span> Reset Password
                                            </button>
                                            <button className="action-btn danger" onClick={() => onRemoveCollaborator(c_email)}>
                                                <span className="material-symbols-outlined">delete</span> Remove
                                            </button>
                                        </div>
                                    </div>
                                )) : <p>No collaborators yet.</p>}
                            </div>
                        </div>
                    )}
                    {activeTab === 'logout' && (
                        <div className="logout-tab">
                            <h3>Logout Session</h3>
                            <p>This will end your current session and you will need to sign in again to access your dashboard.</p>
                            <button className="submit-btn" onClick={handleLogout} style={{width: 'auto', padding: '0.6rem 1.2rem'}}>Logout Session</button>
                        </div>
                    )}
                    {activeTab === 'account' && (
                        <div className="account-tab">
                            <div className="profile-danger-zone">
                                <h3>Danger Zone</h3>
                                <div className="toggle-group">
                                    <label htmlFor="enable-delete">Enable Account Deletion</label>
                                    <label className="switch">
                                        <input 
                                            type="checkbox" 
                                            id="enable-delete" 
                                            checked={isDeleteEnabled} 
                                            onChange={(e) => setIsDeleteEnabled(e.target.checked)} 
                                        />
                                        <span className="slider round"></span>
                                    </label>
                                </div>
                                {isDeleteEnabled && (
                                    <div className="alert danger" style={{marginTop: '1rem'}}>
                                        <span className="alert-icon">⚠️</span>
                                        <div>
                                            <strong>Caution:</strong> The action you are about to do is irreversible. Read the danger zone description before proceeding.
                                        </div>
                                    </div>
                                )}
                                <p>To delete your account, you must first enable the option using the toggle above. This is a safeguard to prevent accidental deletion.</p>
                                <button 
                                    className="delete-account-btn" 
                                    onClick={openDeleteAccountModal}
                                    disabled={!isDeleteEnabled}
                                >
                                    Delete Account...
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                <div className="modal-actions">
                    <button className="cancel-btn" onClick={onClose}>Cancel</button>
                    <button className="submit-btn" onClick={handleSaveChanges}>Save Changes</button>
                </div>
            </div>
        </div>
    );
};

export default ProfileSettingsModal;