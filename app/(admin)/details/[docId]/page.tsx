"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ArrowLeft, ArrowRight, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import FileDisplay from "../FileDisplay";
import Link from "next/link";

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
  relevant: boolean;
  summary: string;
  keywords: string;
}

export default function DocumentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [document, setDocument] = useState<DocumentRecord | null>(null);
  const [allDocIds, setAllDocIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDocument = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/details");
        const data = await response.json();

        const ids = data.map((doc: DocumentRecord) => doc.doc_id);
        setAllDocIds(ids);

        const currentDoc = data.find(
          (doc: DocumentRecord) => doc.doc_id === params.docId
        );
        setDocument(currentDoc);
      } catch (error) {
        console.error("Error fetching document:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDocument();
  }, [params.docId]);

  const handleNavigation = (direction: "prev" | "next") => {
    const currentIndex = allDocIds.indexOf(params.docId as string);
    let newIndex;

    if (direction === "prev") {
      newIndex = currentIndex > 0 ? currentIndex - 1 : allDocIds.length - 1;
    } else {
      newIndex = currentIndex < allDocIds.length - 1 ? currentIndex + 1 : 0;
    }

    router.push(`/details/${allDocIds[newIndex]}`);
  };

  const handleRelevantToggle = async () => {
    if (!document) return;

    try {
      const response = await fetch(`/api/details/${document.doc_id}/relevant`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ relevant: !document.relevant }),
      });

      if (!response.ok) throw new Error("Failed to update relevant status");

      setDocument({ ...document, relevant: !document.relevant });
    } catch (error) {
      console.error("Error updating relevant status:", error);
    }
  };

  const formatDate = (dateString: string): string => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="loader">Loading...</div>
      </div>
    );
  }

  if (!document) {
    return <div>Document not found</div>;
  }

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <div className="border-b p-4 flex items-center justify-between bg-white dark:bg-neutral-800">
        <div className="flex items-center gap-4">
          <Link
            href="/details"
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 dark:bg-neutral-800 dark:text-gray-300 dark:border-neutral-600 dark:hover:bg-neutral-700"
          >
            <ChevronLeft className="h-4 w-4" />
            Back to List
          </Link>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => handleNavigation("prev")}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Previous
          </Button>
          <Button
            variant="outline"
            onClick={() => handleNavigation("next")}
            className="flex items-center gap-2"
          >
            Next
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 overflow-y-auto bg-gray-50 dark:bg-neutral-900">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Document Header Card */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div className="space-y-2">
                  <CardTitle className="text-2xl font-bold dark:text-white">
                    {document.title}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Document #{document.doc_id}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Mark as Relevant:
                  </span>
                  <input
                    type="checkbox"
                    checked={document.relevant}
                    onChange={handleRelevantToggle}
                    className="h-4 w-4 text-lime-600 focus:ring-lime-500 border-gray-300 rounded"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <dl className="space-y-4">
                    <div>
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Agency
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                        {document.agencyId}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Document Type
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                        {document.documentType}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Docket ID
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                        {document.docketId || "N/A"}
                      </dd>
                    </div>
                  </dl>
                </div>
                <div>
                  <dl className="space-y-4">
                    <div>
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Posted Date
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                        {formatDate(document.postedDate)}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Comment Period
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                        {formatDate(document.commentStartDate)} -{" "}
                        {formatDate(document.commentEndDate)}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        FR Document Number
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                        {document.frDocNum || "N/A"}
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Rest of the cards remain the same */}
          {/* Files Card */}
          <Card>
            <CardHeader>
              <CardTitle>Associated Files</CardTitle>
            </CardHeader>
            <CardContent>
              {document.files ? (
                <FileDisplay filesJson={document.files} />
              ) : (
                <p className="text-gray-500 dark:text-gray-400">
                  No files available
                </p>
              )}
            </CardContent>
          </Card>

          {/* Topics and Keywords Card */}
          <Card>
            <CardHeader>
              <CardTitle>Topics & Keywords</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                    Topics
                  </h4>
                  <div className="prose dark:prose-invert">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {document.topics || "No topics listed"}
                    </ReactMarkdown>
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                    Keywords
                  </h4>
                  <div className="prose dark:prose-invert">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {document.keywords || "No keywords available"}
                    </ReactMarkdown>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Summary Card */}
          <Card>
            <CardHeader>
              <CardTitle>AI-Generated Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose dark:prose-invert">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {document.summary || "No summary available"}
                </ReactMarkdown>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
