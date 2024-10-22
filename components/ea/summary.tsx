import { useEffect, useState } from "react";
import Link from "next/link";
import ReactMarkdown from "react-markdown"; // Import react-markdown
import remarkGfm from "remark-gfm"; // Optional: adds support for GitHub Flavored Markdown (tables, task lists, etc.)
import BarChart from "./summary-chart1"; // Import the BarChart component

interface SummaryRecord {
  agency: string;
  date: string;
  url: string;
  title: string;
  type: string;
  entity: string;
  sum: string;
  year: string;
  month: string;
}

const summary_client = () => {
  const [data, setData] = useState<SummaryRecord[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/ea/summary");
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const result = await response.json();
        setData(result);
      } catch (error) {
        setError((error as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="loader">Loading...</div>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-600 text-center">Error: {error}</div>;
  }

  if (data.length === 0) {
    return <div>No data available.</div>;
  }

  // Aggregate data by both year and month for the bar chart
  const aggregatedData = data.reduce((acc: Record<string, number>, curr) => {
    // Ensure month is treated as a string and pad with zero if necessary
    const yearMonth = `${curr.year}-${String(curr.month).padStart(2, "0")}`;
    acc[yearMonth] = (acc[yearMonth] || 0) + 1;
    return acc;
  }, {});

  const barChartData = Object.keys(aggregatedData).map((yearMonth) => ({
    yearMonth,
    count: aggregatedData[yearMonth],
  }));

  return (
    <div className="p-4 bg-neutral-100 dark:bg-neutral-900">
      <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 gap-4">
        <div className="w-full">
          <div className="p-4 bg-white dark:bg-neutral-800 rounded shadow h-full">
            <h3 className="text-xl font-semibold mb-2 dark:text-white">
              2024 EAs by Agency
            </h3>
            <p className="text-gray-700 dark:text-gray-300">
              Content for placeholder 1.
            </p>
          </div>
        </div>
        <div className="w-full">
          <div className="p-4 bg-white dark:bg-neutral-800 rounded shadow h-full">
            <h3 className="text-xl font-semibold mb-2 dark:text-white">
              Total EAs 2023-2024: {data.length}
            </h3>
            <BarChart data={barChartData} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default summary_client;
