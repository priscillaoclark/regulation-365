import { useEffect, useState } from "react";

// Interface for CFPB record data
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

const CfpbClient = () => {
  const [data, setData] = useState<CfpbRecord[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [darkMode, setDarkMode] = useState<boolean>(false);

  // Function to toggle between light and dark themes
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    if (!darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  // Check system or local storage for dark mode preference on component load
  useEffect(() => {
    const storedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;

    if (storedTheme === "dark" || (!storedTheme && prefersDark)) {
      setDarkMode(true);
      document.documentElement.classList.add("dark");
    } else {
      setDarkMode(false);
      document.documentElement.classList.remove("dark");
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/ea/cfpb");
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
      return [<li key="error">Invalid related documents format</li>];
    }
  };

  const parseProducts = (products: string): JSX.Element[] => {
    try {
      const sanitizedProducts = products.replace(/'/g, '"');
      const parsedProducts: string[] = JSON.parse(sanitizedProducts);
      return parsedProducts.map((product, index) => (
        <li key={index}>{product}</li>
      ));
    } catch (error) {
      return [<li key="error">Invalid products format</li>];
    }
  };

  return (
    <div className="p-4 bg-neutral-100 dark:bg-neutral-900">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-center dark:text-white">
          Consumer Financial Protection Bureau
        </h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {data.map((record, index) => (
          <div
            key={index}
            className="bg-white dark:bg-neutral-800 dark:text-white shadow-lg rounded-lg p-4 hover:shadow-xl transition-shadow"
          >
            <h3 className="text-xl font-bold mb-2 text-lime-500">
              {record.title}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-300 mb-4">
              {new Date(record.date).toLocaleDateString()}
            </p>
            <p className="mb-4">{record.summary}</p>
            <button
              className="text-lime-500 hover:underline mb-2"
              onClick={() => window.open(record.link, "_blank")}
            >
              View Full Case
            </button>

            <details className="mb-4">
              <summary className="cursor-pointer text-lime-500 hover:underline">
                More Details
              </summary>
              <p className="mt-2">{record.description}</p>
            </details>

            <ul className="mb-4">
              <li>
                <strong>Press Release: </strong>
                <a
                  href={record.press_release}
                  className="text-lime-500 hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View
                </a>
              </li>
              <li>
                <strong>Case Docket: </strong>
                {record.case_docket ? (
                  <a
                    href={record.case_docket}
                    className="text-lime-500 hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View Docket
                  </a>
                ) : (
                  "N/A"
                )}
              </li>
            </ul>

            <ul className="mb-4">
              <strong>Related Documents:</strong>
              {parseRelatedDocuments(record.related_documents)}
            </ul>

            <ul className="mb-4">
              <strong>Products:</strong>
              {parseProducts(record.products)}
            </ul>

            <span
              className={`inline-block px-3 py-1 rounded-full text-white text-sm ${
                record.status === "Pending Litigation"
                  ? "bg-red-600"
                  : "bg-green-500"
              }`}
            >
              {record.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CfpbClient;
