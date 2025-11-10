// src/pages/Profile.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import PostCard from '../components/posts/PostCard';
import { userService } from '../services/userService';
import { postService } from '../services/postService';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
    const { userId } = useParams();
    const navigate = useNavigate();
    const { user: currentUser } = useAuth();
    const [profileData, setProfileData] = useState(null);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('posts');
    const [isOwnProfile, setIsOwnProfile] = useState(false);

    useEffect(() => {
        const fetchProfileData = async () => {
            try {
                setLoading(true);

                // Check if viewing own profile
                const isOwn = currentUser?.id?.toString() === userId?.toString();
                setIsOwnProfile(isOwn);

                // Fetch user data
                const userData = await userService.getUser(userId);
                setProfileData(userData[0]); // API returns array

                // Fetch user's posts
                const allPosts = await postService.getAllPosts();
                const userPosts = allPosts.filter(post =>
                    post.assignedUser?.userId?.toString() === userId?.toString()
                );
                setPosts(userPosts);

            } catch (error) {
                console.error('Error fetching profile:', error);
            } finally {
                setLoading(false);
            }
        };

        if (userId) {
            fetchProfileData();
        }
    }, [userId, currentUser]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-black">
                <Navbar />
                <div className="max-w-4xl mx-auto pt-8 px-4">
                    <div className="animate-pulse space-y-4">
                        <div className="h-32 bg-gray-200 dark:bg-gray-800 rounded-xl"></div>
                        <div className="h-24 bg-gray-200 dark:bg-gray-800 rounded-xl"></div>
                    </div>
                </div>
            </div>
        );
    }

    if (!profileData) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-black">
                <Navbar />
                <div className="max-w-4xl mx-auto pt-8 px-4">
                    <div className="text-center py-12">
                        <p className="text-gray-600 dark:text-gray-400">User not found</p>
                    </div>
                </div>
            </div>
        );
    }

    const formatJoinDate = (dateString) => {
        if (!dateString) return 'Recently';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-black">
            <Navbar />
            <div className="max-w-4xl mx-auto pt-8 px-4 pb-8">
                {/* Profile Header */}
                <div className="bg-white dark:bg-black rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">
                    {/* Cover Photo */}
                    <div className="h-32 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>

                    {/* Profile Info */}
                    <div className="px-6 pb-6">
                        <div className="flex flex-col sm:flex-row sm:items-end sm:space-x-5 -mt-12 sm:-mt-16">
                            {/* Profile Picture */}
                            <div className="relative">
                                <div className="w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full border-4 border-white dark:border-black flex items-center justify-center">
                                    <span className="text-white text-3xl sm:text-4xl font-bold">
                                        {profileData.username?.charAt(0).toUpperCase()}
                                    </span>
                                </div>
                            </div>

                            {/* Name and Actions */}
                            <div className="flex-1 mt-4 sm:mt-0 min-w-0">
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                                    <div className="min-w-0">
                                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white truncate">
                                            {profileData.firstName || profileData.username} {profileData.lastName || ''}
                                        </h1>
                                        <p className="text-gray-600 dark:text-gray-400 truncate">
                                            @{profileData.username}
                                        </p>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex space-x-2 mt-4 sm:mt-0">
                                        {isOwnProfile ? (
                                            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                                                Edit Profile
                                            </button>
                                        ) : (
                                            <>
                                                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                                                    Follow
                                                </button>
                                                <button className="px-4 py-2 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors">
                                                    Message
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </div>

                                {/* Email */}
                                {profileData.email && (
                                    <p className="mt-3 text-gray-600 dark:text-gray-400 text-sm">
                                        📧 {profileData.email}
                                    </p>
                                )}

                                {/* Additional Info */}
                                <div className="mt-3 flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400">
                                    <div className="flex items-center space-x-1">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                        <span>Joined {formatJoinDate(profileData.createdAt)}</span>
                                    </div>
                                </div>

                                {/* Stats */}
                                <div className="mt-4 flex space-x-6">
                                    <button className="text-center hover:underline">
                                        <span className="font-bold text-gray-900 dark:text-white">{posts.length}</span>
                                        <span className="text-gray-600 dark:text-gray-400 ml-1">Posts</span>
                                    </button>
                                    <button className="text-center hover:underline">
                                        <span className="font-bold text-gray-900 dark:text-white">{profileData.followers || 0}</span>
                                        <span className="text-gray-600 dark:text-gray-400 ml-1">Followers</span>
                                    </button>
                                    <button className="text-center hover:underline">
                                        <span className="font-bold text-gray-900 dark:text-white">{profileData.following || 0}</span>
                                        <span className="text-gray-600 dark:text-gray-400 ml-1">Following</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="mt-6 bg-white dark:bg-black rounded-xl shadow-sm border border-gray-200 dark:border-gray-800">
                    <div className="border-b border-gray-200 dark:border-gray-800">
                        <div className="flex space-x-8 px-6">
                            <button
                                onClick={() => setActiveTab('posts')}
                                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                                    activeTab === 'posts'
                                        ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                                        : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                                }`}
                            >
                                Posts
                            </button>
                            <button
                                onClick={() => setActiveTab('media')}
                                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                                    activeTab === 'media'
                                        ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                                        : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                                }`}
                            >
                                Media
                            </button>
                            <button
                                onClick={() => setActiveTab('likes')}
                                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                                    activeTab === 'likes'
                                        ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                                        : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                                }`}
                            >
                                Likes
                            </button>
                        </div>
                    </div>

                    {/* Tab Content */}
                    <div className="p-6">
                        {activeTab === 'posts' && (
                            <div className="space-y-6">
                                {posts.length > 0 ? (
                                    posts.map((post) => (
                                        <PostCard key={post.postId} post={post} />
                                    ))
                                ) : (
                                    <div className="text-center py-12">
                                        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                        <p className="mt-4 text-gray-600 dark:text-gray-400">
                                            {isOwnProfile ? "You haven't posted anything yet" : "No posts yet"}
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === 'media' && (
                            <div className="grid grid-cols-3 gap-4">
                                {posts.filter(p => p.image).length > 0 ? (
                                    posts.filter(p => p.image).map((post) => (
                                        <div key={post.postId} className="aspect-square rounded-lg overflow-hidden">
                                            <img
                                                src={post.image}
                                                alt="Post media"
                                                className="w-full h-full object-cover hover:opacity-75 transition-opacity cursor-pointer"
                                            />
                                        </div>
                                    ))
                                ) : (
                                    <div className="col-span-3 text-center py-12">
                                        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                        <p className="mt-4 text-gray-600 dark:text-gray-400">No media to show</p>
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === 'likes' && (
                            <div className="text-center py-12">
                                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                </svg>
                                <p className="mt-4 text-gray-600 dark:text-gray-400">
                                    {isOwnProfile ? "You haven't liked any posts yet" : "No liked posts to show"}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;