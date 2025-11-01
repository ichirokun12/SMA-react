// src/pages/Home.jsx
import React, { useState, useEffect } from 'react';
import PostCard from '../components/posts/PostCard';
import Navbar from '../components/common/Navbar';
import { postService } from '../services/postService';

const Home = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
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

        fetchPosts();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
                <Navbar />
                <div className="max-w-2xl mx-auto pt-8">
                    <div className="space-y-6">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="bg-white dark:bg-gray-800 rounded-xl p-6 animate-pulse">
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
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
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
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
            <Navbar />
            <div className="max-w-2xl mx-auto pt-8 px-4">
                {posts.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-gray-600 dark:text-gray-400">No posts yet. Be the first to create one!</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {posts.map((post) => (
                            <PostCard key={post.postId} post={post} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Home;