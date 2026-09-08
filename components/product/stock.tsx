import { getStock } from "lib/inventory";

export async function Stock({ handle }: { handle: string }) {
  const stock = await getStock(handle);

  return (
    <p
      className="mt-2 text-sm text-neutral-600 dark:text-neutral-400"
      data-testid="product-stock"
    >
      {stock === null ? "stock: unavailable" : `stock: ${stock}`}
    </p>
  );
}
