import React, { useState,useEffect } from "react";
import DashSideBar from "../components/DashSideBar";
import DashNavBar from "../components/DashNavBar";
import { Outlet } from "react-router-dom";
import useAttendanceStore from "../../store/useAttendanceStore";

const HRLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // mobile
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false); // desktop

  // pull the actions from your Zustand store
  const fetchAllAttendees = useAttendanceStore(
    (state) => state.fetchAllAttendees
  );
  const fetchTodayAttendance = useAttendanceStore(
    (state) => state.fetchTodayAttendance
  );
  const fetchAllAttendance = useAttendanceStore(
    (state) => state.fetchAllAttendance
  );

  useEffect(() => {
    // Fetch immediately when HRLayout mounts
    fetchAllAttendees();
    fetchTodayAttendance();
    fetchAllAttendance();

    // Poll every 60 seconds
    const interval = setInterval(() => {
      fetchAllAttendees();
      fetchTodayAttendance();
      fetchAllAttendance();
    }, 60000);

    return () => clearInterval(interval); // cleanup on unmount
  }, [fetchAllAttendees, fetchTodayAttendance, fetchAllAttendance]);

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
