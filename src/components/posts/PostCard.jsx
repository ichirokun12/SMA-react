// src/components/posts/PostCard.jsx - WITH AUTHOR FIX
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { commentService } from '../../services/commentService';
import { useAuth } from '../../context/AuthContext';

const PostCard = ({ post, onPostUpdate }) => {
    const [liked, setLiked] = useState(false);
    const [likes, setLikes] = useState(post.likes || 0);
    const [showComments, setShowComments] = useState(false);
    const [comment, setComment] = useState('');
    const [comments, setComments] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { user } = useAuth();
    const navigate = useNavigate();

    // Initialize comments with author fallback
    useEffect(() => {
        const processedComments = (post.comments || []).map(c => ({
            ...c,
            // If author is "User" or missing, try to get from localStorage
            author: (c.author && c.author !== "User") ? c.author :
                localStorage.getItem(`comment_${c.commentId}_author`) ||
                c.author ||
                'Anonymous'
        }));
        setComments(processedComments);
    }, [post.comments]);

    const handleLike = () => {
        setLiked(!liked);
        setLikes(liked ? likes - 1 : likes + 1);
    };

    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        if (!comment.trim() || !user) return;

        setIsSubmitting(true);
        try {
            await commentService.addComment(user.id, post.postId, comment);

            const newComment = {
                commentId: Date.now(),
                comment: comment,
                author: user.username,
                timestamp: new Date().toISOString()
            };

            // Store author in localStorage as backup
            localStorage.setItem(`comment_${newComment.commentId}_author`, user.username);

            setComments([...comments, newComment]);
            setComment('');

            if (onPostUpdate) {
                onPostUpdate();
            }
        } catch (error) {
            console.error('Error adding comment:', error);
            alert('Failed to add comment. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Extract username and userId
    const getAuthorInfo = () => {
        const username = post.assignedUser?.username || post.author || post.username || 'Anonymous';
        const userId = post.assignedUser?.userId || post.userId;
        return { username, userId };
    };

    const { username: authorName, userId: authorId } = getAuthorInfo();
    const authorInitial = authorName.charAt(0).toUpperCase();

    // Navigate to profile
    const goToProfile = (userId) => {
        if (userId) {
            navigate(`/profile/${userId}`);
        }
    };

    // Format timestamp
    const formatTimestamp = (timestamp) => {
        if (!timestamp) return 'Just now';
        const date = new Date(timestamp);
        const now = new Date();
        const diff = Math.floor((now - date) / 1000);

        if (diff < 60) return 'Just now';
        if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
        if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
        return `${Math.floor(diff / 86400)}d ago`;
    };

    return (
        <div className="bg-white dark:bg-black rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6 space-y-4 hover:shadow-md transition-all duration-200">
            {/* Post Header */}
            <div className="flex items-center space-x-3">
                <button
                    onClick={() => goToProfile(authorId)}
                    className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0 hover:shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    aria-label={`Go to ${authorName}'s profile`}
                >
                    <span className="text-white font-semibold text-sm">
                        {authorInitial}
                    </span>
                </button>
                <div className="min-w-0 flex-1">
                    <button
                        onClick={() => goToProfile(authorId)}
                        className="font-semibold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 truncate block text-left transition-colors"
                    >
                        {authorName}
                    </button>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">
                        {formatTimestamp(post.timestamp || post.createdAt)}
                    </p>
                </div>
            </div>

            {/* Post Content */}
            <div className="space-y-3">
                {post.opinion && (
                    <div className="space-y-1">
                        <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Opinion</p>
                        <p className="text-gray-800 dark:text-gray-200 leading-relaxed">{post.opinion}</p>
                    </div>
                )}

                {post.fact && (
                    <div className="space-y-1">
                        <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Fact</p>
                        <p className="text-gray-800 dark:text-gray-200 leading-relaxed">{post.fact}</p>
                    </div>
                )}

                {post.image && (
                    <img
                        src={post.image}
                        alt="Post content"
                        className="w-full rounded-lg max-h-96 object-cover"
                        onError={(e) => e.target.style.display = 'none'}
                    />
                )}

                {post.ping && (
                    <p className="text-blue-600 dark:text-blue-400 text-sm">{post.ping}</p>
                )}
            </div>

            {/* Post Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-800">
                <button
                    onClick={handleLike}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                        liked
                            ? 'text-red-600 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30'
                            : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-900'
                    }`}
                >
                    <svg className="w-5 h-5" fill={liked ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                    <span className="text-sm font-medium">{likes}</span>
                </button>

                <button
                    onClick={() => setShowComments(!showComments)}
                    className="flex items-center space-x-2 px-4 py-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    <span className="text-sm font-medium">
                        {comments.length > 0 ? `${comments.length} Comments` : 'Comment'}
                    </span>
                </button>

                <button className="flex items-center space-x-2 px-4 py-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                    </svg>
                    <span className="text-sm font-medium">Share</span>
                </button>
            </div>

            {/* Comments Section */}
            {showComments && (
                <div className="pt-4 border-t border-gray-100 dark:border-gray-800 space-y-4">
                    {/* Comment Form */}
                    <form onSubmit={handleCommentSubmit} className="flex space-x-2">
                        <input
                            type="text"
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="Write a comment..."
                            className="flex-1 px-4 py-2 bg-gray-50 dark:bg-black border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                            disabled={isSubmitting}
                        />
                        <button
                            type="submit"
                            disabled={!comment.trim() || isSubmitting}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            {isSubmitting ? 'Posting...' : 'Post'}
                        </button>
                    </form>

                    {/* Comments List */}
                    {comments.length > 0 && (
                        <div className="space-y-3 max-h-60 overflow-y-auto">
                            {comments.map((c) => (
                                <div key={c.commentId} className="flex space-x-3 p-3 bg-gray-50 dark:bg-black rounded-lg border border-gray-200 dark:border-gray-800">
                                    <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-teal-600 rounded-full flex items-center justify-center flex-shrink-0">
                                        <span className="text-white font-semibold text-xs">
                                            {(c.author || 'U').charAt(0).toUpperCase()}
                                        </span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-semibold text-gray-900 dark:text-white">
                                            {c.author || 'Anonymous'}
                                        </p>
                                        <p className="text-sm text-gray-700 dark:text-gray-300 break-words">
                                            {c.comment}
                                        </p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                            {formatTimestamp(c.timestamp)}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default PostCard;