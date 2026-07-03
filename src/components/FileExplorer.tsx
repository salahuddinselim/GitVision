"use client";

import { useGitStore } from "@/store/gitStore";
import { Folder, FileText, ChevronRight, Search } from "lucide-react";
import { useState } from "react";

interface FileExplorerProps {
  onOpenFile?: (path: string, content: string) => void;
}

export default function FileExplorer({ onOpenFile }: FileExplorerProps) {
  const { files, cwd } = useGitStore();
  const [openFolders, setOpenFolders] = useState<Set<string>>(new Set(["/"]));
  const [search, setSearch] = useState("");

  const currentFiles = files.filter((f) => {
    if (search.trim()) {
      return f.path.toLowerCase().includes(search.toLowerCase());
    }
    const parentPath = f.path.split("/").slice(0, -1).join("/") || "/";
    return parentPath === cwd;
  });

  const groupedFolders = currentFiles
    .filter((f) => f.type === "folder")
    .sort((a, b) => a.name.localeCompare(b.name));
  const groupedFiles = currentFiles
    .filter((f) => f.type === "file")
    .sort((a, b) => a.name.localeCompare(b.name));

  const handleFolderClick = (path: string) => {
    useGitStore.getState().cd(path);
    setOpenFolders((prev) => new Set([...prev, path]));
  };

  const handleFileClick = (file: { path: string; content: string }) => {
    if (onOpenFile) {
      onOpenFile(file.path, file.content);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "staged": return "text-green-400";
      case "modified": return "text-yellow-400";
      case "untracked": return "text-blue-400";
      case "deleted": return "text-red-400";
      default: return "text-gray-400";
    }
  };

  const getStatusDot = (status: string) => {
    switch (status) {
      case "staged": return "bg-green-400";
      case "modified": return "bg-yellow-400";
      case "untracked": return "bg-blue-400";
      case "deleted": return "bg-red-400";
      default: return "";
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="px-3 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider border-b border-gray-700">
        Explorer
      </div>

      {/* Search bar */}
      <div className="px-2 py-1.5 border-b border-gray-700/50">
        <div className="flex items-center gap-1.5 bg-gray-800 rounded-md px-2 py-1">
          <Search className="w-3 h-3 text-gray-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search files..."
            className="flex-1 bg-transparent outline-none text-xs text-gray-300 placeholder:text-gray-600"
          />
          {search && (
            <button onClick={() => setSearch("")} className="text-gray-500 hover:text-gray-300">
              <span className="text-xs">✕</span>
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {groupedFolders.map((folder) => (
          <div key={folder.id}>
            <div
              className="flex items-center gap-2 px-3 py-1.5 text-sm hover:bg-gray-700/50 transition-colors cursor-pointer"
              onClick={() => handleFolderClick(folder.path)}
            >
              <Folder className="w-4 h-4 text-yellow-500 flex-shrink-0" />
              <span className="flex-1 truncate">{folder.name}</span>
              <ChevronRight className="w-3 h-3 text-gray-500 flex-shrink-0" />
            </div>
          </div>
        ))}
        {groupedFiles.map((file) => (
          <div
            key={file.id}
            className="flex items-center gap-2 px-3 py-1.5 text-sm hover:bg-gray-700/50 transition-colors cursor-pointer group"
            onClick={() => handleFileClick(file)}
            title="Click to edit"
          >
            <FileText className="w-4 h-4 text-gray-400 flex-shrink-0" />
            <span className="flex-1 truncate">{file.name}</span>
            <div className="flex items-center gap-1.5">
              {getStatusDot(file.status) && (
                <span className={`w-1.5 h-1.5 rounded-full ${getStatusDot(file.status)}`} />
              )}
              <span className={`text-xs ${getStatusColor(file.status)}`}>
                {file.status === "committed" ? "" : file.status}
              </span>
            </div>
          </div>
        ))}
        {currentFiles.length === 0 && (
          <div className="px-3 py-8 text-center text-sm text-gray-500">
            {search ? "No files match your search." : "No files yet. Use touch or mkdir to create files."}
          </div>
        )}
      </div>
    </div>
  );
}
