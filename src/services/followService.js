// src/services/followService.js
import api from './api';

export const followService = {
    followUser: async (followingId) => {
        // Changed: No followerId in URL, uses authenticated user from token
        const response = await api.post(`/followUser/follow/${followingId}`);
        return response.data;
    },

    unfollowUser: async (followingId) => {
        // Changed: No followerId in URL, uses authenticated user from token
        const response = await api.delete(`/followUser/unfollow/${followingId}`);
        return response.data;
    },

    getFollowers: async (userId) => {
        // Note: Backend uses /followUser but endpoint path is still /{userId}/followers
        const response = await api.get(`/followUser/${userId}/followers`);
        return response.data;
    },

    getFollowing: async (userId) => {
        // Note: Backend uses /followUser but endpoint path is still /{userId}/following
        const response = await api.get(`/followUser/${userId}/following`);
        return response.data;
    },
};