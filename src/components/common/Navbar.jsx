// src/components/common/Navbar.jsx - UPDATED WITH HOME ICON & ACRYLIC THEME
import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@context/AuthContext';
import SettingsDropdown from './SettingsDropdown';

const Navbar = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const goToProfile = () => {
        if (user?.id) {
            navigate(`/profile/${user.id}`);
        }
    };

    const isActive = (path) => location.pathname === path;

    return (
        <nav className="bg-white/80 dark:bg-black/80 backdrop-blur-xl shadow-sm border-b border-gray-200/50 dark:border-gray-800/50 sticky top-0 z-50 transition-colors duration-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex items-center">
                        <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            SocialApp
                        </Link>
                    </div>

                    <div className="flex items-center space-x-4">
                        {/* Home Icon */}
                        <Link
                            to="/"
                            className={`p-2 rounded-lg transition-all duration-200 ${
                                isActive('/')
                                    ? 'bg-blue-100/80 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100/80 dark:hover:bg-gray-800/80'
                            }`}
                            aria-label="Home"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                            </svg>
                        </Link>

                        <div className="flex items-center space-x-3">
                            {/* Profile Icon Button */}
                            <button
                                onClick={goToProfile}
                                className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center hover:shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
                                aria-label="Go to profile"
                                title="View Profile"
                            >
                                <span className="text-white font-semibold text-sm">
                                    {user?.username?.charAt(0).toUpperCase() || 'U'}
                                </span>
                            </button>

                            {/* Settings Dropdown */}
                            <SettingsDropdown />
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;