import React from 'react';

const Footer = () => {
    const currentYear = new Date().getFullYear();
    return (
        <footer className="footer">
            <p>&copy; {currentYear} Wolferonic. All right reserved. By <a href="https://fidelmudzamba.vercel.app" target="_blank" rel="noopener noreferrer">Fidel M Mudzamba.</a></p>
        </footer>
    );
};

export default Footer;

