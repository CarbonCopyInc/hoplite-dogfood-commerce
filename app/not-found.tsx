import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto my-16 flex max-w-xl flex-col items-center rounded-lg border border-neutral-200 bg-white p-8 text-center md:p-12 dark:border-neutral-800 dark:bg-black">
      <h1 className="text-2xl font-bold">Page not found</h1>
      <p className="mt-2 text-neutral-600 dark:text-neutral-400">
        The page you&apos;re looking for doesn&apos;t exist or may have moved.
      </p>
      <Link
        href="/"
        className="mt-6 rounded-full bg-blue-600 px-6 py-3 text-sm font-medium tracking-wide text-white hover:opacity-90"
      >
        Back to home
      </Link>
    </div>
  );
}
