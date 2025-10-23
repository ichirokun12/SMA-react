
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Button from '../ui/Button';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex items-center">
                        <Link to="/" className="text-2xl font-bold text-blue-600">
                            SocialApp
                        </Link>
                    </div>

                    <div className="flex items-center space-x-4">
                        <Link
                            to="/"
                            className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                        >
                            Home
                        </Link>
                        <Link
                            to="/create-post"
                            className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                        >
                            Create Post
                        </Link>
                        <div className="flex items-center space-x-3">
              <span className="text-gray-700 text-sm">
                Welcome, {user?.username || 'User'}
              </span>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleLogout}
                            >
                                Logout
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
