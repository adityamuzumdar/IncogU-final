import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

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

interface User {
  username: string;
  university: string;
}

export default function University() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error("Error parsing user data from localStorage:", error);
      }
    }
  }, []);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get<Post[]>(
          "http://localhost:5001/api/posts"
        );
        if (user) {
          const filteredPosts = response.data.filter(
            (post) => post.user?.university === user.university
          );
          setPosts(filteredPosts);
        }
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    if (user) fetchPosts();
  }, [user]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="container mx-auto py-12 px-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">{user?.university} Posts</h2>
        {posts.length === 0 ? (
          <p className="text-center text-gray-600">No posts available.</p>
        ) : (
          posts.map((post) => (
            <div
              key={post._id}
              className="bg-white p-6 mb-6 rounded-lg shadow-md"
            >
              <h3 className="text-xl font-bold text-gray-800">{post.title}</h3>
              <p className="text-gray-700 mt-2">{post.content}</p>
              <p className="text-sm text-gray-500 mt-4">
                Posted by: {post.user?.username || "Anonymous"}
              </p>
              <p className="text-sm text-gray-500">
                University: {post.user?.university || "Unknown"}
              </p>
              <Link
                to={`/post/${post._id}`}
                className="text-indigo-600 hover:underline"
              >
                View Post
              </Link>
            </div>
          ))
        )}
      </div>
    </div>
  );
}