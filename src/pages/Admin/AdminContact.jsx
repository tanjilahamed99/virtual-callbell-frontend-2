import React, { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../../config/constant";
import { useCall } from "../../Provider/Provider";

const AdminContact = () => {
  const [contactList, setContactList] = useState([]);
  const { user } = useCall();

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await axios.get(
          BASE_URL + `/admin/contacts/${user.id}/${user.email}`
        );
        console.log(data);
        setContactList(data?.data || []);
      } catch (err) {
        console.error("Error fetching contact info:", err);
      }
    };
    if (user) {
      fetch();
    }
  }, [user]);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">
          All Contact Submissions
        </h2>

        <div className="bg-white shadow-md rounded-2xl p-4 md:p-6">
          {contactList.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              No contact data available.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-h-[600px] overflow-y-auto pr-2">
              {contactList.map((item, index) => (
                <div
                  key={index}
                  className="bg-gray-50 border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-lg transition-all">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    {item.name}
                  </h3>
                  <p className="text-sm text-gray-700">
                    <strong className="font-medium">Email: </strong>
                    {item.email}
                  </p>
                  <p className="text-sm text-gray-700 mt-2 line-clamp-3">
                    <strong className="font-medium">Message: </strong>
                    {item.message}
                  </p>
                  <p className="text-xs text-gray-500 mt-3">
                    {new Date(item.createdAt).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminContact;
