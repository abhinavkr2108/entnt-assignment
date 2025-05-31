import React, { useState } from "react";
import { useData } from "../../context/data-context";
import dayjs, { Dayjs } from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";
import { Edit, Trash } from "lucide-react";
import type { Maintenance, Notification } from "../../types";
import { v6 } from "uuid";

export default function MaintenancePage() {
  const {
    appData,
    addMaintenance,
    deleteMaintenance,
    updateMaintenance,
    addNotification,
  } = useData();
  const [form, setForm] = useState({
    equipmentId: "",
    type: "",
    notes: "",
  });

  const [date, setDate] = useState<Dayjs | null>(null);

  const types = [
    { value: "Routine Check", label: "Routine Check", id: 1 },
    { value: "Repair", label: "Repair", id: 2 },
    { value: "Calibration", label: "Calibration", id: 3 },
    { value: "Cleaning", label: "Cleaning", id: 4 },
  ];

  //Edit Dialog
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingMaintenance, setEditingMaintenance] =
    useState<Maintenance | null>(null);
  const [editForm, setEditForm] = useState({
    id: "",
    equipmentId: "",
    type: "",
    notes: "",
  });
  const [editDate, setEditDate] = useState<Dayjs | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.equipmentId || !form.type || !date) {
      alert("Please fill all required fields.");
      return;
    }

    const newMaintenance = {
      id: new Date().getTime().toString(),
      equipmentId: form.equipmentId,
      date: date.format("YYYY-MM-DD"), // formatted date string
      type: form.type as
        | "Routine Check"
        | "Repair"
        | "Calibration"
        | "Cleaning",
      notes: form.notes,
    };

    addMaintenance([newMaintenance]);
    const notificationData: Notification = {
      id: v6(),
      message: `Added Equipment successfully`,
      timestamp: new Date().toISOString(),
    };
    addNotification([notificationData]);
    setForm({ equipmentId: "", type: "", notes: "" });
    setDate(null);
  };

  const handleDeleteMaintenance = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (
      window.confirm("Are you sure you want to delete this maintenance record?")
    ) {
      deleteMaintenance(id);
      const notificationData: Notification = {
        id: v6(),
        message: `Deleted Equipment successfully`,
        timestamp: new Date().toISOString(),
      };
      addNotification([notificationData]);
    }
  };

  const handleEditButtonClick = (maintenance: Maintenance) => {
    setIsEditDialogOpen(true);
    setEditingMaintenance(maintenance);
    setEditForm({
      id: maintenance.id,
      equipmentId: maintenance.equipmentId,
      type: maintenance.type,
      notes: maintenance.notes,
    });
    setEditDate(dayjs(maintenance.date));
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMaintenance) return;
    if (!editForm.equipmentId || !editForm.type || !editDate) {
      alert("Please fill all required fields.");
      return;
    }

    const updatedMaintenance = {
      ...editingMaintenance,
      equipmentId: editForm.equipmentId,
      type: editForm.type as
        | "Routine Check"
        | "Repair"
        | "Calibration"
        | "Cleaning",
      date: editDate?.format("YYYY-MM-DD") || "",
      notes: editForm.notes,
    };
    updateMaintenance(updatedMaintenance);
    const notificationData: Notification = {
      id: v6(),
      message: `Updated Equipment successfully`,
      timestamp: new Date().toISOString(),
    };
    addNotification([notificationData]);
    setIsEditDialogOpen(false);
    setEditingMaintenance(null);
  };

  const handleCloseDialog = () => {
    setIsEditDialogOpen(false);
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Maintenance Records</h2>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow className="bg-gray-100">
              <TableCell sx={{ fontWeight: "bold" }}>Equipment Name</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Date</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Type</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Notes</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Status</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}></TableCell>
              <TableCell sx={{ fontWeight: "bold" }}></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {appData.maintenance.map((m) => (
              <TableRow key={m.id}>
                <TableCell>
                  {appData.equipment.find(
                    (e) => e.id === m.equipmentId.toString()
                  )?.name || "N/A"}
                </TableCell>
                <TableCell>{m.date}</TableCell>
                <TableCell>{m.type}</TableCell>
                <TableCell>{m.notes}</TableCell>
                <TableCell>
                  {new Date(m.date) > new Date() ? (
                    <span className="text-yellow-600">Upcoming</span>
                  ) : (
                    <span className="text-green-600">Completed</span>
                  )}
                </TableCell>
                <TableCell>
                  {
                    <button
                      className="cursor-pointer"
                      onClick={(e) => handleDeleteMaintenance(m.id, e)}
                    >
                      <Trash className="w-4 h-4 text-red-600" />
                    </button>
                  }
                </TableCell>
                <TableCell>
                  {
                    <button
                      className="cursor-pointer"
                      onClick={() => handleEditButtonClick(m)}
                    >
                      <Edit className="w-4 h-4 text-blue-600" />
                    </button>
                  }
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <h3 className="text-lg font-semibold mt-6">Add Maintenance</h3>
      <form
        className="space-y-2 mt-2 flex gap-3 flex-wrap"
        onSubmit={handleSubmit}
      >
        <FormControl className="w-full md:w-1/3 lg:w-1/5">
          <InputLabel id="equipment-select-label">Equipment</InputLabel>{" "}
          <Select
            labelId="equipment-select-label"
            id="status-select"
            value={form.equipmentId}
            label="equipment"
            onChange={(e) => setForm({ ...form, equipmentId: e.target.value })}
          >
            {appData.equipment.map((eq) => (
              <MenuItem key={eq.id} value={eq.id}>
                {eq.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <FormControl className="w-full md:w-1/3 lg:w-1/5">
            <DatePicker
              value={date}
              onChange={(newValue) => setDate(newValue)}
            />
          </FormControl>
        </LocalizationProvider>

        <FormControl className="w-full md:w-1/3 lg:w-1/5">
          <InputLabel id="equipment-select-label">Type</InputLabel>{" "}
          <Select
            labelId="type-select-label"
            id="type-select"
            value={form.type}
            label="type"
            onChange={(e) => setForm({ ...form, type: e.target.value })}
          >
            {types.map((m) => (
              <MenuItem key={m.id} value={m.value}>
                {m.value}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          type="text"
          className="w-full md:w-1/3 lg:w-1/5"
          placeholder="Notes"
          value={form.notes}
          onChange={(e) => setForm({ ...form, notes: e.target.value })}
        />
        <Button
          variant="contained"
          color="primary"
          type="submit"
          className="w-full md:w-fit"
        >
          Submit
        </Button>
      </form>
      <Dialog open={isEditDialogOpen} onClose={handleCloseDialog}>
        <DialogTitle>Edit Maintenance Record</DialogTitle>
        <DialogContent>
          <div className="space-y-4 mt-2">
            <FormControl fullWidth margin="normal">
              <InputLabel id="edit-equipment-select-label">
                Equipment
              </InputLabel>
              <Select
                labelId="edit-equipment-select-label"
                value={editForm.equipmentId}
                label="Equipment"
                onChange={(e) =>
                  setEditForm({ ...editForm, equipmentId: e.target.value })
                }
              >
                {appData.equipment.map((eq) => (
                  <MenuItem key={eq.id} value={eq.id}>
                    {eq.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <FormControl fullWidth margin="normal">
                <DatePicker
                  label="Maintenance Date"
                  value={editDate}
                  onChange={(newValue) => setEditDate(newValue)}
                />
              </FormControl>
            </LocalizationProvider>

            <FormControl fullWidth margin="normal">
              <InputLabel id="edit-type-select-label">Type</InputLabel>
              <Select
                labelId="edit-type-select-label"
                value={editForm.type}
                label="Type"
                onChange={(e) =>
                  setEditForm({ ...editForm, type: e.target.value })
                }
              >
                {types.map((m) => (
                  <MenuItem key={m.id} value={m.value}>
                    {m.value}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              fullWidth
              label="Notes"
              value={editForm.notes}
              onChange={(e) =>
                setEditForm({ ...editForm, notes: e.target.value })
              }
              margin="normal"
            />
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleEditSubmit} color="primary">
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
