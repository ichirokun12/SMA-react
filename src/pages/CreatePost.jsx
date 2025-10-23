
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Button from '../components/ui/Button';

const CreatePost = () => {
    const [content, setContent] = useState('');
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => setImage(e.target.result);
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        // Simulate API call
        setTimeout(() => {
            console.log('Post created:', { content, image });
            setLoading(false);
            navigate('/');
        }, 1000);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="max-w-2xl mx-auto pt-8 px-4">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h1 className="text-2xl font-bold text-gray-900 mb-6">Create New Post</h1>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                What's on your mind?
                            </label>
                            <textarea
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                placeholder="Share your thoughts..."
                                rows={6}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Add Image (Optional)
                            </label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            {image && (
                                <div className="mt-4">
                                    <img
                                        src={image}
                                        alt="Preview"
                                        className="w-full max-h-64 object-cover rounded-lg"
                                    />
                                </div>
                            )}
                        </div>

                        <div className="flex space-x-4">
                            <Button
                                type="submit"
                                variant="primary"
                                size="lg"
                                disabled={loading || !content.trim()}
                                className="flex-1"
                            >
                                {loading ? 'Publishing...' : 'Publish Post'}
                            </Button>

                            <Button
                                type="button"
                                variant="secondary"
                                size="lg"
                                onClick={() => navigate('/')}
                            >
                                Cancel
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CreatePost;
