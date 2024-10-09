import Image from "next/image";
import Link from "next/link";
import AppLogo from "@/components/logo";

const Footer = () => {
  return (
    <footer className="w-full flex items-center justify-center border-t mx-auto text-center text-s">
      <div className="w-full max-w-screen-xl mx-auto p-4 md:py-8">
        <div className="sm:flex sm:items-center sm:justify-between">
          <div className="justify-left">
            <AppLogo />
          </div>
          <ul className="flex flex-wrap items-center mb-6 text-sm font-medium text-gray-500 sm:mb-0 dark:text-gray-400">
            {/* <li>
              <a href="/about" className="hover:underline me-4 md:me-6">
                About
              </a>
            </li>
            <li>
              <a href="/privacy" className="hover:underline me-4 md:me-6">
                Privacy Policy
              </a>
            </li> 
            <li>
              <a href="/contact" className="hover:underline">
                Contact
              </a>
            </li>*/}
          </ul>
        </div>
        <hr className="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-8" />
        <span className="block text-sm text-gray-500 sm:text-center dark:text-gray-400">
          &copy; {new Date().getFullYear()} Regulation 365. All rights reserved.
        </span>
      </div>
    </footer>
  );
};

export default Footer;
