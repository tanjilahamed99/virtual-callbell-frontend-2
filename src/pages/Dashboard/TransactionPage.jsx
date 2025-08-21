import { useEffect, useState } from "react";
import { useCall } from "../../Provider/Provider";
import myData from "../../hooks/users/myData";

// Sample transaction data (replace with API data)

const TransactionPage = () => {
  const [transactions, setTransactions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("All");
  const { user } = useCall();
  console.log(transactions);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleFilter = (e) => {
    setFilterType(e.target.value);
  };

  const filteredTransactions = transactions?.filter((txn) => {
    const matchesSearch =
      txn?._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      txn?.plan.toLowerCase().includes(searchTerm.toLowerCase()) ||
      txn?.amount.toString().includes(searchTerm) ||
      txn?.createdAt.toString().includes(searchTerm) ||
      txn?.paymentMethod.toString().includes(searchTerm);

    const matchesType = filterType === "All" ? true : txn.status === filterType;

    return matchesSearch && matchesType;
  });

  useEffect(() => {
    if (user) {
      const fetch = async () => {
        const { data } = await myData({ id: user.id });
        if (data.success) {
          setTransactions(data?.data?.transactionHistory);
        }
      };
      fetch();
    }
  }, [user]);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-4 text-black">My Transactions</h1>

      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row md:items-center mb-4 gap-4">
        <input
          type="text"
          placeholder="Search by ID, description, or amount..."
          value={searchTerm}
          onChange={handleSearch}
          className="border rounded px-4 py-2 w-full md:w-1/2 border-black text-black"
        />
        <select
          value={filterType}
          onChange={handleFilter}
          className="border rounded px-4 py-2 w-full md:w-1/4 border-black text-black">
          <option value="All">All Transactions</option>
          <option value="Completed">Completed</option>
          <option value="Cancel">Cancel</option>
        </select>
      </div>

      {/* Transactions Table */}
      <div className="overflow-x-auto bg-white shadow rounded">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                ID
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                Date
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                Plan
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                Duration
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                Amount
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                Payment Method
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredTransactions?.length > 0 ? (
              filteredTransactions?.map((txn) => (
                <tr key={txn._id}>
                  <td className="px-6 py-4 text-sm text-gray-800">
                    {txn._id.slice(-5)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-800">
                    {txn.createdAt.slice(0, 10)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-800">
                    {txn.plan}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-800">
                    {txn.planDuration}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-800">
                    ₹{txn.amount}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-800">
                    {txn.paymentMethod}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-800">
                    {txn.status}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                  No transactions found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TransactionPage;
