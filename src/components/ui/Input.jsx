// src/components/ui/Input.jsx
import React from 'react';

const Input = ({
                   label,
                   error,
                   className = '',
                   id,
                   ...props
               }) => {
    return (
        <div className="space-y-1">
            {label && (
                <label htmlFor={id} className="block text-sm font-medium text-gray-700">
                    {label}
                </label>
            )}
            <input
                id={id}
                className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                    error ? 'border-red-500 focus:ring-red-500' : ''
                } ${className}`}
                {...props}
            />
            {error && (
                <p className="text-sm text-red-600">{error}</p>
            )}
        </div>
    );
};

export default Input;