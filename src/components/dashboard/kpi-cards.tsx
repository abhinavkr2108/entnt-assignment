import { useEffect, useState } from "react";
import { Card, CardContent } from "@mui/material/";
import { useData } from "../../context/data-context";

interface KPI {
  title: string;
  value: string | number;
  subtitle: string;
  color: string;
}
export default function KPICards() {
  const { appData } = useData();
  const [kpiData, setKpiData] = useState<KPI[]>([]);

  useEffect(() => {
    const equipments = appData.equipment || [];
    const rentals = appData.rentals || [];
    const maintenance = appData.maintenance || [];

    const totalEquipments = equipments.length;
    const availableEquipments = equipments.filter(
      (equipment) => equipment.status === "Available"
    ).length;
    const rentedEquipments = equipments.filter(
      (equipment) => equipment.status === "Rented"
    ).length;

    const now = new Date();

    const activeRentals = rentals.filter((rental) => {
      return (
        new Date(rental.startDate) <= now && new Date(rental.endDate) >= now
      );
    }).length;

    const overdueRentals = rentals.filter((rental) => {
      return new Date(rental.endDate) < now && rental.status === "Rented";
    }).length;

    const upcomingMaintenance = maintenance.filter((m) => {
      const nowDate = new Date(now);
      const futureDate = new Date(nowDate.setDate(nowDate.getDate() + 7));
      const futureTime = futureDate.getTime();
      return new Date(m.date).getTime() <= futureTime;
    }).length;

    const utilizationPercentage =
      totalEquipments > 0
        ? Math.round((rentedEquipments / totalEquipments) * 100)
        : 0;

    setKpiData([
      {
        title: "Total Equipment",
        value: totalEquipments,
        subtitle: `${availableEquipments} available`,
        color: "bg-blue-500",
      },
      {
        title: "Active Rentals",
        value: activeRentals,
        subtitle: `${rentedEquipments} currently rented`,
        color: "bg-green-500",
      },
      {
        title: "Overdue Rentals",
        value: overdueRentals,
        subtitle: overdueRentals > 0 ? "Need urgent attention" : "All clear",
        color: overdueRentals > 0 ? "bg-red-500" : "bg-gray-400",
      },
      {
        title: "Upcoming Maintenance",
        value: upcomingMaintenance,
        subtitle: `In next 7 days`,
        color: "bg-orange-500",
      },
      {
        title: "Equipment Utilization",
        value: `${utilizationPercentage}%`,
        subtitle: "Percentage of rented equipment",
        color: "bg-indigo-500",
      },
    ]);
  }, [appData]);
  return (
    <div className="mt-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      {kpiData.map((kpi, index) => (
        <Card key={index}>
          <div className="flex flex-row items-center justify-between space-y-0 py-2 px-4">
            <div className="text-sm font-medium text-gray-600">{kpi.title}</div>
            <div className={`w-4 h-4 rounded-full ${kpi.color}`} />
          </div>
          <CardContent>
            <div className="text-2xl font-bold">{kpi.value}</div>
            <p className="text-xs text-gray-500 mt-1">{kpi.subtitle}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
