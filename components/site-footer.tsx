import Link from "next/link";

const { SITE_NAME } = process.env;

export default function SiteFooter() {
  const siteName = SITE_NAME || "Store";

  return (
    <footer className="text-sm text-neutral-500 dark:text-neutral-400">
      <div className="mx-auto w-full max-w-7xl border-t border-neutral-200 px-6 py-12 md:px-4 min-[1320px]:px-0 dark:border-neutral-700">
        <p className="text-black dark:text-white">{siteName}</p>
        <p className="mt-2">
          &copy; {new Date().getFullYear()} {siteName}. All rights reserved.
        </p>
        <a href="#" rel="nofollow" className="mt-4 inline-block">
          Back to top
        </a>
        <Link href="/products" className="mt-4 inline-block">
          Products
        </Link>
      </div>
    </footer>
  );
}
