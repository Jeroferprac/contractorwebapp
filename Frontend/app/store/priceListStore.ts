import { create } from "zustand";
import type { PriceList, PriceListItem } from "@/lib/priceList";
import {
  getPriceLists,
  getPriceList,
  createPriceList as apiCreatePriceList,
  updatePriceList as apiUpdatePriceList,
  getPriceListItems,
  addPriceListItem as apiAddPriceListItem,
} from "@/lib/priceList";

interface PriceListState {
  priceLists: PriceList[];
  selectedPriceList: PriceList | null;
  items: PriceListItem[];
  loading: boolean;
  error: string | null;
  fetchPriceLists: () => Promise<void>;
  fetchPriceList: (id: string) => Promise<void>;
  createPriceList: (data: any) => Promise<void>;
  updatePriceList: (id: string, data: any) => Promise<void>;
  fetchPriceListItems: (id: string) => Promise<void>;
  addPriceListItem: (id: string, data: any) => Promise<void>;
}

export const usePriceListStore = create<PriceListState>((set, get) => ({
  priceLists: [],
  selectedPriceList: null,
  items: [],
  loading: false,
  error: null,
  fetchPriceLists: async () => {
    set({ loading: true, error: null });
    try {
      console.log('PriceListStore: Fetching price lists...');
      const priceLists = await getPriceLists();
      console.log('PriceListStore: Price lists fetched successfully:', priceLists);
      set({ priceLists });
    } catch (error: any) {
      console.error('PriceListStore: Error fetching price lists:', error);
      set({ error: error.message || 'Failed to fetch price lists' });
    } finally {
      set({ loading: false });
    }
  },
  fetchPriceList: async (id) => {
    set({ loading: true, error: null });
    try {
      const selectedPriceList = await getPriceList(id);
      set({ selectedPriceList });
    } catch (error: any) {
      set({ error: error.message || 'Failed to fetch price list' });
    } finally {
      set({ loading: false });
    }
  },
  createPriceList: async (data) => {
    set({ loading: true, error: null });
    try {
      console.log('PriceListStore: Creating price list with data:', data);
      await apiCreatePriceList(data);
      console.log('PriceListStore: Price list created successfully');
      // Refresh the price list
      await get().fetchPriceLists();
    } catch (error: any) {
      console.error('PriceListStore: Error creating price list:', error);
      set({ error: error.message || 'Failed to create price list' });
    } finally {
      set({ loading: false });
    }
  },
  updatePriceList: async (id, data) => {
    set({ loading: true, error: null });
    try {
      console.log('PriceListStore: Updating price list with ID:', id, 'data:', data);
      await apiUpdatePriceList(id, data);
      console.log('PriceListStore: Price list updated successfully');
      // Refresh the price list
      await get().fetchPriceLists();
    } catch (error: any) {
      console.error('PriceListStore: Error updating price list:', error);
      set({ error: error.message || 'Failed to update price list' });
    } finally {
      set({ loading: false });
    }
  },
  fetchPriceListItems: async (id) => {
    set({ loading: true, error: null });
    try {
      const items = await getPriceListItems(id);
      set({ items });
    } catch (error: any) {
      set({ error: error.message || 'Failed to fetch price list items' });
    } finally {
      set({ loading: false });
    }
  },
  addPriceListItem: async (id, data) => {
    set({ loading: true, error: null });
    try {
      await apiAddPriceListItem(id, data);
      // Refresh the items
      await get().fetchPriceListItems(id);
    } catch (error: any) {
      set({ error: error.message || 'Failed to add price list item' });
    } finally {
      set({ loading: false });
    }
  },
})); 