import { create } from 'zustand';

export const useRedirect = create<{
    to: string | null;
    setTo: (to: string | null) => void;
}>((set) => ({
    to: null,
    setTo: (to) => set({ to }),
}));
