"use client";

import { useMemo } from "react";
import { useGitStore, GraphNode } from "@/store/gitStore";
import { GitCommit, Circle } from "lucide-react";

const COLORS = [
  "#58a6ff", "#3fb950", "#d29922", "#f778ba", "#39d2c0",
  "#bc8cff", "#ff7b72", "#79c0ff", "#56d364", "#e3b341",
  "#f0883e", "#db6d28", "#a371f7", "#7ee787", "#ffa657",
];

function getColor(id: number) {
  return COLORS[id % COLORS.length];
}

interface LayoutNode {
  hash: string;
  message: string;
  author: string;
  date: number;
  parentHashes: string[];
  branchLabels: string[];
  isHead: boolean;
  isMergeCommit: boolean;
  depth: number;
  column: number;
  x: number;
  y: number;
}

const NODE_RADIUS = 10;
const VERTICAL_GAP = 64;
const HORIZONTAL_GAP = 40;
const PADDING = { top: 24, left: 40, right: 120, bottom: 24 };

export default function GitGraph() {
  const { commits, branches, head, getGraphData } = useGitStore();
  const rawNodes = getGraphData();

  const layout = useMemo(() => {
    if (rawNodes.length === 0) return { nodes: [], edges: [], width: 300, height: 100 };

    // Assign columns based on branch topology
    const branchColors = new Map<string, number>();
    let colorIdx = 0;
    branches.forEach((b, i) => {
      if (!branchColors.has(b.name)) {
        branchColors.set(b.name, colorIdx++);
      }
    });

    // Map commits to columns, grouping by branch
    const columnMap = new Map<string, number>();
    const sorted = [...rawNodes].sort((a, b) => a.date - b.date);

    // Assign columns: each branch gets its own column
    sorted.forEach((node) => {
      const nodeBranches = node.branchLabels.filter((l) => l !== "HEAD");
      if (nodeBranches.length > 0) {
        // Use the first branch label to assign column
        const br = nodeBranches[0];
        if (!columnMap.has(node.hash)) {
          const col = branchColors.get(br) ?? 0;
          columnMap.set(node.hash, col);
        }
      } else if (node.parentHashes.length > 1) {
        // Merge commit: use parent 0's column
        columnMap.set(node.hash, columnMap.get(node.parentHashes[0]) ?? 0);
      } else if (node.parentHashes.length === 1) {
        const parentCol = columnMap.get(node.parentHashes[0]);
        columnMap.set(node.hash, parentCol ?? 0);
      } else {
        columnMap.set(node.hash, 0);
      }
    });

    // Build layout nodes
    const layoutNodes: LayoutNode[] = sorted.map((n, i) => {
      const col = columnMap.get(n.hash) ?? 0;
      return {
        ...n,
        x: PADDING.left + col * HORIZONTAL_GAP,
        y: PADDING.top + i * VERTICAL_GAP,
        column: col,
      };
    });

    // Build edges
    const edges: Array<{ from: LayoutNode; to: LayoutNode }> = [];
    sorted.forEach((n) => {
      n.parentHashes.forEach((ph) => {
        const parent = layoutNodes.find((ln) => ln.hash === ph);
        if (parent) {
          edges.push({
            from: layoutNodes.find((ln) => ln.hash === n.hash)!,
            to: parent,
          });
        }
      });
    });

    const width = Math.max(
      PADDING.left + (branches.length + 1) * HORIZONTAL_GAP + PADDING.right,
      300,
    );
    const height = Math.max(
      PADDING.top + sorted.length * VERTICAL_GAP + PADDING.bottom,
      100,
    );

    return { nodes: layoutNodes, edges, width, height };
  }, [rawNodes, branches]);

  if (commits.length === 0) {
    return (
      <div className="h-full flex flex-col">
        <div className="px-3 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider border-b border-gray-700">
          Git Graph
        </div>
        <div className="flex-1 flex items-center justify-center text-sm text-gray-500">
          <div className="text-center">
            <GitCommit className="w-12 h-12 mx-auto mb-3 text-gray-600" />
            <p>No commits yet</p>
            <p className="text-xs mt-1">
              Start by running <code className="bg-gray-700 px-1 rounded">git commit</code>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="px-3 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider border-b border-gray-700 flex items-center justify-between">
        <span>Git Graph</span>
        <span className="text-gray-500 font-normal normal-case">
          {commits.length} commit{commits.length !== 1 ? "s" : ""}
        </span>
      </div>
      <div className="flex-1 overflow-auto">
        <svg
          width={layout.width}
          height={layout.height}
          className="min-w-full"
          style={{ background: "transparent" }}
        >
          {/* Edges */}
          {layout.edges.map((edge, i) => {
            const fromCol = edge.from.column;
            const toCol = edge.to.column;
            const fromX = edge.from.x;
            const fromY = edge.from.y;
            const toX = edge.to.x;
            const toY = edge.to.y;
            const midY = (fromY + toY) / 2;
            const color = getColor(fromCol);

            return (
              <g key={`edge-${i}`}>
                {fromCol !== toCol ? (
                  <>
                    <path
                      d={`M ${fromX} ${fromY + NODE_RADIUS} C ${fromX} ${midY}, ${toX} ${midY}, ${toX} ${toY + NODE_RADIUS}`}
                      fill="none"
                      stroke={color}
                      strokeWidth="2"
                      strokeOpacity="0.6"
                    />
                    <circle
                      cx={toX}
                      cy={toY + NODE_RADIUS}
                      r="3"
                      fill={color}
                    />
                  </>
                ) : (
                  <line
                    x1={fromX}
                    y1={fromY + NODE_RADIUS}
                    x2={toX}
                    y2={toY + NODE_RADIUS}
                    stroke={color}
                    strokeWidth="2"
                    strokeOpacity="0.6"
                  />
                )}
              </g>
            );
          })}

          {/* Nodes */}
          {layout.nodes.map((node, i) => {
            const col = node.column;
            const color = getColor(col);
            const isHead = node.isHead;
            const isMerge = node.isMergeCommit;

            return (
              <g key={node.hash} className="group">
                {/* Label background */}
                {node.branchLabels.length > 0 && (
                  <g>
                    {node.branchLabels.map((label, li) => (
                      <g key={li}>
                        <rect
                          x={node.x + NODE_RADIUS + 6}
                          y={node.y - 8 + li * 18}
                          width={label.length * 8 + 16}
                          height="16"
                          rx="4"
                          fill={label === "HEAD" ? "#3b82f6" : "#7c3aed"}
                          fillOpacity="0.2"
                          stroke={label === "HEAD" ? "#3b82f6" : "#7c3aed"}
                          strokeWidth="1"
                        />
                        <text
                          x={node.x + NODE_RADIUS + 14}
                          y={node.y + 4 + li * 18}
                          fill={label === "HEAD" ? "#93c5fd" : "#c4b5fd"}
                          fontSize="10"
                          fontFamily="monospace"
                          fontWeight="600"
                        >
                          {label}
                        </text>
                      </g>
                    ))}
                  </g>
                )}

                {/* Commit circle */}
                {isMerge ? (
                  <rect
                    x={node.x - NODE_RADIUS}
                    y={node.y - NODE_RADIUS}
                    width={NODE_RADIUS * 2}
                    height={NODE_RADIUS * 2}
                    rx="3"
                    fill={isHead ? color : "#1f2937"}
                    stroke={color}
                    strokeWidth={isHead ? 3 : 2}
                  />
                ) : (
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={isHead ? NODE_RADIUS : NODE_RADIUS - 2}
                    fill={isHead ? color : "#1f2937"}
                    stroke={color}
                    strokeWidth={isHead ? 3 : 2}
                  />
                )}

                {/* HEAD glow */}
                {isHead && (
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={NODE_RADIUS + 4}
                    fill="none"
                    stroke={color}
                    strokeWidth="1"
                    strokeOpacity="0.4"
                  />
                )}

                {/* Hash label */}
                <text
                  x={node.x + NODE_RADIUS + 6}
                  y={node.y - 14}
                  fill="#6b7280"
                  fontSize="10"
                  fontFamily="monospace"
                >
                  {node.hash.substring(0, 7)}
                </text>

                {/* Commit message */}
                <text
                  x={node.x + NODE_RADIUS + 6}
                  y={node.y + 4 + node.branchLabels.length * 18}
                  fill="#e5e7eb"
                  fontSize="12"
                  fontFamily="sans-serif"
                >
                  {node.message.length > 30
                    ? node.message.substring(0, 30) + "…"
                    : node.message}
                </text>

                {/* Date */}
                <text
                  x={node.x + NODE_RADIUS + 6}
                  y={node.y + 18 + node.branchLabels.length * 18}
                  fill="#6b7280"
                  fontSize="10"
                >
                  {new Date(node.date).toLocaleDateString()} · {node.author}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}
