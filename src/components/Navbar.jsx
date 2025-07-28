import React, { useState } from 'react';

const Navbar = ({ theme, toggleTheme, openProfileSettings, onLogout, userRole }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const navLinks = [
        { href: '#balances', text: 'Balances' },
        { href: '#add-transaction', text: 'Add Transaction' },
        { href: '#history', text: 'History' },
        { href: '#expense-breakdown', text: 'Breakdowns' },
        { href: '#analytics', text: 'Analytics' },
        { href: '#settings', text: 'Budget Settings' }
    ];

    const ownerNavLinks = [
        ...navLinks,
        { href: '#system-logs', text: 'System Logs' }
    ];

    const handleLinkClick = (e, href) => {
        setIsMenuOpen(false);
        e.preventDefault();
        const targetElement = document.querySelector(href);
        if (targetElement) {
            // Get the top position of the element
            const elementPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
            // Get the navbar height (approximate, adjust if needed)
            const navbarHeight = document.querySelector('.navbar')?.offsetHeight || 80;
            // Calculate the offset position
            const offsetPosition = elementPosition - navbarHeight;
    
            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    }

    const scrollToTop = (e) => {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    const visibleLinks = userRole === 'owner' ? ownerNavLinks : navLinks;

    return (
        <header className={`navbar ${isMenuOpen ? 'nav-open' : ''} left-edge-style`}>
            <div className="top-bar">
                <a href="#" className="logo" onClick={scrollToTop}>Wolferonic SwiftBudget</a>
                <div className="controls">
                     <div className="theme-switcher">
                        <button onClick={toggleTheme} title="Toggle theme">
                            {theme === 'light' 
                                ? <span className="material-symbols-outlined">dark_mode</span> 
                                : <span className="material-symbols-outlined">light_mode</span>
                            }
                        </button>
                    </div>
                    <button className="hamburger" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                        <span className="material-symbols-outlined">
                            {isMenuOpen ? 'close' : 'menu'}
                        </span>
                    </button>
                </div>
            </div>
            <nav className="horizontal-nav">
                <ul>
                    {visibleLinks.map(link => (
                        <li key={link.href}>
                            <a href={link.href} onClick={(e) => handleLinkClick(e, link.href)}>{link.text}</a>
                        </li>
                    ))}
                    <li>
                        <a href="#profile-settings" onClick={(e) => {
                                e.preventDefault();
                                setIsMenuOpen(false);
                                openProfileSettings();
                            }}>
                            Profile Settings
                        </a>
                    </li>
                    <li className="theme-nav-link">
                        <a href="#change-theme" onClick={(e) => {
                                e.preventDefault();
                                setIsMenuOpen(false);
                                toggleTheme();
                            }}>
                            Change Theme
                        </a>
                    </li>
                     <li>
                        <a href="#logout" onClick={(e) => {
                                e.preventDefault();
                                setIsMenuOpen(false);
                                onLogout();
                            }}>
                            Logout
                        </a>
                    </li>
                </ul>
            </nav>
        </header>
    );
};

export default Navbar;