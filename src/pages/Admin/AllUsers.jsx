import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import getAllUsers from "../../hooks/admin/getAllUsers";
import { useCall } from "../../Provider/Provider";
import deleteUser from "../../hooks/admin/deleteUser";

const AllUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useCall();
  const [searchTerm, setSearchTerm] = useState("");
  console.log(users);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredUsers = users?.filter((txn) => {
    const matchesSearch =
      txn?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      txn?.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      txn?.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      txn?.phone.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesSearch;
  });

  const getRemainingDays = (endDate) => {
    const today = new Date();
    const end = new Date(endDate);
    const diffTime = end - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  // Fetch all users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data } = await getAllUsers(user.id, user.email);
        if (data.success) {
          setUsers(data.users || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [user]);

  // Delete user handler
  const handleDelete = async (userId) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This will permanently delete the user!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc3545",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        const { data } = await deleteUser(user.id, user.email, userId);
        if (data.success) {
          setUsers(users.filter((u) => u._id !== userId));
          Swal.fire("Deleted!", "User has been deleted.", "success");
        }
      } catch (err) {
        Swal.fire("Error!", "Something went wrong.", "error");
        console.error(err);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-300 border-t-blue-500" />
      </div>
    );
  }

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Admin - All Users
      </h1>

      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row md:items-center mb-4 gap-4">
        <input
          type="text"
          placeholder="Search by ID, email, name, or amount..."
          value={searchTerm}
          onChange={handleSearch}
          className="border rounded px-4 py-2 w-full md:w-1/2 border-black text-black"
        />
      </div>

      <div className="bg-white rounded-xl shadow-md p-6 md:p-10 overflow-x-auto">
        <table className="min-w-full text-left text-gray-700 text-xs sm:text-sm">
          <thead>
            <tr className="border-b border-gray-300">
              <th className="px-3 py-2 font-medium">No.</th>
              <th className="px-3 py-2 font-medium">User</th>
              <th className="px-3 py-2 font-medium">Email</th>
              <th className="px-3 py-2 font-medium">Transaction</th>
              <th className="px-3 py-2 font-medium">Subscriptions End</th>
              <th className="px-3 py-2 font-medium">Remaining Days</th>
              <th className="px-3 py-2 font-medium">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers?.map((user, idx) => (
              <tr key={idx} className="border-b border-gray-200">
                <td className="px-3 py-2">{idx + 1}</td>
                <td className="px-3 py-2">{user?.name}</td>
                <td className="px-3 py-2">{user?.email}</td>
                <td className="px-3 py-2">
                  {user?.transactionHistory?.length}
                </td>
                <td className="px-3 py-2">
                  {user?.subscription?.endDate?.slice(0, 10)}
                </td>
                <td className="px-3 py-2">
                  {getRemainingDays(user?.subscription?.endDate)}
                </td>
                <td className={`px-3 py-2 font-medium`}>
                  <button
                    onClick={() => handleDelete(user._id)}
                    className="text-red-600 hover:text-red-800 cursor-pointer">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {users?.length === 0 && (
              <tr>
                <td colSpan={6} className="px-3 py-4 text-center text-gray-500">
                  No users found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AllUsers;
