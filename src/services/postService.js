// src/services/postService.js - WITH EDIT SUPPORT
import api from './api';

export const postService = {
    getAllPosts: async () => {
        try {
            const response = await api.get('/post/all');
            const posts = response.data || [];

            const processedPosts = posts.map(post => {
                if (post.assignedUser && !post.assignedUser.username) {
                    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
                    post.assignedUser.username = currentUser.username || 'User';
                }
                return post;
            });

            return processedPosts;
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
        const response = await api.post('/post/addPost', postData);
        return response.data;
    },

    editPost: async (postId, postData) => {
        const response = await api.put(`/post/editPost/${postId}`, postData);
        return response.data;
    },

    deletePost: async (postId) => {
        const response = await api.delete(`/post/deletePost/${postId}`);
        return response.data;
    },
};