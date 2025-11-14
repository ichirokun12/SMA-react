// src/pages/Home.jsx - WITH FLOATING ACTION BUTTON
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PostCard from '../components/posts/PostCard';
import Navbar from '../components/common/Navbar';
import { postService } from '../services/postService';

const Home = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const fetchPosts = async () => {
        try {
            setLoading(true);
            const data = await postService.getAllPosts();
            setPosts(data);
        } catch (err) {
            console.error('Error fetching posts:', err);
            setError('Failed to load posts. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    const handlePostUpdate = () => {
        fetchPosts();
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-black">
                <Navbar />
                <div className="max-w-2xl mx-auto pt-8">
                    <div className="space-y-6">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="bg-white dark:bg-black rounded-xl p-6 animate-pulse">
                                <div className="flex items-center space-x-3 mb-4">
                                    <div className="w-10 h-10 bg-gray-300 dark:bg-gray-700 rounded-full"></div>
                                    <div className="space-y-2">
                                        <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-24"></div>
                                        <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-16"></div>
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-full"></div>
                                    <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-black">
                <Navbar />
                <div className="max-w-2xl mx-auto pt-8 px-4">
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 text-red-800 dark:text-red-200">
                        {error}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-black transition-colors duration-200">
            <Navbar />
            <div className="max-w-2xl mx-auto pt-8 px-4 pb-24">
                {posts.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-gray-600 dark:text-gray-400">No posts yet. Be the first to create one!</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {posts.map((post) => (
                            <PostCard
                                key={post.postId}
                                post={post}
                                onPostUpdate={handlePostUpdate}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Floating Action Button for Create Post */}
            <button
                onClick={() => navigate('/create-post')}
                className="fixed bottom-8 right-8 w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-200 flex items-center justify-center z-50 group"
                aria-label="Create new post"
            >
                <svg
                    className="w-8 h-8 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                    />
                </svg>

                {/* Tooltip */}
                <span className="absolute bottom-full right-0 mb-2 px-3 py-1 bg-gray-900 dark:bg-gray-700 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    Create Post
                </span>
            </button>
        </div>
    );
};

export default Home;