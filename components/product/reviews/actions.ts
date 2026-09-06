"use server";

import { addReview } from "lib/reviews";
import { revalidatePath } from "next/cache";

export type SubmitReviewState = {
  error?: string;
  success?: boolean;
};

function readField(formData: FormData, name: string): string {
  const value = formData.get(name);
  return typeof value === "string" ? value.trim() : "";
}

export async function submitReview(
  _prevState: SubmitReviewState | null,
  formData: FormData,
): Promise<SubmitReviewState> {
  const productHandle = readField(formData, "productHandle");
  const rating = Number(formData.get("rating"));
  const author = readField(formData, "author");
  const text = readField(formData, "text");

  if (!productHandle) {
    return { error: "Missing product." };
  }

  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    return { error: "Rating must be a whole number between 1 and 5." };
  }

  if (!author) {
    return { error: "Please enter your name." };
  }

  if (!text) {
    return { error: "Please write a short review." };
  }

  if (text.length > 1000) {
    return { error: "Reviews must be 1000 characters or fewer." };
  }

  addReview({ productHandle, rating, author, text });
  revalidatePath(`/product/${productHandle}`);

  return { success: true };
}
