import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

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

interface AgencyStats {
  name: string;
  count: number;
  percentage: number;
}

interface MonthlyTrend {
  yearMonth: string;
  count: number;
}

const COLORS = [
  "#84CC16",
  "#65A30D",
  "#4D7C0F",
  "#3F6212",
  "#365314",
  "#422006",
];

const SummaryClient = () => {
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
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-lime-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
        <h3 className="text-lg font-semibold text-red-800 dark:text-red-200">
          Error Loading Data
        </h3>
        <p className="text-red-600 dark:text-red-300">{error}</p>
      </div>
    );
  }

  // Calculate agency statistics
  const agencyStats = Object.entries(
    data.reduce((acc: { [key: string]: number }, curr) => {
      acc[curr.agency] = (acc[curr.agency] || 0) + 1;
      return acc;
    }, {})
  )
    .map(([name, count]) => ({
      name,
      count,
      percentage: (count / data.length) * 100,
    }))
    .sort((a, b) => b.count - a.count);

  // Calculate monthly trends
  const monthlyTrends = Object.entries(
    data.reduce((acc: { [key: string]: number }, curr) => {
      const yearMonth = `${curr.year}-${String(curr.month).padStart(2, "0")}`;
      acc[yearMonth] = (acc[yearMonth] || 0) + 1;
      return acc;
    }, {})
  )
    .map(([yearMonth, count]) => ({ yearMonth, count }))
    .sort((a, b) => a.yearMonth.localeCompare(b.yearMonth));

  // Get current year's data
  const currentYear = new Date().getFullYear();
  const currentYearData = data.filter(
    (item) => parseInt(item.year) === currentYear
  );

  return (
    <div className="p-4 bg-neutral-100 dark:bg-neutral-900 relative z-0">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Summary Statistics */}
        <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-bold mb-4 dark:text-white">
            Key Statistics
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-lime-50 dark:bg-lime-900/20 p-4 rounded-lg">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Total Actions
              </p>
              <p className="text-2xl font-bold text-lime-600 dark:text-lime-400">
                {data.length}
              </p>
            </div>
            <div className="bg-lime-50 dark:bg-lime-900/20 p-4 rounded-lg">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                This Year
              </p>
              <p className="text-2xl font-bold text-lime-600 dark:text-lime-400">
                {currentYearData.length}
              </p>
            </div>
            <div className="bg-lime-50 dark:bg-lime-900/20 p-4 rounded-lg">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Most Active Agency
              </p>
              <p className="text-2xl font-bold text-lime-600 dark:text-lime-400">
                {agencyStats[0]?.name}
              </p>
            </div>
            <div className="bg-lime-50 dark:bg-lime-900/20 p-4 rounded-lg">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Monthly Average
              </p>
              <p className="text-2xl font-bold text-lime-600 dark:text-lime-400">
                {Math.round(data.length / monthlyTrends.length)}
              </p>
            </div>
          </div>
        </div>

        {/* Agency Distribution Pie Chart */}
        <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-bold mb-4 dark:text-white">
            Agency Distribution
          </h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={agencyStats}
                  dataKey="count"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label={({ name, percentage }) =>
                    `${name} (${percentage.toFixed(1)}%)`
                  }
                >
                  {agencyStats.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Monthly Trends Bar Chart */}
        <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-lg p-6 md:col-span-2">
          <h3 className="text-xl font-bold mb-4 dark:text-white">
            Monthly Trends
          </h3>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="yearMonth"
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis />
                <Tooltip />
                <Bar
                  dataKey="count"
                  fill="#84CC16"
                  name="Enforcement Actions"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Agency Breakdown Table */}
        <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-lg p-6 md:col-span-2">
          <h3 className="text-xl font-bold mb-4 dark:text-white">
            Agency Breakdown
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b dark:border-neutral-700">
                  <th className="text-left p-2 text-gray-600 dark:text-gray-400">
                    Agency
                  </th>
                  <th className="text-right p-2 text-gray-600 dark:text-gray-400">
                    Actions
                  </th>
                  <th className="text-right p-2 text-gray-600 dark:text-gray-400">
                    Percentage
                  </th>
                </tr>
              </thead>
              <tbody>
                {agencyStats.map((stat, index) => (
                  <tr
                    key={stat.name}
                    className="border-b dark:border-neutral-700 hover:bg-gray-50 dark:hover:bg-neutral-700/50"
                  >
                    <td className="p-2 dark:text-white">{stat.name}</td>
                    <td className="text-right p-2 dark:text-white">
                      {stat.count}
                    </td>
                    <td className="text-right p-2 dark:text-white">
                      {stat.percentage.toFixed(1)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SummaryClient;
