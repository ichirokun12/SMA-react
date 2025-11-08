// src/services/postService.js - DEBUG VERSION
import api from './api';

export const postService = {
    getAllPosts: async () => {
        try {
            const response = await api.get('/post/all');
            const posts = response.data || [];

            // Debug: Log the raw response
            console.log('Raw posts from backend:', posts);

            // Add fallback username if missing
            const processedPosts = posts.map(post => {
                console.log('Processing post:', post);
                console.log('Post assignedUser:', post.assignedUser);

                // If assignedUser exists but username is missing
                if (post.assignedUser && !post.assignedUser.username) {
                    // Try to get from user data in localStorage
                    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
                    post.assignedUser.username = currentUser.username || 'User';
                }

                return post;
            });

            console.log('Processed posts:', processedPosts);
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

    deletePost: async (postId) => {
        const response = await api.delete(`/post/deletePost/${postId}`);
        return response.data;
    },
};