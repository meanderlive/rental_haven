import React from "react";
import Navbar from "@/components/navbar";

const Cancellation: React.FC = () => (
  <div className="min-h-screen bg-white">
    <Navbar />
    <div className="max-w-2xl mx-auto py-12 px-4">
      <h1 className="text-4xl font-bold mb-6 text-center text-red-600">Cancellation Policy</h1>
      <p className="mb-6 text-lg text-gray-700 text-center">Learn about our cancellation policy for both tenants and property owners.</p>
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-red-500">Policy Details</h2>
        <ul className="list-disc list-inside text-gray-700 mb-4">
          <li>Free cancellation within 24 hours of booking.</li>
          <li>50% refund if cancelled up to 7 days before move-in date.</li>
          <li>No refund if cancelled within 7 days of move-in date.</li>
        </ul>
      </div>
      <div className="bg-gray-100 rounded-lg p-6 text-center shadow">
        <h2 className="text-xl font-semibold mb-2 text-red-500">Need Help?</h2>
        <p className="mb-2">Contact our support team at <a href="mailto:support@rentalhaven.in" className="text-blue-600 underline">support@rentalhaven.in</a></p>
        <p>Or call us at <span className="font-semibold">+91 98765 43210</span></p>
      </div>
    </div>
  </div>
);

export default Cancellation; 