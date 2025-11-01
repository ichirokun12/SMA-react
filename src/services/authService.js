// src/services/authService.js
import api from './api';

export const authService = {
    login: async (username, password) => {
        const response = await api.post('/auth/login', { username, password });
        return response.data;
    },

    register: async (userData) => {
        const response = await api.post('/auth/signup', {
            username: userData.username,
            email: userData.email,
            password: userData.password,
            firstName: userData.firstName || '',
            lastName: userData.lastName || '',
        });
        return response.data;
    },
};