// src/components/common/Navbar.jsx - UPDATED WITHOUT LOGOUT & WELCOME
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@context/AuthContext';
import { useTheme } from '@context/ThemeContext';
import SettingsDropdown from './SettingsDropdown';

const Navbar = () => {
    const { user } = useAuth();
    const { isDark } = useTheme();
    const navigate = useNavigate();

    const goToProfile = () => {
        if (user?.id) {
            navigate(`/profile/${user.id}`);
        }
    };

    return (
        <nav className="bg-white dark:bg-black shadow-sm border-b border-gray-200 dark:border-gray-800 sticky top-0 z-50 transition-colors duration-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex items-center">
                        <Link to="/" className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                            SocialApp
                        </Link>
                    </div>

                    <div className="flex items-center space-x-4">
                        <Link
                            to="/"
                            className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                        >
                            Home
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