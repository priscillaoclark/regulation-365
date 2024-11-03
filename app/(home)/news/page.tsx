import Parser from "rss-parser";
import { notFound } from "next/navigation";
import RSSFeed from "@/components/rss";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

interface FeedItem {
  title: string;
  link: string;
  pubDate: string;
  contentSnippet: string;
  source: string;
  guid?: string;
  categories?: string[];
}

interface Feed {
  title: string;
  items: FeedItem[];
  lastBuildDate?: string;
  description?: string;
}

// Configuration object for RSS feeds
const RSS_FEEDS = [
  {
    url: "https://www.globalfinregblog.com/feed/",
    name: "Global Financial Regulatory Blog",
    category: "Legal",
  },
  {
    url: "https://www.morganlewis.com/rss/blogs?category=finreg&amp;top=15",
    name: "Morgan Lewis FinReg",
    category: "Legal",
  },
  {
    url: "https://www.gtlaw-financialservicesobserver.com/feed/",
    name: "GT Financial Services Observer",
    category: "Legal",
  },
  {
    url: "https://mco.mycomplianceoffice.com/blog/rss.xml",
    name: "MCO Compliance",
    category: "Professional Services",
  },
  {
    url: "https://www.globalcompliancenews.com/feed/",
    name: "Global Compliance News",
    category: "Professional Services",
  },
  {
    url: "https://www.consumerfinance.gov/about-us/newsroom/feed/",
    name: "CFPB Newsroom",
    category: "Regulator",
  },
  {
    url: "https://public.govdelivery.com/topics/USFDIC_26/feed.rss",
    name: "FDIC Updates",
    category: "Regulator",
  },
  {
    url: "https://www.federalreserve.gov/feeds/press_all.xml",
    name: "Federal Reserve Press Releases",
    category: "Regulator",
  },
  {
    url: "https://www.sec.gov/news/pressreleases.rss",
    name: "SEC Press Releases",
    category: "Regulator",
  },
] as const;

// Blacklist of titles to filter out
const BLACKLISTED_TITLES = [
  "Action Required: Confirm Your WSJ Newsletter",
  "Action Required: Set a password",
  // Add more blacklisted titles as needed
];

async function fetchFeed(
  feedConfig: (typeof RSS_FEEDS)[number]
): Promise<Feed | null> {
  try {
    const parser = new Parser({
      timeout: 5000, // 5 second timeout
      maxRedirects: 3,
      headers: {
        "User-Agent": "Regulation365/1.0 (https://regulation365.com)",
      },
    });

    const feed = await parser.parseURL(feedConfig.url);

    return {
      title: feed.title || feedConfig.name,
      description: feed.description,
      lastBuildDate: feed.lastBuildDate,
      items: feed.items
        .filter((item) => item.title && item.link) // Ensure required fields exist
        .map((item) => ({
          title: item.title!,
          link: item.link!,
          pubDate: item.pubDate || new Date().toISOString(),
          contentSnippet: item.contentSnippet || "No description available",
          source: feedConfig.name,
          guid: item.guid,
          categories: item.categories,
        })),
    };
  } catch (error) {
    console.error(`Error fetching ${feedConfig.name}:`, error);
    return null;
  }
}

async function fetchFeeds(): Promise<Feed[]> {
  // Fetch all feeds in parallel
  const feedPromises = RSS_FEEDS.map((feedConfig) => fetchFeed(feedConfig));
  const feeds = await Promise.allSettled(feedPromises);

  // Collect successful feeds
  const successfulFeeds = feeds
    .filter(
      (result): result is PromiseFulfilledResult<Feed | null> =>
        result.status === "fulfilled" && result.value !== null
    )
    .map((result) => result.value!);

  // Combine and process all items
  const allItems = successfulFeeds.flatMap((feed) => feed.items);

  // Filter and sort items
  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 2);

  const processedItems = allItems
    .filter((item) => {
      const pubDate = new Date(item.pubDate);
      return (
        pubDate > oneMonthAgo &&
        !BLACKLISTED_TITLES.some((title) => item.title.includes(title))
      );
    })
    .sort(
      (a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime()
    );

  if (processedItems.length === 0) {
    throw new Error("No recent items found in any feeds");
  }

  // Group items by category
  const itemsByCategory = RSS_FEEDS.reduce(
    (acc, feed) => {
      if (!acc[feed.category]) {
        acc[feed.category] = [];
      }
      const categoryItems = processedItems.filter(
        (item) => item.source === feed.name
      );
      acc[feed.category].push(...categoryItems);
      return acc;
    },
    {} as Record<string, FeedItem[]>
  );

  return Object.entries(itemsByCategory).map(([category, items]) => ({
    title: category,
    items: items,
  }));
}

export const revalidate = 3600; // Revalidate every hour

export default async function NewsPage() {
  let feeds: Feed[] = [];
  let error: Error | null = null;

  try {
    feeds = await fetchFeeds();
  } catch (e) {
    error = e instanceof Error ? e : new Error("Failed to fetch feeds");
    if (feeds.length === 0) {
      notFound();
    }
  }

  return (
    <div className="flex-1 w-full flex flex-col gap-6 p-4 md:gap-12 md:p-8 max-w-7xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="text-4xl">Regulatory News</CardTitle>
          <p className="text-muted-foreground mt-2">
            Current topics aggregated from regulators and trustworthy
            legal/professional services firms.
          </p>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Some feeds may be unavailable: {error.message}
              </AlertDescription>
            </Alert>
          )}
          <RSSFeed feeds={feeds} />
        </CardContent>
      </Card>
    </div>
  );
}
