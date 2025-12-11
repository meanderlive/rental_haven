import React from "react";
import Navbar from "@/components/navbar";

const Press: React.FC = () => (
  <div className="min-h-screen bg-white">
    <Navbar />
    <div className="max-w-2xl mx-auto py-12 px-4">
      <h1 className="text-4xl font-bold mb-6 text-center text-red-600">Press</h1>
      <p className="mb-6 text-lg text-gray-700 text-center">Read the latest news and press releases about RentalHaven. For media inquiries, contact <a href="mailto:press@rentalhaven.in" className="text-blue-600 underline">press@rentalhaven.in</a>.</p>
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-red-500">Latest News</h2>
        <div className="bg-gray-100 rounded-lg p-6 shadow mb-4">
          <h3 className="font-bold text-lg">RentalHaven Launches New Platform</h3>
          <p className="text-gray-600">April 2024 - RentalHaven launches a new platform to make renting easier and more transparent across India.</p>
        </div>
        <div className="bg-gray-100 rounded-lg p-6 shadow mb-4">
          <h3 className="font-bold text-lg">RentalHaven Reaches 10,000 Users</h3>
          <p className="text-gray-600">March 2024 - We are proud to announce that we have reached 10,000 happy users!</p>
        </div>
      </div>
      <div className="bg-gray-100 rounded-lg p-6 text-center shadow">
        <h2 className="text-xl font-semibold mb-2 text-red-500">Media Contact</h2>
        <p>Email: <a href="mailto:press@rentalhaven.in" className="text-blue-600 underline">press@rentalhaven.in</a></p>
        <p>Phone: +91 98765 43210</p>
      </div>
    </div>
  </div>
);

export default Press; 