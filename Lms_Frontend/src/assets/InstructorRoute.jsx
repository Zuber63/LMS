import React from "react";
import { Navigate } from "react-router-dom";

const InstructorRoute = ({ children }) => {
  // LocalStorage se user aur token nikalenge
  const token = localStorage.getItem("token");
  const userData = JSON.parse(localStorage.getItem("user"));

  // 1. Agar token nahi hai, toh seedhe login page par bhej do
  if (!userData) {
    return <Navigate to="/signin" replace />;
  }

  // 2. Agar login hai par accountType "Instructor" nahi hai, toh unauthorized bhej do ya home par redirect karo
  if (userData?.accountType !== "Instructor") {
    return <Navigate to="/instructordashboard" replace />; // Ya jahan aap student ko bhejna chahein
  }

  // Agar dono clear hain, toh page render karne do
  return children;
};

export default InstructorRoute;