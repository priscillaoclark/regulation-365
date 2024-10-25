import { useEffect, useState } from "react";
import Link from "next/link";
import ReactMarkdown from "react-markdown"; // Import react-markdown
import remarkGfm from "remark-gfm"; // Optional: adds support for GitHub Flavored Markdown (tables, task lists, etc.)

interface FrbRecord {
  id: string;
  effective_date: string;
  termination_date: string;
  entity: string;
  entity_type: string;
  action: string;
  url: string;
  type: string;
  ai_summary: string;
  attachment_url: string;
  attachment_summary: string;
  keywords: string;
}

const frb_client = () => {
  const [data, setData] = useState<FrbRecord[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/ea/frb");
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
          Federal Reserve
        </h2>
      </div>
      {data.map((record, index) => (
        <div
          key={index}
          className="mb-4 p-4 dark:text-white bg-white dark:bg-neutral-800 rounded shadow"
        >
          <p className="text-lg font-semibold text-lime-500">{record.entity}</p>
          <p className="text-m">
            <strong>Type:</strong> {record.entity_type}
          </p>
          <p className="text-m">
            <strong>Action:</strong> {record.action}
          </p>
          <p className="text-m">
            <strong>Effective Date:</strong> {record.effective_date}
          </p>
          {record.termination_date && (
            <p className="text-m">
              <strong>Termination Date:</strong> {record.termination_date}
            </p>
          )}
          <div className="text-m">
            <strong>Overview:</strong>
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {record.ai_summary}
            </ReactMarkdown>{" "}
            {/* Render ai_summary as markdown */}
          </div>
          <details className="text-m">
            <summary className="cursor-pointer text-lime-500 hover:underline">
              Additional Details
            </summary>
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {record.attachment_summary}
            </ReactMarkdown>
          </details>
          <Link
            href={record.attachment_url}
            className="text-lime-500 hover:underline"
          >
            Download Document
          </Link>
          <br></br>
          <Link href={record.url} className="text-lime-500 hover:underline">
            More Info on FRB Website
          </Link>
        </div>
      ))}
    </div>
  );
};

export default frb_client;
