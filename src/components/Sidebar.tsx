"use client";

import { useState } from "react";
import { Search, Folder, FileText, ChevronDown } from "lucide-react";

interface SidebarItem {
  label: string;
  href: string;
  icon?: React.ReactNode;
  children?: SidebarItem[];
}

interface SidebarProps {
  items: SidebarItem[];
}

export default function Sidebar({ items }: SidebarProps) {
  const [openSections, setOpenSections] = useState<Set<string>>(new Set());

  const toggle = (label: string) => {
    setOpenSections((prev) => {
      const next = new Set(prev);
      if (next.has(label)) next.delete(label);
      else next.add(label);
      return next;
    });
  };

  const renderItem = (item: SidebarItem, depth = 0) => {
    const hasChildren = item.children && item.children.length > 0;
    const isOpen = openSections.has(item.label);

    return (
      <div key={item.label}>
        <button
          onClick={() => hasChildren ? toggle(item.label) : null}
          className={`w-full flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-colors ${
            depth > 0 ? "pl-6" : ""
          } ${
            hasChildren
              ? "hover:bg-gray-700/50 text-gray-300"
              : "hover:bg-primary/10 text-gray-300 hover:text-primary"
          }`}
        >
          {item.icon || (hasChildren ? <Folder className="w-4 h-4" /> : <FileText className="w-4 h-4" />)}
          <span className="flex-1 text-left">{item.label}</span>
          {hasChildren && (
            <ChevronDown
              className={`w-3 h-3 transition-transform ${isOpen ? "rotate-180" : ""}`}
            />
          )}
        </button>
        {hasChildren && isOpen && (
          <div className="ml-2 border-l border-gray-700 pl-1">
            {item.children!.map((child) => renderItem(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col">
      <div className="px-3 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider border-b border-gray-700">
        Navigation
      </div>
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {items.map(renderItem)}
      </div>
    </div>
  );
}