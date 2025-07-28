import { Routes, Route, useLocation } from "react-router-dom";
import AuthPage from "./Components/AuthPage.jsx";
import InventoryPage from "./Components/Inventory.jsx";
import Order from "./Components/Order.jsx";
import Navbar from "./Components/Navbar.jsx";
import OrderHistory from "./Components/OrderHistory.jsx";
import Healthz from "./Components/Healthz.jsx";
import Profile from "./Components/Profile.jsx";
import Customer from "./Components/Customer.jsx";
import AdminRoute from "./Components/AdminRoute";
import CustomerDetails from "./Components/CustomerDetails.jsx"; 
import InventoryDetails from "./Components/InventoryDetails.jsx";

function App() {
  const location = useLocation();
  const hideNavbarRoutes = ["/signup", "/"];
  const shouldShowNavbar = !hideNavbarRoutes.includes(location.pathname);

 
  return (
    <>
      {shouldShowNavbar && <Navbar />}

      <Routes>
        <Route path="/" element={<AuthPage />} />
        <Route path="/inventory" element={<InventoryPage />} />
        <Route path="/order" element={<Order />} />
        <Route path="/orderHistory" element={<OrderHistory />} />
        <Route path="/healthz" element={<Healthz />} />
        <Route path="/profile" element={<Profile />} />
        {/* Protected Route for Admin */}
        <Route
          path="/customer"
          element={
            <AdminRoute>
              <Customer />
            </AdminRoute>
          }
        />
        <Route path="/customerDetails/:id" element={<CustomerDetails />} />
        <Route path="/inventoryDetails" element={<InventoryDetails />} />
      </Routes>
    </>
  );
}

export default App;
