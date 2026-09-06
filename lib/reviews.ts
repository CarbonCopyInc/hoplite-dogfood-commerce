import "server-only";
import { randomUUID } from "node:crypto";

export type Review = {
  id: string;
  productHandle: string;
  rating: number;
  author: string;
  text: string;
  createdAt: string;
};

// In-memory reviews seeded for a few demo products, matching the demo
// catalog in lib/shopify/demo.ts. Reviews are lost on server restart.
const reviews: Review[] = [
  {
    id: "review-aurora-1",
    productHandle: "aurora-desk-lamp",
    rating: 5,
    author: "Maya",
    text: "Beautiful warm light and the dimmer is buttery smooth. The arm stays exactly where I put it.",
    createdAt: "2026-07-02T09:30:00.000Z",
  },
  {
    id: "review-aurora-2",
    productHandle: "aurora-desk-lamp",
    rating: 4,
    author: "Jonas",
    text: "Great lamp for late-night work. I wish the cable were a bit longer, but otherwise perfect.",
    createdAt: "2026-07-18T18:05:00.000Z",
  },
  {
    id: "review-aurora-3",
    productHandle: "aurora-desk-lamp",
    rating: 3,
    author: "Priya",
    text: "Nice design, but the touch dimmer is a little finicky at the lowest setting.",
    createdAt: "2026-08-01T12:00:00.000Z",
  },
  {
    id: "review-halo-1",
    productHandle: "halo-wireless-speaker",
    rating: 5,
    author: "Sam",
    text: "Ridiculous bass for a speaker this small. Battery easily lasts a full day.",
    createdAt: "2026-07-25T07:45:00.000Z",
  },
  {
    id: "review-halo-2",
    productHandle: "halo-wireless-speaker",
    rating: 4,
    author: "Nina",
    text: "Great sound and easy to pair. The fabric picks up dust, but that's a minor quibble.",
    createdAt: "2026-08-10T21:20:00.000Z",
  },
];

export function getReviews(productHandle: string): Review[] {
  return reviews
    .filter((review) => review.productHandle === productHandle)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function addReview(input: {
  productHandle: string;
  rating: number;
  author: string;
  text: string;
}): Review {
  const review: Review = {
    id: randomUUID(),
    ...input,
    createdAt: new Date().toISOString(),
  };
  reviews.push(review);
  return review;
}
