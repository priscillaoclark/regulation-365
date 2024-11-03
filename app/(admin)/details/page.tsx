"use client";
import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Search } from "lucide-react";
import DocumentFilters from "./DocumentFilters";
import FileDisplay from "./FileDisplay";

interface DocumentRecord {
  doc_id: string;
  title: string;
  agencyId: string;
  documentType: string;
  postedDate: string;
  modifyDate: string;
  receiveDate: string;
  withdrawn: string;
  docketId: string;
  openForComment: string;
  commentStartDate: string;
  commentEndDate: string;
  frDocNum: string;
  objectId: string;
  topics: string;
  files: string;
  relevant: string;
}

interface FilterValues {
  documentType: string;
  agencyId: string;
  dateFrom: string;
  dateTo: string;
  searchText: string;
}

const DocumentClient: React.FC = () => {
  const [data, setData] = React.useState<DocumentRecord[]>([]);
  const [filteredData, setFilteredData] = React.useState<DocumentRecord[]>([]);
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [currentPage, setCurrentPage] = React.useState<number>(1);
  const [expandedRow, setExpandedRow] = React.useState<string | null>(null);
  const [filters, setFilters] = React.useState<FilterValues>({
    documentType: "",
    agencyId: "",
    dateFrom: "",
    dateTo: "",
    searchText: "",
  });
  const itemsPerPage = 20;

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/details");
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const result = await response.json();
        setData(result);
        setFilteredData(result);
      } catch (error) {
        setError(error instanceof Error ? error.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleFilterChange = (newFilters: FilterValues): void => {
    setFilters(newFilters);
    let filtered = [...data];

    if (newFilters.documentType) {
      filtered = filtered.filter(
        (doc) => doc.documentType === newFilters.documentType
      );
    }

    if (newFilters.agencyId) {
      filtered = filtered.filter((doc) => doc.agencyId === newFilters.agencyId);
    }

    if (newFilters.dateFrom) {
      filtered = filtered.filter(
        (doc) => new Date(doc.postedDate) >= new Date(newFilters.dateFrom)
      );
    }

    if (newFilters.dateTo) {
      filtered = filtered.filter(
        (doc) => new Date(doc.postedDate) <= new Date(newFilters.dateTo)
      );
    }

    if (newFilters.searchText) {
      const searchLower = newFilters.searchText.toLowerCase();
      filtered = filtered.filter((doc) => {
        const titleMatch = doc.title?.toLowerCase().includes(searchLower);
        const topicsMatch = doc.topics?.toLowerCase().includes(searchLower);
        return titleMatch || topicsMatch;
      });
    }

    setFilteredData(filtered);
    setCurrentPage(1);
  };

  const formatDate = (dateString: string): string => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handlePageChange = (page: number): void => {
    setCurrentPage(page);
    setExpandedRow(null);
  };

  const toggleRowExpansion = (docId: string): void => {
    setExpandedRow(expandedRow === docId ? null : docId);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFilters = { ...filters, searchText: e.target.value };
    handleFilterChange(newFilters);
  };

  const renderPaginationButtons = (totalPages: number) => {
    const visiblePages = 7;
    const edgePages = 2;
    const surroundingPages = 1;

    let pages: (number | string)[] = [];

    if (totalPages <= visiblePages) {
      pages = Array.from({ length: totalPages }, (_, i) => i + 1);
    } else {
      for (let i = 1; i <= edgePages; i++) {
        pages.push(i);
      }

      const leftBound = Math.max(edgePages + 1, currentPage - surroundingPages);
      const rightBound = Math.min(
        totalPages - edgePages,
        currentPage + surroundingPages
      );

      if (leftBound > edgePages + 1) {
        pages.push("...");
      }

      for (let i = leftBound; i <= rightBound; i++) {
        pages.push(i);
      }

      if (rightBound < totalPages - edgePages) {
        pages.push("...");
      }

      for (let i = totalPages - edgePages + 1; i <= totalPages; i++) {
        pages.push(i);
      }
    }

    return pages.map((page, index) => {
      if (page === "...") {
        return (
          <span
            key={`ellipsis-${index}`}
            className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 dark:bg-neutral-800 dark:border-neutral-600 dark:text-gray-300"
          >
            ...
          </span>
        );
      }

      return (
        <button
          key={page}
          onClick={() => handlePageChange(page as number)}
          className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium
          ${
            currentPage === page
              ? "z-10 bg-blue-50 border-blue-500 text-blue-600 dark:bg-blue-900 dark:border-blue-500 dark:text-blue-200"
              : "bg-white dark:bg-neutral-800 border-gray-300 dark:border-neutral-600 text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-neutral-700"
          }`}
        >
          {page}
        </button>
      );
    });
  };

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

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = filteredData.slice(startIndex, endIndex);

  return (
    <div className="p-4 bg-neutral-100 dark:bg-neutral-900">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-center dark:text-white">
          Federal Document Details
        </h2>
      </div>

      <div className="space-y-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search in titles and topics..."
            value={filters.searchText}
            onChange={handleSearchChange}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-neutral-800 dark:border-neutral-600 dark:text-white dark:placeholder-gray-400"
          />
        </div>

        <DocumentFilters
          data={data}
          onFilterChange={(filterValues) =>
            handleFilterChange({
              ...filterValues,
              searchText: filters.searchText,
            })
          }
        />
      </div>

      <div className="overflow-x-auto mt-4">
        <table className="min-w-full bg-white dark:bg-neutral-800 rounded-lg shadow-md">
          <thead className="bg-lime-400 dark:bg-lime-400">
            <tr>
              <th className="px-6 py-2 text-left text-xs font-bold text-center uppercase tracking-wider">
                Document ID
              </th>
              <th className="px-6 py-2 text-left text-xs font-bold text-center uppercase tracking-wider">
                Title
              </th>
              <th className="px-6 py-2 text-left text-xs font-bold text-center uppercase tracking-wider">
                Document Type
              </th>
              <th className="px-6 py-2 text-left text-xs font-bold text-center uppercase tracking-wider">
                Posted Date
              </th>
              <th className="px-6 py-2 text-left text-xs font-bold text-center uppercase tracking-wider">
                Agency ID
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
            {currentData.map((record) => (
              <React.Fragment key={record.doc_id}>
                <tr
                  className="hover:bg-gray-50 dark:hover:bg-neutral-700 cursor-pointer"
                  onClick={() => toggleRowExpansion(record.doc_id)}
                >
                  <td className="px-6 py-4 whitespace-normal">
                    <div className="text-sm text-gray-900 dark:text-white">
                      {record.doc_id}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-normal">
                    <div className="text-sm text-gray-900 dark:text-white">
                      {record.title}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-white">
                      {record.documentType}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-white">
                      {formatDate(record.postedDate)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-white">
                      {record.agencyId}
                    </div>
                  </td>
                </tr>
                {expandedRow === record.doc_id && (
                  <tr className="bg-gray-50 dark:bg-neutral-700">
                    <td colSpan={5} className="px-6 py-4">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="font-medium">
                            Document ID:{" "}
                            <span className="font-normal">{record.doc_id}</span>
                          </p>
                          <p className="font-medium">
                            FR Document Number:{" "}
                            <span className="font-normal">
                              {record.frDocNum}
                            </span>
                          </p>
                          <p className="font-medium">
                            Docket ID:{" "}
                            <span className="font-normal">
                              {record.docketId}
                            </span>
                          </p>
                          <p className="font-medium">
                            Comment Period:{" "}
                            <span className="font-normal">
                              {formatDate(record.commentStartDate)} -{" "}
                              {formatDate(record.commentEndDate)}
                            </span>
                          </p>
                          {record.files && (
                            <div className="mt-4">
                              <FileDisplay filesJson={record.files} />
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="font-medium">Topics:</p>
                          <div className="mt-1">
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                              {record.topics || "No topics listed"}
                            </ReactMarkdown>
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div className="flex-1 flex justify-between sm:hidden">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-neutral-800 dark:text-gray-300 dark:border-neutral-600"
          >
            Previous
          </button>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-neutral-800 dark:text-gray-300 dark:border-neutral-600"
          >
            Next
          </button>
        </div>
        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Showing <span className="font-medium">{startIndex + 1}</span> to{" "}
              <span className="font-medium">
                {Math.min(endIndex, filteredData.length)}
              </span>{" "}
              of <span className="font-medium">{filteredData.length}</span>{" "}
              results
            </p>
          </div>
          <div>
            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
              {renderPaginationButtons(totalPages)}
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentClient;
