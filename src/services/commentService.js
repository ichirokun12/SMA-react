// src/services/commentService.js - FIXED
import api from './api';

export const commentService = {
    // Fixed: Use the correct endpoint format
    addComment: async (userId, postId, commentText) => {
        const response = await api.post(`/comment/addCommentOn/${postId}`, {
            comment: commentText,
        });
        return response.data;
    },

    deleteComment: async (commentId) => {
        const response = await api.delete(`/comment/deleteComment/${commentId}`);
        return response.data;
    },
};