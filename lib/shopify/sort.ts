type SortableProduct = {
  title: string;
  createdAt: string;
  priceRange: {
    minVariantPrice: {
      amount: string;
    };
  };
};

export function sortProducts<T extends SortableProduct>(
  products: T[],
  reverse = false,
  sortKey?: string,
): T[] {
  const sorted = [...products].sort((a, b) => {
    switch (sortKey) {
      case "PRICE":
        return (
          Number(a.priceRange.minVariantPrice.amount) -
          Number(b.priceRange.minVariantPrice.amount)
        );
      case "CREATED_AT":
        return (
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
      case "TITLE":
        return a.title.localeCompare(b.title);
      default:
        return 0;
    }
  });

  return reverse ? sorted.reverse() : sorted;
}
