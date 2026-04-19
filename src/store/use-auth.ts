import type { JwtPayload } from "@/services/iam/types";
import { create } from "zustand";
import { persist } from "zustand/middleware"; // <-- Importar persist

interface User extends JwtPayload {
    jwt: string;
}

interface AuthState {
    user: User | null;
    setUser: (user: User) => void;
}

const useAuth = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            setUser: (user) => set({ user }),
        }),
        {
            name: "auth-storage", // Nombre de la key en localStorage
        },
    ),
);

export default useAuth;
