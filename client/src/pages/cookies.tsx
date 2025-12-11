import React from "react";
import Navbar from "@/components/navbar";

const Cookies: React.FC = () => (
  <div className="min-h-screen bg-white">
    <Navbar />
    <div className="max-w-2xl mx-auto py-12 px-4">
      <h1 className="text-4xl font-bold mb-6 text-center text-red-600">Cookie Policy</h1>
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-2 text-red-500">Cookie Usage</h2>
        <p className="mb-4 text-gray-700">We use cookies to enhance your experience. You can manage your preferences in your browser settings.</p>
        <ul className="list-disc list-inside text-gray-700 mb-4">
          <li>Cookies help us remember your preferences and login state.</li>
          <li>We do not use cookies for advertising or tracking outside our platform.</li>
        </ul>
      </div>
      <div className="bg-gray-100 rounded-lg p-6 text-center shadow">
        <h2 className="text-xl font-semibold mb-2 text-red-500">Contact for Cookie Queries</h2>
        <p>Email: <a href="mailto:privacy@rentalhaven.in" className="text-blue-600 underline">privacy@rentalhaven.in</a></p>
      </div>
    </div>
  </div>
);

export default Cookies; 