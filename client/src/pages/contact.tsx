import React, { useState } from "react";
import Navbar from "@/components/navbar";

const Contact: React.FC = () => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="max-w-xl mx-auto py-12 px-4">
        <h1 className="text-4xl font-bold mb-6 text-center text-red-600">Contact Us</h1>
        <p className="mb-6 text-lg text-gray-700 text-center">Have questions or feedback? Fill out the form below or reach us directly.</p>
        <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded shadow">
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            value={form.name}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Your Email"
            value={form.email}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
            required
          />
          <textarea
            name="message"
            placeholder="Your Message"
            value={form.message}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
            rows={4}
            required
          />
          <button
            type="submit"
            className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700 transition"
          >
            Send Message
          </button>
          {submitted && <p className="text-green-600 mt-2">Thank you for contacting us!</p>}
        </form>
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-2 text-red-500">Contact Information</h2>
          <p>Email: support@rentalhaven.in</p>
          <p>Phone: +91 98765 43210</p>
          <p>Address: 123, Main Street, Mumbai, India</p>
          <div className="mt-4">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 mr-4">Facebook</a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-blue-400 mr-4">Twitter</a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-pink-500">Instagram</a>
          </div>
        </div>
        <div className="mt-8">
          <iframe
            title="RentalHaven Location"
            src="https://www.openstreetmap.org/export/embed.html?bbox=72.8777%2C19.0760%2C72.8777%2C19.0760&amp;layer=mapnik"
            className="w-full h-64 rounded-lg border"
            allowFullScreen
          ></iframe>
        </div>
      </div>
    </div>
  );
};

export default Contact; 