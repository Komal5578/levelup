import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Lottie from "lottie-react";
import moneyTransfer from "../assets/Money Transfer.json";
import loadingBar from "../assets/Loading bar.json";

const Loading = () => {
  const navigate = useNavigate();

  // 👇 Navigate to /landing after 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/landing");
    }, 3000); // 3 seconds
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-white space-y-6">
      {/* Money Transfer Animation */}
      <Lottie animationData={moneyTransfer} loop={true} className="w-72 h-72" />

      {/* Loading Bar Animation */}
      <Lottie animationData={loadingBar} loop={true} className="w-64 h-12" />
    </div>
  );
};

export default Loading;
