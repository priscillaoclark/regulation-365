import { useEffect, useState } from "react";
import Link from "next/link";
import ReactMarkdown from "react-markdown"; // Import react-markdown
import remarkGfm from "remark-gfm"; // Optional: adds support for GitHub Flavored Markdown (tables, task lists, etc.)

interface OccRecord {
  id: string;
  institution: string;
  charter_number: string;
  company: string;
  location: string;
  type_code: string;
  type: string;
  amount: string;
  start_date: string;
  start_documents: string;
  termination_date: string;
  termination_documents: string;
  docket_number: string;
  url: string;
  ai_summary: string;
}

const occ_client = () => {
  const [data, setData] = useState<OccRecord[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/ea/occ");
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

  return (
    <div className="p-4 bg-neutral-100 dark:bg-neutral-900">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-center dark:text-white">
          Office of the Comptroller of the Currency
        </h2>
      </div>
      {data.map((record, index) => (
        <div
          key={index}
          className="mb-4 p-4 dark:text-white bg-white dark:bg-neutral-800 rounded shadow"
        >
          <p className="text-lg font-semibold text-lime-500">
            {record.institution}
          </p>
          <p className="text-m">
            <strong>Charter Number:</strong> {record.charter_number}
          </p>
          <p className="text-m">
            <strong>Type:</strong> {record.type}
          </p>
          <p className="text-m">
            <strong>Location:</strong> {record.location}
          </p>
          <p className="text-m">
            <strong>Start Date:</strong> {record.start_date}
          </p>
          {record.termination_date && (
            <p className="text-m">
              <strong>Termination Date:</strong> {record.termination_date}
            </p>
          )}
          <div className="text-m">
            <strong>AI Summary:</strong>
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {record.ai_summary}
            </ReactMarkdown>{" "}
            {/* Render ai_summary as markdown */}
          </div>
          <Link href={record.url} className="text-lime-500 hover:underline">
            View Document
          </Link>
        </div>
      ))}
    </div>
  );
};

export default occ_client;
