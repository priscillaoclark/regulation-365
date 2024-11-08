"use client";
import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  BarChart3,
  Calendar,
  FileText,
  Users,
  Tag,
  AlertTriangle,
  Clock,
  Building2,
  GanttChartSquare,
  Filter,
  X,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";

interface DocumentRecord {
  doc_id: string;
  title: string;
  agencyId: string;
  documentType: string;
  postedDate: string;
  openForComment: string;
  commentStartDate: string;
  commentEndDate: string;
  topics: string;
  relevant: boolean;
}

interface FilterState {
  agencies: string[];
  documentTypes: string[];
  timeRange: "7d" | "30d" | "90d";
  relevantOnly: boolean;
}

interface AvailableFilters {
  agencies: Set<string>;
  documentTypes: Set<string>;
}

const COLORS = ["#84CC16", "#65A30D", "#4D7C0F", "#3F6212", "#365314"];

export default function DashboardPage() {
  const [data, setData] = useState<DocumentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter states
  const [filters, setFilters] = useState<FilterState>({
    agencies: [],
    documentTypes: [],
    timeRange: "30d",
    relevantOnly: false,
  });

  // Available options for filters
  const [availableFilters, setAvailableFilters] = useState({
    agencies: new Set<string>(),
    documentTypes: new Set<string>(),
  });

  const fetchData = async () => {
    try {
      const response = await fetch("/api/details");
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      const result: DocumentRecord[] = await response.json();
      setData(result);

      // Set available filter options
      const agencies = new Set(
        result.map((doc: DocumentRecord) => doc.agencyId)
      );
      const docTypes = new Set(
        result.map((doc: DocumentRecord) => doc.documentType)
      );
      setAvailableFilters({
        agencies,
        documentTypes: docTypes,
      });
    } catch (error) {
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Apply all filters to data
  const getFilteredData = () => {
    const now = new Date();
    const filterDate = new Date();

    switch (filters.timeRange) {
      case "7d":
        filterDate.setDate(now.getDate() - 7);
        break;
      case "30d":
        filterDate.setDate(now.getDate() - 30);
        break;
      case "90d":
        filterDate.setDate(now.getDate() - 90);
        break;
    }

    return data.filter((doc) => {
      const passesTimeFilter = new Date(doc.postedDate) >= filterDate;
      const passesAgencyFilter =
        filters.agencies.length === 0 ||
        filters.agencies.includes(doc.agencyId);
      const passesTypeFilter =
        filters.documentTypes.length === 0 ||
        filters.documentTypes.includes(doc.documentType);
      const passesRelevanceFilter = !filters.relevantOnly || doc.relevant;

      return (
        passesTimeFilter &&
        passesAgencyFilter &&
        passesTypeFilter &&
        passesRelevanceFilter
      );
    });
  };

  const filteredData = getFilteredData();

  // Calculate metrics
  const metrics = {
    totalDocuments: filteredData.length,
    relevantDocuments: filteredData.filter((doc) => doc.relevant).length,
    openForComment: filteredData.filter((doc) => doc.openForComment === "true")
      .length,
    uniqueAgencies: new Set(filteredData.map((doc) => doc.agencyId)).size,
  };

  // Calculate agency distribution
  const agencyDistribution = Object.entries(
    filteredData.reduce((acc: { [key: string]: number }, doc) => {
      acc[doc.agencyId] = (acc[doc.agencyId] || 0) + 1;
      return acc;
    }, {})
  )
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);

  // Calculate document types distribution
  const documentTypes = Object.entries(
    filteredData.reduce((acc: { [key: string]: number }, doc) => {
      acc[doc.documentType] = (acc[doc.documentType] || 0) + 1;
      return acc;
    }, {})
  )
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);

  // Calculate daily document counts
  const dailyCounts = filteredData.reduce(
    (acc: { [key: string]: number }, doc) => {
      const date = new Date(doc.postedDate).toLocaleDateString();
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    },
    {}
  );

  const timeSeriesData = Object.entries(dailyCounts)
    .map(([date, count]) => ({
      date,
      count,
    }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  // Get upcoming deadlines
  const upcomingDeadlines = filteredData
    .filter(
      (doc) => doc.commentEndDate && new Date(doc.commentEndDate) > new Date()
    )
    .sort(
      (a, b) =>
        new Date(a.commentEndDate).getTime() -
        new Date(b.commentEndDate).getTime()
    )
    .slice(0, 5);

  // Handle filter changes
  const handleTimeRangeChange = (range: "7d" | "30d" | "90d") => {
    setFilters((prev) => ({ ...prev, timeRange: range }));
  };

  const toggleAgencyFilter = (agency: string) => {
    setFilters((prev) => ({
      ...prev,
      agencies: prev.agencies.includes(agency)
        ? prev.agencies.filter((a) => a !== agency)
        : [...prev.agencies, agency],
    }));
  };

  const toggleDocumentTypeFilter = (type: string) => {
    setFilters((prev) => ({
      ...prev,
      documentTypes: prev.documentTypes.includes(type)
        ? prev.documentTypes.filter((t) => t !== type)
        : [...prev.documentTypes, type],
    }));
  };

  const toggleRelevantOnly = () => {
    setFilters((prev) => ({
      ...prev,
      relevantOnly: !prev.relevantOnly,
    }));
  };

  const clearFilters = () => {
    setFilters({
      agencies: [],
      documentTypes: [],
      timeRange: "30d",
      relevantOnly: false,
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
    return <div className="p-4 text-red-600">Error: {error}</div>;
  }

  return (
    <div className="p-6 space-y-6 bg-gray-50 dark:bg-neutral-900">
      {/* Header with Filter Summary */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-bold dark:text-white">
            Federal Documents Dashboard
          </h2>
          <Button
            variant="outline"
            onClick={clearFilters}
            className="flex items-center gap-2"
            disabled={
              !filters.agencies.length &&
              !filters.documentTypes.length &&
              !filters.relevantOnly
            }
          >
            <X className="h-4 w-4" />
            Clear Filters
          </Button>
        </div>

        {/* Filter Controls */}
        <Card>
          <CardContent className="p-4 space-y-4">
            <div className="flex flex-wrap gap-4">
              {/* Time Range Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Time Range</label>
                <div className="flex gap-2">
                  <Button
                    variant={filters.timeRange === "7d" ? "default" : "outline"}
                    onClick={() => handleTimeRangeChange("7d")}
                    className={
                      filters.timeRange === "7d"
                        ? "bg-lime-500 hover:bg-lime-600"
                        : ""
                    }
                    size="sm"
                  >
                    7 Days
                  </Button>
                  <Button
                    variant={
                      filters.timeRange === "30d" ? "default" : "outline"
                    }
                    onClick={() => handleTimeRangeChange("30d")}
                    className={
                      filters.timeRange === "30d"
                        ? "bg-lime-500 hover:bg-lime-600"
                        : ""
                    }
                    size="sm"
                  >
                    30 Days
                  </Button>
                  <Button
                    variant={
                      filters.timeRange === "90d" ? "default" : "outline"
                    }
                    onClick={() => handleTimeRangeChange("90d")}
                    className={
                      filters.timeRange === "90d"
                        ? "bg-lime-500 hover:bg-lime-600"
                        : ""
                    }
                    size="sm"
                  >
                    90 Days
                  </Button>
                </div>
              </div>

              {/* Relevance Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Relevance</label>
                <div>
                  <Button
                    variant={filters.relevantOnly ? "default" : "outline"}
                    onClick={toggleRelevantOnly}
                    className={
                      filters.relevantOnly
                        ? "bg-lime-500 hover:bg-lime-600"
                        : ""
                    }
                    size="sm"
                  >
                    Relevant Only
                  </Button>
                </div>
              </div>

              {/* Agency Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Agencies</label>
                <Select onValueChange={toggleAgencyFilter}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Select agency" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from(availableFilters.agencies).map((agency) => (
                      <SelectItem key={agency} value={agency}>
                        {agency}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="flex flex-wrap gap-2 mt-2">
                  {filters.agencies.map((agency) => (
                    <Badge
                      key={agency}
                      variant="secondary"
                      className="flex items-center gap-1"
                    >
                      {agency}
                      <X
                        className="h-3 w-3 cursor-pointer"
                        onClick={() => toggleAgencyFilter(agency)}
                      />
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Document Type Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Document Types</label>
                <Select onValueChange={toggleDocumentTypeFilter}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from(availableFilters.documentTypes).map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="flex flex-wrap gap-2 mt-2">
                  {filters.documentTypes.map((type) => (
                    <Badge
                      key={type}
                      variant="secondary"
                      className="flex items-center gap-1"
                    >
                      {type}
                      <X
                        className="h-3 w-3 cursor-pointer"
                        onClick={() => toggleDocumentTypeFilter(type)}
                      />
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Total Documents
                </p>
                <p className="text-2xl font-bold">{metrics.totalDocuments}</p>
              </div>
              <FileText className="h-8 w-8 text-lime-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Relevant Documents
                </p>
                <p className="text-2xl font-bold">
                  {metrics.relevantDocuments}
                </p>
              </div>
              <Filter className="h-8 w-8 text-lime-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Open for Comment
                </p>
                <p className="text-2xl font-bold">{metrics.openForComment}</p>
              </div>
              <Clock className="h-8 w-8 text-lime-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Active Agencies
                </p>
                <p className="text-2xl font-bold">{metrics.uniqueAgencies}</p>
              </div>
              <Building2 className="h-8 w-8 text-lime-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Time Series Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-lime-500" />
              Document Volume Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={timeSeriesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#84CC16" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Agency Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GanttChartSquare className="h-5 w-5 text-lime-500" />
              Agency Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={agencyDistribution}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}`}
                  >
                    {agencyDistribution.map((entry, index) => (
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
          </CardContent>
        </Card>
      </div>

      {/* Document Types Distribution */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Tag className="h-5 w-5 text-lime-500" />
            Document Types Distribution
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {documentTypes.map((type, index) => (
              <div
                key={type.name}
                className="bg-gray-50 dark:bg-neutral-800 p-4 rounded-lg"
              >
                <div className="flex justify-between items-center">
                  <span className="font-medium">{type.name}</span>
                  <span className="text-lime-500 font-bold">{type.value}</span>
                </div>
                <div className="mt-2 bg-gray-200 dark:bg-neutral-700 rounded-full h-2">
                  <div
                    className="bg-lime-500 h-2 rounded-full"
                    style={{
                      width: `${(type.value / metrics.totalDocuments) * 100}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Upcoming Deadlines */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-lime-500" />
            Upcoming Comment Deadlines
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {upcomingDeadlines.length > 0 ? (
              upcomingDeadlines.map((doc) => (
                <Link
                  key={doc.doc_id}
                  href={`/details/${doc.doc_id}`}
                  className="block p-4 bg-gray-50 dark:bg-neutral-800 rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-700 transition-colors"
                >
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <p className="font-medium">{doc.title}</p>
                      <p className="text-sm text-muted-foreground">
                        Agency: {doc.agencyId}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Type: {doc.documentType}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">Comment Deadline</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(doc.commentEndDate).toLocaleDateString()}
                      </p>
                      <Badge variant="secondary" className="mt-2">
                        {Math.ceil(
                          (new Date(doc.commentEndDate).getTime() -
                            new Date().getTime()) /
                            (1000 * 60 * 60 * 24)
                        )}{" "}
                        days left
                      </Badge>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <div className="text-center text-muted-foreground py-8">
                No upcoming comment deadlines found for the selected filters
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
