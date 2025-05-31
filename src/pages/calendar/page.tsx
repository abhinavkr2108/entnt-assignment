import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { useData } from "../../context/data-context";
import { type Rental } from "../../types";

export default function CalendarPage() {
  const { appData } = useData();
  const [date, setDate] = useState(new Date());
  const [rentals] = useState(appData.rentals || []);
  const [rentalsOnDate, setRentalsOnDate] = useState<Rental[]>([]);

  useEffect(() => {
    const formattedDate = date.toISOString().split("T")[0];
    const filtered = rentals.filter((rental) => {
      const start = new Date(rental.startDate);
      const end = new Date(rental.endDate);
      return new Date(formattedDate) >= start && new Date(formattedDate) <= end;
    });
    setRentalsOnDate(filtered);
  }, [date, rentals]);

  return (
    <React.Fragment>
      <h2 className="text-2xl font-semibold mb-4">Rental Calendar</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Calendar onChange={(value) => setDate(value as Date)} value={date} />
        <div>
          <h3 className="text-xl font-medium mb-2">
            Rentals on {date.toDateString()}
          </h3>
          {rentalsOnDate.length > 0 ? (
            <ul className="space-y-2">
              {rentalsOnDate.map((rental) => (
                <li key={rental.id} className="p-3 bg-gray-100 rounded shadow">
                  <strong>Equipment ID:</strong> {rental.equipmentId}
                  <br />
                  <strong>Customer ID:</strong> {rental.customerId}
                  <br />
                  <strong>Status:</strong> {rental.status}
                  <br />
                  <strong>From:</strong> {rental.startDate} <strong>To:</strong>{" "}
                  {rental.endDate}
                </li>
              ))}
            </ul>
          ) : (
            <p>No rentals on this date.</p>
          )}
        </div>
      </div>
    </React.Fragment>
  );
}
