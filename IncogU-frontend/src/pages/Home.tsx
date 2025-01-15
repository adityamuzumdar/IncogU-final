import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Post {
  _id: string;
  user: {
    username: string;
    email: string;
  };
  title: string;
  content: string;
  comments: Array<{
    user: string;
    text: string;
  }>;
}

const Home = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [newComment, setNewComment] = useState<string>('');
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);

  useEffect(() => {
    // Fetch all posts from the backend
    axios.get('http://localhost:5001/api/posts')
      .then((response) => {
        setPosts(response.data);
      })
      .catch((error) => {
        console.error('Error fetching posts:', error);
      });
  }, []);

  const handleCommentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewComment(event.target.value);
  };

  const handleCommentSubmit = async (event: React.FormEvent, postId: string) => {
    event.preventDefault();

    if (!newComment) {
      alert('Please enter a comment');
      return;
    }

    try {
      // Post the comment to the backend
      await axios.post(`http://localhost:5001/api/posts/${postId}/comments`, {
        userId: 'userIdPlaceholder', // Replace with the actual userId (could be from context or props)
        text: newComment,
      });

      // Update the state to reflect the new comment
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post._id === postId
            ? {
                ...post,
                comments: [...post.comments, { user: 'userIdPlaceholder', text: newComment }],
              }
            : post
        )
      );

      // Clear the comment input field
      setNewComment('');
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  return (
    <div>
      <h1>Posts</h1>
      {posts.map((post) => (
        <div key={post._id} className="post">
          <h2>{post.title}</h2>
          <p>{post.content}</p>
          <div>
            <h3>Comments</h3>
            <ul>
              {post.comments.map((comment, index) => (
                <li key={index}>
                  <strong>{comment.user}</strong>: {comment.text}
                </li>
              ))}
            </ul>
            <form
              onSubmit={(event) => handleCommentSubmit(event, post._id)}
              className="comment-form"
            >
              <input
                type="text"
                value={newComment}
                onChange={handleCommentChange}
                placeholder="Add a comment"
                required
              />
              <button type="submit">Add Comment</button>
            </form>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Home;