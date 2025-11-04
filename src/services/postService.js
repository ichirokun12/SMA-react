// src/services/postService.js
import api from './api';

export const postService = {
    getAllPosts: async () => {
        // Note: Backend doesn't have /post/all endpoint
        // Using a workaround - you may need to add this endpoint to backend
        try {
            const response = await api.get('/post/all');
            return response.data;
        } catch (error) {
            console.error('Error fetching posts:', error);
            // Return empty array if endpoint doesn't exist
            return [];
        }
    },

    getPostById: async (postId) => {
        const response = await api.get(`/post/getPostById/${postId}`);
        return response.data;
    },

    createPost: async (postData) => {
        // Changed: No userId in URL, uses authenticated user from token
        const response = await api.post('/post/addPost', postData);
        return response.data;
    },

    deletePost: async (postId) => {
        const response = await api.delete(`/post/deletePost/${postId}`);
        return response.data;
    },
};