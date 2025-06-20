import { create } from "zustand"

type Quote = {
  id: string
  contractor: string
  amount: string
  status: "Pending" | "Approved" | "Rejected"
}

type QuoteState = {
  quotes: Quote[]
  addQuote: (quote: Quote) => void
}

export const useQuoteStore = create<QuoteState>((set) => ({
  quotes: [],
  addQuote: (quote) =>
    set((state) => ({
      quotes: [...state.quotes, quote],
    })),
}))
