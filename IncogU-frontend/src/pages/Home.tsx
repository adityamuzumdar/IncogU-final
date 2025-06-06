import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../AuthProvider';
import { useNavigate, Link } from 'react-router-dom';

interface Post {
  _id: string;
  title: string;
  content: string;
  user: {
    username: string;
    email: string;
    university: string;
  };
  comments: {
    user: string;
    text: string;
  }[];
}

const Home: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [newPost, setNewPost] = useState<{ title: string; content: string }>({ title: '', content: '' });
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get<Post[]>('http://localhost:5001/api/posts');
        setPosts(response.data);
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };
    fetchPosts();
  }, []);

  const handlePost = async () => {
    if (!isAuthenticated) {
      alert('Please login first');
      return;
    }

    const token = localStorage.getItem('authToken');
    try {
      const response = await axios.post<Post>(
        'http://localhost:5001/api/posts',
        { title: newPost.title, content: newPost.content },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPosts([...posts, response.data]);
      setNewPost({ title: '', content: '' });
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="container mx-auto py-12 px-6">
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-4xl font-extrabold text-gray-900">Dashboard</h2>
        </div>
        <div className="bg-white p-8 rounded-lg shadow-lg mb-10">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Create a Post</h2>
          <input
            type="text"
            placeholder="Title"
            value={newPost.title}
            onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
            className="w-full px-4 py-3 mb-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
          <textarea
            placeholder="Content"
            value={newPost.content}
            onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
            className="w-full px-4 py-3 mb-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
          <button
            onClick={handlePost}
            className="w-full px-4 py-3 text-white bg-indigo-600 rounded-md shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Post
          </button>
        </div>
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">All Posts</h2>
        {posts.length === 0 ? (
          <p className="text-center text-gray-600">No posts available.</p>
        ) : (
          posts.map((post) => (
            <div key={post._id} className="bg-white p-6 mb-6 rounded-lg shadow-md">
              <h3 className="text-xl font-bold text-gray-800">{post.title}</h3>
              <p className="text-gray-700 mt-2">{post.content}</p>
              <p className="text-sm text-gray-500 mt-4">Posted by: {post.user?.username || 'Anonymous'}</p>
              <p className="text-sm text-gray-500">University: {post.user?.university || 'Unknown'}</p>
              <Link to={`/post/${post._id}`} className="text-indigo-600 hover:underline">
                View Post
              </Link>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Home;