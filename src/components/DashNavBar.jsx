import React, { useEffect, useState } from "react";
import { EllipsisVertical, Menu, User, Bell } from "lucide-react";
import useLoginStore from "../../store/useLoginStore";

const DashNavBar = ({
  setIsSidebarOpen,
  setIsSidebarCollapsed,
  isSidebarCollapsed,
}) => {
  const user = useLoginStore((state) => state.user);
  if (!user) {
    if (!user) {
      return <p className="text-center text-gray-500">No user logged in.</p>;
    }
  }

  // Generate consistent color based on string
  const stringToColor = (str) => {
    if (!str) return "#4b5563"; // fallback gray
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const c = (hash & 0x00ffffff).toString(16).toUpperCase();
    return "#" + "00000".substring(0, 6 - c.length) + c;
  };

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
            Welcome back!{" "}
            <span className="hidden ml-1 md:flex">
              Here's your attendance overview
            </span>
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
          <span className="absolute hidden -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 items-center justify-center">
            3
          </span>
        </button>

        <div className="flex items-center space-x-3">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium text-gray-800">
              {user?.attendee?.fullName}
            </p>
            <p className="text-xs text-gray-500">{user?.attendee?.email}</p>
            <p className="text-xs text-gray-900 font-bold">
              {user?.attendee?.role}
            </p>
          </div>

          {/* Avatar: show image if exists, else show initials with dynamic bg */}
          {user?.attendee?.image ? (
            <img
              src={user.attendee.image}
              alt={user.attendee.fullName}
              className="w-8 h-8 rounded-full object-cover"
            />
          ) : (
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center`}
              style={{
                backgroundColor: stringToColor(
                  user?.attendee?.fullName || "Unknown"
                ),
              }}
            >
              <span className="text-white text-sm font-bold">
                {user?.attendee?.fullName
                  ?.split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()
                  .slice(0, 2)}
              </span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default DashNavBar;
