"use client";

import React from "react";
import { useEffect, useState } from "react";
import { BarChart, Calendar, FileText, Users, Tag } from "lucide-react";

interface DocumentRecord {
  doc_id: string;
  title: string;
  agencyId: string;
  documentType: string;
  postedDate: string;
  openForComment: string;
  commentStartDate: string;
  commentEndDate: string;
  topics: string;
  relevant: boolean;
}

interface AgencyCount {
  agencyId: string;
  count: number;
}

interface KeywordCount {
  keyword: string;
  count: number;
}

export default function OverviewPage() {
  const [data, setData] = useState<DocumentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [metrics, setMetrics] = useState({
    totalDocuments: 0,
    relevantDocuments: 0,
    uniqueAgencies: 0,
    recentDocuments: 0,
  });
  const [topAgencies, setTopAgencies] = useState<AgencyCount[]>([]);
  const [recentActivity, setRecentActivity] = useState<DocumentRecord[]>([]);
  const [topKeywords, setTopKeywords] = useState<KeywordCount[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/details");
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const result = await response.json();
        setData(result);
        calculateMetrics(result);
      } catch (error) {
        setError(error instanceof Error ? error.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const calculateMetrics = (documents: DocumentRecord[]) => {
    // Calculate basic metrics
    const now = new Date();
    const thirtyDaysAgo = new Date(now.setDate(now.getDate() - 30));

    // Count relevant documents
    const relevantDocs = documents.filter((doc) => doc.relevant).length;

    // Count unique agencies
    const uniqueAgencies = new Set(documents.map((doc) => doc.agencyId)).size;

    // Count recent documents
    const recent = documents.filter(
      (doc) => new Date(doc.postedDate) >= thirtyDaysAgo
    ).length;

    // Calculate top agencies
    const agencyCounts = documents.reduce(
      (acc: { [key: string]: number }, doc) => {
        acc[doc.agencyId] = (acc[doc.agencyId] || 0) + 1;
        return acc;
      },
      {}
    );

    const sortedAgencies = Object.entries(agencyCounts)
      .map(([agencyId, count]) => ({ agencyId, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Calculate top keywords from topics with improved cleaning
    const keywordCounts: { [key: string]: number } = {};
    const stopWords = new Set([
      "and",
      "the",
      "for",
      "with",
      "this",
      "that",
      "any",
      "from",
      "has",
      "have",
      "had",
      "not",
      "are",
      "were",
      "was",
      "our",
      "will",
      "all",
      "may",
    ]);

    documents.forEach((doc) => {
      if (doc.topics) {
        // Split topics into words, clean them, and normalize
        const words = doc.topics
          .toLowerCase()
          // Replace any special characters with spaces
          .replace(/[^a-z0-9\s]/g, " ")
          // Split on whitespace
          .split(/\s+/)
          // Clean and filter words
          .map((word) => word.trim())
          .filter(
            (word) =>
              word.length > 3 && // Filter out short words
              !stopWords.has(word) && // Filter out stop words
              /^[a-z0-9]+$/.test(word) // Ensure only alphanumeric characters
          );

        // Count each word
        words.forEach((word) => {
          keywordCounts[word] = (keywordCounts[word] || 0) + 1;
        });
      }
    });

    const sortedKeywords = Object.entries(keywordCounts)
      .map(([keyword, count]) => ({ keyword, count }))
      .sort((a, b) => {
        if (b.count !== a.count) {
          return b.count - a.count; // First sort by count
        }
        return a.keyword.localeCompare(b.keyword); // Then alphabetically for same count
      })
      .slice(0, 20);

    // Get recent activity
    const recentDocs = documents
      .sort(
        (a, b) =>
          new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime()
      )
      .slice(0, 5);

    setMetrics({
      totalDocuments: documents.length,
      relevantDocuments: relevantDocs,
      uniqueAgencies,
      recentDocuments: recent,
    });

    setTopAgencies(sortedAgencies);
    setRecentActivity(recentDocs);
    setTopKeywords(sortedKeywords);
  };

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  if (error) {
    return <div className="p-6 text-red-500">Error: {error}</div>;
  }

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="p-6 space-y-8 bg-gray-50 dark:bg-neutral-900">
      <h2 className="text-3xl font-bold dark:text-white">
        Federal Documents Dashboard
      </h2>

      {/* Key Statistics Section */}
      <section className="bg-white dark:bg-neutral-800 p-6 rounded-lg shadow-md">
        <h3 className="text-2xl font-semibold mb-4 dark:text-white">
          Key Metrics
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 bg-lime-400 rounded-lg shadow flex items-center justify-between">
            <div>
              <p className="text-sm opacity-80">Total Documents</p>
              <p className="text-2xl font-bold">
                {metrics.totalDocuments.toLocaleString()}
              </p>
            </div>
            <FileText size={32} className="opacity-80" />
          </div>
          <div className="p-6 bg-lime-400 rounded-lg shadow flex items-center justify-between">
            <div>
              <p className="text-sm opacity-80">Relevant Documents</p>
              <p className="text-2xl font-bold">
                {metrics.relevantDocuments.toLocaleString()}
              </p>
            </div>
            <BarChart size={32} className="opacity-80" />
          </div>
          <div className="p-6 bg-lime-400 rounded-lg shadow flex items-center justify-between">
            <div>
              <p className="text-sm opacity-80">Unique Agencies</p>
              <p className="text-2xl font-bold">
                {metrics.uniqueAgencies.toLocaleString()}
              </p>
            </div>
            <Users size={32} className="opacity-80" />
          </div>
          <div className="p-6 bg-lime-400 rounded-lg shadow flex items-center justify-between">
            <div>
              <p className="text-sm opacity-80">Last 30 Days</p>
              <p className="text-2xl font-bold">
                {metrics.recentDocuments.toLocaleString()}
              </p>
            </div>
            <Calendar size={32} className="opacity-80" />
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Top Agencies Section */}
        <section className="bg-white dark:bg-neutral-800 p-6 rounded-lg shadow-md">
          <h3 className="text-2xl font-semibold mb-4 dark:text-white">
            Top Agencies by Documents
          </h3>
          <div className="space-y-4">
            {topAgencies.map((agency, index) => (
              <div
                key={agency.agencyId}
                className="flex items-center justify-between p-4 bg-gray-50 dark:bg-neutral-700 rounded-lg"
              >
                <div className="flex items-center space-x-4">
                  <span className="text-2xl font-bold text-gray-400">
                    #{index + 1}
                  </span>
                  <span className="font-medium dark:text-white">
                    {agency.agencyId}
                  </span>
                </div>
                <span className="px-4 py-2 bg-lime-100 dark:bg-lime-900 text-lime-800 dark:text-lime-100 rounded-full">
                  {agency.count.toLocaleString()} docs
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Top Keywords Section */}
        <section className="bg-white dark:bg-neutral-800 p-6 rounded-lg shadow-md">
          <h3 className="text-2xl font-semibold mb-4 dark:text-white flex items-center gap-2">
            <Tag className="h-6 w-6" />
            Top 20 Keywords
          </h3>
          <div className="flex flex-wrap gap-3">
            {topKeywords.map((keyword) => (
              <div
                key={keyword.keyword}
                className="inline-flex items-center px-4 py-2 rounded-full bg-gray-100 dark:bg-neutral-700"
              >
                <span className="font-medium text-gray-900 dark:text-white">
                  {keyword.keyword}
                </span>
                <span className="ml-2 px-2 py-1 text-sm rounded-full bg-lime-100 dark:bg-lime-900 text-lime-800 dark:text-lime-100">
                  {keyword.count}
                </span>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Recent Activity Section */}
      <section className="bg-white dark:bg-neutral-800 p-6 rounded-lg shadow-md">
        <h3 className="text-2xl font-semibold mb-4 dark:text-white">
          Recent Documents
        </h3>
        <div className="space-y-4">
          {recentActivity.map((doc) => (
            <div
              key={doc.doc_id}
              className="p-4 bg-gray-50 dark:bg-neutral-700 rounded-lg"
            >
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <h4 className="font-medium dark:text-white">{doc.title}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Agency: {doc.agencyId} | Type: {doc.documentType}
                  </p>
                </div>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {formatDate(doc.postedDate)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
