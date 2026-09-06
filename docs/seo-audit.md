# SEO metadata audit

Audit of every page route under `app/` for `title`, `description`, and Open
Graph metadata. Run 2026-09-06 against commit `4167ba1`.

Legend: ✓ present · ~ weak (present but low quality) · ✗ missing.

Note: Next.js inherits `openGraph.title`/`openGraph.description` from the
page `title`/`description` fields, so those are only flagged when the source
fields themselves are weak. `og:image` comes from an `opengraph-image.tsx`
file or an explicit `openGraph.images` entry.

| Route                  | File                               | Title                                 | Description                                                     | Open Graph                                                                                                 |
| ---------------------- | ---------------------------------- | ------------------------------------- | --------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| `/`                    | `app/page.tsx`                     | ✓ root default (`SITE_NAME`)          | ✓ static                                                        | ~ `type: website` only; `og:image` ✓ (`app/opengraph-image.tsx`); no `siteName`/`url`                      |
| `/[page]`              | `app/[page]/page.tsx`              | ✓ CMS `seo.title` \|\| `title`        | ~ falls back to `bodySummary`, which can be empty               | ~ `type: article` + timestamps; `og:image` ✓ (`app/[page]/opengraph-image.tsx`); no `siteName`/`url`       |
| `/product/[handle]`    | `app/product/[handle]/page.tsx`    | ✓ product `seo.title` \|\| `title`    | ~ falls back to full product `description` (can be long HTML)   | ~ `og:image` ✓ (featured image) + noindex logic; no `type`, no `siteName`/`url`                            |
| `/search`              | `app/search/page.tsx`              | ~ static `"Search"`, ignores `?q=`    | ✓ static                                                        | ✗ none; no `og:image` (no `opengraph-image.tsx`)                                                           |
| `/search/[collection]` | `app/search/[collection]/page.tsx` | ✓ collection `seo.title` \|\| `title` | ✓ collection `seo.description` \|\| `description` \|\| fallback | ~ `og:image` ✓ (`app/search/[collection]/opengraph-image.tsx`); no `openGraph` object, no `siteName`/`url` |
| `/wishlist`            | `app/wishlist/page.tsx`            | ✓ static                              | ✓ static                                                        | ✗ none; no `og:image` (no `opengraph-image.tsx`)                                                           |

## Worst offenders

`/search` and `/wishlist` are the only routes with zero Open Graph coverage:
neither declares an `openGraph` object nor ships an `opengraph-image.tsx`,
so social shares fall back to a bare card with no image and no type.
`/search` also has a static title that does not reflect the active query.

Non-page files under `app/` (`error.tsx`, `api/revalidate`, `robots.ts`,
`sitemap.ts`, `favicon.ico`, `globals.css`) are out of scope for this audit.
