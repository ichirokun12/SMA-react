// src/components/ui/FollowButton.jsx
import React, { useState } from 'react';
import { followService } from '../../services/followService';
import { useAuth } from '../../context/AuthContext';

const FollowButton = ({ userId, initialFollowing = false, onFollowChange }) => {
    const [isFollowing, setIsFollowing] = useState(initialFollowing);
    const [loading, setLoading] = useState(false);
    const { user } = useAuth();

    // Don't show button for own profile
    if (user?.id === userId) {
        return null;
    }

    const handleFollow = async () => {
        setLoading(true);
        try {
            if (isFollowing) {
                await followService.unfollowUser(userId);
                setIsFollowing(false);
            } else {
                await followService.followUser(userId);
                setIsFollowing(true);
            }
            if (onFollowChange) {
                onFollowChange(!isFollowing);
            }
        } catch (error) {
            console.error('Error toggling follow:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            onClick={handleFollow}
            disabled={loading}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 backdrop-blur-sm ${
                isFollowing
                    ? 'bg-gray-200/80 dark:bg-gray-800/80 text-gray-900 dark:text-white hover:bg-gray-300/80 dark:hover:bg-gray-700/80'
                    : 'bg-blue-600/90 text-white hover:bg-blue-700/90'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
        >
            {loading ? 'Loading...' : isFollowing ? 'Following' : 'Follow'}
        </button>
    );
};

export default FollowButton;