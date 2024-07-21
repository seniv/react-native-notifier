import { create } from 'zustand';

interface AppStore {
  statusBar: boolean;
  statusBarTranslucent: boolean;
  useRNScreensOverlay: boolean;
  toggleStatusBar: () => void;
  toggleStatusBarTranslucent: () => void;
  toggleUseRNScreensOverlay: () => void;
}

export const useAppStore = create<AppStore>()((set) => ({
  statusBar: true,
  statusBarTranslucent: false,
  useRNScreensOverlay: true,
  toggleStatusBar: () => set((state) => ({ statusBar: !state.statusBar })),
  toggleStatusBarTranslucent: () =>
    set((state) => ({ statusBarTranslucent: !state.statusBarTranslucent })),
  toggleUseRNScreensOverlay: () =>
    set((state) => ({ useRNScreensOverlay: !state.useRNScreensOverlay })),
}));
