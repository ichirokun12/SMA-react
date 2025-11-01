// src/services/userService.js
import api from './api';

export const userService = {
    getUser: async (userId) => {
        const response = await api.get(`/user/${userId}`);
        return response.data;
    },

    getAllUsers: async () => {
        const response = await api.get('/admin/allUsers');
        return response.data;
    },
};