import React from "react";
import Navbar from "@/components/navbar";

const Privacy: React.FC = () => (
  <div className="min-h-screen bg-white">
    <Navbar />
    <div className="max-w-2xl mx-auto py-12 px-4">
      <h1 className="text-4xl font-bold mb-6 text-center text-red-600">Privacy Policy</h1>
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-2 text-red-500">Policy Overview</h2>
        <p className="mb-4 text-gray-700">Your privacy is important to us. We do not share your personal information with third parties without your consent.</p>
        <ul className="list-disc list-inside text-gray-700 mb-4">
          <li>We collect only necessary information for providing our services.</li>
          <li>Your data is stored securely and encrypted where possible.</li>
          <li>You can request deletion of your data at any time.</li>
        </ul>
      </div>
      <div className="bg-gray-100 rounded-lg p-6 text-center shadow">
        <h2 className="text-xl font-semibold mb-2 text-red-500">Contact for Privacy Queries</h2>
        <p>Email: <a href="mailto:privacy@rentalhaven.in" className="text-blue-600 underline">privacy@rentalhaven.in</a></p>
      </div>
    </div>
  </div>
);

export default Privacy; 