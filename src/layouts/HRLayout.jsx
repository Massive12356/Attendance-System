import React, { useState } from "react";
import DashSideBar from "../components/DashSideBar";
import DashNavBar from "../components/DashNavBar";
import { Outlet } from "react-router-dom";

const HRLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // mobile
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false); // desktop

  return (
    <div className="flex h-screen bg-[#F9FAFB]">
      {/* Sidebar full height */}
      <DashSideBar
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
        isCollapsed={isSidebarCollapsed}
      />

      {/* Right side*/}
      <div className="flex flex-col flex-1 overflow-hidden">
        <DashNavBar
          setIsSidebarOpen={setIsSidebarOpen}
          setIsSidebarCollapsed={setIsSidebarCollapsed}
          isSidebarCollapsed={isSidebarCollapsed}
        />
        <main className="flex-1 p-6 overflow-y-auto bg-gray-50/30">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default HRLayout;
