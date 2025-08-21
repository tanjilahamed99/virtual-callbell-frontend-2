import React, { use, useEffect, useState } from "react";
import Swal from "sweetalert2";
import getWebsiteData from "../../hooks/admin/getWebisteData";
import { useCall } from "../../Provider/Provider";
import deleteSub from "../../hooks/admin/deleteSub";
import addNewWebsiteData from "../../hooks/admin/addNewSub";

const AdminSubscription = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [newSub, setNewSub] = useState({ name: "", duration: "", price: "" });
  const { user } = useCall();

  // Fetch subscriptions
  useEffect(() => {
    const fetchSubs = async () => {
      try {
        const { data } = await getWebsiteData();
        console.log(data);
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
    if (!newSub.name || !newSub.duration || !newSub.price) return;

    let plan = [];

    if (subscriptions.length > 0) {
      plan = [
        {
          duration: parseFloat(newSub.duration),
          price: parseFloat(newSub.price),
          name: newSub.name,
        },
        ...subscriptions,
      ];
    } else {
      plan = [
        {
          duration: parseFloat(newSub.duration),
          price: parseFloat(newSub.price),
          name: newSub.name,
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
          },
          ...subscriptions,
        ]);
        setModalOpen(false);
        setNewSub({ name: "", duration: "", price: "" });
        Swal.fire("Success", "Subscription added!", "success");
      }
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Something went wrong.", "error");
    }
  };

  // Handle Delete Subscription
  const handleDelete = async (id) => {
    console.log(id);
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
        console.log(update);
        const { data } = await addNewWebsiteData(user.id, user.email, update);
        console.log(data);
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
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Subscriptions</h1>
        <button
          onClick={() => setModalOpen(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition">
          Add Subscription
        </button>
      </div>
      {/* Subscription Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300 bg-white shadow-sm rounded-lg">
          <thead className="bg-gray-800 text-white">
            <tr>
              <th className="px-4 py-2 text-left">#</th>
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2 text-left">Duration</th>
              <th className="px-4 py-2 text-left">Price</th>
              <th className="px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            {subscriptions?.map((sub, idx) => (
              <tr
                key={idx}
                className="border-b border-gray-300 hover:bg-gray-100">
                <td className="px-4 py-2">{idx + 1}</td>
                <td className="px-4 py-2">{sub.name}</td>
                <td className="px-4 py-2">{sub.duration} days</td>
                <td className="px-4 py-2">₹{sub.price}</td>
                <td className="px-4 py-2">
                  <button
                    onClick={() => handleDelete(sub._id)}
                    className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 transition">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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
              type="text"
              placeholder="Name"
              value={newSub.name}
              onChange={(e) => setNewSub({ ...newSub, name: e.target.value })}
              className="w-full rounded-md border border-gray-300 px-3 py-2 mb-3 outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="number"
              placeholder="Duration (days)"
              value={newSub.duration}
              onChange={(e) =>
                setNewSub({ ...newSub, duration: e.target.value })
              }
              className="w-full rounded-md border border-gray-300 px-3 py-2 mb-3 outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="number"
              placeholder="Price ($)"
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
