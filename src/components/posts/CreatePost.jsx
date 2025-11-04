// src/pages/CreatePost.jsx - FIXED
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Button from '../components/ui/Button';
import { postService } from '../services/postService';
import { useAuth } from '../context/AuthContext';

const CreatePost = () => {
    const [formData, setFormData] = useState({
        opinion: '',
        fact: '',
        image: '',
        ping: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const { user } = useAuth();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate at least one field is filled
        if (!formData.opinion && !formData.fact) {
            setError('Please provide at least an opinion or a fact');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            // Send post data without userId in URL - it's handled by JWT
            await postService.createPost(formData);
            navigate('/');
        } catch (err) {
            console.error('Error creating post:', err);
            setError(err.response?.data?.message || 'Failed to create post. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-black">
            <Navbar />
            <div className="max-w-2xl mx-auto pt-8 px-4">
                <div className="bg-white dark:bg-black rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                        Create New Post
                    </h1>

                    {error && (
                        <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-800 dark:text-red-200">
                            {error}
                        </div>
                    )}

                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Opinion
                            </label>
                            <textarea
                                name="opinion"
                                value={formData.opinion}
                                onChange={handleChange}
                                placeholder="Share your opinion..."
                                rows={4}
                                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 bg-white dark:bg-black text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none placeholder-gray-400 dark:placeholder-gray-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Fact
                            </label>
                            <textarea
                                name="fact"
                                value={formData.fact}
                                onChange={handleChange}
                                placeholder="Share a fact..."
                                rows={4}
                                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 bg-white dark:bg-black text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none placeholder-gray-400 dark:placeholder-gray-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Image URL (Optional)
                            </label>
                            <input
                                type="text"
                                name="image"
                                value={formData.image}
                                onChange={handleChange}
                                placeholder="https://example.com/image.jpg"
                                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 bg-white dark:bg-black text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400 dark:placeholder-gray-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Ping/Tag (Optional)
                            </label>
                            <input
                                type="text"
                                name="ping"
                                value={formData.ping}
                                onChange={handleChange}
                                placeholder="@username"
                                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 bg-white dark:bg-black text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400 dark:placeholder-gray-500"
                            />
                        </div>

                        <div className="flex space-x-4">
                            <Button
                                type="button"
                                variant="primary"
                                size="lg"
                                disabled={loading}
                                className="flex-1"
                                onClick={handleSubmit}
                            >
                                {loading ? 'Publishing...' : 'Publish Post'}
                            </Button>

                            <Button
                                type="button"
                                variant="secondary"
                                size="lg"
                                onClick={() => navigate('/')}
                                className="dark:bg-gray-900 dark:text-white dark:hover:bg-gray-800"
                            >
                                Cancel
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreatePost;