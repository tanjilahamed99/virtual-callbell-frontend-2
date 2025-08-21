import { useEffect, useState } from "react";
import { useCall } from "../../Provider/Provider";
import getAllUsers from "../../hooks/admin/getAllUsers";
import { Link } from "react-router-dom";

const AdminDashboard = () => {
  const { user } = useCall();
  console.log(user);
  const [dashboardData, setDashboardData] = useState({
    totalUsers: 0,
    totalSubscriptions: 0,
    totalTransactions: 0,
    latestTransactions: [],
  });

  useEffect(() => {
    if (user) {
      const fetch = async () => {
        const { data: userData } = await getAllUsers(user.id, user.email);
        console.log(userData);
        if (userData.success) {
          const allTransactions = userData.users
            .flatMap((u) => u.transactionHistory || [])
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          setDashboardData({
            totalUsers: userData.users?.length,
            totalTransactions: allTransactions.length,
            latestTransactions: allTransactions.slice(0, 10),
          });
        }
      };
      fetch();
    }
  }, [user]);

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-10 flex flex-col gap-10">
      {/* Welcome Banner */}
      <div className="bg-indigo-600 text-white rounded-xl p-6 md:p-10 shadow-md flex flex-col md:flex-row items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold">
            Admin Dashboard
          </h1>
          <p className="mt-1 sm:mt-2 text-sm sm:text-base">
            Welcome back,{" "}
            <span className="font-medium">{user?.name?.split(" ")[0]}</span>
          </p>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-md p-6 text-center">
          <h2 className="text-gray-600 text-sm">Total Users</h2>
          <p className="text-2xl font-semibold text-indigo-600">
            {dashboardData.totalUsers}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6 text-center">
          <h2 className="text-gray-600 text-sm">Subscriptions</h2>
          <p className="text-2xl font-semibold text-indigo-600">
            {dashboardData.totalSubscriptions}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6 text-center">
          <h2 className="text-gray-600 text-sm">Transactions</h2>
          <p className="text-2xl font-semibold text-indigo-600">
            {dashboardData.totalTransactions}
          </p>
        </div>
      </div>

      {/* Latest Transactions */}
      <div className="bg-white rounded-xl shadow-md p-6 md:p-10 overflow-x-auto">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4">
          Latest Transactions
        </h2>
        <table className="min-w-full text-left text-gray-700 text-xs sm:text-sm">
          <thead>
            <tr className="border-b border-gray-300">
              <th className="px-3 py-2 font-medium">No.</th>
              <th className="px-3 py-2 font-medium">User</th>
              <th className="px-3 py-2 font-medium">Date</th>
              <th className="px-3 py-2 font-medium">Plan</th>
              <th className="px-3 py-2 font-medium">Amount</th>
              <th className="px-3 py-2 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {dashboardData?.latestTransactions?.map((tran, idx) => (
              <tr key={idx} className="border-b border-gray-200">
                <td className="px-3 py-2">{idx + 1}</td>
                <td className="px-3 py-2">{tran.author.name}</td>
                <td className="px-3 py-2">{tran.createdAt?.slice(0, 10)}</td>
                <td className="px-3 py-2">{tran.plan}</td>
                <td className="px-3 py-2">₹{tran.amount}</td>
                <td
                  className={`px-3 py-2 font-medium ${
                    tran.status === "Completed"
                      ? "text-green-600"
                      : "text-red-600"
                  }`}>
                  {tran.status}
                </td>
              </tr>
            ))}
            {dashboardData?.latestTransactions?.length === 0 && (
              <tr>
                <td colSpan={6} className="px-3 py-4 text-center text-gray-500">
                  No transactions found
                </td>
              </tr>
            )}
            <td colSpan={6} className="px-3 py-4 text-center">
              <Link
                to="/admin/transactions"
                className="px-3 py-4 text-center text-indigo-600 hover:underline mt-5">
                View All Transactions
              </Link>
            </td>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;
