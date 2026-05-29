import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { STORAGE_KEYS } from '@/config/constants';
import type { Toast, Theme } from '@/types';

interface UIState {
  theme: Theme;
  sidebarCollapsed: boolean;
  toasts: Toast[];
  isModalOpen: boolean;
  modalContent: React.ReactNode | null;
}

interface UIActions {
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
  clearToasts: () => void;
  openModal: (content: React.ReactNode) => void;
  closeModal: () => void;
}

type UIStore = UIState & UIActions;

let toastIdCounter = 0;

export const useUIStore = create<UIStore>()(
  persist(
    (set, get) => ({
      // Initial state
      theme: 'dark',
      sidebarCollapsed: false,
      toasts: [],
      isModalOpen: false,
      modalContent: null,

      // Actions
      setTheme: (theme: Theme) => {
        set({ theme });
        // Apply theme to document
        if (theme === 'dark') {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      },

      toggleTheme: () => {
        const currentTheme = get().theme;
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        get().setTheme(newTheme);
      },

      toggleSidebar: () => {
        set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed }));
      },

      setSidebarCollapsed: (collapsed: boolean) => {
        set({ sidebarCollapsed: collapsed });
      },

      addToast: (toast: Omit<Toast, 'id'>) => {
        const id = `toast-${++toastIdCounter}`;
        const newToast: Toast = { ...toast, id };
        
        set((state) => ({
          toasts: [...state.toasts, newToast],
        }));

        // Auto-remove toast after duration
        const duration = toast.duration || 5000;
        setTimeout(() => {
          get().removeToast(id);
        }, duration);
      },

      removeToast: (id: string) => {
        set((state) => ({
          toasts: state.toasts.filter((toast) => toast.id !== id),
        }));
      },

      clearToasts: () => {
        set({ toasts: [] });
      },

      openModal: (content: React.ReactNode) => {
        set({ isModalOpen: true, modalContent: content });
      },

      closeModal: () => {
        set({ isModalOpen: false, modalContent: null });
      },
    }),
    {
      name: 'ui-storage',
      partialize: (state) => ({
        theme: state.theme,
        sidebarCollapsed: state.sidebarCollapsed,
      }),
    }
  )
);

// Initialize theme on load
const storedTheme = localStorage.getItem(STORAGE_KEYS.THEME);
if (storedTheme === 'dark' || !storedTheme) {
  document.documentElement.classList.add('dark');
}

// Made with Bob
