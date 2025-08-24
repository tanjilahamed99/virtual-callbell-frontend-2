import axios from "axios";
import { useEffect, useState } from "react";
import { useCall } from "../../Provider/Provider";
import getPaygicInfo from "../../hooks/admin/getPaygicInfo";
import getWebsiteData from "../../hooks/admin/getWebisteData";
import { BASE_URL } from "../../config/constant";
import Swal from "sweetalert2";
import addNewWebsiteData from "../../hooks/admin/addNewSub";
import getAllLiveKit from "../../hooks/admin/getAdminLiveKit";

const Settings = () => {
  const [refetch, setRefetch] = useState(false);
  const { user } = useCall();
  const [reUpdate, setReUpdate] = useState(true);
  const [paygicMid, setPaygicMid] = useState("");
  const [paygicpassword, setPaygicPassword] = useState("");
  const [paygicStatus, setPaygicStatus] = useState();
  const [liveKitUrl, setLiveKitUrl] = useState("");
  const [liveKitKey, setLiveKitKey] = useState("");
  const [liveKitSecret, setLiveKitSecret] = useState("");

  const handleUpdatePayGicCredential = async (e) => {
    e.preventDefault();
    const mid = e.target.mid.value;
    const password = e.target.password.value;
    try {
      const { data } = await axios.put(
        `${BASE_URL}/admin/paygic/set/${user.id}/${user.email}`,
        {
          mid,
          password,
        }
      );
      if (data.success) {
        setReUpdate(!reUpdate);
        Swal.fire({
          title: "Success",
          text: "PayGic credentials updated successfully.",
          icon: "success",
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleUpdatePaymentSystem = async (e) => {
    e.preventDefault();
    const paygic = e.target.paygicEnabled.checked;
    try {
      const { data } = await addNewWebsiteData(user.id, user.email, {
        paymentMethod: {
          paygic,
        },
      });
      if (data.success) {
        setRefetch(!refetch);
        Swal.fire({
          title: "Success",
          text: "Payment method updated successfully.",
          icon: "success",
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleUpdateLiveKitCredential = async (e) => {
    e.preventDefault();
    const url = e.target.url.value;
    const key = e.target.key.value;
    const secret = e.target.secret.value;
    try {
      const { data } = await axios.put(
        `${BASE_URL}/admin/livekit/set/${user.id}/${user.email}`,
        {
          url,
          key,
          secret,
        }
      );
      if (data.success) {
        setReUpdate(!reUpdate);
        Swal.fire({
          title: "Success",
          text: "LiveKit credentials updated successfully.",
          icon: "success",
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const fetch = async () => {
      const { data } = await getWebsiteData();
      if (data.success) {
        setPaygicStatus(data.data.paymentMethod.paygic);
      }
    };
    fetch();
  }, [refetch]);

  useEffect(() => {
    const fetch = async () => {
      const { data: res } = await getPaygicInfo(user.id, user.email);
      if (res?.success) {
        setPaygicMid(res?.data.mid);
        setPaygicPassword(res?.data.password);
      }
    };
    const fetchLiveKit = async () => {
      const { data } = await getAllLiveKit(user.id, user.email);
      if (data.success) {
        setLiveKitUrl(data.data.url);
        setLiveKitKey(data.data.key);
        setLiveKitSecret(data.data.secret);
      }
    };
    if (user) {
      fetch();
    }
    fetchLiveKit();
  }, [user, reUpdate]);

  return (
    <div className="min-h-screen bg-[#f9fafb] flex items-center justify-center p-4">
      <div className="w-full max-w-3xl space-y-8">
        {/* Payment Types */}
        <form
          onSubmit={handleUpdatePaymentSystem}
          className="bg-white shadow-md rounded-2xl p-6 md:p-8">
          <h2 className="text-2xl font-bold text-[#111827]">Payment Types</h2>
          <p className="text-[#6b7280] mt-1">Enable or disable</p>

          <div className="mt-6 space-y-4">
            {/* Paygic */}
            <div className="flex items-center justify-between border p-4 rounded-xl shadow-sm">
              <label className="text-[#111827] font-medium">Paygic</label>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="paygicEnabled"
                  checked={!!paygicStatus}
                  onChange={(e) => setPaygicStatus(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-[#e5e7eb] rounded-full peer-checked:bg-[#2563eb] transition-all"></div>
                <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-5"></div>
              </label>
            </div>
          </div>

          <button
            type="submit"
            className="mt-6 w-full cursor-pointer bg-[#2563eb] hover:bg-[#1e40af] text-white font-semibold py-3 rounded-xl transition-all shadow-md">
            Update
          </button>
        </form>

        {/* Paygic Keys */}
        <form
          onSubmit={handleUpdatePayGicCredential}
          className="bg-white shadow-md rounded-2xl p-6 md:p-8">
          <h2 className="text-2xl font-bold text-[#111827]">Set Paygic Keys</h2>
          <p className="text-[#6b7280] mt-1">Account Information</p>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-[#111827] font-medium mb-2">
                Mid
              </label>
              <input
                defaultValue={paygicMid}
                name="mid"
                required
                className="w-full px-4 py-2 border border-[#d1d5db] rounded-xl focus:ring-2 focus:ring-[#2563eb] focus:outline-none text-black"
                placeholder="Key"
              />
            </div>

            <div>
              <label className="block text-[#111827] font-medium mb-2">
                Password
              </label>
              <input
                defaultValue={paygicpassword}
                name="password"
                required
                className="w-full px-4 py-2 border border-[#d1d5db] rounded-xl focus:ring-2 text-black focus:ring-[#2563eb] focus:outline-none"
                placeholder="Secret"
              />
            </div>
          </div>

          <button
            type="submit"
            className="mt-6 cursor-pointer w-full bg-[#2563eb] hover:bg-[#1e40af] text-white font-semibold py-3 rounded-xl transition-all shadow-md">
            Update
          </button>
        </form>

        {/* LiveKit Keys */}
        <form
          onSubmit={handleUpdateLiveKitCredential}
          className="bg-white shadow-md rounded-2xl p-6 md:p-8">
          <h2 className="text-2xl font-bold text-[#111827]">Set Paygic Keys</h2>
          <p className="text-[#6b7280] mt-1">Account Information</p>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-[#111827] font-medium mb-2">
                Live Kit Url
              </label>
              <input
                defaultValue={liveKitUrl}
                name="url"
                required
                className="w-full px-4 py-2 border border-[#d1d5db] rounded-xl focus:ring-2 focus:ring-[#2563eb] focus:outline-none text-black"
                placeholder="Key"
              />
            </div>
            <div>
              <label className="block text-[#111827] font-medium mb-2">
                Live Kit Api Key
              </label>
              <input
                defaultValue={liveKitKey}
                name="key"
                required
                className="w-full px-4 py-2 border border-[#d1d5db] rounded-xl focus:ring-2 text-black focus:ring-[#2563eb] focus:outline-none"
                placeholder="Secret"
              />
            </div>
            <div>
              <label className="block text-[#111827] font-medium mb-2">
                Live kit Api Secret
              </label>
              <input
                defaultValue={liveKitSecret}
                name="secret"
                required
                className="w-full px-4 py-2 border border-[#d1d5db] rounded-xl focus:ring-2 text-black focus:ring-[#2563eb] focus:outline-none"
                placeholder="Secret"
              />
            </div>
          </div>

          <button
            type="submit"
            className="mt-6 cursor-pointer w-full bg-[#2563eb] hover:bg-[#1e40af] text-white font-semibold py-3 rounded-xl transition-all shadow-md">
            Update
          </button>
        </form>
      </div>
    </div>
  );
};

export default Settings;
