import React, { useState } from "react";
import Navbar from "@/components/navbar";

const posts = [
  {
    title: "5 Tips for First-Time Renters in India",
    date: "April 2024",
    excerpt: "Discover essential tips to make your first rental experience smooth and stress-free.",
  },
  {
    title: "How to List Your Property Effectively",
    date: "March 2024",
    excerpt: "Learn how to attract more tenants and get the best value for your property.",
  },
];

const Blog: React.FC = () => {
  const [search, setSearch] = useState("");
  const filteredPosts = posts.filter(post => post.title.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="max-w-2xl mx-auto py-12 px-4">
        <h1 className="text-4xl font-bold mb-6 text-center text-red-600">RentalHaven Blog</h1>
        <input
          type="text"
          placeholder="Search blog posts..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2 mb-6"
        />
        <div className="space-y-6">
          {filteredPosts.length === 0 ? (
            <p className="text-gray-500 text-center">No blog posts found.</p>
          ) : (
            filteredPosts.map((post, idx) => (
              <div key={idx} className="bg-gray-100 rounded-lg p-6 shadow">
                <h2 className="font-bold text-xl mb-2 text-red-500">{post.title}</h2>
                <p className="text-gray-500 text-sm mb-2">{post.date}</p>
                <p className="text-gray-700 mb-2">{post.excerpt}</p>
                <button className="text-blue-600 underline">Read More</button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Blog; 