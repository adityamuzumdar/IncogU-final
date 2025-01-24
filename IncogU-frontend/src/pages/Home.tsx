import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../AuthProvider';
import { useNavigate } from 'react-router-dom';

interface Post {
  _id: string;
  title: string;
  content: string;
  user: {
    username: string;
    email: string;
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

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div>
      <h1>Welcome to IncogU!</h1>
      <button onClick={handleLogout}>Logout</button>
      <h2>Create a Post</h2>
      <input
        type="text"
        placeholder="Title"
        value={newPost.title}
        onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
      />
      <textarea
        placeholder="Content"
        value={newPost.content}
        onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
      />
      <button onClick={handlePost}>Post</button>
      <h2>All Posts</h2>
      {posts.length === 0 ? (
        <p>No posts available.</p>
      ) : (
        posts.map((post) => (
          <div key={post._id}>
            <h3>{post.title}</h3>
            <p>{post.content}</p>
            <p>Posted by: {post.user?.username || 'Anonymous'}</p>
          </div>
        ))
      )}
    </div>
  );
};

export default Home;