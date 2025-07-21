import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface AuthState {
    accessToken: string | null;
    imagePreview?: string;
    setImagePreview: (url: string | undefined) => void;
    setCredentials: (token: string) => void;
    clearCredentials: () => void;
}

export const useAuthCredentials = create<AuthState>()(
    persist<AuthState>(
        (set) => ({
            accessToken: null,
            imagePreview: undefined,
            setImagePreview: (url: string | undefined) =>
                set({ imagePreview: url }),
            setCredentials: (token: string) => set({ accessToken: token }),
            clearCredentials: () => set({ accessToken: null }),
        }),
        {
            name: 'auth-storage',
            storage: createJSONStorage(() => localStorage),
            //@ts-ignore
            partialize: (state) => ({
                accessToken: state.accessToken,
                imagePreview: state.imagePreview,
            }),
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
