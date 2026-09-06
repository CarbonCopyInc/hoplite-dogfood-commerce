"use client";

import type { Review } from "lib/reviews";
import { useActionState } from "react";
import { submitReview } from "./actions";

function averageRating(reviews: Review[]): number {
  if (reviews.length === 0) return 0;
  return (
    reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
  );
}

function Stars({ rating }: { rating: number }) {
  return (
    <span
      aria-label={`${rating.toFixed(1)} out of 5 stars`}
      className="flex items-center gap-0.5"
    >
      {Array.from({ length: 5 }, (_, index) => (
        <span
          key={index}
          className={
            index < Math.round(rating)
              ? "text-amber-400"
              : "text-neutral-300 dark:text-neutral-600"
          }
        >
          ★
        </span>
      ))}
    </span>
  );
}

const inputClasses =
  "w-full rounded-lg border bg-white px-4 py-2 text-sm text-black placeholder:text-neutral-500 dark:border-neutral-800 dark:bg-transparent dark:text-white dark:placeholder:text-neutral-400";

export function Reviews({
  productHandle,
  initialReviews,
}: {
  productHandle: string;
  initialReviews: Review[];
}) {
  const [state, formAction] = useActionState(submitReview, null);
  const average = averageRating(initialReviews);

  return (
    <section className="mt-8 rounded-lg border border-neutral-200 bg-white p-8 dark:border-neutral-800 dark:bg-black">
      <div className="mb-6 flex flex-col gap-2 border-b pb-6 dark:border-neutral-700 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-2xl font-bold">Reviews</h2>
        {initialReviews.length > 0 ? (
          <div className="flex items-center gap-2">
            <Stars rating={average} />
            <span className="text-sm text-neutral-600 dark:text-neutral-400">
              {average.toFixed(1)} · {initialReviews.length}{" "}
              {initialReviews.length === 1 ? "review" : "reviews"}
            </span>
          </div>
        ) : (
          <span className="text-sm text-neutral-600 dark:text-neutral-400">
            No reviews yet
          </span>
        )}
      </div>

      {initialReviews.length > 0 ? (
        <ul className="mb-8 flex flex-col gap-6">
          {initialReviews.map((review) => (
            <li key={review.id} className="flex flex-col gap-1">
              <div className="flex items-center justify-between gap-2">
                <span className="font-medium">{review.author}</span>
                <time
                  dateTime={review.createdAt}
                  className="text-xs text-neutral-500 dark:text-neutral-400"
                >
                  {new Date(review.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                    timeZone: "UTC",
                  })}
                </time>
              </div>
              <Stars rating={review.rating} />
              <p className="text-sm leading-relaxed dark:text-white/[60%]">
                {review.text}
              </p>
            </li>
          ))}
        </ul>
      ) : null}

      <form action={formAction} className="flex flex-col gap-4">
        <h3 className="text-lg font-medium">Write a review</h3>
        <input type="hidden" name="productHandle" value={productHandle} />
        <div className="flex flex-col gap-2 sm:flex-row">
          <label className="flex flex-1 flex-col gap-1 text-sm">
            <span className="text-neutral-600 dark:text-neutral-400">Name</span>
            <input
              name="author"
              type="text"
              required
              maxLength={60}
              placeholder="Your name"
              className={inputClasses}
            />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            <span className="text-neutral-600 dark:text-neutral-400">
              Rating
            </span>
            <select name="rating" defaultValue={5} className={inputClasses}>
              {[5, 4, 3, 2, 1].map((value) => (
                <option key={value} value={value}>
                  {value} star{value === 1 ? "" : "s"}
                </option>
              ))}
            </select>
          </label>
        </div>
        <label className="flex flex-col gap-1 text-sm">
          <span className="text-neutral-600 dark:text-neutral-400">Review</span>
          <textarea
            name="text"
            required
            maxLength={1000}
            rows={4}
            placeholder="What did you think of this product?"
            className={inputClasses}
          />
        </label>
        <div>
          <button
            type="submit"
            className="rounded-full bg-blue-600 px-6 py-3 text-sm tracking-wide text-white hover:opacity-90"
          >
            Submit Review
          </button>
        </div>
        {state?.error ? (
          <p role="alert" className="text-sm text-red-600 dark:text-red-400">
            {state.error}
          </p>
        ) : null}
        {state?.success ? (
          <p
            role="status"
            className="text-sm text-green-600 dark:text-green-400"
          >
            Thanks! Your review has been added.
          </p>
        ) : null}
      </form>
    </section>
  );
}
