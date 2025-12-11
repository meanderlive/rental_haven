import React from "react";
import Navbar from "@/components/navbar";

const Sitemap: React.FC = () => (
  <div className="min-h-screen bg-white">
    <Navbar />
    <div className="max-w-2xl mx-auto py-12 px-4">
      <h1 className="text-4xl font-bold mb-6 text-center text-red-600">Sitemap</h1>
      <ul className="grid grid-cols-2 gap-4 list-none text-lg">
        <li><a href="/" className="text-blue-600 underline">Home</a></li>
        <li><a href="/properties" className="text-blue-600 underline">Properties</a></li>
        <li><a href="/about" className="text-blue-600 underline">About Us</a></li>
        <li><a href="/careers" className="text-blue-600 underline">Careers</a></li>
        <li><a href="/press" className="text-blue-600 underline">Press</a></li>
        <li><a href="/blog" className="text-blue-600 underline">Blog</a></li>
        <li><a href="/help-center" className="text-blue-600 underline">Help Center</a></li>
        <li><a href="/safety" className="text-blue-600 underline">Safety</a></li>
        <li><a href="/cancellation" className="text-blue-600 underline">Cancellation</a></li>
        <li><a href="/contact" className="text-blue-600 underline">Contact Us</a></li>
        <li><a href="/terms" className="text-blue-600 underline">Terms</a></li>
        <li><a href="/privacy" className="text-blue-600 underline">Privacy</a></li>
        <li><a href="/cookies" className="text-blue-600 underline">Cookies</a></li>
      </ul>
    </div>
  </div>
);

export default Sitemap; 