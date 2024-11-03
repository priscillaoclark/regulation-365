"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type FeedItem = {
  title: string;
  link: string;
  pubDate: string;
  contentSnippet: string;
  source: string;
  sourceTitle?: string;
  dateObj?: Date;
};

type Feed = {
  title: string;
  items: FeedItem[];
};

interface RSSFeedProps {
  feeds: Feed[];
}

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  startIndex: number;
  endIndex: number;
  onPageChange: (page: number) => void;
}

const ITEMS_PER_PAGE = 10;

// Source mapping configuration
const SOURCE_MAPPING = {
  MORGAN_LEWIS: {
    url: "morganlewis",
    name: "All Things FinReg (Morgan Lewis)",
  },
  LATHAM: {
    url: "globalfinregblog",
    name: "Global Financial Regulatory Blog (Latham & Watkins LLP)",
  },
  GREENBERG: {
    url: "gtlaw-financialservicesobserver",
    name: "Financial Services Observer (Greenberg Traurig)",
  },
  MCO: {
    url: "mycomplianceoffice",
    name: "MyComplianceOffice Blog",
  },
  BAKER: {
    url: "globalcompliancenews",
    name: "Global Compliance News (Baker McKenzie)",
  },
  DELOITTE: {
    url: "wwqqjxqkqqvdy67ypt4s",
    name: "Risk & Compliance Journal (Deloitte / WSJ)",
  },
  CFPB: {
    url: "consumerfinance.gov",
    name: "Consumer Financial Protection Bureau (CFPB)",
  },
  FDIC: {
    url: "USFDIC",
    name: "Federal Deposit Insurance Corporation (FDIC)",
  },
  FRB: {
    url: "federalreserve",
    name: "Federal Reserve Board (FRB)",
  },
  OCC: {
    url: "occ.gov",
    name: "Office of the Comptroller of the Currency (OCC)",
  },
  SEC: {
    url: "sec.gov",
    name: "Securities and Exchange Commission (SEC)",
  },
} as const;

// Function to get source name from link
const getSourceFromLink = (link: string): string => {
  const sourceEntry = Object.values(SOURCE_MAPPING).find((source) =>
    link.toLowerCase().includes(source.url.toLowerCase())
  );
  return sourceEntry?.name || "Unknown Source";
};

// Format date for display
const formatDate = (dateString: string): string => {
  try {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch (error) {
    console.error("Invalid date:", dateString);
    return "Invalid Date";
  }
};

const PaginationControls: React.FC<PaginationControlsProps> = ({
  currentPage,
  totalPages,
  totalItems,
  startIndex,
  endIndex,
  onPageChange,
}) => {
  if (totalPages <= 1) return null;

  return (
    <div className="flex flex-col sm:flex-row justify-between items-center gap-4 py-4 px-2">
      <div className="text-sm text-muted-foreground order-2 sm:order-1">
        Showing {startIndex + 1}-{Math.min(endIndex, totalItems)} of{" "}
        {totalItems} items
      </div>

      <div className="flex items-center gap-2 order-1 sm:order-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Previous
        </Button>

        <div className="hidden sm:flex items-center gap-2 mx-4">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
            if (
              page === 1 ||
              page === totalPages ||
              (page >= currentPage - 1 && page <= currentPage + 1)
            ) {
              return (
                <Button
                  key={page}
                  variant={currentPage === page ? "default" : "outline"}
                  size="sm"
                  onClick={() => onPageChange(page)}
                  className={
                    currentPage === page ? "bg-lime-500 hover:bg-lime-600" : ""
                  }
                >
                  {page}
                </Button>
              );
            } else if (page === currentPage - 2 || page === currentPage + 2) {
              return (
                <span key={page} className="px-2">
                  ...
                </span>
              );
            }
            return null;
          })}
        </div>

        <div className="sm:hidden flex items-center gap-2 mx-2">
          <span className="text-sm text-muted-foreground">
            Page {currentPage} of {totalPages}
          </span>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
          <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </div>
    </div>
  );
};

const RSSFeed: React.FC<RSSFeedProps> = ({ feeds }) => {
  const [currentPage, setCurrentPage] = useState(1);

  // Process and sort all items
  const sortedItems = useMemo(() => {
    const items = feeds.flatMap((feed) =>
      feed.items.map((item) => ({
        ...item,
        sourceTitle: feed.title,
        dateObj: new Date(item.pubDate),
      }))
    );

    // Filter out invalid dates and sort
    return items
      .filter((item) => !isNaN(item.dateObj!.getTime()))
      .sort((a, b) => b.dateObj!.getTime() - a.dateObj!.getTime());
  }, [feeds]);

  const totalPages = Math.ceil(sortedItems.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentItems = sortedItems.slice(startIndex, endIndex);

  const goToPage = (page: number) => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setCurrentPage(page);
  };

  if (feeds.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No RSS feeds available at the moment.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Pagination */}
      <Card>
        <CardContent>
          <PaginationControls
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={sortedItems.length}
            startIndex={startIndex}
            endIndex={endIndex}
            onPageChange={goToPage}
          />
        </CardContent>
      </Card>

      {/* Items Display */}
      <div className="space-y-4">
        {currentItems.map((item, index) => (
          <Card key={`${item.link}-${index}`} className="overflow-hidden">
            <CardContent className="p-6">
              <Link
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="group block"
                aria-label={`Read more about ${item.title}`}
              >
                <h3 className="text-2xl font-semibold mb-2 text-lime-500 group-hover:text-lime-600 group-hover:underline transition-colors">
                  {item.title}
                </h3>
              </Link>

              <div className="flex flex-col space-y-2 mb-4 text-sm text-muted-foreground">
                <time dateTime={item.pubDate}>{formatDate(item.pubDate)}</time>
                <div>Source: {getSourceFromLink(item.link)}</div>
              </div>

              <p className="leading-relaxed text-muted-foreground">
                {item.contentSnippet.replace(/... Continue Reading/g, "... ")}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Bottom Pagination */}
      <Card>
        <CardContent>
          <PaginationControls
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={sortedItems.length}
            startIndex={startIndex}
            endIndex={endIndex}
            onPageChange={goToPage}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default RSSFeed;
