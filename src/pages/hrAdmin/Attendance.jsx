import React, { useState, useEffect, useRef } from "react";
import { FiLogOut, FiPrinter } from "react-icons/fi";
import { AiOutlineUserAdd } from "react-icons/ai";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { exportToExcel } from "../../utils/exportToExcel";
import useAttendanceStore from "../../../store/useAttendanceStore";
import { Calendar, Users, Clock, TrendingUp, BarChart3 } from "lucide-react";

const Attendance = () => {
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [viewMode, setViewMode] = useState("table"); // "table" | "cards"
  const tableRef = useRef();

  // Zustand store hooks
  const { attendees, loading } = useAttendanceStore();
  const fetchAllAttendance = useAttendanceStore(
    (state) => state.fetchAllAttendance
  );
  const attendances = useAttendanceStore((state) => state.attendances);

  // restore saved view mode from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("attendanceViewMode");
    if (saved) setViewMode(saved);
  }, []);

  // persist view mode to localStorage
  useEffect(() => {
    localStorage.setItem("attendanceViewMode", viewMode);
  }, [viewMode]);

  const getFullName = (staffID) => {
    const person = attendees.find((a) => a.staffID === staffID);
    return person?.fullName || "Unknown";
  };

  // handling search and filter by date logic
  // function to handle export data to excel
  // const handleExportExcel = () => {
  //   if (!filteredAttendance.length) {
  //     toast.error("No attendance data to export.");
  //     return;
  //   }
  //   const dataToExport = filteredAttendance.map((entry) => ({
  //     "Staff ID": entry.staffID,
  //     "Full Name": getFullName(entry.staffID),
  //     Date: new Date(entry.date).toLocaleDateString(),
  //     "Check-In": entry.checkIn,
  //     "Check-Out": entry.checkOut || "--",
  //     Status: entry.status,
  //   }));
  //   exportToExcel(
  //     dataToExport,
  //     "Attendance Report",
  //     `Attendance_Report_${new Date().toISOString().slice(0, 10)}`
  //   );
  // };

  useEffect(() => {
    fetchAllAttendance(true);
    const interval = setInterval(() => {
      fetchAllAttendance(true);
    }, 60000);
    return () => clearInterval(interval);
  }, [fetchAllAttendance]);

  return (
    <div className="space-y-6">
      {/* Top Nav */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 ">
          Attendance Records
        </h1>
        <p className="text-gray-600  mt-1">
          View and manage staff attendance records
        </p>
      </div>
      {/* Filters + Actions + View Toggle */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200  transition-all duration-200">
        <div className="space-y-4 p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Date for Daily View
              </label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white  text-gray-900 transition-colors duration-200 "
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700  mb-2">
                Select Month for Summary
              </label>
              <input
                type="month"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white  text-gray-900 transition-colors duration-200 "
              />
            </div>
          </div>
        </div>
      </div>

      {/* Attendance cards Stats*/}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* total attendance */}
        <div className="bg-white  rounded-xl shadow-sm border border-gray-200  transition-all duration-200 hover:shadow-md hover:border-gray-300">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Records
                </p>
                <p className="text-2xl font-bold text-gray-900">0</p>
              </div>
              <Users className="w-8 h-8 text-blue-600" />
            </div>
          </div>
        </div>

        {/* present attendance */}
        <div className="bg-white  rounded-xl shadow-sm border border-gray-200  transition-all duration-200 hover:shadow-md hover:border-gray-300">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Records
                </p>
                <p className="text-2xl font-bold text-green-600">0</p>
              </div>
              <Clock className="w-8 h-8 text-green-600" />
            </div>
          </div>
        </div>

        {/* late check-ins */}
        <div className="bg-white  rounded-xl shadow-sm border border-gray-200  transition-all duration-200 hover:shadow-md hover:border-gray-300">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Late Check-ins
                </p>
                <p className="text-2xl font-bold text-yellow-600">0</p>
              </div>
              <Users className="w-8 h-8 text-yellow-600" />
            </div>
          </div>
        </div>

        {/* absent */}
        <div className="bg-white  rounded-xl shadow-sm border border-gray-200  transition-all duration-200 hover:shadow-md hover:border-gray-300">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Absent</p>
                <p className="text-2xl font-bold text-red-500">0</p>
              </div>
              <Users className="w-8 h-8 text-red-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Daily Attendance List */}
      <div className="bg-white shadow-sm border border-gray-100  transition-all duration-200">
        <div className="bg-white mb-2  shadow-sm border border-gray-100 transition-all duration-200 p-6 border-b">
          <h3 className="text-lg font-semibold text-gray-900  flex items-center">
            <Calendar className="w-5 h-5 mr-2" />
            Daily Attendance - {new Date().toLocaleDateString()}
          </h3>
        </div>

        <div className="bg-white  shadow-sm  transition-all duration-200 p-6">
          <div className="space-y-4">
            <div className="text-center py-8">
              <Calendar className="w-12 h-12 text-gray-400  mx-auto mb-4" />
              <p className="text-gray-500 ">
                No attendance records found for this date
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Monthly Summary */}
      <div className="bg-white shadow-sm border border-gray-100  transition-all duration-200">
        <div className="bg-white mb-2  shadow-sm  transition-all duration-200 p-6 ">
          <h3 className="text-lg font-semibold text-gray-900  flex items-center">
            <BarChart3 className="w-5 h-5 mr-2" />
            Monthly Summary -{" "}
            {new Date().toLocaleDateString("en-US", {
              month: "long",
              year: "numeric",
            })}
          </h3>
        </div>

        <div className="bg-white shadow-sm   transition-all duration-200 p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <TrendingUp className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-blue-600">0%</p>
              <p className="text-sm text-gray-600">Attendance Rate</p>
            </div>

            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <Calendar className="w-8 h-8 text-gray-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900">24</p>
              <p className="text-sm text-gray-600 ">Working Days</p>
            </div>

            <div className="text-center p-4 bg-green-50  rounded-lg">
              <Users className="w-8 h-8 text-green-600  mx-auto mb-2" />
              <p className="text-2xl font-bold text-green-600 ">10</p>
              <p className="text-sm text-gray-600">Present Records</p>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-lg font-semibold text-gray-900">
                12
              </p>
              <p className="text-xs text-gray-500">
                Total Records
              </p>
            </div>
            <div className="text-center">
              <p className="text-lg font-semibold text-red-600">
                21
              </p>
              <p className="text-xs text-gray-500">Absent</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-semibold text-yellow-600">
                22
              </p>
              <p className="text-xs text-gray-500">Late</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-semibold text-orange-600">
                32
              </p>
              <p className="text-xs text-gray-500">
                Half Day
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Attendance;
