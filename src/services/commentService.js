// src/services/commentService.js
import api from './api';

export const commentService = {
    addComment: async (userId, postId, comment) => {
        const response = await api.post(`/comment/addCommentOn/${postId}/by/${userId}`, {
            comment,
        });
        return response.data;
    },
};