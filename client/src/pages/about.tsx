import React from "react";
import Navbar from "@/components/navbar";

const About: React.FC = () => (
  <div className="min-h-screen bg-white">
    <Navbar />
    <div className="max-w-3xl mx-auto py-12 px-4">
      <h1 className="text-4xl font-bold mb-6 text-center text-red-600">About RentalHaven</h1>
      <p className="mb-6 text-lg text-gray-700 text-center">
        RentalHaven is dedicated to making property rental easy, transparent, and accessible for everyone in India. We connect tenants and property owners with a seamless, secure, and user-friendly platform.
      </p>
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-2 text-red-500">Our Mission</h2>
        <p className="mb-4 text-gray-700">To empower people to find their perfect rental home with trust and convenience, leveraging technology and local expertise.</p>
        <h2 className="text-2xl font-semibold mb-2 text-red-500">Our Vision</h2>
        <p className="mb-4 text-gray-700">To be India's most trusted and innovative rental platform, building communities and making renting joyful for all.</p>
      </div>
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-red-500">Meet Our Team</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="bg-gray-100 rounded-lg p-6 text-center shadow">
            <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="Founder" className="w-20 h-20 rounded-full mx-auto mb-2" />
            <h3 className="font-bold text-lg">Amit Sharma</h3>
            <p className="text-gray-600">Founder & CEO</p>
          </div>
          <div className="bg-gray-100 rounded-lg p-6 text-center shadow">
            <img src="https://randomuser.me/api/portraits/women/44.jpg" alt="CTO" className="w-20 h-20 rounded-full mx-auto mb-2" />
            <h3 className="font-bold text-lg">Priya Singh</h3>
            <p className="text-gray-600">Chief Technology Officer</p>
          </div>
        </div>
      </div>
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-2 text-red-500">Our Values</h2>
        <ul className="list-disc list-inside text-gray-700">
          <li>Transparency</li>
          <li>Customer Focus</li>
          <li>Innovation</li>
          <li>Integrity</li>
          <li>Community</li>
        </ul>
      </div>
      <div className="text-center mt-10">
        <span className="inline-block bg-red-100 text-red-600 px-6 py-2 rounded-full font-semibold">Whether you are a property owner or a tenant, RentalHaven is here to help you every step of the way.</span>
      </div>
    </div>
  </div>
);

export default About; 