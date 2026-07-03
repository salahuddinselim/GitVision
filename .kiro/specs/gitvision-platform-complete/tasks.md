# Implementation Plan: GitVision Platform Complete

## Overview

This plan resolves all 30 identified bugs and completes the full UI across all pages. Tasks are ordered so the build compiles first (import fixes), then foundational wiring is established, then store/logic is corrected, then components are fixed, then pages are corrected, and finally the full UI is completed. Property-based tests using `fast-check` are included as optional sub-tasks close to the code they validate.

---

## Tasks

### Phase 1: Build-Breaking Fixes

- [x] 1. Fix xterm import paths in Terminal component and type declarations
  - [x] 1.1 Update `src/components/Terminal.tsx` to import from `@xterm/xterm` and `@xterm/xterm/css/xterm.css` instead of `xterm` and `xterm/css/xterm.css`
    - Change the CSS import at the top of the file
    - Change the dynamic `import("xterm")` call to `import("@xterm/xterm")`
    - Remove the unused `useCallback` import (Requirement 19.3)
    - _Requirements: 1.1, 19.3_
  - [x] 1.2 Update `src/types/globals.d.ts` to declare `@xterm/xterm` and `@xterm/xterm/css/xterm.css` modules instead of `xterm` and `xterm/css/xterm.css`
    - Replace `declare module 'xterm'` with `declare module '@xterm/xterm'`
    - Replace `declare module 'xterm/css/xterm.css'` with `declare module '@xterm/xterm/css/xterm.css'`
    - Keep `@xterm/addon-fit` and `@xterm/addon-web-links` declarations unchanged
    - _Requirements: 1.2, 1.4_

- [x] 2. Fix Trees icon import in internals page
  - [x] 2.1 Update `src/app/internals/page.tsx` to import `Network` (or `TreePine`) from `lucide-react` instead of the non-existent `Trees` export, and remove the unused `Layers` import
    - Replace `Trees` with `Network` in the import statement
    - Remove `Layers` from the import if it is not referenced in JSX
    - Update any JSX that renders `<Trees />` to render `<Network />`
    - _Requirements: 1.3, 19.2, 28.5, 28.6_

### Phase 2: Foundation Fixes

- [x] 3. Wire root layout with globals.css, Navbar, and Providers
  - [x] 3.1 Update `src/app/layout.tsx` to import `./globals.css`, render `<Providers>` wrapping `{children}`, and render `<Navbar />` inside `<body>` above `{children}`
    - Add `import "./globals.css"` as the first import
    - Add `import Navbar from "@/components/Navbar"`
    - Add `import Providers from "@/components/Providers"`
    - Wrap the body content: `<Providers><Navbar />{children}</Providers>`
    - Export a `metadata` object with `title.template: "%s | GitVision"` and a default description
    - _Requirements: 2.1, 2.2, 2.3, 5.3_

- [x] 4. Implement the `cn` utility with tailwind-merge
  - [x] 4.1 Rewrite `src/lib/cn.ts` to call `twMerge(clsx(...inputs))` using the installed `tailwind-merge` and `clsx` packages
    - Import `clsx` and `type ClassValue` from `clsx`
    - Import `twMerge` from `tailwind-merge`
    - Export `cn(...inputs: ClassValue[]): string` that returns `twMerge(clsx(inputs))`
    - _Requirements: 12.1, 12.2, 12.3_
  - [ ]\* 4.2 Write property test for `cn` — Property 1: conflicting Tailwind classes
    - **Property 1: cn resolves conflicting Tailwind classes**
    - For any two conflicting utility classes from the same group (e.g., `p-2`/`p-4`, `text-sm`/`text-lg`), `cn(first, second)` returns only the second
    - Use `fc.integer({ min: 0, max: 96 })` to generate padding values
    - Tag: `// Feature: gitvision-platform-complete, Property 1`
    - **Validates: Requirements 12.1, 12.2**
  - [ ]\* 4.3 Write property test for `cn` — Property 2: accepts all clsx input types without throwing
    - **Property 2: cn accepts all clsx input types without throwing**
    - For any combination of strings, arrays, objects, `null`, `undefined`, `false`, `cn()` returns a string without throwing
    - Tag: `// Feature: gitvision-platform-complete, Property 2`
    - **Validates: Requirements 12.3**

- [x] 5. Add IndexedDB SSR guard to `src/lib/db.ts`
  - [x] 5.1 Add `typeof window === "undefined"` check at the top of `openDB` that returns a rejected Promise with a descriptive error message when running in a Node.js/SSR environment
    - The rejection message must contain "server" or "IndexedDB"
    - All other db functions (`dbGet`, `dbSet`, `dbGetAll`, `dbDelete`, `dbClear`) already call `openDB()` first and will propagate the rejection automatically — no changes needed to them
    - _Requirements: 11.1, 11.2, 11.3_
  - [ ]\* 5.2 Write property test for `openDB` — Property 10: rejects in non-browser environments
    - **Property 10: openDB rejects in non-browser environments**
    - Mock `typeof window` to be `"undefined"` and assert the returned Promise rejects with an Error whose message contains "server" or "IndexedDB"
    - Tag: `// Feature: gitvision-platform-complete, Property 10`
    - **Validates: Requirements 11.1, 11.2**

- [x] 6. Delete stale files and remove dead dependency
  - [x] 6.1 Delete `src/app/client.tsx`, `src/app/globals.html`, `src/next.config.ts`, `src/tailwind.config.ts`, and any duplicate `globals.css` outside `src/app/globals.css`
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 7.1, 7.2_
  - [x] 6.2 Remove `react-router-dom` from `package.json` dependencies (do not run install — just remove the entry)
    - _Requirements: 3.5_

### Phase 3: Store and Logic Fixes

- [x] 7. Fix `processCommand` argument parsing in `src/store/gitStore.ts`
  - [x] 7.1 Rewrite the `processCommand` dispatcher to tokenize input with `input.trim().split(/\s+/)` and use the `parts` array for all argument extraction — replace all `args.replace(...)` patterns
    - `git add` path: use `parts[2]` (or `parts.slice(2).join(" ")`)
    - `git commit -m`: keep regex for quoted message parsing (`/commit\s+-m\s+"([^"]+)"/`)
    - `git branch`, `git checkout`, `git switch`, etc.: use `parts[2]` or `parts.slice(2).join(" ")`
    - Unrecognized commands: return `{ success: false, message: "command not found: <input>" }`
    - _Requirements: 13.1, 13.2, 13.3, 13.4_
  - [ ]\* 7.2 Write property test for `processCommand` — Property 3: git subcommand argument extraction
    - **Property 3: processCommand extracts git subcommand arguments correctly**
    - For any non-empty string `message` without double-quote characters, `processCommand('git commit -m "' + message + '"')` on an initialized repo with staged files calls `gitCommit` with exactly `message`
    - Tag: `// Feature: gitvision-platform-complete, Property 3`
    - **Validates: Requirements 13.1, 13.2, 13.3**

- [x] 8. Fix `gitCommit` and `gitCheckout` branch tracking in `src/store/gitStore.ts`
  - [x] 8.1 Update `gitCommit` to set `head: currentBranch.name` (not `head: hash`) after creating a new commit, and update the current branch's `commitHash` to the new hash
    - Find the branch where `isHead === true` before the `set()` call
    - In the `set()` call: `head: branchName` where `branchName = currentBranch?.name ?? "master"`
    - _Requirements: 14.1, 14.2, 14.3_
  - [x] 8.2 Update `gitCheckout` to set `head: target` (the branch name string) and `detachedHead: false` when switching to a named branch
    - _Requirements: 14.4_
  - [ ]\* 8.3 Write property test for `gitCommit` — Property 4: head is always a branch name after commit
    - **Property 4: head is always a branch name after commit**
    - For any sequence of `gitInit`, `gitAdd`, `gitCommit`, after each commit `head` equals the `name` of the branch where `isHead === true`, never a commit hash
    - Tag: `// Feature: gitvision-platform-complete, Property 4`
    - **Validates: Requirements 14.1, 14.2, 14.3**
  - [ ]\* 8.4 Write property test for `gitCheckout` — Property 5: head is always a branch name after checkout
    - **Property 5: head is always a branch name after checkout**
    - For any branch name that exists in the branches array, `gitCheckout(branchName)` sets `head` to `branchName` and `detachedHead` to `false`
    - Tag: `// Feature: gitvision-platform-complete, Property 5`
    - **Validates: Requirements 14.4**

- [x] 9. Fix `parseGitLog` parser in `src/lib/utils.ts`
  - [x] 9.1 Rewrite `parseGitLog` to split on `\n(?=commit\s)`, then for each block find `hash` from `lines[0]`, `author` from the line starting with `"Author:"`, `date` from the line starting with `"Date:"`, and `message` from lines after the first blank line
    - Return an empty array for empty input
    - _Requirements: 21.1, 21.2, 21.3_
  - [ ]\* 9.2 Write property test for `parseGitLog` — Property 6: round-trip preserves commit fields
    - **Property 6: parseGitLog round-trip preserves commit fields**
    - For any `GitCommit` with non-empty `hash`, `author`, and `message`, format it as `git log` output then parse with `parseGitLog` — the result's `hash`, `author`, and `message` must match the originals
    - Tag: `// Feature: gitvision-platform-complete, Property 6`
    - **Validates: Requirements 21.1, 21.2**

- [ ] 10. Checkpoint — verify store and logic fixes
  - Ensure all tests pass, ask the user if questions arise.

### Phase 4: Component Fixes

- [ ] 11. Fix and complete the Navbar component
  - [~] 11.1 Rewrite `src/components/Navbar.tsx` to use `usePathname()` from `next/navigation`, replace all `<a>` tags with Next.js `<Link>` components, and add the hamburger mobile menu with drawer
    - Add `"use client"` directive
    - Import `usePathname` from `next/navigation` and `Link` from `next/link`
    - Replace `window.location.pathname` with `const pathname = usePathname()`
    - Add `useState<boolean>` for `mobileOpen`
    - Apply active class `bg-primary/10 text-primary` when `pathname === item.href`
    - Render hamburger `<button>` with `Menu`/`X` icons visible only on `md:hidden` viewports
    - Render mobile drawer `div` when `mobileOpen === true`
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 34.1, 34.2, 34.3, 34.4_
  - [ ]\* 11.2 Write property test for Navbar — Property 12: active item matches current pathname
    - **Property 12: Navbar active item is exactly the current pathname**
    - For any pathname matching one of the nav items' `href` values, rendering Navbar results in exactly one item with the active class and all others without it
    - Tag: `// Feature: gitvision-platform-complete, Property 12`
    - **Validates: Requirements 6.3**

- [ ] 12. Fix and complete the Terminal component
  - [~] 12.1 Update `src/components/Terminal.tsx` to store `FitAddon` in a `useRef` created once during initialization, and use that ref in the entries update effect instead of creating a new `FitAddon`
    - Add `const fitAddonRef = useRef<any>(null)`
    - In the initialization `useEffect` (empty deps `[]`): create `FitAddon`, call `term.loadAddon(fitAddon)`, `fitAddon.fit()`, then `fitAddonRef.current = fitAddon`
    - In the entries `useEffect` (`[entries]` dep): call `fitAddonRef.current?.fit()` — do NOT create a new `FitAddon`
    - _Requirements: 10.1, 10.2, 10.3, 10.4_
  - [~] 12.2 Wire Terminal to display entries correctly: command lines prefixed with `$ `, error entries wrapped in `\x1b[31m...\x1b[0m`, output entries in default color
    - _Requirements: 9.2, 9.3, 9.4, 9.5_
  - [ ]\* 12.3 Write property test for Terminal entry formatting — Property 9
    - **Property 9: Terminal entry formatting invariant**
    - For any `CommandHistoryEntry` with `type: "error"`, the string written to xterm contains `\x1b[31m`; for `type: "output"`, it does not
    - Tag: `// Feature: gitvision-platform-complete, Property 9`
    - **Validates: Requirements 9.3, 9.4, 9.5**

- [ ] 13. Fix and complete the CommandInput component
  - [~] 13.1 Rewrite `src/components/CommandInput.tsx` to call `processCommand`, then `addEntry` with the result, then `clearInput` on submit; reject empty/whitespace-only input; support up/down arrow history navigation
    - Import `useGitStore` and `useTerminalStore` from `@/store/gitStore`
    - On submit: guard `if (!input.trim()) return`; call `const result = await processCommand(cmd)`; call `addEntry({ command: cmd, output: result.message, timestamp: Date.now(), type: result.success ? "output" : "error" })`; call `clearInput()`
    - Add `historyIndex` state; handle `ArrowUp`/`ArrowDown` keys to navigate `history`
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5, 8.6_
  - [ ]\* 13.2 Write property test for CommandInput — Property 7: rejects whitespace-only input
    - **Property 7: CommandInput rejects whitespace-only input**
    - For any string composed entirely of whitespace, submitting it does NOT call `processCommand` and does NOT add an entry to TerminalStore history
    - Tag: `// Feature: gitvision-platform-complete, Property 7`
    - **Validates: Requirements 8.4**
  - [ ]\* 13.3 Write property test for CommandInput — Property 8: addEntry type matches processCommand success
    - **Property 8: CommandInput addEntry type matches processCommand success**
    - For any non-empty command, the entry added to TerminalStore has `type: "output"` when `result.success === true` and `type: "error"` when `result.success === false`
    - Tag: `// Feature: gitvision-platform-complete, Property 8`
    - **Validates: Requirements 8.2**

- [ ] 14. Update playground page to pass terminal history as entries prop
  - [~] 14.1 Update `src/app/playground/page.tsx` to read `useTerminalStore((s) => s.history)` and pass it as the `entries` prop to `<Terminal entries={entries} />`
    - _Requirements: 9.1, 24.2_

- [ ] 15. Fix SplitView view mode toggle
  - [~] 15.1 Update `src/components/SplitView.tsx` to add `viewMode` state (`"combined" | "terminal" | "graph"`), wire each button's `onClick` to `setViewMode`, conditionally render panels based on `viewMode`, and apply active class to the current mode button
    - Replace hardcoded `false` constants with `viewMode === "combined"`, `viewMode === "terminal"`, `viewMode === "graph"` conditions
    - Each button: `onClick={() => setViewMode(mode)}` and active class `bg-primary text-primary-foreground` when `viewMode === mode`
    - _Requirements: 15.1, 15.2, 15.3, 15.4, 15.5, 15.6_
  - [ ]\* 15.2 Write property test for SplitView — Property 11: panel visibility matches viewMode
    - **Property 11: SplitView panel visibility matches viewMode**
    - For each of the three `viewMode` values, assert the correct panels are rendered/hidden
    - Tag: `// Feature: gitvision-platform-complete, Property 11`
    - **Validates: Requirements 15.1, 15.2, 15.3, 15.4**

- [ ] 16. Fix and complete the FileExplorer component
  - [~] 16.1 Update `src/components/FileExplorer.tsx` to render the full recursive filesystem tree from GitStore with expand/collapse folder state and status color coding
    - Read `files` and `cwd` from `useGitStore`
    - Add `openFolders` state (`Set<string>`) for expand/collapse
    - Render a recursive `FileNode` component with `depth`-based left padding
    - Color-code: untracked → gray, modified → yellow, staged → green, committed → default foreground
    - _Requirements: 36.1, 36.2, 36.3, 36.4_

- [ ] 17. Fix and complete the GitGraph component
  - [~] 17.1 Update `src/components/GitGraph.tsx` to use `@xyflow/react` for DAG rendering with custom `CommitNode` components, directed edges from parent to child, and HEAD highlighting
    - Import `ReactFlow`, `Background`, `Controls`, `type Node`, `type Edge` from `@xyflow/react`
    - Import `@xyflow/react/dist/style.css`
    - Convert `commits` to `Node[]` with position `{ x: 0, y: idx * 80 }`
    - Convert `parentHashes` to `Edge[]` with `type: "smoothstep"`
    - Register `CommitNode` via `nodeTypes` prop
    - Highlight HEAD commit node with `border-blue-500 bg-blue-500/10`
    - _Requirements: 35.1, 35.2, 35.3, 35.4, 35.5, 35.6_

- [ ] 18. Fix and complete the StagingArea component
  - [~] 18.1 Update `src/components/StagingArea.tsx` to read staged and unstaged files from GitStore and display them in separate sections with a staged file count
    - Read `files` and `staging` from `useGitStore`
    - Separate files into staged (`status === "staged"`) and unstaged sections
    - Display count of staged files
    - _Requirements: 37.1, 37.2, 37.3, 37.4_

- [ ] 19. Implement Radix UI component stubs
  - [~] 19.1 Implement `src/components/ui/tabs.tsx` using `@radix-ui/react-tabs` — export `Tabs`, `TabsList`, `TabsTrigger`, `TabsContent` with Tailwind styling
    - _Requirements: 20.1, 20.4_
  - [~] 19.2 Implement `src/components/ui/dialog.tsx` using `@radix-ui/react-dialog` — export `Dialog`, `DialogTrigger`, `DialogContent`, `DialogHeader`, `DialogTitle`, `DialogDescription`, `DialogFooter`, `DialogClose`
    - _Requirements: 20.2, 20.5_
  - [~] 19.3 Implement `src/components/ui/toast.tsx` using `@radix-ui/react-toast` — export `ToastProvider`, `ToastViewport`, `Toast`, `ToastTitle`, `ToastDescription`, `ToastAction`, `ToastClose`
    - _Requirements: 20.3, 20.6_

- [x] 20. Fix unused imports in remaining files
  - [x] 20.1 Remove `useAnimation` from the `framer-motion` import in `src/app/page.tsx`
    - _Requirements: 19.1_
  - [x] 20.2 Remove unused import from `ui/card` in `src/components/FeatureCard.tsx`
    - _Requirements: 19.4_
  - [x] 20.3 Fix `AnimatePresence` import order in `src/components/SearchBar.tsx` — move it to the top of the file and remove any duplicate import at the bottom
    - _Requirements: 19.5_

- [~] 21. Checkpoint — verify all component fixes compile and tests pass
  - Ensure all tests pass, ask the user if questions arise.

### Phase 5: Page Fixes

- [ ] 22. Fix robots.ts route
  - [~] 22.1 Delete `src/app/robots.txt/page.tsx` and create `src/app/robots.ts` that exports a default function returning a `MetadataRoute.Robots` object with `userAgent: "*"`, `allow: "/"`, `disallow: ["/api/", "/_next/"]`, and `sitemap: "https://gitvision.dev/sitemap.xml"`
    - _Requirements: 4.1, 4.2, 4.3, 39.4_

- [ ] 23. Fix sitemap.ts — remove /404 entry
  - [~] 23.1 Update `src/app/sitemap.ts` to remove the entry with URL `https://gitvision.dev/404`
    - _Requirements: 18.1, 18.2_

- [ ] 24. Fix merge-conflicts page — remove dangerouslySetInnerHTML
  - [~] 24.1 Update `src/app/merge-conflicts/page.tsx` to replace all `dangerouslySetInnerHTML` usage with proper JSX, rendering inline code as `<code className="bg-gray-700 px-1 rounded font-mono text-sm">` elements
    - _Requirements: 16.1, 16.2, 16.3_

- [ ] 25. Fix learn/layout.tsx — remove "use client" and unused imports
  - [~] 25.1 Update `src/app/learn/layout.tsx` to remove the `"use client"` directive, remove the `motion` import from `framer-motion`, and remove any other unused imports; verify all sidebar links point to existing routes or create stub pages at those routes
    - _Requirements: 17.1, 17.2, 17.3, 17.4, 26.5, 39.3_

- [ ] 26. Fix internals page — complete metadata and content
  - [~] 26.1 Update `src/app/internals/page.tsx` to export a `metadata` object with `title: "Git Internals"`, ensure it uses `Network` (not `Trees`), and remove unused `Layers` import
    - This task depends on task 2.1 (Trees fix) already being done
    - _Requirements: 28.5, 28.6, 28.7_

- [ ] 27. Delete SEO component and add metadata exports to all pages
  - [~] 27.1 Delete `src/components/SEO.tsx`
    - _Requirements: 5.1_
  - [~] 27.2 Add `export const metadata: Metadata` to each page that previously used `<SEO />`: `/playground`, `/docs`, `/learn`, `/blog`, `/commands`, `/merge-conflicts`, `/classroom`, `/linux-basics`, and each `/docs/git-[cmd]` page
    - Use the title mapping from the design: `"Playground"`, `"Git Documentation"`, `"Learn Git"`, `"Blog"`, `"Git Commands Reference"`, `"Merge Conflict Resolver"`, `"Classroom"`, `"Linux Basics"`, `"git [cmd]"` for command pages
    - _Requirements: 5.2, 5.4_

- [ ] 28. Create 404 not-found page
  - [~] 28.1 Create `src/app/not-found.tsx` that exports a default `NotFound` component rendering a styled error message, a "Page not found" heading, and a `<Link href="/">` back to home, consistent with the dark design system
    - _Requirements: 33.1, 33.2, 33.3, 33.4_

- [~] 29. Checkpoint — verify all page fixes, run `tsc --noEmit`
  - Ensure all tests pass and TypeScript reports zero errors, ask the user if questions arise.

### Phase 6: UI Completion

- [ ] 30. Implement design system tokens and globals.css
  - [~] 30.1 Ensure `src/app/globals.css` defines the full color palette (`--background: #0f0f11`, `--surface: #161b22`, `--primary: #38a6ff`), the `.glass` utility class (backdrop blur, semi-transparent background, border), Inter as UI font, and JetBrains Mono as code/terminal font
    - _Requirements: 22.1, 22.2, 22.3, 22.4_

- [ ] 31. Implement landing page sections
  - [~] 31.1 Create `src/components/HeroTerminal.tsx` as a `"use client"` component with a typewriter animation that cycles through a sequence of Git commands and updates a mini commit graph
    - _Requirements: 23.1, 23.2, 23.11_
  - [~] 31.2 Create `src/components/FAQAccordion.tsx` as a `"use client"` component using `@radix-ui/react-accordion`, accepting `items: FAQItem[]` and rendering each as `AccordionTrigger` / `AccordionContent`
    - _Requirements: 23.8_
  - [~] 31.3 Update `src/app/page.tsx` to render all landing page sections as a Server Component: Hero (with `<HeroTerminal />`), Feature Cards grid (8 cards with Framer Motion `whileInView`), Why GitVision, Demo Preview, Blog Preview (3 cards), Testimonials (3 cards), `<FAQAccordion />`, CTA, and Footer
    - Export `metadata` with `title: "GitVision | Learn Git Visually"`
    - Remove unused `useAnimation` import
    - _Requirements: 23.1, 23.2, 23.3, 23.4, 23.5, 23.6, 23.7, 23.8, 23.9, 23.10, 23.11_

- [ ] 32. Complete the playground page
  - [~] 32.1 Update `src/app/playground/page.tsx` to render the full three-panel layout (FileExplorer 260px, Terminal center, GitGraph + StagingArea 320px), the view mode toolbar via `<SplitView />`, `<CommandInput />` below Terminal, `<ReplayTimeline />`, and a welcome screen when `!initialized`
    - Export `metadata` with `title: "Playground"`
    - _Requirements: 24.1, 24.3, 24.4, 24.5, 24.6, 24.7, 24.8_

- [ ] 33. Complete the docs index page and command pages
  - [~] 33.1 Update `src/app/docs/page.tsx` to render a sidebar with command categories, a `<DocsSearch />` Client Component for filtering, and a command cards grid (name, description, difficulty badge)
    - Create `src/components/DocsSearch.tsx` as a `"use client"` component
    - Export `metadata` with `title: "Git Documentation"`
    - _Requirements: 25.1, 25.2, 25.3, 39.1_
  - [~] 33.2 Update each `src/app/docs/git-[cmd]/page.tsx` to render: command syntax in a `<CodeBlock>`, prose explanation, options table, at least two usage examples, a visual diagram or animation, common mistakes section, related commands list, and a "Try in Playground" link
    - Export `metadata` with `title: "git [cmd]"` for each page
    - _Requirements: 25.4, 25.5, 25.6_

- [ ] 34. Complete the learn pages
  - [~] 34.1 Update `src/app/learn/page.tsx` to render three learning track cards (Beginner, Intermediate, Advanced) with lesson cards showing title, duration, and completion status, plus an interactive demo section linking to `/playground`
    - Export `metadata` with `title: "Learn Git"`
    - _Requirements: 26.1, 26.2, 26.3, 26.7_
  - [~] 34.2 Update `src/app/learn/layout.tsx` to render a sticky sidebar with the full lesson navigation tree (Server Component, no `"use client"`)
    - Create stub pages for any sidebar links that do not yet have a corresponding route
    - _Requirements: 26.4, 26.5, 26.6_

- [ ] 35. Complete the merge-conflicts page with interactive resolver
  - [~] 35.1 Update `src/app/merge-conflicts/page.tsx` to render a side-by-side diff view, three resolution buttons ("Accept Current", "Accept Incoming", "Combine Both"), a resolved output panel that updates on button click, a success state, and the step-by-step guide in proper JSX
    - Export `metadata` with `title: "Merge Conflict Resolver"`
    - _Requirements: 27.1, 27.2, 27.3, 27.4, 27.5, 27.6_

- [ ] 36. Complete the internals page with animated diagrams
  - [~] 36.1 Update `src/app/internals/page.tsx` to render Framer Motion animated object model diagrams for blob, tree, commit, and tag objects; a SHA-1 hash explanation section; a packfiles section; and a refs section
    - _Requirements: 28.1, 28.2, 28.3, 28.4_

- [ ] 37. Complete the classroom page
  - [~] 37.1 Update `src/app/classroom/page.tsx` to render a teacher mode UI with a "Create Session" button, a session sharing mockup with a shareable URL, and a student list panel with placeholder data
    - Export `metadata` with `title: "Classroom"`
    - _Requirements: 29.1, 29.2, 29.3, 29.4_

- [ ] 38. Complete the blog page
  - [~] 38.1 Create `src/components/BlogFilter.tsx` as a `"use client"` component that accepts `posts: BlogPost[]`, manages `activeTag` state, renders tag filter buttons (Beginner, Intermediate, Advanced), and renders the filtered post grid
    - _Requirements: 30.3, 30.4_
  - [~] 38.2 Update `src/app/blog/page.tsx` to render a featured post card at the top, pass all posts to `<BlogFilter />`, and export `metadata` with `title: "Blog"`
    - Define at least 6 static `BlogPost` objects including one with `featured: true`
    - _Requirements: 30.1, 30.2, 30.5_

- [ ] 39. Complete the linux-basics page
  - [~] 39.1 Create `src/components/LinuxSearch.tsx` as a `"use client"` component that accepts `commands: LinuxCommand[]`, manages `query` state, and renders a search input + filtered command cards (name, syntax, description, usage examples in CodeBlock)
    - _Requirements: 31.3_
  - [~] 39.2 Update `src/app/linux-basics/page.tsx` to define at least 20 static `LinuxCommand` objects and render `<LinuxSearch commands={COMMANDS} />`
    - Export `metadata` with `title: "Linux Basics"`
    - _Requirements: 31.1, 31.2, 31.4_

- [ ] 40. Complete the commands reference page
  - [~] 40.1 Create `src/components/CommandsFilter.tsx` as a `"use client"` component that accepts the full commands array, manages `query` and `category` state, renders a search input, category filter buttons (Basics, Branching, Remote, Advanced), and a filtered command card grid applying both filters simultaneously
    - _Requirements: 32.1, 32.2, 32.3, 32.4_
  - [~] 40.2 Update `src/app/commands/page.tsx` to define the full Git command data and render `<CommandsFilter />`
    - Export `metadata` with `title: "Git Commands Reference"`
    - _Requirements: 32.5_

- [ ] 41. Implement SearchBar modal with keyboard shortcut
  - [~] 41.1 Update `src/components/SearchBar.tsx` to render as a modal overlay, implement fuzzy search across Git commands and page titles, navigate on Enter/click, close on Escape, and wire the `/` key shortcut via a `keydown` listener on `document`
    - Update `src/components/Navbar.tsx` to render a search icon button that opens the SearchBar modal
    - _Requirements: 34.5, 34.6, 34.7, 38.1, 38.2, 38.3, 38.4, 38.5_

- [ ] 42. Apply responsive design and accessibility across all pages
  - [~] 42.1 Verify all pages are fully responsive across mobile (< 768px), tablet (768–1024px), and desktop (> 1024px) breakpoints; add visible focus rings using the primary color on all interactive elements; add Framer Motion page entry animations (`opacity: 0→1`, `y: 20→0`) to all major page sections
    - _Requirements: 22.5, 22.6, 22.7_

- [~] 43. Final checkpoint — full build verification
  - Run `tsc --noEmit` and verify zero TypeScript errors; verify `src/app/globals.css` is the only `globals.css`; verify `src/app/robots.ts` exists; verify no page imports from `src/components/SEO.tsx`; ensure all tests pass, ask the user if questions arise.

---

## Notes

- Tasks marked with `*` are optional and can be skipped for a faster MVP
- Each task references specific requirements for traceability
- Checkpoints at tasks 10, 21, 29, and 43 ensure incremental validation
- Property tests use `fast-check` with a minimum of 100 iterations per property
- Unit tests and property tests are complementary — both should be written
- The design document's "Correctness Properties" section defines 12 properties; all are covered by tasks 4.2, 4.3, 5.2, 7.2, 8.3, 8.4, 9.2, 11.2, 12.3, 13.2, 13.3, 15.2
- All `"use client"` directives must be the first line of the file (before imports)
- Tailwind CSS v4 uses `@theme inline` in `globals.css` — there is no `tailwind.config.js`
- `metadata` exports only work in Server Component page/layout files, not in Client Components
- Read `node_modules/next/dist/docs/` before writing any Next.js-specific code (per AGENTS.md)

---

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1.1", "1.2", "2.1"] },
    { "id": 1, "tasks": ["3.1", "4.1", "5.1", "6.1", "6.2"] },
    {
      "id": 2,
      "tasks": [
        "4.2",
        "4.3",
        "5.2",
        "7.1",
        "8.1",
        "8.2",
        "9.1",
        "20.1",
        "20.2",
        "20.3"
      ]
    },
    {
      "id": 3,
      "tasks": [
        "7.2",
        "8.3",
        "8.4",
        "9.2",
        "11.1",
        "12.1",
        "12.2",
        "13.1",
        "14.1",
        "15.1",
        "16.1",
        "17.1",
        "18.1",
        "19.1",
        "19.2",
        "19.3"
      ]
    },
    {
      "id": 4,
      "tasks": [
        "11.2",
        "12.3",
        "13.2",
        "13.3",
        "15.2",
        "22.1",
        "23.1",
        "24.1",
        "25.1",
        "26.1",
        "27.1",
        "27.2",
        "28.1"
      ]
    },
    {
      "id": 5,
      "tasks": [
        "30.1",
        "31.1",
        "31.2",
        "33.1",
        "34.2",
        "37.1",
        "38.1",
        "39.1",
        "40.1"
      ]
    },
    {
      "id": 6,
      "tasks": [
        "31.3",
        "32.1",
        "33.2",
        "34.1",
        "35.1",
        "36.1",
        "38.2",
        "39.2",
        "40.2",
        "41.1"
      ]
    },
    { "id": 7, "tasks": ["42.1"] }
  ]
}
```
