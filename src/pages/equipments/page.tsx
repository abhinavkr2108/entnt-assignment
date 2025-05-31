import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import React, { useState } from "react";
import SearchFilter from "../../components/equipments/search-filter";
import Modal from "@mui/material/Modal";
import { useData } from "../../context/data-context";
import type { Notification } from "../../types";
import { v6 } from "uuid";

export default function EquipmentsPage() {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [name, setName] = useState<string>("");
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  const [condition, setCondition] = useState<string>("");

  const status = [
    { id: 1, name: "Available" },
    { id: 2, name: "Rented" },
    { id: 3, name: "Maintenance" },
    { id: 4, name: "Retired" },
  ];
  const categories = [
    { id: 1, name: "Construction" },
    { id: 2, name: "Heavy Machinery" },
    { id: 3, name: "Construction" },
    { id: 4, name: "Material Handling" },
    { id: 5, name: "Power Tools" },
    { id: 6, name: "Building Supplies" },
    { id: 7, name: "Demolition" },
    { id: 8, name: "Cleaning" },
    { id: 9, name: "Tools" },
    { id: 10, name: "Fabrications" },
  ];

  const conditionArray = [
    { id: 1, name: "New" },
    { id: 2, name: "Good" },
    { id: 3, name: "Fair" },
    { id: 4, name: "Poor" },
  ];

  const { addEquipment, addNotification } = useData();

  const handleAddEquipment = () => {
    const newEquipment = {
      id: Date.now().toString(),
      name,
      category: selectedCategory,
      condition: condition as "New" | "Good" | "Fair" | "Poor",
      status: selectedStatus as
        | "Available"
        | "Rented"
        | "Maintenance"
        | "Retired",
    };
    addEquipment([newEquipment]);

    const notificationData: Notification = {
      id: v6(),
      message: `New equipment added: ${name}`,
      timestamp: new Date().toISOString(),
    };
    addNotification([notificationData]);
    handleClose();
  };

  return (
    <React.Fragment>
      <div className="flex flex-col gap-2 md:flex-row md:justify-between md:items-center mt-4">
        <div>
          <h1 className="text-2xl font-bold">Equipments</h1>
          <h2 className="font-medium text-lg text-gray-500">
            Manage your equipment inventory
          </h2>
        </div>
        <Button
          variant="contained"
          className="w-full md:w-fit"
          onClick={handleOpen}
        >
          Add New Equipment
        </Button>
        <Modal open={open} onClose={handleClose}>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 bg-white p-4 rounded-md">
            <h1 className="text-2xl font-bold mb-4">Add New Item</h1>
            <div className="flex flex-col gap-4">
              <TextField
                label="Equipment Name"
                variant="outlined"
                size="small"
                value={name}
                onChange={(e) => setName(e.target.value)}
                fullWidth
                required
              />
              <FormControl fullWidth size="small">
                <InputLabel id="status-select-label">Status</InputLabel>{" "}
                <Select
                  labelId="status-select-label"
                  id="status-select"
                  value={selectedStatus}
                  label="Status" // This prop is still needed for the floating label
                  onChange={(e) => setSelectedStatus(e.target.value)}
                >
                  {status.map((s) => (
                    <MenuItem key={s.id} value={s.name}>
                      {s.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl fullWidth size="small">
                <InputLabel id="status-category-label">Category</InputLabel>{" "}
                <Select
                  labelId="category-select-label"
                  id="category-select"
                  value={selectedCategory}
                  label="Status" // This prop is still needed for the floating label
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  {categories.map((c) => (
                    <MenuItem key={c.id} value={c.name}>
                      {c.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth size="small">
                <InputLabel id="condition-select-label">Condition</InputLabel>{" "}
                <Select
                  labelId="condition-select-label"
                  id="condition-select"
                  value={condition}
                  label="Condition"
                  onChange={(e) => setCondition(e.target.value)}
                >
                  {conditionArray.map((c) => (
                    <MenuItem key={c.id} value={c.name}>
                      {c.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Button
                variant="contained"
                className="btn btn-primary"
                onClick={handleAddEquipment}
              >
                Add
              </Button>
            </div>
          </div>
        </Modal>
      </div>
      <SearchFilter />
    </React.Fragment>
  );
}
