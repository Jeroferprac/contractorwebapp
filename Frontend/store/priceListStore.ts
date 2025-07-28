import { create } from 'zustand';
import { PriceList, CreatePriceListData, UpdatePriceListData, getPriceLists, createPriceList, updatePriceList, deletePriceList } from '@/app/lib/priceList';

interface PriceListStore {
  priceLists: PriceList[];
  loading: boolean;
  error: string | null;
  fetchPriceLists: () => Promise<void>;
  createPriceList: (data: CreatePriceListData) => Promise<void>;
  updatePriceList: (id: string, data: UpdatePriceListData) => Promise<void>;
  deletePriceList: (id: string) => Promise<void>;
  clearError: () => void;
}

export const usePriceListStore = create<PriceListStore>((set, get) => ({
  priceLists: [],
  loading: false,
  error: null,

  fetchPriceLists: async () => {
    set({ loading: true, error: null });
    try {
      console.log('🔄 Store: Fetching price lists...');
      const priceLists = await getPriceLists(); // Changed to getPriceLists
      console.log('✅ Store: Price lists fetched successfully:', priceLists);
      set({ priceLists, loading: false });
    } catch (error) {
      console.error('❌ Store: Error fetching price lists:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch price lists', 
        loading: false 
      });
    }
  },

  createPriceList: async (data: CreatePriceListData) => {
    set({ loading: true, error: null });
    try {
      console.log('🔄 Store: Creating price list...', data);
      const newPriceList = await createPriceList(data);
      console.log('✅ Store: Price list created successfully:', newPriceList);
      set(state => ({ 
        priceLists: [...state.priceLists, newPriceList], 
        loading: false 
      }));
    } catch (error) {
      console.error('❌ Store: Error creating price list:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to create price list', 
        loading: false 
      });
      throw error;
    }
  },

  updatePriceList: async (id: string, data: UpdatePriceListData) => {
    set({ loading: true, error: null });
    try {
      console.log('🔄 Store: Updating price list...', { id, data });
      const updatedPriceList = await updatePriceList(id, data);
      console.log('✅ Store: Price list updated successfully:', updatedPriceList);
      set(state => ({ 
        priceLists: state.priceLists.map(pl => 
          pl.id === id ? updatedPriceList : pl
        ), 
        loading: false 
      }));
    } catch (error) {
      console.error('❌ Store: Error updating price list:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to update price list', 
        loading: false 
      });
      throw error;
    }
  },

  deletePriceList: async (id: string) => {
    set({ loading: true, error: null });
    try {
      console.log('🔄 Store: Deleting price list...', id);
      await deletePriceList(id);
      console.log('✅ Store: Price list deleted successfully');
      set(state => ({ 
        priceLists: state.priceLists.filter(pl => pl.id !== id), 
        loading: false 
      }));
    } catch (error) {
      console.error('❌ Store: Error deleting price list:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to delete price list', 
        loading: false 
      });
      throw error;
    }
  },

  clearError: () => set({ error: null }),
})); 