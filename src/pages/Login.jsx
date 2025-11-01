// src/pages/Login.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        // Clear error when user starts typing
        if (errors[e.target.name]) {
            setErrors({
                ...errors,
                [e.target.name]: ''
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const result = await login(formData);
        if (result.success) {
            navigate('/');
        } else {
            setErrors({ general: result.error });
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
            <div className="max-w-md w-full space-y-8 p-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Welcome Back</h2>
                    <p className="mt-2 text-gray-600 dark:text-gray-400">Sign in to your account</p>
                </div>

                <form className="space-y-6" onSubmit={handleSubmit}>
                    <Input
                        id="email"
                        name="email"
                        type="email"
                        label="Email Address"
                        value={formData.email}
                        onChange={handleChange}
                        error={errors.email}
                        required
                    />

                    <Input
                        id="password"
                        name="password"
                        type="password"
                        label="Password"
                        value={formData.password}
                        onChange={handleChange}
                        error={errors.password}
                        required
                    />

                    {errors.general && (
                        <div className="text-red-600 text-sm text-center">
                            {errors.general}
                        </div>
                    )}

                    <Button
                        type="submit"
                        variant="primary"
                        size="lg"
                        className="w-full"
                        disabled={loading}
                    >
                        {loading ? 'Signing In...' : 'Sign In'}
                    </Button>
                </form>

                <div className="text-center">
                    <p className="text-gray-600 dark:text-gray-400">
                        Don't have an account?{' '}
                        <Link to="/register" className="text-blue-600 dark:text-blue-400 hover:text-blue-500 font-medium">
                            Sign up
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;