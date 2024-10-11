// components/RSSFeed.tsx
"use client"; // Mark this component as a Client Component

import React, { useState, useEffect } from "react";
import Link from "next/link";

// Define the structure of the RSS items
type FeedItem = {
  title: string;
  link: string;
  pubDate: string;
  contentSnippet: string;
  source: string;
};

type Feed = {
  title: string;
  items: FeedItem[];
};

// Component Props
interface RSSFeedProps {
  feeds: Feed[];
}

// RSSFeed component to display the feeds
const RSSFeed: React.FC<RSSFeedProps> = ({ feeds }) => {
  const [darkMode, setDarkMode] = useState<boolean>(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      setDarkMode(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    if (!darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  if (feeds.length === 0) {
    return <p>No RSS feeds available at the moment.</p>;
  }

  return (
    <div className="flex flex-col min-h-screen w-full p-4 bg-gray-100 dark:bg-gray-900">
      <div className="w-full h-full">
        {feeds.map((feed, index) => (
          <div key={index} className="mb-8">
            {feed.items.map((item, i) => (
              <div
                key={i}
                className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-md rounded-lg p-6 mb-4"
              >
                <Link
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-blue-700"
                  aria-label={`Read more about ${item.title}`}
                >
                  <h3 className="text-2xl font-semibold mb-2 text-lime-500 hover:underline">
                    {item.title}
                  </h3>
                </Link>
                <p className="text-sm text-gray-500 mb-2">
                  {new Date(item.pubDate).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
                <p className="text-sm text-gray-500 mb-2">
                  {" "}
                  Source:{" "}
                  {feed.title === "Blogs" || item.link.includes("morganlewis")
                    ? "All Things FinReg (Morgan Lewis)"
                    : feed.title === "Global Financial Regulatory Blog" ||
                        item.link.includes("globalfinregblog")
                      ? "Global Financial Regulatory Blog (Latham & Watkins LLP)"
                      : feed.title === "Financial Services Observer" ||
                          item.link.includes("gtlaw-financialservicesobserver")
                        ? "Financial Services Observer (Greenberg Traurig)"
                        : feed.title === "MyComplianceOffice Blog" ||
                            item.link.includes("mycomplianceoffice")
                          ? "MyComplianceOffice Blog"
                          : feed.title === "Global Compliance News" ||
                              item.link.includes("globalcompliancenews")
                            ? "Global Compliance News (Baker McKenzie)"
                            : "N/A"}
                </p>
                <p className="leading-relaxed mb-4">
                  {item.contentSnippet.replace(/... Continue Reading/g, "... ")}
                </p>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default RSSFeed;
