import { create } from "zustand";

type Quote = {
  id: string;
  contractor: string;
  amount: string;
  status: "Pending" | "Approved" | "Rejected";
};

type QuoteState = {
  quotes: Quote[];
  setQuotes: (quotes: Quote[]) => void;
};

export const useQuoteStore = create<QuoteState>((set) => ({
  quotes: [],
  setQuotes: (quotes) => set({ quotes }),
}));
