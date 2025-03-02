import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../AuthProvider";

const Header: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const { logout, isAuthenticated } = useAuth();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement search functionality
    console.log("Search query:", searchQuery);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <>
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center">
              <span className="text-2xl font-bold text-indigo-600">IncogU</span>
            </Link>

            {isAuthenticated && (
              <>
                {/* Search Bar */}
                <form onSubmit={handleSearch} className="flex-1 max-w-2xl mx-8">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                    <button
                      type="submit"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2"
                    >
                      <svg
                        className="h-5 w-5 text-gray-400"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path d="M21 21l-6-6m2-5a7 7 7 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </button>
                  </div>
                </form>

                {/* Navigation Links and Actions */}
                <nav className="flex items-center space-x-6">
                  <Link
                    to="/university"
                    className="px-4 py-2 text-sm font-medium"
                  >
                    Uni
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-full hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-400"
                  >
                    Logout
                  </button>
                </nav>
              </>
            )}
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
