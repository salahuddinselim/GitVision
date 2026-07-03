import Link from "next/link";

export default function NotFoundPage() {
  return (
    <main className="flex min-h-[calc(100vh-57px)] items-center justify-center px-4">
      <div className="text-center max-w-lg mx-auto">
        <h1 className="text-8xl font-bold text-gray-800 dark:text-gray-200 mb-4">404</h1>
        <h2 className="text-2xl font-bold text-gray-200 mb-2">Page Not Found</h2>
        <p className="text-gray-400 mb-8">
          Sorry, the page you are looking for does not exist. It might have been moved, deleted, or you may have mistyped the URL.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/" className="px-6 py-3 rounded-xl bg-primary text-white font-medium hover:opacity-90 transition-opacity">
            Go to Home
          </Link>
          <Link href="/docs" className="px-6 py-3 rounded-xl border border-gray-700 hover:border-gray-500 transition-colors">
            Explore Docs
          </Link>
        </div>
      </div>
    </main>
  );
}