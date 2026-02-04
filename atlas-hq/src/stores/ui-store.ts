import { create } from 'zustand';

interface UIState {
  sidebarCollapsed: boolean;
  terminalOpen: boolean;
  terminalExpanded: boolean;
  toggleSidebar: () => void;
  toggleTerminal: () => void;
  toggleTerminalExpanded: () => void;
  setTerminalOpen: (open: boolean) => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
}

export const useUIStore = create<UIState>((set) => ({
  sidebarCollapsed: false,
  terminalOpen: false,
  terminalExpanded: false,
  toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
  toggleTerminal: () => set((state) => ({ terminalOpen: !state.terminalOpen })),
  toggleTerminalExpanded: () => set((state) => ({ terminalExpanded: !state.terminalExpanded })),
  setTerminalOpen: (open) => set({ terminalOpen: open }),
  setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
}));
