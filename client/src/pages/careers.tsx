import React, { useState } from "react";
import Navbar from "@/components/navbar";

const Careers: React.FC = () => {
  const [form, setForm] = useState({ name: "", email: "", position: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="max-w-3xl mx-auto py-12 px-4">
        <h1 className="text-4xl font-bold mb-6 text-center text-red-600">Careers at RentalHaven</h1>
        <p className="mb-6 text-lg text-gray-700 text-center">Join our mission to revolutionize the rental market in India! We are always looking for talented, passionate people to join our team.</p>
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-red-500">Open Positions</h2>
          <div className="bg-gray-100 rounded-lg p-6 shadow mb-4">
            <h3 className="font-bold text-lg">Frontend Developer</h3>
            <p className="text-gray-600">React, TypeScript, Tailwind CSS</p>
            <span className="inline-block bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs mt-2">Remote</span>
          </div>
          <div className="bg-gray-100 rounded-lg p-6 shadow mb-4">
            <h3 className="font-bold text-lg">Backend Developer</h3>
            <p className="text-gray-600">Java, Spring Boot, PostgreSQL</p>
            <span className="inline-block bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs mt-2">Bangalore</span>
          </div>
        </div>
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-red-500">Our Culture</h2>
          <ul className="list-disc list-inside text-gray-700 mb-4">
            <li>Flexible work hours & remote options</li>
            <li>Inclusive and diverse team</li>
            <li>Continuous learning and growth</li>
            <li>Fun team events and hackathons</li>
          </ul>
        </div>
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-red-500">Apply Now</h2>
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
            <select
              name="position"
              value={form.position}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
              required
            >
              <option value="">Select Position</option>
              <option value="Frontend Developer">Frontend Developer</option>
              <option value="Backend Developer">Backend Developer</option>
            </select>
            <textarea
              name="message"
              placeholder="Why do you want to join us?"
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
              Submit Application
            </button>
            {submitted && <p className="text-green-600 mt-2">Thank you for applying! We'll get in touch soon.</p>}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Careers; 