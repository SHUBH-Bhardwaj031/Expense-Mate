import React from "react";
import SideMenu from "../../components/SideMenu";
import { Navigate, Outlet } from "react-router";
import { getAccessTokenFromLocalStorage } from "../../services/LocalStorageService";
import { toast } from "react-toastify";
import { useAuthContext } from "../../context/AuthContext";
import GradientBackground from "../../components/GradientBackground.jsx";

function DashboardLayout() {
  const accessToken = getAccessTokenFromLocalStorage();
  const { user } = useAuthContext();

  if (!user) {
    if (!accessToken) {
      toast.error("You are not logged in !!");
      return <Navigate to={"/login"} />;
    }
  }

  return (
    <GradientBackground>
      <div className="flex">
        
        {/* Sidebar */}
        <SideMenu />

        {/* Main Content */}
        <div className="pl-64 flex-1">
          <div className="p-10">
            <Outlet />
          </div>
        </div>

      </div>
    </GradientBackground>
  );
}

export default DashboardLayout;