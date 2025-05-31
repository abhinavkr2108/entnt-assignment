import { useData } from "../../context/data-context";
import { useAuth } from "../../context/auth-context";
import {
  Chip,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";

export default function MyRentalsPage() {
  const { user } = useAuth();
  const { appData } = useData();

  const myRentals = appData.rentals.filter(
    (rental) => rental.customerId === user?.id
  );

  const getEquipmentName = (id: string) =>
    appData.equipment.find((eq) => eq.id === id)?.name || "Unknown";

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">My Rentals</h1>

      {myRentals.length === 0 ? (
        <p>No rentals yet.</p>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead className="bg-gray-100 font-bold">
              <TableRow>
                <TableCell sx={{ fontWeight: "bold" }}>
                  Equipment Name
                </TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Start Date</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>End Date</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {myRentals.map((rental) => (
                <TableRow key={rental.id}>
                  <TableCell>{getEquipmentName(rental.equipmentId)}</TableCell>
                  <TableCell>
                    {new Intl.DateTimeFormat("en-US", {
                      dateStyle: "medium",
                    }).format(new Date(rental.startDate))}
                  </TableCell>
                  <TableCell>
                    {new Intl.DateTimeFormat("en-US", {
                      dateStyle: "medium",
                    }).format(new Date(rental.startDate))}
                  </TableCell>
                  <TableCell>
                    {rental.status === "Rented" && (
                      <Chip label="Rented" color="success" />
                    )}
                    {rental.status === "Reserved" && (
                      <Chip label="Reserved" color="warning" />
                    )}
                    {rental.status === "Returned" && (
                      <Chip label="Returned" color="default" />
                    )}
                    {rental.status === "Cancelled" && (
                      <Chip label="Cancelled" color="error" />
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </div>
  );
}
