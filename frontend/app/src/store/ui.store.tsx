import { create } from 'zustand';

interface UiStore {
  isMobileMenuOpen: boolean;
  isCartOpen: boolean;

  openMobileMenu: () => void;
  closeMobileMenu: () => void;
  toggleMobileMenu: () => void;

  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
}

export const useUiStore = create<UiStore>((set) => ({
  isMobileMenuOpen: false,
  isCartOpen: false,

  openMobileMenu: () => set({ isMobileMenuOpen: true }),

  closeMobileMenu: () => set({ isMobileMenuOpen: false }),

  toggleMobileMenu: () =>
    set((state) => ({
      isMobileMenuOpen: !state.isMobileMenuOpen,
    })),

  openCart: () => set({ isCartOpen: true }),

  closeCart: () => set({ isCartOpen: false }),

  toggleCart: () =>
    set((state) => ({
      isCartOpen: !state.isCartOpen,
    })),
}));