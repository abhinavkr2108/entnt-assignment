import React, { useState } from "react";
import { useData } from "../../context/data-context";
import {
  Badge,
  Button,
  Card,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import type { Dayjs } from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import type { Equipment, Rental } from "../../types";
import { v6 } from "uuid";
import { useAuth } from "../../context/auth-context";

export default function EquipmentCatalogPage() {
  const { appData, addRentals, updateEquipment } = useData();
  const { user } = useAuth();
  const equipments = appData.equipment || [];
  const customerId = user?.id;

  const [open, setOpen] = useState<boolean>(false);
  const [startDate, setStartDate] = useState<Dayjs | null>(null);
  const [endDate, setEndDate] = useState<Dayjs | null>(null);
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment | null>(
    null
  );

  const handleOpenDialog = (equipment: Equipment) => {
    setSelectedEquipment(equipment);
    setOpen(true);
  };

  const handleBookNow = () => {
    if (!startDate || !endDate || !selectedEquipment) {
      alert("Please select both start and end dates.");
      return;
    }

    const newRental: Rental = {
      id: v6(),
      equipmentId: selectedEquipment.id,
      customerId: customerId as string,
      startDate: startDate.format("YYYY-MM-DD"),
      endDate: endDate.format("YYYY-MM-DD"),
      status: "Reserved",
      rentalPrice: selectedEquipment.pricePerDay,
    };
    if (newRental) {
      addRentals([newRental]);
      setOpen(false);
      updateEquipment({ ...selectedEquipment, status: "Rented" });
    }
  };

  const handleCloseDialog = () => {
    setSelectedEquipment(null);
    setStartDate(null);
    setEndDate(null);
    setOpen(false);
  };

  return (
    <React.Fragment>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {equipments.map((equipment) => (
          <Card key={equipment.id} className="p-4">
            <div className="flex justify-between items-center">
              <div className="space-y-1.5">
                <p className="text-lg font-medium">{equipment.name}</p>
                <p className="text-sm text-gray-500">
                  Price per day: ${equipment?.pricePerDay}
                </p>
              </div>
              {equipment.status === "Available" && (
                <button
                  className="px-4 py-2 cursor-pointer bg-green-500 text-white rounded"
                  onClick={() => handleOpenDialog(equipment)}
                >
                  Book Now
                </button>
              )}
            </div>
            <div className="mt-4 px-8">
              <Badge
                color={equipment.status === "Available" ? "success" : "warning"}
                badgeContent={equipment.status}
              />
            </div>
            <p className="text-lg text-gray-500">{equipment.category}</p>

            <p className="text-sm text-gray-500">
              Condition: {equipment.condition}
            </p>
          </Card>
        ))}
      </div>
      <Dialog open={open} onClose={handleCloseDialog}>
        <DialogTitle>Book Now</DialogTitle>
        <DialogContent>
          <div className="mt-2">
            <p className="text-md font-medium mb-4">
              Select from which date to which date you want to book this item
            </p>
            <div className="flex flex-col gap-4">
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Start Date"
                  value={startDate}
                  onChange={(date) => setStartDate(date)}
                />
              </LocalizationProvider>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="End Date"
                  value={endDate}
                  onChange={(date) => setEndDate(date)}
                />
              </LocalizationProvider>
            </div>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="error">
            Cancel
          </Button>
          <Button onClick={handleBookNow} variant="contained">
            Book Now
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
