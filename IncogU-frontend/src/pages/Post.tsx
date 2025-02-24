import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

interface Comment {
  user: string;
  text: string;
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
            post.comments.map((comment, index) => (
              <div key={index} className="bg-gray-100 p-4 mb-4 rounded-md">
                <p className="text-gray-800"> {comment.text}</p>
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