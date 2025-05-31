import {
  Card,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Badge,
  Modal,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import { Edit, Search, Trash } from "lucide-react";
import React, { useState } from "react";
import { useData } from "../../context/data-context";
import type { Equipment, Notification } from "../../types";
import { v6 } from "uuid";

export default function SearchFilter() {
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const [open, setOpen] = useState(false);
  //   const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [condition, setCondition] = useState("");
  const [status, setStatus] = useState("");
  const [editingEquipment, setEditingEquipment] = useState<Equipment | null>(
    null
  );
  const [equipmentToDelete, setEquipmentToDelete] = useState<Equipment | null>(
    null
  );

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const handleOpenDeleteDialog = () => setOpenDeleteDialog(true);
  const handleCloseDeleteDialog = () => setOpenDeleteDialog(false);

  const { appData, updateEquipment, deleteEquipment, addNotification } =
    useData();

  const statuses = [
    { id: 0, name: "All" },
    { id: 1, name: "Available" },
    { id: 2, name: "Rented" },
    { id: 3, name: "Maintenance" },
  ];

  const categories = [
    { id: 0, name: "All" },
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

  const filteredEquipments = appData.equipment.filter((eq) => {
    const matchesSearch =
      eq.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      eq.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      selectedStatus === "All" || eq.status === selectedStatus;
    const matchesCategory =
      selectedCategory === "All" || eq.category === selectedCategory;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const handleEditEquipment = (equipment: Equipment) => {
    setEditingEquipment(equipment);
    setName(equipment.name);
    setCategory(equipment.category);
    setCondition(equipment.condition);
    setStatus(equipment.status);
    setOpen(true);
  };
  const handleSaveEditedEquipment = () => {
    if (!editingEquipment) return;

    // Mock updating logic; you'll want to use a context function in real apps
    const updated = {
      ...editingEquipment,
      name,
      category,
      condition: condition as "New" | "Good" | "Fair" | "Poor",
      status: status as "Available" | "Rented" | "Maintenance" | "Retired",
    };

    console.log("Updated Equipment:", updated);
    updateEquipment(updated);
    const notificationData: Notification = {
      id: v6(),
      message: `Updated Equipment ${updated.name} successfully`,
      timestamp: new Date().toISOString(),
    };
    addNotification([notificationData]);

    // Reset modal and editing state
    setEditingEquipment(null);
    setOpen(false);
  };

  const handleConfirmDelete = () => {
    if (equipmentToDelete) {
      deleteEquipment(equipmentToDelete.id);
      const notificationData: Notification = {
        id: v6(),
        message: `Deleted Equipment successfully`,
        timestamp: new Date().toISOString(),
      };
      addNotification([notificationData]);
      setEquipmentToDelete(null);
    }
    handleCloseDeleteDialog();
  };
  return (
    <React.Fragment>
      <Card className="px-8 py-4 w-full mt-4">
        <div className="flex gap-2">
          <Search />
          <p className="text-lg font-medium text-gray-500">Filters</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-4">
          <TextField
            label="Search Equipment..."
            variant="outlined"
            size="small"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {/* Status Filter */}
          <FormControl fullWidth size="small">
            <InputLabel id="status-select-label">Status</InputLabel>{" "}
            <Select
              labelId="status-select-label"
              id="status-select"
              value={selectedStatus}
              label="Status" // This prop is still needed for the floating label
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              {statuses.map((s) => (
                <MenuItem key={s.id} value={s.name}>
                  {s.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          {/* Category Filter */}
          <FormControl fullWidth size="small">
            <InputLabel id="category-select-label">Category</InputLabel>{" "}
            <Select
              labelId="category-select-label"
              id="category-select"
              value={selectedCategory}
              label="Category" // This prop is still needed for the floating label
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {categories.map((c) => (
                <MenuItem key={c.id} value={c.name}>
                  {c.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
      </Card>

      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredEquipments.map((equipment) => (
          <Card key={equipment.id} className="p-4">
            <div className="flex justify-between items-center">
              <p className="text-lg font-medium">{equipment.name}</p>
              <div className="flex gap-2 items-center">
                <button
                  className="cursor-pointer"
                  onClick={() => handleEditEquipment(equipment)}
                >
                  <Edit />
                </button>
                <button
                  className="cursor-pointer"
                  onClick={() => {
                    setEquipmentToDelete(equipment);
                    handleOpenDeleteDialog();
                  }}
                >
                  <Trash className="text-red-500" />
                </button>
              </div>
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
      <Modal open={open} onClose={handleClose}>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 bg-white p-4 rounded-md">
          <h1 className="text-2xl font-bold mb-4">Edit Item</h1>
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
                value={status}
                label="Status" // This prop is still needed for the floating label
                onChange={(e) => setStatus(e.target.value)}
              >
                {statuses.map((s) => (
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
                value={category}
                label="Status" // This prop is still needed for the floating label
                onChange={(e) => setCategory(e.target.value)}
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
              onClick={handleSaveEditedEquipment}
            >
              Save Changes
            </Button>
          </div>
        </div>
      </Modal>
      <Dialog
        open={openDeleteDialog}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Permanently Delete Equipment?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this equipment? This action cannot
            be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>Cancel</Button>
          <Button
            color="error"
            variant="contained"
            onClick={handleConfirmDelete}
            autoFocus
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
