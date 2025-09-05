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
  const [selectedStaff, setSelectedStaff] = useState("all");
  const [viewMode, setViewMode] = useState("table"); // "table" | "cards"
  const tableRef = useRef();

  const { attendances, attendees, todayAttendance, loading } =
    useAttendanceStore();

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

  // Filtered attendance based on date, month, and staff
  const filteredAttendance = attendances.filter((att) => {
    const attDate = new Date(att.date);
    const matchDate = selectedDate
      ? attDate.toISOString().slice(0, 10) === selectedDate
      : true;
    const matchMonth = selectedMonth
      ? attDate.toISOString().slice(0, 7) === selectedMonth
      : true;
    const matchStaff =
      selectedStaff === "all" ? true : att.staffID === selectedStaff;

    return matchDate && matchMonth && matchStaff;
  });

  // Stats calculations
  const totalRecords = filteredAttendance.length;
  const presentRecords = filteredAttendance.filter(
    (att) => att.status === "present"
  ).length;
  const lateCheckIns = filteredAttendance.filter(
    (att) => att.status === "late"
  ).length;
  const halfDayRecords = filteredAttendance.filter(
    (att) => att.status === "half-day"
  ).length;

  // Calculate absent properly
  const absentRecords = attendees.filter((attendee) => {
    if (selectedStaff === "all") {
      return !filteredAttendance.some(
        (att) => att.staffID === attendee.staffID
      );
    } else {
      return (
        attendee.staffID === selectedStaff &&
        !filteredAttendance.some((att) => att.staffID === selectedStaff)
      );
    }
  }).length;

  // Calculate working days dynamically
  const calculateWorkingDays = (month) => {
    if (!month) return 0;
    const [year, monthIndex] = month.split("-").map(Number); // e.g., "2025-09" -> [2025, 9]
    const firstDay = new Date(year, monthIndex - 1, 1);
    const lastDay = new Date(year, monthIndex, 0);
    let count = 0;
    for (let d = new Date(firstDay); d <= lastDay; d.setDate(d.getDate() + 1)) {
      const day = d.getDay();
      if (day !== 0 && day !== 6) count++; // skip Sunday (0) and Saturday (6)
    }
    return count;
  };

  const workingDays = calculateWorkingDays(selectedMonth);

  // Attendance rate relative to working days
  const attendanceRate = workingDays
    ? Math.round((presentRecords / workingDays) * 100)
    : 0;

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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Date */}
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

            {/* Month */}
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

            {/* Staff */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Staff
              </label>
              <select
                value={selectedStaff}
                onChange={(e) => setSelectedStaff(e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900 transition-colors duration-200"
              >
                <option value="all">All Staff</option>
                {attendees.map((att) => (
                  <option key={att.staffID} value={att.staffID}>
                    {att.fullName}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Attendance cards Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* total attendance */}
        <div className="bg-white  rounded-xl shadow-sm border border-gray-200  transition-all duration-200 hover:shadow-md hover:border-gray-300">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Records
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {totalRecords}
                </p>
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
                <p className="text-sm font-medium text-gray-600">Present</p>
                <p className="text-2xl font-bold text-green-600">
                  {presentRecords}
                </p>
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
                <p className="text-2xl font-bold text-yellow-600">
                  {lateCheckIns}
                </p>
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
                <p className="text-2xl font-bold text-red-500">
                  {absentRecords}
                </p>
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
            Daily Attendance - {selectedDate || new Date().toLocaleDateString()}
          </h3>
        </div>

        <div className="bg-white  shadow-sm  transition-all duration-200 p-6">
          {filteredAttendance.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="w-12 h-12 text-gray-400  mx-auto mb-4" />
              <p className="text-gray-500">
                No attendance records found for this date
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredAttendance.map((att) => (
                <div
                  key={att.staffID + att.date}
                  className="p-4 border rounded-lg flex justify-between items-center"
                >
                  <p>{getFullName(att.staffID)}</p>
                  <p>
                    {att.checkIn || "--"} - {att.checkOut || "--"}
                  </p>
                  <p
                    className={`font-semibold ${
                      att.status === "present"
                        ? "text-green-600"
                        : att.status === "late"
                        ? "text-yellow-600"
                        : att.status === "absent"
                        ? "text-red-600"
                        : "text-orange-600"
                    }`}
                  >
                    {att.status}
                  </p>
                </div>
              ))}
            </div>
          )}
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
              <p className="text-2xl font-bold text-blue-600">
                {attendanceRate}%
              </p>
              <p className="text-sm text-gray-600">Attendance Rate</p>
            </div>

            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <Calendar className="w-8 h-8 text-gray-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900">{workingDays}</p>
              <p className="text-sm text-gray-600 ">Working Days</p>
            </div>

            <div className="text-center p-4 bg-green-50  rounded-lg">
              <Users className="w-8 h-8 text-green-600  mx-auto mb-2" />
              <p className="text-2xl font-bold text-green-600 ">
                {presentRecords}
              </p>
              <p className="text-sm text-gray-600">Present Records</p>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-lg font-semibold text-gray-900">
                {totalRecords}
              </p>
              <p className="text-xs text-gray-500">Total Records</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-semibold text-red-600">
                {absentRecords}
              </p>
              <p className="text-xs text-gray-500">Absent</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-semibold text-yellow-600">
                {lateCheckIns}
              </p>
              <p className="text-xs text-gray-500">Late</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-semibold text-orange-600">
                {halfDayRecords}
              </p>
              <p className="text-xs text-gray-500">Half Day</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Attendance;
