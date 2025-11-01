// src/services/postService.js
import api from './api';

export const postService = {
    getAllPosts: async () => {
        const response = await api.get('/post/all');
        return response.data;
    },

    getPostById: async (postId) => {
        const response = await api.get(`/post/getPostById/${postId}`);
        return response.data;
    },

    createPost: async (userId, postData) => {
        const response = await api.post(`/post/addPost/${userId}`, postData);
        return response.data;
    },

    deletePost: async (postId) => {
        const response = await api.delete(`/post/deletePost/${postId}`);
        return response.data;
    },
};