import React from "react";
import type { User, AppState, Equipment, Maintenance, Rental, Notification } from "../types/index.ts";
interface DataContextType {
    appData: AppState;
    addEquipment: (newEquipment: Equipment[]) => void;
    addRentals: (newRentals: Rental[]) => void;
    updateRental: (updatedRental: Rental) => void;
    deleteRental: (rentalId: string) => void;
    addMaintenance: (newMaintenance: Maintenance[]) => void;
    deleteMaintenance: (maintenanceId: string) => void;
    updateMaintenance: (updatedMaintenance: Maintenance) => void;
    addUsers: (newUsers: User[]) => void;
    updateEquipment: (updatedEquipment: Equipment) => void;
    deleteEquipment: (equipmentId: string) => void;
    addNotification: (newNotification: Notification[]) => void;
    deleteNotification: (notificationId: string) => void;
}
export declare const DataContext: React.Context<DataContextType | undefined>;
export declare const useData: () => DataContextType;
interface DataProviderProps {
    children: React.ReactNode;
}
export declare const DataProvider: ({ children }: DataProviderProps) => import("react/jsx-runtime").JSX.Element;
export {};
