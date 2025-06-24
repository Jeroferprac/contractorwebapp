import { create } from "zustand"

type Client = {
  id: string
  name: string
  email: string
  phone: string
}

type ClientStore = {
  clients: Client[]
  addClient: (client: Client) => void
}

export const useClientStore = create<ClientStore>((set) => ({
  clients: [],
  addClient: (client) =>
    set((state) => ({
      clients: [...state.clients, client],
    })),
}))
