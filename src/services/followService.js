// src/services/followService.js
import api from './api';

export const followService = {
    followUser: async (followerId, followingId) => {
        const response = await api.post(`/follow/${followerId}/follow/${followingId}`);
        return response.data;
    },

    unfollowUser: async (followerId, followingId) => {
        const response = await api.delete(`/follow/${followerId}/unfollow/${followingId}`);
        return response.data;
    },

    getFollowers: async (userId) => {
        const response = await api.get(`/follow/${userId}/followers`);
        return response.data;
    },

    getFollowing: async (userId) => {
        const response = await api.get(`/follow/${userId}/following`);
        return response.data;
    },
};