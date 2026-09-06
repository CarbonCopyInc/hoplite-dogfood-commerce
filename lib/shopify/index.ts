import * as demo from "./demo";
import * as shopify from "./shopify";

// With no Shopify credentials the storefront runs against an in-memory demo
// catalog so the app boots and renders without a real store. Set
// SHOPIFY_STORE_DOMAIN and SHOPIFY_STOREFRONT_ACCESS_TOKEN to use Shopify.
const demoMode =
  !process.env.SHOPIFY_STORE_DOMAIN ||
  !process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;

const impl = demoMode ? demo : shopify;

export const createCart = impl.createCart;
export const addToCart = impl.addToCart;
export const removeFromCart = impl.removeFromCart;
export const updateCart = impl.updateCart;
export const getCart = impl.getCart;
export const getCollection = impl.getCollection;
export const getCollectionProducts = impl.getCollectionProducts;
export const getCollections = impl.getCollections;
export const getMenu = impl.getMenu;
export const getPage = impl.getPage;
export const getPages = impl.getPages;
export const getProduct = impl.getProduct;
export const getProductRecommendations = impl.getProductRecommendations;
export const getProducts = impl.getProducts;
export const revalidate = impl.revalidate;
