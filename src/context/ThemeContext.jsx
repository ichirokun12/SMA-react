// src/context/ThemeContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within ThemeProvider');
    }
    return context;
};

export const ThemeProvider = ({ children }) => {
    const getInitialTheme = () => {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme && ['light', 'dark', 'amoled'].includes(savedTheme)) {
            return savedTheme;
        }
        // Check system preference
        if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return 'dark';
        }
        return 'light';
    };

    const [theme, setTheme] = useState(getInitialTheme);

    // Update document class and localStorage when theme changes
    useEffect(() => {
        const root = document.documentElement;

        // Remove all theme classes
        root.classList.remove('dark', 'amoled');

        // Add appropriate class
        if (theme === 'dark' || theme === 'amoled') {
            root.classList.add('dark');
        }
        if (theme === 'amoled') {
            root.classList.add('amoled');
        }

        localStorage.setItem('theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme((prevTheme) => {
            // Cycle: light -> dark -> amoled -> light
            if (prevTheme === 'light') return 'dark';
            if (prevTheme === 'dark') return 'amoled';
            return 'light';
        });
    };

    const setLightMode = () => setTheme('light');
    const setDarkMode = () => setTheme('dark');
    const setAmoledMode = () => setTheme('amoled');

    const value = {
        theme,
        setTheme,
        toggleTheme,
        setLightMode,
        setDarkMode,
        setAmoledMode,
        isLight: theme === 'light',
        isDark: theme === 'dark',
        isAmoled: theme === 'amoled'
    };

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
};