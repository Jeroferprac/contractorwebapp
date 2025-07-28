"use client";

import { useSession } from "next-auth/react";
import QuotationForm from "../components/QuotationForm";

export default function NewQuotationPage() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-center">Checking login...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <QuotationForm />
    </div>
  );
}
