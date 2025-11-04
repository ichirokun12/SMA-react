// src/services/commentService.js
import api from './api';

export const commentService = {
    addComment: async (postId, comment) => {
        // Changed: No userId in URL, uses authenticated user from token
        const response = await api.post(`/comment/addCommentOn/${postId}`, {
            comment,
        });
        return response.data;
    },

    deleteComment: async (commentId) => {
        const response = await api.delete(`/comment/deleteComment/${commentId}`);
        return response.data;
    },
};