import { useEffect, useState } from "react";
import Link from "next/link";
import ReactMarkdown from "react-markdown"; // Import react-markdown
import remarkGfm from "remark-gfm"; // Optional: adds support for GitHub Flavored Markdown (tables, task lists, etc.)

interface FdicRecord {
  id: string;
  title: string;
  issued_date: string;
  termination_date: string;
  respondent: string;
  amount: string;
  nmls_id: string;
  restitution_amount: string;
  restitution_comment: string;
  bank_name: string;
  bank_city: string;
  bank_state: string;
  cert_number: string;
  category: string;
  action_type: string;
  docket_number: string;
  file_name: string;
  url: string;
  ai_summary: string;
}

const fdic_client = () => {
  const [data, setData] = useState<FdicRecord[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/ea/fdic");
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
          Federal Deposit Insurance Corporation
        </h2>
      </div>
      <div className="grid grid-cols-1 gap-4">
        {data.map((record) => (
          <div
            key={record.id}
            className="mb-4 p-4 dark:text-white bg-white dark:bg-neutral-800 rounded shadow"
          >
            <h3 className="text-xl font-semibold mb-2 text-lime-500 dark:text-lime-500">
              {record.bank_name}: {record.title}
            </h3>
            <p className="text-m dark:text-gray-300">
              <strong>Issued Date:</strong> {record.issued_date}
            </p>
            <p className="text-m dark:text-gray-300">
              <strong>Termination Date:</strong> {record.termination_date}
            </p>
            <p className="text-m dark:text-gray-300">
              <strong>Respondent:</strong> {record.respondent}
            </p>
            <p className="text-m dark:text-gray-300">
              <strong>Bank Name:</strong> {record.bank_name}
            </p>
            <p className="text-m dark:text-gray-300">
              <strong>Bank Location:</strong> {record.bank_city}
              {", "}
              {record.bank_state}
            </p>
            <p className="text-m dark:text-gray-300">
              <strong>AI Summary:</strong>
              <ReactMarkdown className="markdown" remarkPlugins={[remarkGfm]}>
                {record.ai_summary}
              </ReactMarkdown>
            </p>
            <Link href={record.url} className="text-lime-500 hover:underline">
              Download Document
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default fdic_client;
