// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@context/AuthContext';
import { ThemeProvider } from '@context/ThemeContext';
import ProtectedRoute from '@utils/ProtectedRoute';
import Login from '@pages/Login';
import Register from '@pages/Register';
import Home from '@pages/Home';
import CreatePost from '@pages/CreatePost';
import './App.css';

function App() {
    return (
        <ThemeProvider>
            <AuthProvider>
                <Router>
                    <div className="App min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
                        <Routes>
                            <Route path="/login" element={<Login />} />
                            <Route path="/register" element={<Register />} />
                            <Route
                                path="/"
                                element={
                                    <ProtectedRoute>
                                        <Home />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/create-post"
                                element={
                                    <ProtectedRoute>
                                        <CreatePost />
                                    </ProtectedRoute>
                                }
                            />
                        </Routes>
                    </div>
                </Router>
            </AuthProvider>
        </ThemeProvider>
    );
}

export default App;
