import { create } from 'zustand';

interface CategoryStore {
  page: number;
  limit: number;
  search: string;
  isActive?: boolean;

  isCreateModalOpen: boolean;
  isEditModalOpen: boolean;

  selectedCategoryId: string | null;

  setPage: (page: number) => void;
  setSearch: (search: string) => void;
  setIsActive: (isActive?: boolean) => void;

  openCreateModal: () => void;
  closeCreateModal: () => void;

  openEditModal: (id: string) => void;
  closeEditModal: () => void;
}

export const useCategoryStore = create<CategoryStore>((set) => ({
  page: 1,
  limit: 10,
  search: '',
  isActive: undefined,

  isCreateModalOpen: false,
  isEditModalOpen: false,

  selectedCategoryId: null,

  setPage: (page) => set({ page }),

  setSearch: (search) =>
    set({
      search,
      page: 1,
    }),

  setIsActive: (isActive) =>
    set({
      isActive,
      page: 1,
    }),

  openCreateModal: () =>
    set({
      isCreateModalOpen: true,
    }),

  closeCreateModal: () =>
    set({
      isCreateModalOpen: false,
    }),

  openEditModal: (id) =>
    set({
      isEditModalOpen: true,
      selectedCategoryId: id,
    }),

  closeEditModal: () =>
    set({
      isEditModalOpen: false,
      selectedCategoryId: null,
    }),
}));