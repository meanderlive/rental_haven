import React, { useState } from "react";
import Navbar from "@/components/navbar";

const faqs = [
  {
    question: "How do I book a property?",
    answer: "Browse properties, select your favorite, and click 'Book Now'. Follow the instructions to complete your booking.",
  },
  {
    question: "How do I list my property?",
    answer: "Register as an owner, go to your dashboard, and click 'List Your Property'. Fill in the details and submit.",
  },
  {
    question: "Is my payment secure?",
    answer: "Yes, we use secure payment gateways and never store your card details.",
  },
  {
    question: "How do I contact support?",
    answer: "Use the contact form on the Contact Us page or email support@rentalhaven.in.",
  },
];

const HelpCenter: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="max-w-2xl mx-auto py-12 px-4">
        <h1 className="text-4xl font-bold mb-6 text-center text-red-600">Help Center</h1>
        <p className="mb-8 text-lg text-gray-700 text-center">Find answers to common questions and get support for using RentalHaven.</p>
        <div className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-red-500">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div key={idx} className="border rounded-lg">
                <button
                  className="w-full text-left px-4 py-3 font-semibold text-gray-800 focus:outline-none flex justify-between items-center"
                  onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                >
                  {faq.question}
                  <span>{openIndex === idx ? "-" : "+"}</span>
                </button>
                {openIndex === idx && (
                  <div className="px-4 pb-4 text-gray-600 bg-gray-50">{faq.answer}</div>
                )}
              </div>
            ))}
          </div>
        </div>
        <div className="bg-gray-100 rounded-lg p-6 text-center shadow">
          <h2 className="text-xl font-semibold mb-2 text-red-500">Need more help?</h2>
          <p className="mb-2">Contact our support team at <a href="mailto:support@rentalhaven.in" className="text-blue-600 underline">support@rentalhaven.in</a></p>
          <p>Or call us at <span className="font-semibold">+91 98765 43210</span></p>
        </div>
      </div>
    </div>
  );
};

export default HelpCenter; 