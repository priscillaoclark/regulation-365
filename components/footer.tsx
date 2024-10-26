import Image from "next/image";
import Link from "next/link";
import AppLogo from "@/components/logo";

const Footer = () => {
  return (
    <footer className="w-full">
      <div className="w-full mx-auto p-4 md:py-12">
        <span className="block text-sm text-gray-500 text-center dark:text-gray-400">
          &copy; {new Date().getFullYear()} Regulation 365. All rights reserved.
        </span>
      </div>
    </footer>
  );
};

export default Footer;
