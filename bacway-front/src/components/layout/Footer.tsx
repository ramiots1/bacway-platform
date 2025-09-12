"use client";

import Link from 'next/link';
import React from 'react';
    
const Footer = () => {
  return (
    <footer className="w-full bg-[#171717] text-white">
      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Top: logo + tagline */}
        <div className="flex flex-col items-start md:flex-row md:justify-between gap-3 md:gap-0">
          <div className="flex items-center gap-3">
            <Link href="/" aria-label="Bacway home" className="inline-flex items-center">
              <img src="/logowhite.svg" alt="Bacway" className="h-5 w-auto" />
            </Link>
            <div className="text-sm text-gray-300 hidden md:block">Made with love in Algeria</div>
          </div>

          <div className="text-sm text-gray-300 md:hidden">Made with love in Algeria</div>
        </div>

        {/* Grid */}
        <div className="mt-15 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-white font-semibold mb-3">General</h3>
            <ul className="space-y-2 text-gray-300">
              <li>
                <Link href="/" className="hover:text-white transition-colors">Home</Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white transition-colors">About</Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-white transition-colors">Our Terms &amp; Conditions</Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-3">Collaboration</h3>
            <ul className="space-y-2 text-gray-300">
              <li>
                <Link href="/collabs" className="hover:text-white transition-colors">Collab</Link>
              </li>
              <li>
                <span className="text-sm text-gray-400">Looking to collaborate? Reach out and we'll connect.</span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-3">Contact us</h3>
            <ul className="space-y-2 text-gray-300">
              <li>
                <a href="https://instagram.com" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">Instagram</a>
              </li>
              <li>
                <a href="mailto:contact@bacway.dz" className="hover:text-white transition-colors">contact@bacway.dz</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-6 text-center text-xs text-gray-500">
          © {new Date().getFullYear()} Bacway. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
