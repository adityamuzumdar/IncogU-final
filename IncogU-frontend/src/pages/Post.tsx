import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

interface Reply {
  _id: string;
  user: string;
  text: string;
  createdAt: string;
  replies: Reply[];
}

interface Comment {
  _id: string;
  user: string;
  text: string;
  replies: Reply[];
  createdAt: string;
}

interface Post {
  _id: string;
  title: string;
  content: string;
  user: {
    username: string;
    email: string;
    university: string;
  };
  comments: Comment[];
}

export default function Post() {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [newComment, setNewComment] = useState<string>('');
  const [replyText, setReplyText] = useState<string>('');
  const [activeReplyId, setActiveReplyId] = useState<string | null>(null);
  const [replyToReplyText, setReplyToReplyText] = useState<string>('');
  const [activeReplyToReplyId, setActiveReplyToReplyId] = useState<string | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get<Post>(`http://localhost:5001/api/posts/${id}`);
        setPost(response.data);
      } catch (error) {
        console.error('Error fetching post:', error);
      }
    };
    fetchPost();
  }, [id]);

  const handleComment = async () => {
    if (!newComment.trim()) return;

    const token = localStorage.getItem('authToken');
    if (!token) {
      alert('Please login first');
      return;
    }

    try {
      const response = await axios.post<Comment>(
        `http://localhost:5001/api/posts/${id}/comments`,
        { text: newComment },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPost((prevPost) => prevPost ? { ...prevPost, comments: [...prevPost.comments, response.data] } : null);
      setNewComment('');
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const handleReply = async (commentId: string) => {
    if (!replyText.trim()) return;

    const token = localStorage.getItem('authToken');
    if (!token) {
      alert('Please login first');
      return;
    }

    try {
      const response = await axios.post(
        `http://localhost:5001/api/posts/${id}/comments/${commentId}/replies`,
        { text: replyText },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setPost((prevPost) => {
        if (!prevPost) return null;
        return {
          ...prevPost,
          comments: prevPost.comments.map(comment => 
            comment._id === commentId
              ? { ...comment, replies: [...comment.replies, response.data] }
              : comment
          )
        };
      });
      setReplyText('');
      setActiveReplyId(null);
    } catch (error) {
      console.error('Error adding reply:', error);
    }
  };

  const handleReplyToReply = async (commentId: string, replyId: string) => {
    if (!replyToReplyText.trim()) return;

    const token = localStorage.getItem('authToken');
    if (!token) {
      alert('Please login first');
      return;
    }

    try {
      const response = await axios.post(
        `http://localhost:5001/api/posts/${id}/comments/${commentId}/replies/${replyId}/replies`,
        { text: replyToReplyText },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setPost((prevPost) => {
        if (!prevPost) return null;
        return {
          ...prevPost,
          comments: prevPost.comments.map(comment => 
            comment._id === commentId
              ? {
                  ...comment,
                  replies: comment.replies.map(reply =>
                    reply._id === replyId
                      ? { ...reply, replies: [...(reply.replies || []), response.data] }
                      : reply
                  )
                }
              : comment
          )
        };
      });
      setReplyToReplyText('');
      setActiveReplyToReplyId(null);
    } catch (error) {
      console.error('Error adding reply to reply:', error);
    }
  };

  const RenderReply = ({ reply, commentId, depth = 0 }: { reply: Reply; commentId: string; depth?: number }) => {
    const maxDepth = 3;

    return (
      <div className={`bg-gray-50 p-3 mb-2 rounded-md ${depth > 0 ? 'ml-4' : ''}`}>
        <p className="text-gray-800">{reply.text}</p>
        <p className="text-xs text-gray-500 mt-1">
          {new Date(reply.createdAt).toLocaleDateString()}
        </p>

        {depth < maxDepth && (
          <>
            {activeReplyToReplyId === reply._id ? (
              <div className="mt-2">
                <textarea
                  value={replyToReplyText}
                  onChange={(e) => setReplyToReplyText(e.target.value)}
                  placeholder="Write a reply..."
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md"
                />
                <div className="mt-2 space-x-2">
                  <button
                    onClick={() => handleReplyToReply(commentId, reply._id)}
                    className="px-3 py-1 text-sm text-white bg-indigo-600 rounded-md"
                  >
                    Reply
                  </button>
                  <button
                    onClick={() => setActiveReplyToReplyId(null)}
                    className="px-3 py-1 text-sm text-gray-600 bg-gray-200 rounded-md"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setActiveReplyToReplyId(reply._id)}
                className="mt-2 text-sm text-indigo-600 hover:text-indigo-800"
              >
                Reply
              </button>
            )}
          </>
        )}

        {reply.replies && reply.replies.length > 0 && (
          <div className="mt-2">
            {reply.replies.map((nestedReply) => (
              <RenderReply
                key={nestedReply._id}
                reply={nestedReply}
                commentId={commentId}
                depth={depth + 1}
              />
            ))}
          </div>
        )}
      </div>
    );
  };

  if (!post) return <p>Loading...</p>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="container mx-auto py-12 px-6">
        <div className="bg-white p-8 rounded-lg shadow-lg mb-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{post.title}</h1>
          <p className="text-gray-700 mb-4">{post.content}</p>
          <p className="text-sm text-gray-500 mb-6">Posted by: {post.user.username}</p>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Comments</h2>
          {post.comments.length === 0 ? (
            <p className="text-center text-gray-600">No comments yet.</p>
          ) : (
            post.comments.map((comment) => (
              <div key={comment._id} className="bg-gray-100 p-4 mb-4 rounded-md">
                <p className="text-gray-800">{comment.text}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {new Date(comment.createdAt).toLocaleDateString()}
                </p>
                
                {/* Replies section */}
                <div className="ml-8 mt-4">
                  {comment.replies.map((reply) => (
                    <RenderReply
                      key={reply._id}
                      reply={reply}
                      commentId={comment._id}
                    />
                  ))}
                </div>

                {/* Reply input section */}
                {activeReplyId === comment._id ? (
                  <div className="mt-2">
                    <textarea
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder="Write a reply..."
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md"
                    />
                    <div className="mt-2 space-x-2">
                      <button
                        onClick={() => handleReply(comment._id)}
                        className="px-3 py-1 text-sm text-white bg-indigo-600 rounded-md"
                      >
                        Reply
                      </button>
                      <button
                        onClick={() => setActiveReplyId(null)}
                        className="px-3 py-1 text-sm text-gray-600 bg-gray-200 rounded-md"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => setActiveReplyId(comment._id)}
                    className="mt-2 text-sm text-indigo-600 hover:text-indigo-800"
                  >
                    Reply
                  </button>
                )}
              </div>
            ))
          )}
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment"
            className="w-full px-4 py-3 mb-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
          <button
            onClick={handleComment}
            className="w-full px-4 py-3 text-white bg-indigo-600 rounded-md shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}