// src/components/ProtectedRoute.tsx
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../contexts/UserContext";
import { Spinner } from "@chakra-ui/react";
interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const navigate = useNavigate();
  const { currentUser, loading } = useUser();

  useEffect(() => {
    if (!loading && !currentUser) {
      navigate("/login");
    }
  }, [currentUser, loading, navigate]);

  if (loading) {
    return <div className="text-white ">
      <Spinner size={"xl"}/>
    </div>;
  }

  if (!currentUser) {
    return null; 
  }

  return <>{children}</>;
};

export default ProtectedRoute;
