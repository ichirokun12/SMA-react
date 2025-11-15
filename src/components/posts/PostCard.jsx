// src/components/posts/PostCard.jsx - UPDATED WITH STICKY MENU & CLICKABLE USERNAMES
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { commentService } from '../../services/commentService';
import { postService } from '../../services/postService';
import { useAuth } from '../../context/AuthContext';

const PostCard = ({ post, onPostUpdate }) => {
    const [liked, setLiked] = useState(false);
    const [likes, setLikes] = useState(post.likes || 0);
    const [showComments, setShowComments] = useState(false);
    const [comment, setComment] = useState('');
    const [comments, setComments] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editedContent, setEditedContent] = useState({
        opinion: post.opinion || '',
        fact: post.fact || '',
        image: post.image || '',
        ping: post.ping || ''
    });
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [showMenu, setShowMenu] = useState(false);
    const { user } = useAuth();
    const navigate = useNavigate();

    const isOwnPost = post.assignedUser?.userId === user?.id;

    useEffect(() => {
        const processedComments = (post.comments || []).map(c => ({
            ...c,
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

    const handleDeleteComment = async (commentId) => {
        if (!window.confirm('Are you sure you want to delete this comment?')) return;

        try {
            await commentService.deleteComment(commentId);
            setComments(comments.filter(c => c.commentId !== commentId));
            if (onPostUpdate) {
                onPostUpdate();
            }
        } catch (error) {
            console.error('Error deleting comment:', error);
            alert('Failed to delete comment. Please try again.');
        }
    };

    const handleEditPost = async () => {
        if (!editedContent.opinion && !editedContent.fact) {
            alert('Please provide at least an opinion or a fact');
            return;
        }

        try {
            await postService.editPost(post.postId, editedContent);
            setIsEditing(false);
            if (onPostUpdate) {
                onPostUpdate();
            }
        } catch (error) {
            console.error('Error editing post:', error);
            alert('Failed to edit post. Please try again.');
        }
    };

    const handleDeletePost = async () => {
        try {
            await postService.deletePost(post.postId);
            if (onPostUpdate) {
                onPostUpdate();
            }
        } catch (error) {
            console.error('Error deleting post:', error);
            alert('Failed to delete post. Please try again.');
        }
    };

    const getAuthorInfo = () => {
        const username = post.assignedUser?.username || post.author || post.username || 'Anonymous';
        const userId = post.assignedUser?.userId || post.userId;
        return { username, userId };
    };

    const { username: authorName, userId: authorId } = getAuthorInfo();
    const authorInitial = authorName.charAt(0).toUpperCase();

    const goToProfile = (userId) => {
        if (userId) {
            navigate(`/profile/${userId}`);
        }
    };

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
        <div className="bg-white/80 dark:bg-black/80 backdrop-blur-xl rounded-xl shadow-sm border border-gray-200/50 dark:border-gray-800/50 p-6 space-y-4 hover:shadow-md transition-all duration-200">
            {/* Post Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3 min-w-0 flex-1">
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

                {/* Edit/Delete Menu for Own Posts - STICKY ON HOVER */}
                {isOwnPost && !isEditing && (
                    <div className="relative">
                        <button
                            onMouseEnter={() => setShowMenu(true)}
                            className="p-2 hover:bg-gray-100/80 dark:hover:bg-gray-800/80 rounded-lg transition-colors"
                        >
                            <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                            </svg>
                        </button>

                        {/* Dropdown Menu - STICKY */}
                        {showMenu && (
                            <div
                                onMouseLeave={() => setShowMenu(false)}
                                className="absolute right-0 mt-1 w-48 bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-lg shadow-lg border border-gray-200/50 dark:border-gray-700/50 z-10"
                            >
                                <button
                                    onClick={() => {
                                        setIsEditing(true);
                                        setShowMenu(false);
                                    }}
                                    className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50/80 dark:hover:bg-gray-700/80 flex items-center space-x-2 rounded-t-lg transition-colors"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                    <span>Edit Post</span>
                                </button>
                                <button
                                    onClick={() => {
                                        setShowDeleteConfirm(true);
                                        setShowMenu(false);
                                    }}
                                    className="w-full px-4 py-2 text-left text-sm text-red-600 dark:text-red-400 hover:bg-red-50/80 dark:hover:bg-red-900/20 flex items-center space-x-2 rounded-b-lg transition-colors"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                    <span>Delete Post</span>
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Post Content - Edit Mode */}
            {isEditing ? (
                <div className="space-y-4 border border-blue-500/50 rounded-lg p-4 bg-blue-50/50 dark:bg-blue-900/10 backdrop-blur-sm">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Opinion</label>
                        <textarea
                            value={editedContent.opinion}
                            onChange={(e) => setEditedContent({...editedContent, opinion: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300/50 dark:border-gray-600/50 bg-white/80 dark:bg-black/80 backdrop-blur-sm rounded-lg focus:ring-2 focus:ring-blue-500 dark:text-white resize-none"
                            rows={3}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Fact</label>
                        <textarea
                            value={editedContent.fact}
                            onChange={(e) => setEditedContent({...editedContent, fact: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300/50 dark:border-gray-600/50 bg-white/80 dark:bg-black/80 backdrop-blur-sm rounded-lg focus:ring-2 focus:ring-blue-500 dark:text-white resize-none"
                            rows={3}
                        />
                    </div>
                    <div className="flex space-x-2">
                        <button
                            onClick={handleEditPost}
                            className="px-4 py-2 bg-blue-600/90 text-white rounded-lg hover:bg-blue-700/90 backdrop-blur-sm transition-colors"
                        >
                            Save Changes
                        </button>
                        <button
                            onClick={() => {
                                setIsEditing(false);
                                setEditedContent({
                                    opinion: post.opinion || '',
                                    fact: post.fact || '',
                                    image: post.image || '',
                                    ping: post.ping || ''
                                });
                            }}
                            className="px-4 py-2 border border-gray-300/50 dark:border-gray-600/50 bg-white/80 dark:bg-black/80 backdrop-blur-sm text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50/80 dark:hover:bg-gray-800/80 transition-colors"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            ) : (
                // Post Content - View Mode
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
            )}

            {/* Delete Confirmation Dialog */}
            {showDeleteConfirm && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-lg p-6 max-w-sm w-full border border-gray-200/50 dark:border-gray-700/50">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                            Delete Post?
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-4">
                            This action cannot be undone. Are you sure you want to delete this post?
                        </p>
                        <div className="flex space-x-3">
                            <button
                                onClick={() => {
                                    handleDeletePost();
                                    setShowDeleteConfirm(false);
                                }}
                                className="flex-1 px-4 py-2 bg-red-600/90 text-white rounded-lg hover:bg-red-700/90 backdrop-blur-sm transition-colors"
                            >
                                Delete
                            </button>
                            <button
                                onClick={() => setShowDeleteConfirm(false)}
                                className="flex-1 px-4 py-2 border border-gray-300/50 dark:border-gray-600/50 bg-white/80 dark:bg-black/80 backdrop-blur-sm text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50/80 dark:hover:bg-gray-700/80 transition-colors"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Post Actions */}
            {!isEditing && (
                <>
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100/50 dark:border-gray-800/50">
                        <button
                            onClick={handleLike}
                            className={`flex items-center space-x-2 px-4 py-2 rounded-lg backdrop-blur-sm transition-colors ${
                                liked
                                    ? 'text-red-600 bg-red-50/80 dark:bg-red-900/20 hover:bg-red-100/80 dark:hover:bg-red-900/30'
                                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50/80 dark:hover:bg-gray-900/80'
                            }`}
                        >
                            <svg className="w-5 h-5" fill={liked ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                            <span className="text-sm font-medium">{likes}</span>
                        </button>

                        <button
                            onClick={() => setShowComments(!showComments)}
                            className="flex items-center space-x-2 px-4 py-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-50/80 dark:hover:bg-gray-900/80 backdrop-blur-sm transition-colors"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                            <span className="text-sm font-medium">
                                {comments.length > 0 ? `${comments.length} Comments` : 'Comment'}
                            </span>
                        </button>

                        <button className="flex items-center space-x-2 px-4 py-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-50/80 dark:hover:bg-gray-900/80 backdrop-blur-sm transition-colors">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                            </svg>
                            <span className="text-sm font-medium">Share</span>
                        </button>
                    </div>

                    {/* Comments Section */}
                    {showComments && (
                        <div className="pt-4 border-t border-gray-100/50 dark:border-gray-800/50 space-y-4">
                            <form onSubmit={handleCommentSubmit} className="flex space-x-2">
                                <input
                                    type="text"
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    placeholder="Write a comment..."
                                    className="flex-1 px-4 py-2 bg-gray-50/80 dark:bg-black/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                                    disabled={isSubmitting}
                                />
                                <button
                                    type="submit"
                                    disabled={!comment.trim() || isSubmitting}
                                    className="px-4 py-2 bg-blue-600/90 text-white rounded-lg hover:bg-blue-700/90 backdrop-blur-sm disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    {isSubmitting ? 'Posting...' : 'Post'}
                                </button>
                            </form>

                            {comments.length > 0 && (
                                <div className="space-y-3 max-h-60 overflow-y-auto">
                                    {comments.map((c) => {
                                        const isOwnComment = c.author === user?.username;
                                        return (
                                            <div key={c.commentId} className="flex space-x-3 p-3 bg-gray-50/80 dark:bg-black/80 backdrop-blur-sm rounded-lg border border-gray-200/50 dark:border-gray-800/50 group">
                                                <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-teal-600 rounded-full flex items-center justify-center flex-shrink-0">
                                                    <span className="text-white font-semibold text-xs">
                                                        {(c.author || 'U').charAt(0).toUpperCase()}
                                                    </span>
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-start justify-between">
                                                        <button
                                                            onClick={() => {
                                                                // Find user by author name and navigate to profile
                                                                // This is a simplified version - you may need to fetch user ID
                                                                console.log('Navigate to profile of:', c.author);
                                                            }}
                                                            className="text-sm font-semibold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                                                        >
                                                            {c.author || 'Anonymous'}
                                                        </button>
                                                        {isOwnComment && (
                                                            <button
                                                                onClick={() => handleDeleteComment(c.commentId)}
                                                                className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-50/80 dark:hover:bg-red-900/20 backdrop-blur-sm rounded transition-all"
                                                                title="Delete comment"
                                                            >
                                                                <svg className="w-4 h-4 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                                </svg>
                                                            </button>
                                                        )}
                                                    </div>
                                                    <p className="text-sm text-gray-700 dark:text-gray-300 break-words">
                                                        {c.comment}
                                                    </p>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                                        {formatTimestamp(c.timestamp)}
                                                    </p>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default PostCard;