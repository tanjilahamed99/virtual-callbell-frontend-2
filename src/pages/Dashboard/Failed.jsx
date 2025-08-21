import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Failed = () => {
  const [showModal, setShowModal] = useState(true);

          const navigate = useNavigate();
          
  const back = () => {
    navigate("/dashboard/subscriptions");
    setShowModal(false);
          };
          

  return (
    <div>
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center font-sans">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/60" onClick={back} />

          {/* Modal Content */}
          <div className="relative z-50 w-11/12 max-w-sm rounded-xl bg-white p-8 text-center shadow-xl animate-[fadeInUp_0.4s_ease-out]">
            <div className="mb-4 text-6xl text-red-600">❌</div>
            <h2 className="mb-2 text-2xl font-semibold text-gray-800">
              Payment Failed
            </h2>
            <p className="mb-6 text-gray-600">
              Something went wrong during the payment process.
            </p>
            <button
              onClick={back}
              className="rounded-md bg-blue-600 px-5 py-2 text-white transition hover:bg-blue-700">
              Try Again
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Failed;
