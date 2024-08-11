// src/components/ProtectedRoute.tsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../contexts/UserContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
    const nav  = useNavigate();
  const { currentUser, loading } = useUser();

  if (loading) {
    return <div className="text-white">Loading...</div>;
  }

  if (!currentUser) {
     nav('/login');
  }else{
    console.log(currentUser)
  }

  return <>{children}</>;
};

export default ProtectedRoute;
