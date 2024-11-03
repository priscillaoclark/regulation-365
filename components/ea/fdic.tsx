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

interface PaginationMetadata {
  totalCount: number;
  currentPage: number;
  pageSize: number;
  totalPages: number;
}

interface ApiResponse {
  data: FdicRecord[];
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

const FdicClient = () => {
  const [data, setData] = useState<FdicRecord[]>([]);
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
        `/api/ea/fdic?page=${page}&pageSize=${metadata.pageSize}`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result: ApiResponse = await response.json();
      setData(result.data);
      setMetadata(result.metadata);
    } catch (error) {
      setError((error as Error).message);
      console.error("Error fetching FDIC data:", error);
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
      // Scroll to top of the component
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
          Federal Deposit Insurance Corporation
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
        <div className="grid grid-cols-1 gap-4">
          {data.map((record) => (
            <article
              key={record.id}
              className="mb-4 p-6 dark:text-white bg-white dark:bg-neutral-800 rounded-lg shadow-lg hover:shadow-xl transition-shadow"
            >
              <h3 className="text-xl font-semibold mb-4 text-lime-500">
                {record.bank_name}: {record.title}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <div className="mb-2">
                    <strong className="text-gray-700 dark:text-gray-300">
                      Issued Date:
                    </strong>{" "}
                    <time dateTime={record.issued_date}>
                      {formatDate(record.issued_date)}
                    </time>
                  </div>
                  {record.termination_date && (
                    <div className="mb-2">
                      <strong className="text-gray-700 dark:text-gray-300">
                        Termination Date:
                      </strong>{" "}
                      <time dateTime={record.termination_date}>
                        {formatDate(record.termination_date)}
                      </time>
                    </div>
                  )}
                  {record.respondent && (
                    <div className="mb-2">
                      <strong className="text-gray-700 dark:text-gray-300">
                        Respondent:
                      </strong>{" "}
                      {record.respondent}
                    </div>
                  )}
                </div>

                <div>
                  <div className="mb-2">
                    <strong className="text-gray-700 dark:text-gray-300">
                      Bank Location:
                    </strong>{" "}
                    {record.bank_city}, {record.bank_state}
                  </div>
                  {record.cert_number && (
                    <div className="mb-2">
                      <strong className="text-gray-700 dark:text-gray-300">
                        Certificate Number:
                      </strong>{" "}
                      {record.cert_number}
                    </div>
                  )}
                  {record.docket_number && (
                    <div className="mb-2">
                      <strong className="text-gray-700 dark:text-gray-300">
                        Docket Number:
                      </strong>{" "}
                      {record.docket_number}
                    </div>
                  )}
                </div>
              </div>

              {record.ai_summary && (
                <div className="mb-4">
                  <h4 className="font-semibold mb-2 text-gray-700 dark:text-gray-300">
                    Summary:
                  </h4>
                  <div className="prose dark:prose-invert max-w-none">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {record.ai_summary}
                    </ReactMarkdown>
                  </div>
                </div>
              )}

              <div className="mt-4">
                <Link
                  href={record.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-lime-500 hover:underline"
                >
                  Download Document
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

export default FdicClient;
