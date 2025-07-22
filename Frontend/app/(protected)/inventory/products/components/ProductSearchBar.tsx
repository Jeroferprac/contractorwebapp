"use client"

import React, { useState, useRef, useCallback } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { getProductByBarcode } from "@/lib/inventory";
// Use the Product type from your types file for consistency
import type { Product } from "@/types/inventory";
import { Input } from "@/components/ui/input";
import { Search, Camera } from "lucide-react";

interface ProductSearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function ProductSearchBar({ value, onChange, placeholder = "Search products..." }: ProductSearchBarProps) {
  const [scannerOpen, setScannerOpen] = useState(false);
  const [scannedProduct, setScannedProduct] = useState<Product | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const html5QrcodeRef = useRef<Html5Qrcode | null>(null);
  const scannerId = "html5qr-code-full-region";

  // useCallback to avoid missing dependency warning
  const handleBarcodeScan = useCallback(async (barcode: string) => {
    setScannerOpen(false);
    setError("");
    setLoading(true);
    if (html5QrcodeRef.current) {
      await html5QrcodeRef.current.stop();
      html5QrcodeRef.current.clear();
    }
    const product = await getProductByBarcode(barcode);
    setLoading(false);
    if (product) {
      setScannedProduct(product);
      onChange(barcode);
    } else {
      setScannedProduct(null);
      setError("Product not found!");
    }
  }, [onChange]);

  // Start scanner when modal opens
  React.useEffect(() => {
    if (scannerOpen) {
      setError("");
      setScannedProduct(null);
      if (!html5QrcodeRef.current) {
        html5QrcodeRef.current = new Html5Qrcode(scannerId);
      }
      html5QrcodeRef.current.start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: { width: 300, height: 150 },
          aspectRatio: 2.0,
        },
        (decodedText) => {
          handleBarcodeScan(decodedText);
        },
        () => {
          // Optionally handle scan errors
        }
      ).catch((err) => {
        setError("Camera error: " + err);
      });
    } else if (html5QrcodeRef.current) {
      try { html5QrcodeRef.current.stop(); } catch {}
      try { html5QrcodeRef.current.clear(); } catch {}
    }
    // Cleanup on unmount
    return () => {
      if (html5QrcodeRef.current) {
        try { html5QrcodeRef.current.stop(); } catch {}
        try { html5QrcodeRef.current.clear(); } catch {}
      }
    };
  }, [scannerOpen, handleBarcodeScan]);

  return (
    <div className="relative w-full max-w-sm lg:max-w-md flex items-center">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-500/70 w-4 h-4" />
      <Input
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="pl-10 pr-12 bg-gradient-to-r from-background to-muted/20 text-foreground border-border/50 hover:border-purple-500/50 focus:border-purple-500 rounded-xl shadow-lg backdrop-blur-sm transition-all duration-300"
      />
      <button
        type="button"
        onClick={() => setScannerOpen(true)}
        className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center justify-center bg-transparent hover:bg-purple-100 dark:hover:bg-purple-900 rounded-full p-2 transition"
        aria-label="Scan Barcode"
      >
        <Camera className="w-5 h-5 text-purple-500" />
      </button>
      {scannerOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-xl shadow-lg relative min-w-[350px] min-h-[250px]">
            <button
              className="absolute top-2 right-2 text-gray-500"
              onClick={() => setScannerOpen(false)}
            >
              ✕
            </button>
            <div id={scannerId} className="w-[350px] h-[200px] mx-auto" />
            <div className="text-center mt-2 text-sm text-gray-600">Align barcode within the frame</div>
            {error && <div className="text-red-500 text-xs mt-2">{error}</div>}
          </div>
        </div>
      )}
      {loading && <div className="text-blue-500 text-xs">Searching...</div>}
      {error && !scannerOpen && <div className="text-red-500 text-xs">{error}</div>}
      {scannedProduct && (
        <div className="absolute top-full left-0 bg-white shadow-lg rounded p-2 mt-2 w-full z-50">
          <div className="font-bold">{scannedProduct.name}</div>
          <div>SKU: {scannedProduct.sku}</div>
          <div>Barcode: {scannedProduct.barcode}</div>
          <div>Category: {scannedProduct.category}</div>
          <div>Brand: {scannedProduct.brand}</div>
        </div>
      )}
    </div>
  );
}
