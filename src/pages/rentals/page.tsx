import React, { useState } from "react";
import { useData } from "../../context/data-context";
import {
  DataGrid,
  GridActionsCellItem,
  GridEditInputCell,
  type GridColDef,
  type GridRenderEditCellParams,
  type GridRowModel,
} from "@mui/x-data-grid";
import { v4, v6 } from "uuid";
import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
} from "@mui/material";
import { Trash } from "lucide-react";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import type { Dayjs } from "dayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import type { Notification } from "../../types";

export default function RentalsPage() {
  const {
    appData,
    addRentals,
    deleteRental,
    addUsers,
    updateRental,
    addNotification,
  } = useData();

  const [statusFilter] = useState<string>("all");
  const [form, setForm] = useState({
    equipment: "",
    customerEmail: "",
    startDate: null as Dayjs | null,
    endDate: null as Dayjs | null,
    status: "",
    rentalPrice: 0,
  });

  const statuses = [
    { id: 1, value: "Reserved" },
    { id: 2, value: "Rented" },
    { id: 3, value: "Returned" },
    { id: 4, value: "Cancelled" },
  ];

  const getCustomerName = (customerId: string) => {
    const customer = appData.users.find((user) => user.id === customerId);
    return customer ? `${customer.email}` : "Unknown Customer";
  };

  const getEquipmentName = (equipmentId: string) => {
    const equipment = appData.equipment.find((eq) => eq.id === equipmentId);
    return equipment ? equipment.name : "Unknown Equipment";
  };

  const columns: GridColDef[] = [
    {
      field: "equipmentId",
      headerName: "Equipment",
      flex: 1,
      editable: true,
      renderCell: (params) => getEquipmentName(params.value),
      renderEditCell: (params: GridRenderEditCellParams) => (
        <FormControl fullWidth variant="outlined" size="small">
          <Select
            value={params.value as string}
            onChange={(event) =>
              params.api.setEditCellValue({
                id: params.id,
                field: params.field,
                value: event.target.value,
              })
            }
            displayEmpty
            input={<GridEditInputCell {...params} fullWidth />}
          >
            {appData.equipment.map((eq) => (
              <MenuItem key={eq.id} value={eq.id}>
                {eq.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      ),
    },
    {
      field: "customerId",
      headerName: "Customer",
      flex: 1,
      renderCell: (params) => getCustomerName(params.value),
    },
    {
      field: "startDate",
      headerName: "Start Date",
      flex: 1,
      renderCell(params) {
        const date = new Date(params.value);
        return new Intl.DateTimeFormat("en-US", { dateStyle: "medium" }).format(
          date
        );
      },
    },
    {
      field: "endDate",
      headerName: "End Date",
      flex: 1,
      renderCell(params) {
        const date = new Date(params.value);
        return new Intl.DateTimeFormat("en-US", { dateStyle: "medium" }).format(
          date
        );
      },
    },
    {
      field: "status",
      headerName: "Status",
      flex: 1,
      editable: true,

      renderCell: (params) => {
        let color;
        switch (params.value) {
          case "Reserved":
            color = "blue";
            break;
          case "Rented":
            color = "green";
            break;
          case "Returned":
            color = "gray";
            break;
          default:
            color = "gray";
        }

        return <span style={{ color }}>{params.value}</span>;
      },
      renderEditCell: (params: GridRenderEditCellParams) => (
        <FormControl fullWidth size="small">
          <Select
            value={params.value as string}
            onChange={(event) =>
              params.api.setEditCellValue({
                id: params.id,
                field: params.field,
                value: event.target.value,
              })
            }
          >
            {statuses.map((s) => (
              <MenuItem key={s.id} value={s.value}>
                {s.value}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      ),
    },
    {
      field: "rentalPrice",
      headerName: "Rental Price",
      flex: 1,
      type: "number",
      renderCell: (params) => "$" + params.value,
    },
    {
      field: "actions",
      headerName: "Actions",
      type: "actions",
      flex: 1,
      getActions: (params) => [
        <GridActionsCellItem
          icon={<Trash className="text-red-500" />}
          label="Delete"
          // @ts-expect-error params can be any type
          onClick={() => handleDeleteClick(params.id)}
        />,
      ],
    },
  ];

  const filteredRentals =
    statusFilter === "all"
      ? appData.rentals
      : appData.rentals.filter((rental) => rental.status === statusFilter);

  const handleDeleteClick = (id: string) => {
    if (window.confirm(`Are you sure you want to delete rental ID: ${id}?`)) {
      deleteRental(id as string);
      const notificationData: Notification = {
        id: v6(),
        message: `Deleted Rental Record successfully`,
        timestamp: new Date().toISOString(),
      };
      addNotification([notificationData]);
    }
  };

  const processRowUpdate = (newRow: GridRowModel) => {
    const updatedRental = {
      id: newRow.id as string,
      equipmentId: newRow.equipmentId as string,
      customerId: newRow.customerId as string,
      startDate: newRow.startDate as string,
      endDate: newRow.endDate as string,
      status: newRow.status as "Reserved" | "Rented" | "Returned" | "Cancelled",
      rentalPrice: newRow.rentalPrice as number,
    };
    updateRental(updatedRental);
    const notificationData: Notification = {
      id: v6(),
      message: `Updated Rental Record Status successfully`,
      timestamp: new Date().toISOString(),
    };
    addNotification([notificationData]);
    return newRow;
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const foundUser = appData.users.find(
      (user) => user.email.toLowerCase() === form.customerEmail.toLowerCase()
    );
    let customerId = foundUser?.id;

    if (!foundUser && form.customerEmail !== "") {
      const newUser = {
        id: v6(),
        email: form.customerEmail,
        password: v4(),
        role: "Customer" as "Admin" | "Staff" | "Customer",
      };
      addUsers([newUser]);
      customerId = newUser.id;
    }

    if (
      !form.equipment ||
      !customerId ||
      !form.startDate ||
      !form.endDate ||
      !form.status
    ) {
      alert("Please fill all required fields.");
      return;
    }

    const newRental = {
      id: v6(),
      equipmentId: form.equipment,
      customerId: customerId as string,
      startDate: form.startDate!.format("YYYY-MM-DD"),
      endDate: form.endDate!.format("YYYY-MM-DD"),
      status: form.status as "Reserved" | "Rented" | "Returned" | "Cancelled",
      rentalPrice: form.rentalPrice,
    };
    addRentals([newRental]);
    const notificationData: Notification = {
      id: v6(),
      message: `Added new Rental Record successfully`,
      timestamp: new Date().toISOString(),
    };
    addNotification([notificationData]);
    setForm({
      equipment: "",
      startDate: null,
      endDate: null,
      status: "",
      customerEmail: "",
      rentalPrice: 0,
    });
  };

  return (
    <React.Fragment>
      <h2 className="text-xl font-bold my-4">Rental Records</h2>
      <Paper sx={{ height: "100%", width: "100%" }}>
        <DataGrid
          rows={filteredRentals}
          columns={columns}
          checkboxSelection
          processRowUpdate={processRowUpdate}
        />
      </Paper>
      <h2 className="text-lg font-bold my-4">Add Rental Records</h2>
      <form
        className="mt-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        onSubmit={handleSubmit}
      >
        <FormControl>
          <InputLabel id="equipment-select-label">Equipment</InputLabel>{" "}
          <Select
            labelId="equipment-select-label"
            id="status-select"
            value={form.equipment}
            label="equipment"
            onChange={(e) => setForm({ ...form, equipment: e.target.value })}
          >
            {appData.equipment.map((eq) => (
              <MenuItem key={eq.id} value={eq.id}>
                {eq.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          label="Customer Email"
          type="email"
          value={form.customerEmail}
          onChange={(e) => setForm({ ...form, customerEmail: e.target.value })}
        />
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <FormControl>
            <DatePicker
              value={form.startDate}
              label="Start Date"
              onChange={(newValue) => setForm({ ...form, startDate: newValue })}
            />
          </FormControl>
        </LocalizationProvider>

        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <FormControl>
            <DatePicker
              value={form.endDate}
              label="End Date"
              onChange={(newValue) => setForm({ ...form, endDate: newValue })}
            />
          </FormControl>
        </LocalizationProvider>

        <FormControl>
          <InputLabel id="status-select-label">Status</InputLabel>{" "}
          <Select
            labelId="status-select-label"
            id="status-select"
            value={form.status}
            label="status"
            onChange={(e) => setForm({ ...form, status: e.target.value })}
          >
            {statuses.map((s) => (
              <MenuItem key={s.id} value={s.value}>
                {s.value}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          type="number"
          placeholder="$Rental Price"
          value={form.rentalPrice}
          onChange={(e) =>
            setForm({ ...form, rentalPrice: Number(e.target.value) })
          }
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
    </React.Fragment>
  );
}
