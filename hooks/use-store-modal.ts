"use client"

import { create } from "zustand"

type StoreModalState = {
  isOpen: boolean
  onOpen: () => void
  onClose: () => void
}

export const useStoreModal = create<StoreModalState>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}))
