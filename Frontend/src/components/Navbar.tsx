import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Navbar.css';

const Navbar: React.FC = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isVisible, setIsVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;

            // Navbar background appears after scrolling
            setIsScrolled(currentScrollY > 50);

            // Hide on scroll down, show on scroll up
            if (currentScrollY > lastScrollY && currentScrollY > 100) {
                setIsVisible(false);
            } else {
                setIsVisible(true);
            }

            setLastScrollY(currentScrollY);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [lastScrollY]);

    const handleCTAClick = () => {
        navigate('/setup');
        setMobileMenuOpen(false);
    };

    const toggleMobileMenu = () => {
        setMobileMenuOpen(!mobileMenuOpen);
    };

    return (
        <>
            <nav className={`navbar ${isScrolled ? 'scrolled' : ''} ${isVisible ? 'visible' : 'hidden'}`}>
                <div className="navbar-container">
                    {/* Logo */}
                    <Link to="/" className="navbar-logo">
                        <span className="logo-icon">🌆</span>
                        <span className="logo-text">DisasterSim</span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="navbar-links">
                        <Link to="/" className="nav-link">Home</Link>
                        <a href="#features" className="nav-link">Features</a>
                        <a href="#technology" className="nav-link">Technology</a>
                        <a href="#about" className="nav-link">About</a>
                    </div>

                    {/* CTA Button */}
                    <button className="navbar-cta" onClick={handleCTAClick}>
                        Launch Simulation
                    </button>

                    {/* Mobile Menu Button */}
                    <button
                        className={`mobile-menu-button ${mobileMenuOpen ? 'open' : ''}`}
                        onClick={toggleMobileMenu}
                        aria-label="Toggle menu"
                    >
                        <span></span>
                        <span></span>
                        <span></span>
                    </button>
                </div>
            </nav>

            {/* Mobile Menu Overlay */}
            <div className={`mobile-menu ${mobileMenuOpen ? 'open' : ''}`}>
                <div className="mobile-menu-content">
                    <Link to="/" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>
                        Home
                    </Link>
                    <a href="#features" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>
                        Features
                    </a>
                    <a href="#technology" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>
                        Technology
                    </a>
                    <a href="#about" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>
                        About
                    </a>
                    <button className="mobile-cta" onClick={handleCTAClick}>
                        Launch Simulation
                    </button>
                </div>
            </div>

            {/* Mobile Menu Backdrop */}
            {mobileMenuOpen && (
                <div className="mobile-menu-backdrop" onClick={() => setMobileMenuOpen(false)} />
            )}
        </>
    );
};

export default Navbar;
