"use client";

import { Link, useLocation } from "react-router-dom";
import { useCall } from "../../Provider/Provider";

const UserDashboardNavLinks = () => {
  const { pathname } = useLocation();
  const { logout } = useCall();

  const handleLogout = () => {
    logout();
  };

  const ulLinks = (
    <>
      <li
        className={`hover:bg-indigo-600 ${
          pathname === "/dashboard" ? "bg-indigo-600" : ""
        } px-3 py-2 rounded-lg cursor-pointer transition `}>
        <Link to={"/dashboard"}>Dashboard</Link>
      </li>
      <li
        className={`hover:bg-indigo-600 ${
          pathname === "/dashboard/profile" ? "bg-indigo-600" : ""
        } px-3 py-2 rounded-lg cursor-pointer transition `}>
        <Link to={"/dashboard/profile"}>Profile</Link>
      </li>
      <li
        className={`hover:bg-indigo-600 ${
          pathname === "/dashboard/subscriptions" ? "bg-indigo-600" : ""
        } px-3 py-2 rounded-lg cursor-pointer transition `}>
        <Link to={"/dashboard/subscriptions"}>Subscriptions</Link>
      </li>
      <li
        className={`hover:bg-indigo-600 ${
          pathname === "/dashboard/transactions" ? "bg-indigo-600" : ""
        } px-3 py-2 rounded-lg cursor-pointer transition `}>
        <Link to={"/dashboard/transactions"}>Transaction</Link>
      </li>
      <li
        onClick={handleLogout}
        className={`hover:bg-indigo-600  px-3 py-2 rounded-lg cursor-pointer transition`}>
        Logout
      </li>
    </>
  );

  return (
    <>
      <h1 className="text-2xl font-bold mb-8">Virtual Callbell</h1>
      <ul className="space-y-1">{ulLinks}</ul>
    </>
  );
};

export default UserDashboardNavLinks;
