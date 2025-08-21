import React from "react";
import { useCall } from "../../Provider/Provider";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  const { user, loading } = useCall();

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600" />
      </div>
    );
  }

  if (!loading && !user) {
    return <Navigate to="/" replace />;
  }

  return <div>{children}</div>;
};

export default PrivateRoute;
