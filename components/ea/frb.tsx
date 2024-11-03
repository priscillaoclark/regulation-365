import { useEffect, useState } from "react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

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

interface PaginationMetadata {
  totalCount: number;
  currentPage: number;
  pageSize: number;
  totalPages: number;
}

interface ApiResponse {
  data: FrbRecord[];
  metadata: PaginationMetadata;
}

const PaginationControls = ({
  metadata,
  onPageChange,
  disabled,
}: {
  metadata: PaginationMetadata;
  onPageChange: (page: number) => void;
  disabled: boolean;
}) => {
  const getPageRange = () => {
    const range: number[] = [];
    const showPages = 5;
    let start = Math.max(1, metadata.currentPage - Math.floor(showPages / 2));
    let end = Math.min(metadata.totalPages, start + showPages - 1);

    if (end - start + 1 < showPages) {
      start = Math.max(1, end - showPages + 1);
    }

    for (let i = start; i <= end; i++) {
      range.push(i);
    }
    return range;
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 my-6">
      <div className="flex items-center space-x-2">
        <button
          onClick={() => onPageChange(1)}
          disabled={metadata.currentPage === 1 || disabled}
          className="p-2 rounded bg-lime-500 text-white disabled:bg-gray-300 disabled:cursor-not-allowed"
          title="First page"
        >
          <ChevronsLeft className="h-4 w-4" />
        </button>

        <button
          onClick={() => onPageChange(metadata.currentPage - 1)}
          disabled={metadata.currentPage === 1 || disabled}
          className="p-2 rounded bg-lime-500 text-white disabled:bg-gray-300 disabled:cursor-not-allowed"
          title="Previous page"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        <div className="flex space-x-1">
          {getPageRange().map((page) => (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              disabled={disabled}
              className={`px-3 py-1 rounded ${
                metadata.currentPage === page
                  ? "bg-lime-700 text-white"
                  : "bg-lime-500 text-white hover:bg-lime-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
              }`}
            >
              {page}
            </button>
          ))}
        </div>

        <button
          onClick={() => onPageChange(metadata.currentPage + 1)}
          disabled={metadata.currentPage === metadata.totalPages || disabled}
          className="p-2 rounded bg-lime-500 text-white disabled:bg-gray-300 disabled:cursor-not-allowed"
          title="Next page"
        >
          <ChevronRight className="h-4 w-4" />
        </button>

        <button
          onClick={() => onPageChange(metadata.totalPages)}
          disabled={metadata.currentPage === metadata.totalPages || disabled}
          className="p-2 rounded bg-lime-500 text-white disabled:bg-gray-300 disabled:cursor-not-allowed"
          title="Last page"
        >
          <ChevronsRight className="h-4 w-4" />
        </button>
      </div>

      <div className="text-sm text-gray-600 dark:text-gray-300">
        Page {metadata.currentPage} of {metadata.totalPages}
        <span className="ml-2">
          ({metadata.totalCount.toLocaleString()} total records)
        </span>
      </div>
    </div>
  );
};

const FrbClient = () => {
  const [data, setData] = useState<FrbRecord[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [metadata, setMetadata] = useState<PaginationMetadata>({
    totalCount: 0,
    currentPage: 1,
    pageSize: 10,
    totalPages: 1,
  });

  const fetchData = async (page: number) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `/api/ea/frb?page=${page}&pageSize=${metadata.pageSize}`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result: ApiResponse = await response.json();
      setData(result.data);
      setMetadata(result.metadata);
    } catch (error) {
      setError((error as Error).message);
      console.error("Error fetching FRB data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(1);
  }, []);

  const handlePageChange = (page: number) => {
    if (page !== metadata.currentPage) {
      fetchData(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const formatDate = (dateString: string): string => {
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch (error) {
      console.error("Error formatting date:", error);
      return dateString;
    }
  };

  if (error) {
    return (
      <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
        <h3 className="text-lg font-semibold text-red-800 dark:text-red-200">
          Error Loading Data
        </h3>
        <p className="text-red-600 dark:text-red-300">{error}</p>
        <button
          onClick={() => fetchData(metadata.currentPage)}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 bg-neutral-100 dark:bg-neutral-900">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-center dark:text-white">
          Federal Reserve Board
        </h2>
      </div>

      <PaginationControls
        metadata={metadata}
        onPageChange={handlePageChange}
        disabled={loading}
      />

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-lime-500"></div>
        </div>
      ) : data.length === 0 ? (
        <div className="text-center py-12 text-gray-600 dark:text-gray-400">
          No enforcement actions found.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {data.map((record) => (
            <article
              key={record.id}
              className="bg-white dark:bg-neutral-800 rounded-lg shadow-lg hover:shadow-xl transition-shadow p-6"
            >
              <h3 className="text-xl font-semibold mb-4 text-lime-500">
                {record.entity}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="mb-2">
                    <strong className="text-gray-700 dark:text-gray-300">
                      Type:
                    </strong>{" "}
                    {record.entity_type}
                  </p>
                  <p className="mb-2">
                    <strong className="text-gray-700 dark:text-gray-300">
                      Action:
                    </strong>{" "}
                    {record.action}
                  </p>
                </div>

                <div>
                  <p className="mb-2">
                    <strong className="text-gray-700 dark:text-gray-300">
                      Effective Date:
                    </strong>{" "}
                    <time dateTime={record.effective_date}>
                      {formatDate(record.effective_date)}
                    </time>
                  </p>
                  {record.termination_date && (
                    <p className="mb-2">
                      <strong className="text-gray-700 dark:text-gray-300">
                        Termination Date:
                      </strong>{" "}
                      <time dateTime={record.termination_date}>
                        {formatDate(record.termination_date)}
                      </time>
                    </p>
                  )}
                </div>
              </div>

              {record.keywords && (
                <div className="mb-4">
                  <strong className="text-gray-700 dark:text-gray-300">
                    Keywords:
                  </strong>{" "}
                  <span className="text-gray-600 dark:text-gray-400">
                    {record.keywords}
                  </span>
                </div>
              )}

              {record.ai_summary && (
                <div className="mb-6">
                  <h4 className="font-semibold mb-2 text-gray-700 dark:text-gray-300">
                    Overview:
                  </h4>
                  <div className="prose dark:prose-invert max-w-none">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {record.ai_summary}
                    </ReactMarkdown>
                  </div>
                </div>
              )}

              {record.attachment_summary && (
                <details className="mb-6">
                  <summary className="cursor-pointer text-lime-500 hover:underline mb-2">
                    Additional Details
                  </summary>
                  <div className="prose dark:prose-invert max-w-none mt-2">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {record.attachment_summary}
                    </ReactMarkdown>
                  </div>
                </details>
              )}

              <div className="flex flex-wrap gap-4">
                {record.attachment_url && (
                  <Link
                    href={record.attachment_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-lime-500 hover:underline"
                  >
                    Download Document
                  </Link>
                )}

                <Link
                  href={record.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-lime-500 hover:underline"
                >
                  View on FRB Website
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}

      <PaginationControls
        metadata={metadata}
        onPageChange={handlePageChange}
        disabled={loading}
      />
    </div>
  );
};

export default FrbClient;
