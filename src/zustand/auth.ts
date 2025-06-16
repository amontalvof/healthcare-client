import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface AuthState {
    accessToken: string | null;
    setCredentials: (token: string) => void;
    clearCredentials: () => void;
}

export const useAuthStore = create<AuthState>()(
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
