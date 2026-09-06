# SEO metadata audit

Audit of every page route under `app/` for `title`, `description`, and Open
Graph metadata. Run 2026-09-06; updated after the follow-up metadata fixes.

Legend: ✓ present · ~ weak (present but low quality) · ✗ missing.

Note: Next.js inherits `openGraph.title`/`openGraph.description` from the
page `title`/`description` fields, so those are only flagged when the source
fields themselves are weak. `og:image` comes from an `opengraph-image.tsx`
file or an explicit `openGraph.images` entry.

| Route                  | File                               | Title                                 | Description                                                     | Open Graph                                                                                              |
| ---------------------- | ---------------------------------- | ------------------------------------- | --------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| `/`                    | `app/page.tsx`                     | ✓ root default (`SITE_NAME`)          | ✓ static                                                        | ~ `type: website`, `siteName` ✓, `og:image` ✓ (`app/opengraph-image.tsx`); no `url`                     |
| `/[page]`              | `app/[page]/page.tsx`              | ✓ CMS `seo.title` \|\| `title`        | ~ falls back to `bodySummary`, which can be empty               | ~ `type: article` + timestamps, `siteName` ✓, `og:image` ✓ (`app/[page]/opengraph-image.tsx`); no `url` |
| `/product/[handle]`    | `app/product/[handle]/page.tsx`    | ✓ product `seo.title` \|\| `title`    | ~ falls back to full product `description` (can be long HTML)   | ~ `og:image` ✓ (featured image) + noindex logic, `siteName` ✓; no `type` or `url`                       |
| `/search`              | `app/search/page.tsx`              | ✓ dynamic for `?q=`                   | ✓ static                                                        | ✓ `type: website`, `siteName`, `og:image` (`app/search/opengraph-image.tsx`)                            |
| `/search/[collection]` | `app/search/[collection]/page.tsx` | ✓ collection `seo.title` \|\| `title` | ✓ collection `seo.description` \|\| `description` \|\| fallback | ~ `siteName` ✓, `og:image` ✓ (`app/search/[collection]/opengraph-image.tsx`); no `type` or `url`        |
| `/wishlist`            | `app/wishlist/page.tsx`            | ✓ static                              | ✓ static                                                        | ✓ `type: website`, `siteName`, `og:image` (`app/wishlist/opengraph-image.tsx`)                          |

## Worst offenders

The initial worst offenders, `/search` and `/wishlist`, have been fixed with
Open Graph type, image, and site name metadata. All audited routes now emit
`og:site_name` from `SITE_NAME`; remaining gaps are noted in the table.

Non-page files under `app/` (`error.tsx`, `api/revalidate`, `robots.ts`,
`sitemap.ts`, `favicon.ico`, `globals.css`) are out of scope for this audit.
