import React from "react";

interface FileInfo {
  fileUrl: string;
  format: string;
  size: number;
}

interface FileDisplayProps {
  filesJson: string;
}

const FileDisplay: React.FC<FileDisplayProps> = ({ filesJson }) => {
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";

    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
  };

  const getFileIcon = (format: string): string => {
    switch (format.toLowerCase()) {
      case "pdf":
        return "📄";
      case "htm":
      case "html":
        return "🌐";
      case "doc":
      case "docx":
        return "📝";
      case "xls":
      case "xlsx":
        return "📊";
      default:
        return "📎";
    }
  };

  const renderFiles = () => {
    try {
      const files: FileInfo[] = JSON.parse(filesJson);

      return (
        <div className="space-y-2">
          {files.map((file, index) => (
            <div
              key={index}
              className="flex items-center space-x-2 p-2 rounded-md hover:bg-gray-50 dark:hover:bg-neutral-700 transition-colors"
            >
              <span className="text-xl" aria-hidden="true">
                {getFileIcon(file.format)}
              </span>
              <a
                href={file.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 underline"
              >
                Download {file.format.toUpperCase()} File
              </a>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {formatFileSize(file.size)}
              </span>
            </div>
          ))}
        </div>
      );
    } catch (error) {
      console.error("Error parsing files JSON:", error);
      return <p className="text-red-500">Error displaying files</p>;
    }
  };

  if (!filesJson) {
    return null;
  }

  return (
    <div className="mt-2">
      <h4 className="font-medium mb-2">Files:</h4>
      {renderFiles()}
    </div>
  );
};

export default FileDisplay;
