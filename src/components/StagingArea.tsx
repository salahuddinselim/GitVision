"use client";

import { useGitStore } from "@/store/gitStore";
import {
  FilePlus,
  CheckCircle,
  AlertCircle,
  Trash2,
  FileDiff,
} from "lucide-react";

export default function StagingArea() {
  const { files } = useGitStore();

  const staged = files.filter((f) => f.status === "staged");
  const modified = files.filter((f) => f.status === "modified");
  const untracked = files.filter((f) => f.status === "untracked");
  const deleted = files.filter((f) => f.status === "deleted");

  return (
    <div className="h-full flex flex-col">
      <div className="px-3 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider border-b border-gray-700">
        Staging Area
      </div>
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {/* Untracked */}
        {untracked.length > 0 && (
          <div>
            <h4 className="text-[11px] font-semibold text-gray-500 uppercase mb-1.5 flex items-center gap-1.5">
              <FilePlus className="w-3 h-3" />
              Untracked
              <span className="ml-auto bg-blue-500/20 text-blue-400 text-[10px] px-1.5 py-0.5 rounded-full">
                {untracked.length}
              </span>
            </h4>
            {untracked.map((f) => (
              <div
                key={f.id}
                className="flex items-center gap-2 px-2 py-1.5 rounded-md text-sm bg-blue-500/5 border border-blue-500/20"
              >
                <FilePlus className="w-3.5 h-3.5 text-blue-400" />
                <code className="flex-1 text-blue-300 text-xs truncate">
                  {f.path}
                </code>
              </div>
            ))}
          </div>
        )}

        {/* Staged */}
        {staged.length > 0 && (
          <div>
            <h4 className="text-[11px] font-semibold text-gray-500 uppercase mb-1.5 flex items-center gap-1.5">
              <CheckCircle className="w-3 h-3" />
              Staged
              <span className="ml-auto bg-green-500/20 text-green-400 text-[10px] px-1.5 py-0.5 rounded-full">
                {staged.length}
              </span>
            </h4>
            {staged.map((f) => (
              <div
                key={f.id}
                className="flex items-center gap-2 px-2 py-1.5 rounded-md text-sm bg-green-500/5 border border-green-500/20"
              >
                <CheckCircle className="w-3.5 h-3.5 text-green-400" />
                <code className="flex-1 text-green-300 text-xs truncate">
                  {f.path}
                </code>
              </div>
            ))}
          </div>
        )}

        {/* Modified */}
        {modified.length > 0 && (
          <div>
            <h4 className="text-[11px] font-semibold text-gray-500 uppercase mb-1.5 flex items-center gap-1.5">
              <AlertCircle className="w-3 h-3" />
              Modified
              <span className="ml-auto bg-yellow-500/20 text-yellow-400 text-[10px] px-1.5 py-0.5 rounded-full">
                {modified.length}
              </span>
            </h4>
            {modified.map((f) => (
              <div
                key={f.id}
                className="flex items-center gap-2 px-2 py-1.5 rounded-md text-sm bg-yellow-500/5 border border-yellow-500/20"
              >
                <AlertCircle className="w-3.5 h-3.5 text-yellow-400" />
                <code className="flex-1 text-yellow-300 text-xs truncate">
                  {f.path}
                </code>
              </div>
            ))}
          </div>
        )}

        {/* Deleted */}
        {deleted.length > 0 && (
          <div>
            <h4 className="text-[11px] font-semibold text-gray-500 uppercase mb-1.5 flex items-center gap-1.5">
              <Trash2 className="w-3 h-3" />
              Deleted
              <span className="ml-auto bg-red-500/20 text-red-400 text-[10px] px-1.5 py-0.5 rounded-full">
                {deleted.length}
              </span>
            </h4>
            {deleted.map((f) => (
              <div
                key={f.id}
                className="flex items-center gap-2 px-2 py-1.5 rounded-md text-sm bg-red-500/5 border border-red-500/20"
              >
                <Trash2 className="w-3.5 h-3.5 text-red-400" />
                <code className="flex-1 text-red-300 text-xs truncate">
                  {f.path}
                </code>
              </div>
            ))}
          </div>
        )}

        {staged.length === 0 && modified.length === 0 && untracked.length === 0 && deleted.length === 0 && (
          <div className="text-center py-6 text-sm text-gray-500">
            <FileDiff className="w-8 h-8 mx-auto mb-2 text-gray-600" />
            Working tree is clean
          </div>
        )}
      </div>
    </div>
  );
}