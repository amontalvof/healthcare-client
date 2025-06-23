import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface AuthState {
    accessToken: string | null;
    setCredentials: (token: string) => void;
    clearCredentials: () => void;
}

export const useAuthCredentials = create<AuthState>()(
    persist(
        (set) => ({
            accessToken: null,
            setCredentials: (token: string) => set({ accessToken: token }),
            clearCredentials: () => set({ accessToken: null }),
        }),
        {
            name: 'auth-storage',
            storage: createJSONStorage(() => localStorage),
            // <-- whitelist only accessToken for persistence
            partialize: (state) => ({ accessToken: state.accessToken }),
        }
    )
);

interface DialogState {
    isAuthDialogOpen: boolean;
    setAuthDialogOpen: (open: boolean) => void;
}

export const useAuthDialog = create<DialogState>((set) => ({
    isAuthDialogOpen: false,
    setAuthDialogOpen: (open) => set({ isAuthDialogOpen: open }),
}));
