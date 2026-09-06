import { Carousel } from "components/carousel";
import { NewArrivals } from "components/grid/new-arrivals";
import { ThreeItemGrid } from "components/grid/three-items";
import Footer from "components/layout/footer";

const { SITE_NAME } = process.env;

export const metadata = {
  description:
    "High-performance ecommerce store built with Next.js, Vercel, and Shopify.",
  openGraph: {
    type: "website",
    siteName: SITE_NAME!,
  },
};

export default function HomePage() {
  return (
    <>
      <ThreeItemGrid />
      <Carousel />
      <NewArrivals />
      <Footer />
    </>
  );
}
