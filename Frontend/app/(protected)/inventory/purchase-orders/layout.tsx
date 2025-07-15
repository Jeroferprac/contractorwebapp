// ✅ Final version: app/(protected)/inventory/purchase-orders/layout.tsx
"use client";

import React from "react";

export default function PurchaseOrdersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>; // No duplicate DashboardLayout
}
