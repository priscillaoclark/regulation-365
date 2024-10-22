// app/page.tsx
import Parser from "rss-parser";
import RSSFeed from "@/components/rss"; // Import the RSSFeed component

// Define the structure of the RSS items
interface FeedItem {
  title: string;
  link: string;
  pubDate: string;
  contentSnippet: string;
  source: string; // Add the source property
}

interface Feed {
  title: string;
  items: FeedItem[];
}

// Server-side fetching happens here in the Server Component
async function fetchFeeds(): Promise<Feed[]> {
  const parser = new Parser();
  const urls = [
    "https://www.globalfinregblog.com/feed/",
    "https://www.morganlewis.com/rss/blogs?category=finreg&amp;top=15",
    "https://www.gtlaw-financialservicesobserver.com/feed/",
    "https://mco.mycomplianceoffice.com/blog/rss.xml",
    "https://www.globalcompliancenews.com/feed/",
  ];

  const feeds = await Promise.all(
    urls.map(async (url) => {
      const feed = await parser.parseURL(url);
      return {
        title: feed.title || "No Title",
        items: feed.items.map((item) => ({
          title: item.title || "No Title",
          link: item.link || "#",
          pubDate: item.pubDate || "Unknown Date",
          contentSnippet: item.contentSnippet || "No Description",
        })),
      };
    })
  );

  // Combine all feed items into a single array with source title
  const allItems = feeds.flatMap((feed) =>
    feed.items.map((item) => ({
      ...item,
      source: feed.title,
    }))
  );

  // Sort the combined items by publication date in descending order
  allItems.sort(
    (a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime()
  );

  // Remove anything older than 3 months
  const threeMonthsAgo = new Date();
  threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
  allItems.filter((item) => new Date(item.pubDate) > threeMonthsAgo);

  // Filter out specific titles
  allItems.filter(
    (item) =>
      !item.title.includes("Action Required: Confirm Your WSJ Newsletter") &&
      !item.title.includes("Action Required: Set a password")
  );

  // Return filtered and sorted items
  return [
    {
      title: "Combined Feed",
      items: allItems,
    },
  ];
}

export default async function Home() {
  const feeds = await fetchFeeds(); // Fetch feeds on the server

  return (
    <div className="flex-1 w-full flex flex-col gap-6 p-4 md:gap-12 md:p-8 max-w-full mx-auto">
      <div className="w-full">
        <h1 className="text-4xl font-bold mb-6">Regulatory News</h1>
        <p>
          Current topics aggregated from trustworthy legal and professional
          services firms.
        </p>
        <hr className="w-full border-t-2 border-gray-300 mt-6 mb-6" />
        {/* Pass the fetched RSS feeds as props to the RSSFeed component */}
        <RSSFeed feeds={feeds} />
      </div>
    </div>
  );
}
