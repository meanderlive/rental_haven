import React from "react";
import { Link } from "wouter";

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-gray-100 py-10 mt-10">
      <div className="container mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8">
        {/* About */}
        <div>
          <h2 className="text-lg font-bold mb-2">RentalHaven</h2>
          <p className="text-sm">
            RentalHaven is your trusted platform for finding the best rental properties across India. Our mission is to make renting easy, transparent, and accessible for everyone.
          </p>
        </div>
        {/* Company */}
        <div>
          <h2 className="text-lg font-bold mb-2">Company</h2>
          <ul className="space-y-1">
            <li><Link href="/about" className="hover:underline">About Us</Link></li>
            <li><Link href="/careers" className="hover:underline">Careers</Link></li>
            <li><Link href="/press" className="hover:underline">Press</Link></li>
            <li><Link href="/blog" className="hover:underline">Blog</Link></li>
          </ul>
        </div>
        {/* Support */}
        <div>
          <h2 className="text-lg font-bold mb-2">Support</h2>
          <ul className="space-y-1">
            <li><Link href="/help-center" className="hover:underline">Help Center</Link></li>
            <li><Link href="/safety" className="hover:underline">Safety</Link></li>
            <li><Link href="/cancellation" className="hover:underline">Cancellation</Link></li>
            <li><Link href="/contact" className="hover:underline">Contact Us</Link></li>
          </ul>
        </div>
        {/* Legal & Sitemap */}
        <div>
          <h2 className="text-lg font-bold mb-2">Legal</h2>
          <ul className="space-y-1">
            <li><Link href="/terms" className="hover:underline">Terms</Link></li>
            <li><Link href="/privacy" className="hover:underline">Privacy</Link></li>
            <li><Link href="/cookies" className="hover:underline">Cookies</Link></li>
            <li><Link href="/sitemap" className="hover:underline">Sitemap</Link></li>
          </ul>
        </div>
      </div>
      <div className="text-center text-gray-400 text-xs mt-8">&copy; {new Date().getFullYear()} RentalHaven. All rights reserved.</div>
    </footer>
  );
};

export default Footer; 