export interface User {
    id: string;
    email: string;
    password: string;
    role: "Admin" | "Staff" | "Customer";
}
export interface Equipment {
    id: string;
    name: string;
    category: string;
    condition: "New" | "Good" | "Fair" | "Poor";
    status: "Available" | "Rented" | "Maintenance" | "Retired";
    pricePerDay?: number;
}
export interface Rental {
    id: string;
    equipmentId: string;
    customerId: string;
    startDate: string;
    endDate: string;
    status: "Reserved" | "Rented" | "Returned" | "Cancelled";
    rentalPrice?: number;
}
export interface Maintenance {
    id: string;
    equipmentId: string;
    date: string;
    type: "Routine Check" | "Repair" | "Calibration" | "Cleaning";
    notes: string;
}
export interface Notification {
    id: string;
    message: string;
    timestamp: string;
}
export interface AppState {
    users: User[];
    equipment: Equipment[];
    rentals: Rental[];
    maintenance: Maintenance[];
    notifications: Notification[];
}
