import { useEffect, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

// Type definitions
interface RelatedDocument {
  text: string;
  link: string;
}

interface CfpbRecord {
  title: string;
  link: string;
  date: string;
  summary: string;
  description: string;
  related_documents: string;
  press_release: string;
  case_docket: string;
  forum: string;
  docket_number: string;
  initial_filing_date: string;
  status: string;
  products: string;
}

interface PaginationMetadata {
  totalCount: number;
  currentPage: number;
  pageSize: number;
  totalPages: number;
}

interface ApiResponse {
  data: CfpbRecord[];
  metadata: PaginationMetadata;
}

// Pagination Controls Component
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

// Main CFPB Client Component
const CfpbClient = () => {
  const [data, setData] = useState<CfpbRecord[]>([]);
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
        `/api/ea/cfpb?page=${page}&pageSize=${metadata.pageSize}`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result: ApiResponse = await response.json();
      setData(result.data);
      setMetadata(result.metadata);
    } catch (error) {
      setError((error as Error).message);
      console.error("Error fetching CFPB data:", error);
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

  const parseRelatedDocuments = (relatedDocs: string): JSX.Element[] => {
    try {
      const sanitizedDocs = relatedDocs.replace(/'/g, '"');
      const parsedDocs: RelatedDocument[] = JSON.parse(sanitizedDocs);
      return parsedDocs.map((doc, index) => (
        <li key={index}>
          <a
            href={doc.link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-lime-500 hover:underline"
          >
            {doc.text}
          </a>
        </li>
      ));
    } catch (error) {
      console.error("Error parsing related documents:", error);
      return [<li key="error">No related documents available</li>];
    }
  };

  const parseProducts = (products: string): JSX.Element[] => {
    try {
      const sanitizedProducts = products.replace(/'/g, '"');
      const parsedProducts: string[] = JSON.parse(sanitizedProducts);
      return parsedProducts.map((product, index) => (
        <li key={index} className="text-gray-700 dark:text-gray-300">
          {product}
        </li>
      ));
    } catch (error) {
      console.error("Error parsing products:", error);
      return [<li key="error">No products information available</li>];
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
          Consumer Financial Protection Bureau
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
          {data.map((record, index) => (
            <article
              key={index}
              className="bg-white dark:bg-neutral-800 dark:text-white shadow-lg rounded-lg p-6 hover:shadow-xl transition-shadow"
            >
              <h3 className="text-xl font-bold mb-2 text-lime-500">
                {record.title}
              </h3>

              <div className="flex flex-wrap gap-4 text-sm text-gray-500 dark:text-gray-400 mb-4">
                <time dateTime={record.date}>{formatDate(record.date)}</time>
                {record.docket_number && (
                  <span>Docket: {record.docket_number}</span>
                )}
                {record.status && <span>Status: {record.status}</span>}
              </div>

              <p className="mb-4">{record.summary}</p>

              <div className="flex flex-wrap gap-4 mb-4">
                {record.press_release && (
                  <a
                    href={record.press_release}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-lime-500 hover:underline inline-flex items-center gap-1"
                  >
                    Press Release
                  </a>
                )}
                {record.case_docket && (
                  <a
                    href={record.case_docket}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-lime-500 hover:underline inline-flex items-center gap-1"
                  >
                    Case Docket
                  </a>
                )}
                <a
                  href={record.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-lime-500 hover:underline inline-flex items-center gap-1"
                >
                  View Full Case
                </a>
              </div>

              <details className="mb-4">
                <summary className="cursor-pointer text-lime-500 hover:underline">
                  More Details
                </summary>
                <div className="mt-4 space-y-4">
                  <p className="text-gray-700 dark:text-gray-300">
                    {record.description}
                  </p>

                  {record.related_documents && (
                    <div>
                      <h4 className="font-semibold mb-2">Related Documents:</h4>
                      <ul className="list-disc pl-5 space-y-1">
                        {parseRelatedDocuments(record.related_documents)}
                      </ul>
                    </div>
                  )}

                  {record.products && (
                    <div>
                      <h4 className="font-semibold mb-2">Products Involved:</h4>
                      <ul className="list-disc pl-5 space-y-1">
                        {parseProducts(record.products)}
                      </ul>
                    </div>
                  )}
                </div>
              </details>
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

export default CfpbClient;
