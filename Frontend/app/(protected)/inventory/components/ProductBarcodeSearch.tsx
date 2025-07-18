import { useState } from "react";
import { useProductByBarcode } from "@/lib/hooks/useProductByBarcode";

export default function ProductBarcodeSearch() {
  const [barcode, setBarcode] = useState("");
  const { product, loading, error, fetchProduct } = useProductByBarcode();

  const handleSearch = () => {
    if (barcode.trim()) {
      fetchProduct(barcode.trim());
    }
  };

  return (
    <div>
      <input
        value={barcode}
        onChange={e => setBarcode(e.target.value)}
        placeholder="Enter barcode"
      />
      <button onClick={handleSearch} disabled={loading}>
        {loading ? "Searching..." : "Search"}
      </button>
      {product && (
        <div>
          <h3>Product: {product.name}</h3>
          <p>SKU: {product.sku}</p>
          {/* Add more product fields as needed */}
        </div>
      )}
      {error && <div style={{ color: "red" }}>{error}</div>}
    </div>
  );
} 