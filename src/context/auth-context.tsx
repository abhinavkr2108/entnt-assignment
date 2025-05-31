import { createContext, useContext, useState, useEffect } from "react";
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

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    try {
      const currentUser = localStorage.getItem("current_user");
      if (currentUser) {
        setUser(JSON.parse(currentUser));
      }
    } catch (error) {
      console.error(error);
      localStorage.removeItem("currentUser");
    }
  }, []);

  const demoCredentials = [
    { id: "1", email: "admin@entnt.in", password: "admin123", role: "Admin" },
    { id: "2", email: "staff@entnt.in", password: "staff123", role: "Staff" },
    {
      id: "3",
      email: "customer@entnt.in",
      password: "cust123",
      role: "Customer",
    },
  ];

  const login = (email: string, password: string) => {
    const foundUser = demoCredentials.find(
      (cred) => cred.email === email && cred.password === password
    );
    if (foundUser) {
      const userToStore: User = {
        id: foundUser.id,
        email: foundUser.email,
        password: foundUser.password,
        role: foundUser.role as "Admin" | "Staff" | "Customer",
      };
      localStorage.setItem("current_user", JSON.stringify(userToStore));
      setUser(userToStore);
      return true;
    } else {
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("current_user");
  };

  const isAuthenticated = !!user;
  const isAdmin = user?.role === "Admin";
  const isStaff = user?.role === "Staff";
  const isCustomer = user?.role === "Customer";
  const isAdminOrStaff = isAdmin || isStaff;
  const canManageEquipment = isAdminOrStaff;
  const canManageRentals = isAdminOrStaff;
  const canManageMaintenance = isAdminOrStaff;

  const value = {
    user,
    login,
    logout,
    isAuthenticated,
    isAdminOrStaff,
    canManageEquipment,
    canManageRentals,
    canManageMaintenance,
    isCustomer,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
