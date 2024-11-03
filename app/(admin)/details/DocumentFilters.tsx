import React from "react";

interface FilterValues {
  documentType: string;
  agencyId: string;
  dateFrom: string;
  dateTo: string;
  searchText: string;
}

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
  summary: string;
  keywords: string;
}

interface DocumentFiltersProps {
  data: DocumentRecord[];
  onFilterChange: (filters: FilterValues) => void;
}

const DocumentFilters: React.FC<DocumentFiltersProps> = ({
  data,
  onFilterChange,
}) => {
  const [documentTypes, setDocumentTypes] = React.useState<string[]>([]);
  const [agencies, setAgencies] = React.useState<string[]>([]);
  const [filters, setFilters] = React.useState<FilterValues>({
    documentType: "",
    agencyId: "",
    dateFrom: "",
    dateTo: "",
    searchText: "",
  });

  React.useEffect(() => {
    const types = Array.from(
      new Set(data.map((doc) => doc.documentType))
    ).sort();
    const agencyIds = Array.from(
      new Set(data.map((doc) => doc.agencyId))
    ).sort();
    setDocumentTypes(types);
    setAgencies(agencyIds);
  }, [data]);

  const handleFilterChange = (
    e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    const newFilters = { ...filters, [name]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearFilters = (): void => {
    const clearedFilters: FilterValues = {
      documentType: "",
      agencyId: "",
      dateFrom: "",
      dateTo: "",
      searchText: "",
    };
    setFilters(clearedFilters);
    onFilterChange(clearedFilters);
  };

  return (
    <div className="mb-6 p-4 bg-white dark:bg-neutral-800 rounded-lg shadow-md">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Document Type
          </label>
          <select
            name="documentType"
            value={filters.documentType}
            onChange={handleFilterChange}
            className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm dark:bg-neutral-700 dark:border-neutral-600 dark:text-white"
          >
            <option value="">All Types</option>
            {documentTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Agency
          </label>
          <select
            name="agencyId"
            value={filters.agencyId}
            onChange={handleFilterChange}
            className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm dark:bg-neutral-700 dark:border-neutral-600 dark:text-white"
          >
            <option value="">All Agencies</option>
            {agencies.map((agency) => (
              <option key={agency} value={agency}>
                {agency}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Date From
          </label>
          <input
            type="date"
            name="dateFrom"
            value={filters.dateFrom}
            onChange={handleFilterChange}
            className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm dark:bg-neutral-700 dark:border-neutral-600 dark:text-white"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Date To
          </label>
          <input
            type="date"
            name="dateTo"
            value={filters.dateTo}
            onChange={handleFilterChange}
            className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm dark:bg-neutral-700 dark:border-neutral-600 dark:text-white"
          />
        </div>
      </div>

      <div className="mt-4 flex justify-end">
        <button
          onClick={clearFilters}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 dark:bg-neutral-700 dark:text-gray-300 dark:hover:bg-neutral-600"
        >
          Clear Filters
        </button>
      </div>
    </div>
  );
};

export default DocumentFilters;
