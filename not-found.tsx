import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex min-h-[calc(100vh-10rem)] flex-col items-center justify-center text-center">
      <h1 className="text-6xl font-bold text-gray-800 dark:text-white">404</h1>
      <h2 className="mt-4 text-2xl font-semibold text-gray-600 dark:text-gray-300">Page Not Found</h2>
      <p className="mt-2 text-gray-500 dark:text-gray-400">
        Sorry, the page you are looking for does not exist.
      </p>
      <Link href="/" className="mt-6 rounded-md bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700">
          Go back home
      </Link>
    </div>
  );
}