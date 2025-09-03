import React from "react";
import { EllipsisVertical, Menu, User, Bell } from "lucide-react";

const DashNavBar = ({
  setIsSidebarOpen,
  setIsSidebarCollapsed,
  isSidebarCollapsed,
}) => {
  return (
    <header className="sticky top-0 z-10 bg-white shadow-sm w-full px-6 py-5 border-b border-gray-200 flex items-center justify-between">
      {/* Hamburger menu for mobile */}
      <button
        className="text-blue-950 text-2xl lg:hidden"
        onClick={() => setIsSidebarOpen(true)}
      >
        <EllipsisVertical />
      </button>

      {/* Desktop sidebar toggle */}
      <div className="flex items-center">
        <button
          className="p-2 hidden md:flex rounded-lg text-gray-600 hover:bg-gray-100 transition-colors duration-200"
          aria-label="Toggle sidebar"
          onClick={() => setIsSidebarCollapsed((prev) => !prev)}
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="ml-4 ">
          <h1 className=" text-[15px] md:text-xl font-semibold text-gray-800">
            Attendance Dashboard
          </h1>
          <p className="text-[12px] flex  md:text-sm text-gray-500">
            Welcome back!  <span className="hidden ml-1 md:flex">Here's your attendance overview</span>
          </p>
        </div>
      </div>

      {/* Right controls remain unchanged */}
      <div className="flex items-center space-x-4">
        <button
          className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors duration-200"
          aria-label="Toggle theme"
        ></button>

        <button
          className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors duration-200 relative"
          aria-label="Notifications"
        >
          <Bell className="w-5 h-5 text-gray-600" />
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            3
          </span>
        </button>

        <div className="flex items-center space-x-3">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium text-gray-800">Admin User</p>
            <p className="text-xs text-gray-500">administrator@company.com</p>
          </div>
          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
            <User className="w-4 h-4 text-white" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashNavBar;
