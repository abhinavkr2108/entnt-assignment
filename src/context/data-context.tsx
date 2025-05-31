import React, { createContext, useContext, useState, useEffect } from "react";
import type {
  User,
  AppState,
  Equipment,
  Maintenance,
  Rental,
  Notification,
} from "../types/index.ts";

const initialData: AppState = {
  users: [
    { id: "1", role: "Admin", email: "admin@entnt.in", password: "admin123" },
    { id: "2", role: "Staff", email: "staff@entnt.in", password: "staff123" },
    {
      id: "3",
      role: "Customer",
      email: "customer@entnt.in",
      password: "cust123",
    },
    {
      id: "4",
      role: "Customer",
      email: "jane@example.com",
      password: "password",
    },
  ],
  equipment: [
    {
      id: "eq1",
      name: "Excavator (Large)",
      category: "Heavy Machinery",
      condition: "Good",
      status: "Available",
      pricePerDay: 100, // updated
    },
    {
      id: "eq2",
      name: "Concrete Mixer (Portable)",
      category: "Construction",
      condition: "Good",
      status: "Rented",
      pricePerDay: 60, // updated
    },
    {
      id: "eq3",
      name: "Scaffolding Set (Small)",
      category: "Building Supplies",
      condition: "Fair",
      status: "Available",
      pricePerDay: 30, // updated
    },
    {
      id: "eq4",
      name: "Jackhammer (Electric)",
      category: "Demolition",
      condition: "Good",
      status: "Maintenance",
      pricePerDay: 20, // updated
    },
    {
      id: "eq5",
      name: "Generator (5kW)",
      category: "Power Tools",
      condition: "New",
      status: "Available",
      pricePerDay: 50, // updated
    },
    {
      id: "eq6",
      name: "Forklift (Electric)",
      category: "Heavy Machinery",
      condition: "Good",
      status: "Rented",
      pricePerDay: 90, // updated
    },
    {
      id: "eq7",
      name: "Pressure Washer",
      category: "Cleaning",
      condition: "Fair",
      status: "Available",
      pricePerDay: 40, // updated
    },
    {
      id: "eq8",
      name: "Air Compressor",
      category: "Tools",
      condition: "Fair",
      status: "Rented",
      pricePerDay: 45, // updated
    },
    {
      id: "eq9",
      name: "Welding Machine",
      category: "Fabrication",
      condition: "Good",
      status: "Available",
      pricePerDay: 35, // updated
    },
    {
      id: "eq10",
      name: "Mini Digger",
      category: "Heavy Machinery",
      condition: "New",
      status: "Available",
      pricePerDay: 85, // updated
    },
  ],
  rentals: [
    {
      id: "r1",
      equipmentId: "eq2",
      customerId: "3",
      startDate: "2025-05-20",
      endDate: "2025-06-05",
      status: "Rented",
      rentalPrice: 250,
    },
    {
      id: "r2",
      equipmentId: "eq8",
      customerId: "4",
      startDate: "2025-05-10",
      endDate: "2025-05-27",
      status: "Rented",
      rentalPrice: 80,
    },
    {
      id: "r3",
      equipmentId: "eq1",
      customerId: "3",
      startDate: "2025-06-10",
      endDate: "2025-06-15",
      status: "Reserved",
      rentalPrice: 400,
    },
    {
      id: "r4",
      equipmentId: "eq6",
      customerId: "4",
      startDate: "2025-05-01",
      endDate: "2025-05-07",
      status: "Returned",
      rentalPrice: 300,
    },
    {
      id: "r5",
      equipmentId: "eq6",
      customerId: "3",
      startDate: "2025-05-25",
      endDate: "2025-06-02",
      status: "Rented",
      rentalPrice: 300,
    },
  ],
  maintenance: [
    {
      id: "m1",
      equipmentId: "eq1",
      date: "2025-05-15",
      type: "Routine Check",
      notes: "Completed annual inspection.",
    },
    {
      id: "m2",
      equipmentId: "eq4",
      date: "2025-06-03",
      type: "Repair",
      notes: "Motor overheating, scheduled for repair.",
    },
    {
      id: "m3",
      equipmentId: "eq2",
      date: "2025-06-01",
      type: "Calibration",
      notes: "Scheduled mixer calibration.",
    },
    {
      id: "m4",
      equipmentId: "eq5",
      date: "2025-06-20",
      type: "Routine Check",
      notes: "Next quarter's check-up.",
    },
  ],
  notifications: [],
};

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

export const DataContext = createContext<DataContextType | undefined>(
  undefined
);

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error("useData must be used within a DataContextProvider");
  }
  return context;
};

interface DataProviderProps {
  children: React.ReactNode;
}

const STORAGE_KEY = "equipment_rental_data";

export const DataProvider = ({ children }: DataProviderProps) => {
  const [appData, setAppData] = useState<AppState>(() => {
    try {
      const storedData = localStorage.getItem(STORAGE_KEY);
      if (storedData) {
        return JSON.parse(storedData);
      }
    } catch (error) {
      console.error(error);
    }
    return initialData;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(appData));
    } catch (error) {
      console.error("Error saving data to localStorage:", error);
    }
  }, [appData]);

  const addEquipment = (newEquipment: Equipment[]) => {
    setAppData((prev) => ({
      ...prev,
      equipment: [...prev.equipment, ...newEquipment],
    }));
  };

  const updateEquipment = (updatedEquipment: Equipment) => {
    setAppData((prev) => ({
      ...prev,
      equipment: prev.equipment.map((eq) =>
        eq.id === updatedEquipment.id ? updatedEquipment : eq
      ),
    }));
  };

  const deleteEquipment = (id: string) => {
    setAppData((prevData) => ({
      ...prevData,
      equipment: prevData.equipment.filter((eq) => eq.id !== id),
    }));
  };

  const addRentals = (newRentals: Rental[]) => {
    setAppData((prev) => ({
      ...prev,
      rentals: [...prev.rentals, ...newRentals],
    }));
  };

  const updateRental = (updatedRental: Rental) => {
    setAppData((prev) => ({
      ...prev,
      rentals: prev.rentals.map((rental) =>
        rental.id === updatedRental.id ? updatedRental : rental
      ),
    }));
  };

  const deleteRental = (id: string) => {
    setAppData((prevData) => ({
      ...prevData,
      rentals: prevData.rentals.filter((rental) => rental.id !== id),
    }));
  };

  const addMaintenance = (newMaintenance: Maintenance[]) => {
    setAppData((prev) => ({
      ...prev,
      maintenance: [...prev.maintenance, ...newMaintenance],
    }));
  };

  const deleteMaintenance = (maintenanceId: string) => {
    setAppData((prevData) => ({
      ...prevData,
      maintenance: prevData.maintenance.filter((m) => m.id !== maintenanceId),
    }));
  };

  const updateMaintenance = (updatedMaintenance: Maintenance) => {
    setAppData((prev) => ({
      ...prev,
      maintenance: prev.maintenance.map((m) =>
        m.id === updatedMaintenance.id ? updatedMaintenance : m
      ),
    }));
  };

  const addUsers = (newUsers: User[]) => {
    setAppData((prev) => ({ ...prev, users: [...prev.users, ...newUsers] }));
  };

  const addNotification = (newNotification: Notification[]) => {
    setAppData((prevData) => ({
      ...prevData,
      notifications: (prevData.notifications || []).concat(newNotification),
    }));
  };

  const deleteNotification = (notificationId: string) => {
    setAppData((prevData) => ({
      ...prevData,
      notifications: prevData.notifications.filter(
        (n) => n.id !== notificationId
      ),
    }));
  };

  return (
    <DataContext.Provider
      value={{
        appData,
        addEquipment,
        addRentals,
        updateRental,
        deleteRental,
        addMaintenance,
        deleteMaintenance,
        updateMaintenance,
        addUsers,
        updateEquipment,
        deleteEquipment,
        addNotification,
        deleteNotification,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};
