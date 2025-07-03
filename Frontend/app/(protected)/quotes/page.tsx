"use client";

import { useEffect, useState } from "react";
import { useQuoteStore } from "@/store/quoteStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { fetchQuotations } from "@/lib/quotation";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

export default function QuotesPage() {
  const { data: session } = useSession();
  const quotes = useQuoteStore((state) => state.quotes);
  const setQuotes = useQuoteStore((state) => state.setQuotes);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadQuotes = async () => {
      try {
        if (!session?.backendAccessToken) {
          toast.error("Please login to view quotations");
          return;
        }
        const data = await fetchQuotations(session.backendAccessToken);

        // ✅ Ensure data is array
        if (Array.isArray(data)) {
          setQuotes(data);
        } else {
          toast.error("Invalid quotations data");
        }
      } catch (error) {
        console.error(error);
        toast.error("Failed to load quotations");
      } finally {
        setLoading(false);
      }
    };

    loadQuotes();
  }, [session?.backendAccessToken, setQuotes]);

  if (loading) {
    return <p>Loading quotations...</p>;
  }

  if (quotes.length === 0) {
    return <p>No quotations found.</p>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {quotes.map((quote) => (
        <Card key={quote.id}>
          <CardHeader>
            <CardTitle className="text-base">Quote #{quote.id}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Contractor</p>
              <p>{quote.contractor}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Amount</p>
              <p>${quote.amount}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Status</p>
              <Badge variant={getStatusVariant(quote.status)}>{quote.status}</Badge>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function getStatusVariant(status: string) {
  switch (status.toLowerCase()) {
    case "approved":
      return "default";
    case "rejected":
      return "destructive";
    case "pending":
    default:
      return "secondary";
  }
}
