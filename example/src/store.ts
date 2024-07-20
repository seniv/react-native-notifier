import { create } from 'zustand';

interface AppStore {
  statusBar: boolean;
  statusBarTranslucent: boolean;
  toggleStatusBar: () => void;
  toggleStatusBarTranslucent: () => void;
}

export const useAppStore = create<AppStore>()((set) => ({
  statusBar: true,
  statusBarTranslucent: false,
  toggleStatusBar: () => set((state) => ({ statusBar: !state.statusBar })),
  toggleStatusBarTranslucent: () =>
    set((state) => ({ statusBarTranslucent: !state.statusBarTranslucent })),
}));
