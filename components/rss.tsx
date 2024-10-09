// components/RSSFeed.tsx
"use client"; // Mark this component as a Client Component

import React from "react";

// Define the structure of the RSS items
type FeedItem = {
  title: string;
  link: string;
  pubDate: string;
  contentSnippet: string;
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
  return (
    <div>
      {feeds.map((feed, index) => (
        <div key={index}>
          <ul>
            {feed.items.map((item, i) => (
              <li key={i}>
                <a href={item.link} target="_blank" rel="noopener noreferrer">
                  <h3 className="text-xl font-bold">{item.title}</h3>
                </a>
                <p>{new Date(item.pubDate).toLocaleDateString()}</p>
                <p>
                  {item.contentSnippet.replace(/... Continue Reading/g, "... ")}
                  <br></br>
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline text-lime-400"
                  >
                    {" "}
                    Continue Reading
                  </a>
                </p>
                <p className="italic text-xs mb-6 mt-3 border-b border-lime-400">
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
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default RSSFeed;
