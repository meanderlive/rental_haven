import React from "react";
import Navbar from "@/components/navbar";

const Terms: React.FC = () => (
  <div className="min-h-screen bg-white">
    <Navbar />
    <div className="max-w-2xl mx-auto py-12 px-4">
      <h1 className="text-4xl font-bold mb-6 text-center text-red-600">Terms & Conditions</h1>
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-2 text-red-500">User Agreement</h2>
        <p className="mb-4 text-gray-700">By using this platform, you agree to our terms and conditions. Please read them carefully before using RentalHaven.</p>
        <ul className="list-disc list-inside text-gray-700 mb-4">
          <li>Use the platform responsibly and lawfully.</li>
          <li>Do not share your account credentials.</li>
          <li>Respect other users and their privacy.</li>
          <li>Report any suspicious activity to our support team.</li>
        </ul>
      </div>
      <div className="bg-gray-100 rounded-lg p-6 text-center shadow">
        <h2 className="text-xl font-semibold mb-2 text-red-500">Contact for Legal Queries</h2>
        <p>Email: <a href="mailto:legal@rentalhaven.in" className="text-blue-600 underline">legal@rentalhaven.in</a></p>
      </div>
    </div>
  </div>
);

export default Terms; 