import React from 'react';
import { FaInstagram, FaTwitter, FaFacebook } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-black text-gray-400 px-12 py-8 mt-12">
      <div className="max-w-[1800px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company */}
          <div>
            <h3 className="text-white font-bold mb-4">Company</h3>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-white">About</a></li>
              <li><a href="#" className="hover:text-white">Jobs</a></li>
              <li><a href="#" className="hover:text-white">For the Record</a></li>
            </ul>
          </div>

          {/* Communities */}
          <div>
            <h3 className="text-white font-bold mb-4">Communities</h3>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-white">For Artists</a></li>
              <li><a href="#" className="hover:text-white">Developers</a></li>
              <li><a href="#" className="hover:text-white">Advertising</a></li>
              <li><a href="#" className="hover:text-white">Investors</a></li>
              <li><a href="#" className="hover:text-white">Vendors</a></li>
            </ul>
          </div>

          {/* Useful links */}
          <div>
            <h3 className="text-white font-bold mb-4">Useful links</h3>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-white">Support</a></li>
              <li><a href="#" className="hover:text-white">Free Mobile App</a></li>
              <li><a href="#" className="hover:text-white">Spotify Plans</a></li>
            </ul>
          </div>

          {/* Spotify Plans */}
          <div>
            <h3 className="text-white font-bold mb-4">Spotify Plans</h3>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-white">Premium Individual</a></li>
              <li><a href="#" className="hover:text-white">Premium Duo</a></li>
              <li><a href="#" className="hover:text-white">Premium Family</a></li>
              <li><a href="#" className="hover:text-white">Premium Student</a></li>
              <li><a href="#" className="hover:text-white">Spotify Free</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex space-x-6 mb-4 md:mb-0">
              <a href="#" className="hover:text-white"><FaInstagram size={24} /></a>
              <a href="#" className="hover:text-white"><FaTwitter size={24} /></a>
              <a href="#" className="hover:text-white"><FaFacebook size={24} /></a>
            </div>
            <div className="text-sm">
              <div className="flex flex-wrap gap-4 justify-center md:justify-end">
                <a href="#" className="hover:text-white">Legal</a>
                <a href="#" className="hover:text-white">Safety & Privacy Center</a>
                <a href="#" className="hover:text-white">Privacy Policy</a>
                <a href="#" className="hover:text-white">Cookies</a>
                <a href="#" className="hover:text-white">About Ads</a>
                <a href="#" className="hover:text-white">Accessibility</a>
              </div>
              <p className="mt-4 text-center md:text-right">© 2025 Spotify AB</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;