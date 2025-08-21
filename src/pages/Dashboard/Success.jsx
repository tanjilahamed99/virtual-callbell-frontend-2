import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import { useCall } from "../../Provider/Provider";
import { BASE_URL } from "../../config/constant";

const Success = () => {
  const [showModal, setShowModal] = useState(true);
  const navigate = useNavigate();
  const { user } = useCall();
  const [status, setStatus] = useState("loading"); // loading | success | failed
  const [errorMsg, setErrorMsg] = useState("");
  const [searchParams] = useSearchParams();
  let refId = searchParams.get("refId");
  let subId = searchParams.get("subId");
  console.log(subId);

  const back = () => {
    navigate("/dashboard/subscriptions");
    setShowModal(false);
  };

  useEffect(() => {
    if (refId && user && subId) {
      setErrorMsg("");
      const fetchStatus = async () => {
        try {
          const { data } = await axios.post(
            `${BASE_URL}/paygic/validatePayment`,
            {
              userId: user.id,
              merchantReferenceId: refId,
              subId,
            }
          );
          if (data.success) {
            setStatus("success");
          } else {
            setStatus("failed");
          }
        } catch (err) {
          console.error(err);
          setStatus("failed");
          setErrorMsg(err.response.data.message);
        }
      };

      fetchStatus();
    }
  }, [refId, user, subId]);

  return (
    <div>
      {showModal && (
        <div className="fixed inset-0 z-[1050] flex items-center justify-center font-sans">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/60" onClick={back} />

          {/* Modal Content */}
          <div className="relative z-[1060] w-11/12 max-w-sm rounded-xl bg-white p-8 text-center shadow-xl animate-[fadeInUp_0.4s_ease-out]">
            {status === "loading" && (
              <>
                <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-l-blue-600" />
                <h2 className="mb-2 text-2xl font-semibold text-gray-800">
                  Checking Payment...
                </h2>
                <p className="text-gray-600">
                  Please wait while we confirm your payment.
                </p>
              </>
            )}

            {status === "success" && (
              <>
                <div className="mb-4 text-5xl text-green-600">✅</div>
                <h2 className="mb-2 text-2xl font-semibold text-gray-800">
                  Payment Successful
                </h2>
                <p className="mb-6 text-gray-600">
                  Your payment was processed successfully.
                </p>
                <button
                  onClick={back}
                  className="rounded-md bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700">
                  Go Back
                </button>
              </>
            )}

            {status === "failed" && (
              <>
                <div className="mb-4 text-5xl text-red-600">❌</div>
                <h2 className="mb-2 text-2xl font-semibold text-gray-800">
                  Payment Failed
                </h2>
                <p className="text-gray-600">
                  We couldn’t confirm your payment. Please try again.
                </p>
                <p className="mb-6 text-sm text-red-500">{errorMsg}</p>
                <button
                  onClick={back}
                  className="rounded-md bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700">
                  Try Again
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Success;
