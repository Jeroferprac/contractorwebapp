import { useState } from "react";
import { getProductByBarcode } from "../inventory";
import type { Product } from "@/types/inventory"; // or "../../types/inventory"

export function useProductByBarcode() {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProduct = async (barcode: string) => {
    setLoading(true);
    setError(null);
    setProduct(null);
    try {
      const result = await getProductByBarcode(barcode);
      setProduct(result);
    } catch {
      setError("Product not found or error fetching product.");
    } finally {
      setLoading(false);
    }
  };

  return { product, loading, error, fetchProduct };
} 