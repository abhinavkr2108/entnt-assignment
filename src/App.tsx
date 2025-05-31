import { BrowserRouter, Route, Routes } from "react-router";
import Layout from "./components/layout/Layout";
import RentalsPage from "./pages/rentals/page";
import MaintenancePage from "./pages/maintenance/page";
import CalendarPage from "./pages/calendar/page";
import EquipmentsPage from "./pages/equipments/page";
import LoginPage from "./pages/auth/login/page";
import DashboardPage from "./pages/dashboard/page";
import { AuthProvider } from "./context/auth-context";
import MyRentalsPage from "./pages/my-rentals/page";
import { DataProvider } from "./context/data-context";
import EquipmentCatalogPage from "./pages/catalog/page";

function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route element={<Layout />}>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/rentals" element={<RentalsPage />} />
              <Route path="/maintenance" element={<MaintenancePage />} />
              <Route path="/calendar" element={<CalendarPage />} />
              <Route path="/equipments" element={<EquipmentsPage />} />
              <Route path="/my-rentals" element={<MyRentalsPage />} />
              <Route
                path="/equipment-catalog"
                element={<EquipmentCatalogPage />}
              />
            </Route>
          </Routes>
        </BrowserRouter>
      </DataProvider>
    </AuthProvider>
  );
}

export default App;
