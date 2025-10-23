
import React, { useState, useEffect } from 'react';
import PostCard from '../components/posts/PostCard';
import Navbar from '../components/common/Navbar';

const Home = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Simulate API call
        const fetchPosts = async () => {
            // Replace with actual API call
            const mockPosts = [
                {
                    id: 1,
                    author: 'John Doe',
                    content: 'Just built an amazing React application! The component architecture is so clean and maintainable. 🚀',
                    timestamp: '2 hours ago',
                    likes: 24,
                    image: null
                },
                {
                    id: 2,
                    author: 'Jane Smith',
                    content: 'Beautiful sunset today! Sometimes you need to step away from the code and appreciate nature.',
                    timestamp: '4 hours ago',
                    likes: 156,
                    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500'
                },
                {
                    id: 3,
                    author: 'Tech Guru',
                    content: 'Pro tip: Always use meaningful variable names in your code. Your future self will thank you! 💡',
                    timestamp: '1 day ago',
                    likes: 89
                }
            ];

            setTimeout(() => {
                setPosts(mockPosts);
                setLoading(false);
            }, 1000);
        };

        fetchPosts();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Navbar />
                <div className="max-w-2xl mx-auto pt-8">
                    <div className="space-y-6">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="bg-white rounded-xl p-6 animate-pulse">
                                <div className="flex items-center space-x-3 mb-4">
                                    <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
                                    <div className="space-y-2">
                                        <div className="h-4 bg-gray-300 rounded w-24"></div>
                                        <div className="h-3 bg-gray-300 rounded w-16"></div>
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <div className="h-4 bg-gray-300 rounded w-full"></div>
                                    <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="max-w-2xl mx-auto pt-8 px-4">
                <div className="space-y-6">
                    {posts.map((post) => (
                        <PostCard key={post.id} post={post} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Home;
