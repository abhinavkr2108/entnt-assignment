import type { ReactNode } from "react";
import type { User } from "../types/index.ts";
export interface AuthContextType {
    user: User | null;
    login: (email: string, password: string) => boolean;
    logout: () => void;
    isAuthenticated: boolean;
    isAdminOrStaff: boolean;
    isCustomer: boolean;
    canManageEquipment: boolean;
    canManageRentals: boolean;
    canManageMaintenance: boolean;
}
export declare const useAuth: () => AuthContextType;
interface AuthProviderProps {
    children: ReactNode;
}
export declare const AuthProvider: ({ children }: AuthProviderProps) => import("react/jsx-runtime").JSX.Element;
export {};
