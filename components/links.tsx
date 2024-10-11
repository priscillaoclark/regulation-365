"use client";

import { useState } from "react";
import Link from "next/link";

const Links = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleLinks = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative">
      {/* Links - visible on larger screens, collapsible on mobile */}
      <div
        className={`${
          isOpen ? "block" : "hidden"
        } md:flex flex-col md:flex-row md:space-x-4 mt-2 md:mt-0 absolute md:relative bg-lime-400 md:bg-transparent w-full md:w-auto right-0 z-50`}
      >
        <Link
          href="/news"
          className="block px-4 py-2 md:inline-block hover:text-gray-400"
        >
          Regulatory News
        </Link>
        <Link
          href="/ea"
          className="block px-4 py-2 md:inline-block hover:text-gray-400"
        >
          Recent Enforcement Actions
        </Link>
      </div>
    </div>
  );
};

export default Links;
