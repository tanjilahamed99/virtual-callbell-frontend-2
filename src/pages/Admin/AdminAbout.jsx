import { useEffect, useState } from "react";
import { useCall } from "../../Provider/Provider";
import getWebsiteData from "../../hooks/admin/getWebisteData";
import addNewWebsiteData from "../../hooks/admin/addNewSub";
import Swal from "sweetalert2";

const AdminAbout = () => {
  const [aboutInfo, setAboutInfo] = useState(null);
  const { user } = useCall();
  const [refetch, setRefetch] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleUpdate = async (e) => {
    e.preventDefault();
    const updatedContent = e.target.about.value;
    try {
      setLoading(true);
      const { data } = await addNewWebsiteData(user.id, user.email, {
        about: updatedContent,
      });
      if (data.success) {
        setRefetch(!refetch);
        Swal.fire({
          title: "Success",
          text: "About content updated successfully.",
          icon: "success",
        });
      }
    } catch (error) {
      console.error("Error updating about content:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await getWebsiteData();
        setAboutInfo(data?.data?.about || "");
      } catch (err) {
        console.error("Error fetching about info:", err);
      }
    };
    fetch();
  }, [refetch]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center md:p-6 p-2">
      <div className="w-full max-w-3xl bg-white shadow-lg rounded-2xl md:p-8 p-2">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">
          Edit About Page Content
        </h2>

        <form onSubmit={handleUpdate} className="space-y-6">
          <div>
            <label
              htmlFor="about"
              className="block text-gray-700 font-medium mb-2">
              HTML Content for About Page:
            </label>
            <textarea
              id="about"
              name="about"
              defaultValue={aboutInfo}
              required
              rows={10}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-800 focus:ring-2 focus:ring-blue-500 focus:outline-none resize-y"
              placeholder="<h1>Welcome</h1><p>Write something here...</p>"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-xl font-semibold shadow-md transition-all ${
              loading
                ? "bg-gray-400 cursor-not-allowed text-white"
                : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}>
            {loading ? "Updating..." : "Update Content"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminAbout;
