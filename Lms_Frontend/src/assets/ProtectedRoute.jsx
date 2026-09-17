import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const user = localStorage.getItem("user");
if(user){
  const userData = JSON.parse(user);
  if (userData.accountType !== "Student") {
    return <Navigate to="/studentdashboard" replace />;
  }
}
  // Agar token nahi hai, toh user ko login page par bhej do
  if (!user) {
    return <Navigate to="/signin" replace />;
  }

  // Agar token hai, toh andar ka component (Dashboard) render karo
  return children;
};

export default ProtectedRoute;