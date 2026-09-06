"use server";

import { cookies } from "next/headers";

const WISHLIST_COOKIE = "wishlist";
const ONE_YEAR_IN_SECONDS = 60 * 60 * 24 * 365;

function normalizeHandle(handle: unknown): string | undefined {
  if (typeof handle !== "string") {
    return undefined;
  }

  const normalizedHandle = handle.trim();
  return normalizedHandle ? normalizedHandle : undefined;
}

function parseWishlist(value: string | undefined): string[] {
  if (!value) {
    return [];
  }

  try {
    const parsed = JSON.parse(value);
    if (!Array.isArray(parsed)) {
      return [];
    }

    return [
      ...new Set(parsed.map(normalizeHandle).filter(Boolean)),
    ] as string[];
  } catch {
    return [];
  }
}

async function saveWishlist(handles: string[]) {
  const cookieStore = await cookies();

  if (handles.length === 0) {
    cookieStore.delete(WISHLIST_COOKIE);
    return [];
  }

  cookieStore.set(WISHLIST_COOKIE, JSON.stringify(handles), {
    httpOnly: true,
    maxAge: ONE_YEAR_IN_SECONDS,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });

  return handles;
}

export async function getWishlist(): Promise<string[]> {
  const cookieStore = await cookies();
  return parseWishlist(cookieStore.get(WISHLIST_COOKIE)?.value);
}

export async function addToWishlist(handle: string): Promise<string[]> {
  const normalizedHandle = normalizeHandle(handle);
  const wishlist = await getWishlist();

  if (!normalizedHandle || wishlist.includes(normalizedHandle)) {
    return wishlist;
  }

  return saveWishlist([...wishlist, normalizedHandle]);
}

export async function removeFromWishlist(handle: string): Promise<string[]> {
  const normalizedHandle = normalizeHandle(handle);
  const wishlist = await getWishlist();

  if (!normalizedHandle) {
    return wishlist;
  }

  return saveWishlist(wishlist.filter((item) => item !== normalizedHandle));
}

export async function toggleWishlist(handle: string): Promise<string[]> {
  const normalizedHandle = normalizeHandle(handle);
  const wishlist = await getWishlist();

  if (!normalizedHandle) {
    return wishlist;
  }

  return wishlist.includes(normalizedHandle)
    ? saveWishlist(wishlist.filter((item) => item !== normalizedHandle))
    : saveWishlist([...wishlist, normalizedHandle]);
}
