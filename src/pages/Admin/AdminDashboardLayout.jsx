import { Outlet } from "react-router-dom";
import AdminDashboardNavLinks from "../../components/Admin/AdminDashboardNavLinks";
import Drawer from "../../components/Dashboard/Drawer";
import AdminPrivateRoute from "../../components/PrivateRoute/AdminPrivateRoute";

const AdminDashboardLayout = () => {
  return (
    <AdminPrivateRoute>
      <div className="flex flex-col md:flex-row min-h-screen">
        {/* Sidebar Navbar */}
        <div className="lg:w-[25%] md:w-[30%] hidden md:block bg-gradient-to-b from-indigo-700 via-indigo-800 to-indigo-900 text-white shadow-lg p-6">
          <AdminDashboardNavLinks />
        </div>
        {/* Mobile Navbar */}
        <div className="md:hidden">
          <Drawer
            links={[
              { href: "/admin", label: "Dashboard" },
              { href: "/", label: "Home" },
              { href: "/admin/users", label: "All Users" },
              { href: "/admin/subscriptions", label: "All Subscriptions" },
              { href: "/admin/transactions", label: "All Transactions" },
              { href: "/admin/settings", label: "Settings" },
              { href: "/admin/about", label: "About" },
              { href: "/admin/contact", label: "Contact" },
              { href: "/admin/terms", label: "Terms" },
              { href: "/admin/privacy", label: "Privacy" },
            ]}
          />
        </div>

        {/* Main Page Content */}
        <div className="lg:w-[75%] md:w-[70%] w-full bg-gray-50 lg:p-8">
          <Outlet />
        </div>
      </div>
    </AdminPrivateRoute>
  );
};

export default AdminDashboardLayout;
