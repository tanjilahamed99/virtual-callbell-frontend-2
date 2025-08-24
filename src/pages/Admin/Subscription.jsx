import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import getWebsiteData from "../../hooks/admin/getWebisteData";
import { useCall } from "../../Provider/Provider";
import addNewWebsiteData from "../../hooks/admin/addNewSub";

const AdminSubscription = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredSubscriptions = subscriptions?.filter((txn) => {
    const matchesSearch =
      txn?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      txn?.duration.toString().includes(searchTerm) ||
      txn?.minute.toString().includes(searchTerm) ||
      txn?.price.toString().includes(searchTerm);

    return matchesSearch;
  });

  const [newSub, setNewSub] = useState({
    name: "",
    duration: "",
    price: "",
    minute: "",
  });
  const { user } = useCall();

  // Fetch subscriptions
  useEffect(() => {
    const fetchSubs = async () => {
      try {
        const { data } = await getWebsiteData();
        if (data.success) {
          setSubscriptions(data.data.plan || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchSubs();
  }, []);

  // Handle Add Subscription
  const handleAdd = async () => {
    if (!newSub.name || !newSub.duration || !newSub.price || !newSub.minute)
      return;

    let plan = [];

    if (subscriptions.length > 0) {
      plan = [
        {
          duration: parseFloat(newSub.duration),
          price: parseFloat(newSub.price),
          name: newSub.name,
          minute: parseFloat(newSub.minute),
        },
        ...subscriptions,
      ];
    } else {
      plan = [
        {
          duration: parseFloat(newSub.duration),
          price: parseFloat(newSub.price),
          name: newSub.name,
          minute: parseFloat(newSub.minute),
        },
      ];
    }

    const update = {
      plan,
    };

    try {
      const { data } = await addNewWebsiteData(user.id, user.email, update);
      if (data.success) {
        setSubscriptions([
          {
            duration: parseFloat(newSub.duration),
            price: parseFloat(newSub.price),
            name: newSub.name,
            minute: parseFloat(newSub.minute),
          },
          ...subscriptions,
        ]);
        setModalOpen(false);
        setNewSub({ name: "", duration: "", price: "", minute: "" });
        Swal.fire("Success", "Subscription added!", "success");
      }
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Something went wrong.", "error");
    }
  };

  // Handle Delete Subscription
  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This will permanently delete the subscription!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc3545",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        const update = {
          plan: subscriptions.filter((s) => s._id !== id),
        };
        const { data } = await addNewWebsiteData(user.id, user.email, update);
        if (data.success) {
          setSubscriptions(subscriptions.filter((s) => s._id !== id));
          Swal.fire("Deleted!", "Subscription deleted.", "success");
        }
      } catch (err) {
        console.error(err);
        Swal.fire("Error", "Something went wrong.", "error");
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
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            Admin - Subscriptions
          </h1>
          <button
            onClick={() => setModalOpen(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition">
            Add Subscription
          </button>
        </div>

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

        {/* Subscription Table */}
        <div className="overflow-x-auto bg-white shadow rounded">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                  No.
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                  Duration
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                  Minute
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredSubscriptions?.length > 0 ? (
                filteredSubscriptions?.map((txn, idx) => (
                  <tr key={idx}>
                    <td className="px-6 py-4 text-sm text-gray-800">
                      {idx + 1}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-800">
                      {txn.name}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-800">
                      {txn.minute}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-800">
                      {txn.duration}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-800">
                      {txn.price}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-800">
                      <button
                        onClick={() => handleDelete(txn._id)}
                        className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 transition">
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="5"
                    className="px-6 py-4 text-center text-gray-500">
                    No transactions found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Modal */}
      {modalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 ">
          {/* Background blur */}
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm"></div>

          {/* Modal content */}
          <div className="relative bg-white text-black rounded-xl p-6 w-full max-w-md shadow-lg z-10">
            <h2 className="text-xl font-bold mb-4">Add Subscription</h2>
            <input
              required
              type="text"
              placeholder="Name"
              value={newSub.name}
              onChange={(e) => setNewSub({ ...newSub, name: e.target.value })}
              className="w-full rounded-md border border-gray-300 px-3 py-2 mb-3 outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              required
              type="number"
              placeholder="Minute"
              value={newSub.minute}
              onChange={(e) => setNewSub({ ...newSub, minute: e.target.value })}
              className="w-full rounded-md border border-gray-300 px-3 py-2 mb-3 outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              required
              type="number"
              placeholder="Duration (days)"
              value={newSub.duration}
              onChange={(e) =>
                setNewSub({ ...newSub, duration: e.target.value })
              }
              className="w-full rounded-md border border-gray-300 px-3 py-2 mb-3 outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              required
              type="number"
              placeholder="Price (₹)"
              value={newSub.price}
              onChange={(e) => setNewSub({ ...newSub, price: e.target.value })}
              className="w-full rounded-md border border-gray-300 px-3 py-2 mb-4 outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setModalOpen(false)}
                className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400 transition">
                Cancel
              </button>
              <button
                onClick={handleAdd}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition">
                Add
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminSubscription;
