// src/services/postService.js - FIXED VERSION
import api from './api';

export const postService = {
    // Fetch all posts from all users
    getAllPosts: async () => {
        try {
            const response = await api.get('/post/all');
            return response.data || [];
        } catch (error) {
            console.error('Error fetching posts:', error);
            throw error;
        }
    },

    getPostById: async (postId) => {
        const response = await api.get(`/post/getPostById/${postId}`);
        return response.data;
    },

    createPost: async (postData) => {
        // Use the correct endpoint that doesn't require userId in URL
        const response = await api.post('/post/addPost', postData);
        return response.data;
    },

    deletePost: async (postId) => {
        const response = await api.delete(`/post/deletePost/${postId}`);
        return response.data;
    },
};