import { useAppSelector } from "../hooks/useAppSelector";
import { Navigate } from "react-router-dom";
import React from "react";

interface ProtectedProps {
  element: JSX.Element;
}

const ProtectedRoute = ({ element }: ProtectedProps) => {
  const user = useAppSelector((state) => state.user.user);

  if (user) {
    return element;
  } else {
    return <Navigate to={"/signin"} />;
  }
};

export default ProtectedRoute;
