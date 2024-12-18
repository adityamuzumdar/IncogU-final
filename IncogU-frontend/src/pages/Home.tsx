import React, { useState } from 'react';
import axios from 'axios';

const Home: React.FC = () => {
    const [posts, setPosts] = useState([]);
    const [newPost, setNewPost] = useState('');
    const [newComment, setNewComment] = useState('');
    const [commentingPostId, setCommentingPostId] = useState<string | null>(null);

    const fetchPosts = async () => {
        try {
            const res = await axios.get('http://localhost:5001/api/posts/posts');
            setPosts(res.data);
        } catch (error) {
            console.error('Error fetching posts:', error);
        }
    };

    const createPost = async () => {
        try {
            const res = await axios.post('http://localhost:5001/api/posts/posts', { content: newPost });
            setNewPost('');
            fetchPosts(); // Re-fetch posts after creating a new one
        } catch (error) {
            console.error('Error creating post:', error);
        }
    };

    const addComment = async () => {
        if (commentingPostId && newComment) {
            try {
                const res = await axios.post(`http://localhost:5001/api/posts/${commentingPostId}/comments`, { content: newComment });
                setNewComment('');
                setCommentingPostId(null);
                fetchPosts(); // Re-fetch posts after adding a comment
            } catch (error) {
                console.error('Error adding comment:', error);
            }
        }
    };

    return (
        <div>
            <h1>Yoo</h1>

            <div>
                <textarea
                    value={newPost}
                    onChange={(e) => setNewPost(e.target.value)}
                    placeholder="Write a new post"
                />
                <button onClick={createPost}>Create Post</button>
            </div>

            {posts.map((post: any) => (
                <div key={post._id}>
                    <p>{post.content}</p>
                    <button onClick={() => setCommentingPostId(post._id)}>Comment</button>

                    {commentingPostId === post._id && (
                        <div>
                            <textarea
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                placeholder="Write a comment"
                            />
                            <button onClick={addComment}>Add Comment</button>
                        </div>
                    )}

                    {post.comments && post.comments.map((comment: any, index: number) => (
                        <div key={index}>
                            <p>{comment.content}</p>
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
};

export default Home;