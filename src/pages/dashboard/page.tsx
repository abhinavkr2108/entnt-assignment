import React from "react";
import KPICards from "../../components/dashboard/kpi-cards";
import { useAuth } from "../../context/auth-context";

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <React.Fragment>
      <div className="px-4 py-5 mx-auto sm:max-w-xl md:max-w-full lg:max-w-screen-xl md:px-24 lg:px-8">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <h2 className="text-lg text-gray-500">Welcome! {user?.role}</h2>
        <KPICards />
      </div>
    </React.Fragment>
  );
}
