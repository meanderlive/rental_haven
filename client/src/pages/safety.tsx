import React from "react";
import Navbar from "@/components/navbar";

const Safety: React.FC = () => (
  <div className="min-h-screen bg-white">
    <Navbar />
    <div className="max-w-2xl mx-auto py-12 px-4">
      <h1 className="text-4xl font-bold mb-6 text-center text-red-600">Safety</h1>
      <p className="mb-6 text-lg text-gray-700 text-center">Your safety is our priority. Learn how to stay safe while renting or listing properties on RentalHaven.</p>
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-red-500">Safety Tips</h2>
        <ul className="list-disc list-inside text-gray-700 mb-4">
          <li>Always verify property details and owner credentials before making payments.</li>
          <li>Never make payments outside the RentalHaven platform.</li>
          <li>Meet in safe, public places for property visits.</li>
          <li>Report any suspicious activity to our support team.</li>
        </ul>
      </div>
      <div className="bg-gray-100 rounded-lg p-6 text-center shadow">
        <h2 className="text-xl font-semibold mb-2 text-red-500">Report a Problem</h2>
        <p className="mb-2">If you encounter any issues or suspicious listings, please contact us at <a href="mailto:support@rentalhaven.in" className="text-blue-600 underline">support@rentalhaven.in</a></p>
        <p>Or call us at <span className="font-semibold">+91 98765 43210</span></p>
      </div>
    </div>
  </div>
);

export default Safety; 