import React, { useState, useEffect, useRef } from "react";
import { FiLogOut, FiPrinter } from "react-icons/fi";
import { AiOutlineUserAdd } from "react-icons/ai";
import { MdCancel, MdSave } from "react-icons/md";
import { FaUserPlus } from "react-icons/fa";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { exportToExcel } from "../../utils/exportToExcel";
import useAttendanceStore from "../../../store/useAttendanceStore"; // from zustand

const HrDashboard = () => {
  const [showModal, setShowModal] = useState(false);
  const [logoutModal, setLogoutModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [formData, setFormData] = useState({
    fullName: "",
    role: "",
    email: "",
    contact:"",
    position:"",
    workID: ""
  });
  const [viewMode, setViewMode] = useState("table"); // "table" | "cards"
  const tableRef = useRef();
  const navigate = useNavigate();

  // Zustand store hooks
  const {
    attendees,
    loading,
    registerAttendee,
  } = useAttendanceStore();
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

  const handlePrint = () => {
    const printContents = tableRef.current.innerHTML;
    const printWindow = window.open("", "", "height=600,width=800");
    printWindow.document.write("<html><head><title>Print Report</title>");
    printWindow.document.write(`
      <style>
        body {
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
          font-family: Arial, sans-serif;
          font-size: 12px;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          border: 1px solid #333;
        }
        th, td {
          border: 1px solid #333;
          padding: 6px 8px;
          text-align: center;
          vertical-align: middle;
        }
        thead { background-color: #0d3b66; color: white; }
        tr:nth-child(even) { background-color: #f8f8f8; }
        table img {
          width: 40px !important;
          height: 40px !important;
          object-fit: cover;
          border-radius: 50%;
          display: block;
          margin: 0 auto;
        }
        .print-watermark {
          position: fixed;
          top: 50%; left: 50%;
          width: 300px; height: 300px;
          transform: translate(-50%, -50%);
          opacity: 0.08;
          z-index: -1;
          pointer-events: none;
        }
        .print-watermark img { width: 100%; height: auto; }
      </style>
    `);
    printWindow.document.write("</head><body>");
    printWindow.document.write(`
      <div class="print-watermark">
        <img src="${window.location.origin}/assets/logo.png" alt="Company Watermark" />
      </div>
    `);
    printWindow.document.write(printContents);
    printWindow.document.write("</body></html>");
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  };

  // handling search and filter by date logic
  const filteredAttendance = attendances.filter((attendance) => {
    const matchSearch =
      attendance.staffID?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      attendance.status?.toLowerCase().includes(searchQuery.toLowerCase());

    let matchesDate = true;
    if (selectedDate) {
      const created = new Date(attendance.createdAt);
      const selected = new Date(selectedDate);
      if (!isNaN(created.getTime()) && !isNaN(selected.getTime())) {
        matchesDate = created.toISOString().slice(0, 10) === selectedDate;
      } else {
        matchesDate = false;
      }
    }
    return matchSearch && matchesDate;
  });

  // handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
        await registerAttendee(formData);
        toast.success("Attendee registered successfully.");
        setFormData({
          fullName: "",
          role: "",
          email: "",
          contact: "",
          position: "",
          workID: "",
        });
        setShowModal(false);
    } catch (error) {
       toast.error(error.message || "An error Occurred");
       console.log(error);
    }
  
  };

  // function to handle export data to excel
  const handleExportExcel = () => {
    if (!filteredAttendance.length) {
      toast.error("No attendance data to export.");
      return;
    }
    const dataToExport = filteredAttendance.map((entry) => ({
      "Staff ID": entry.staffID,
      "Full Name": getFullName(entry.staffID),
      Date: new Date(entry.date).toLocaleDateString(),
      "Check-In": entry.checkIn,
      "Check-Out": entry.checkOut || "--",
      Status: entry.status,
    }));
    exportToExcel(
      dataToExport,
      "Attendance Report",
      `Attendance_Report_${new Date().toISOString().slice(0, 10)}`
    );
  };

  useEffect(() => {
    fetchAllAttendance(true);
    const interval = setInterval(() => {
      fetchAllAttendance(true);
    }, 60000);
    return () => clearInterval(interval);
  }, [fetchAllAttendance]);

  // handle Logout
  const HandleLogout = () => {
    navigate("/");
    setLogoutModal(false);
  };

  const cancelLogOut = () => {
    setLogoutModal(false);
  };


  return (
    <div className="min-h-screen flex flex-col bg-[#F4F2EE] p-4 overflow-hidden">
      {/* Top Nav */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">HR Attendance Dashboard</h1>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => setLogoutModal(true)}
          className="flex items-center gap-2 bg- px-4 py-2 rounded-lg text-black font-semibold cursor-pointer"
        >
          <FiLogOut size={20} />
          <span className="hidden md:block">Logout</span>
        </motion.button>
      </div>

      {/* Filters + Actions + View Toggle */}
      <div className="flex flex-col gap-4 mb-4 md:flex-row md:items-end md:justify-between flex-wrap">
        {/* Date Filter */}
        <div className="flex flex-col w-full sm:w-1/2 md:w-auto">
          <label className="text-sm text-gray-700 mb-1 font-bold">
            Filter by Date
          </label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-4 py-2 rounded-lg outline-none bg-white border border-gray-300 text-black w-full md:w-[200px]"
          />
        </div>

        {/* Search Filter */}
        <div className="flex flex-col w-full sm:w-1/2 md:w-auto">
          <label className="text-sm text-gray-700 mb-1 font-bold">
            Search Attendance
          </label>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by ID, Status..."
            className="px-4 py-2 rounded-lg outline-none bg-white border border-gray-300 text-black w-full md:w-64"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col w-full sm:flex-row gap-2 md:items-end md:justify-end md:w-auto">
          <Link to={"/insight-center/attendList"} className="w-full sm:w-auto">
            <motion.button
              whileTap={{ scale: 0.95 }}
              className="flex items-center justify-center gap-2 bg-blue-950 hover:bg-blue-900 cursor-pointer px-4 py-2 rounded-lg text-white font-semibold w-full sm:w-auto"
            >
              <AiOutlineUserAdd size={20} /> View List
            </motion.button>
          </Link>

          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleExportExcel}
            className="bg-white hover:bg-gray-50 font-semibold px-4 py-2 rounded-lg border flex items-center gap-1 border-gray-300 cursor-pointer w-full sm:w-auto justify-center"
          >
            📊 Export to Excel
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 bg-blue-900 hover:bg-blue-950 cursor-pointer px-4 py-2 justify-center rounded-lg text-white font-semibold w-full sm:w-auto"
          >
            <AiOutlineUserAdd size={20} /> Create Attendee
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handlePrint}
            className="bg-white hover:bg-gray-50 font-semibold px-4 py-2 rounded-lg border flex items-center gap-1 border-gray-300 cursor-pointer w-full sm:w-auto justify-center"
          >
            <FiPrinter /> Print Report
          </motion.button>

          {/* View Toggle */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() =>
              setViewMode(viewMode === "table" ? "cards" : "table")
            }
            className="bg-gray-800 text-white px-4 py-2 rounded-lg font-semibold"
          >
            {viewMode === "table" ? "Switch to Cards" : "Switch to Table"}
          </motion.button>
        </div>
      </div>

      {/* Table or Card View */}
      <div
        className="flex-1 overflow-auto"
        ref={tableRef}
        style={{ maxHeight: "500px" }}
      >
        {viewMode === "table" ? (
          <table className="w-full border border-white">
            <thead className="bg-blue-950/90 text-white sticky top-0 z-10 text-sm font-semibold">
              <tr>
                <th className="py-3 px-4 text-left">Staff ID</th>
                <th className="py-3 px-4 text-left">Full Name</th>
                <th className="py-3 px-4 text-left">Date</th>
                <th className="py-3 px-4 text-left">Check-In</th>
                <th className="py-3 px-4 text-left">Check-Out</th>
                <th className="py-3 px-4 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" className="text-center py-10 text-gray-500">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <svg
                        className="animate-spin h-10 w-10"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <defs>
                          <linearGradient
                            id="spinnerGradient"
                            x1="0%"
                            y1="0%"
                            x2="100%"
                            y2="0%"
                          >
                            <stop offset="0%" stopColor="#1e3a8a" />{" "}
                            {/* Deep Blue */}
                            <stop offset="50%" stopColor="#3b82f6" />{" "}
                            {/* Light Blue */}
                            <stop offset="100%" stopColor="#7c3aed" />{" "}
                            {/* Purple */}
                          </linearGradient>
                        </defs>
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="url(#spinnerGradient)"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="url(#spinnerGradient)"
                          d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                        ></path>
                      </svg>
                      <span className="text-base font-semibold text-gray-700 animate-pulse">
                        Fetching attendance...
                      </span>
                    </div>
                  </td>
                </tr>
              ) : filteredAttendance.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-6 text-gray-500">
                    No attendance records found.
                  </td>
                </tr>
              ) : (
                filteredAttendance.map((entry, i) => (
                  <tr
                    key={i}
                    className="border-t text-sm text-gray-700 font-semibold border-gray-500 bg-white hover:bg-gray-200 transition-colors duration-150"
                  >
                    <td className="py-4 px-3 flex flex-col md:flex-row items-center gap-2.5">
                      {entry.images?.length > 0 && (
                        <img
                          src={entry.images[0]}
                          alt="Staff"
                          className="w-12 h-12 rounded-full object-cover border"
                        />
                      )}
                      {entry.staffID}
                    </td>
                    <td className="py-4 px-3">{getFullName(entry.staffID)}</td>
                    <td className="py-4 px-3">
                      {new Date(entry.date).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-3">{entry.checkIn}</td>
                    <td className="py-4 px-3">{entry.checkOut || "--"}</td>
                    <td className="py-4 px-3 capitalize">
                      <span
                        className={
                          entry.status.toLowerCase() === "late"
                            ? "text-red-600 font-semibold"
                            : "text-green-600 font-semibold"
                        }
                      >
                        {entry.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-2">
            {filteredAttendance.length === 0 ? (
              <p className="text-center text-gray-500">
                No attendance records found.
              </p>
            ) : (
              filteredAttendance.map((entry, i) => (
                <motion.div
                  key={i}
                  whileHover={{ scale: 1.02 }}
                  className="bg-white rounded-xl shadow-md p-4 flex flex-col gap-2 border"
                >
                  <div className="flex items-center gap-3">
                    {entry.images?.length > 0 && (
                      <img
                        src={entry.images[0]}
                        alt="Staff"
                        className="w-12 h-12 rounded-full object-cover border"
                      />
                    )}
                    <div>
                      <h3 className="font-bold text-lg text-gray-800">
                        {getFullName(entry.staffID)}
                      </h3>
                      <p className="text-sm text-gray-500">{entry.staffID}</p>
                    </div>
                  </div>
                  <div className="mt-2 text-sm text-gray-700">
                    <p>
                      <span className="font-semibold">Date:</span>{" "}
                      {new Date(entry.date).toLocaleDateString()}
                    </p>
                    <p>
                      <span className="font-semibold">Check-In:</span>{" "}
                      {entry.checkIn}
                    </p>
                    <p>
                      <span className="font-semibold">Check-Out:</span>{" "}
                      {entry.checkOut || "--"}
                    </p>
                    <p>
                      <span className="font-semibold">Status:</span>{" "}
                      <span
                        className={
                          entry.status.toLowerCase() === "late"
                            ? "text-red-600"
                            : "text-green-600"
                        }
                      >
                        {entry.status}
                      </span>
                    </p>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Modals */}
      {showModal && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
        >
          <div className="bg-white text-black p-6 rounded-xl w-full max-w-lg shadow-lg">
            <div className="flex items-center gap-2 mb-4">
              <FaUserPlus className="text-2xl text-blue-950" />
              <h2 className="text-xl font-semibold text-gray-800">
                Create Attendee
              </h2>
            </div>

            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
              <div className="flex flex-col">
                <label className="text-sm text-gray-600 font-medium">
                  Full Name
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Enter full name"
                  className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400"
                />
              </div>
              <div className="flex flex-col">
                <label className="text-sm text-gray-600 font-medium">
                  Staff ID
                </label>
                <input
                  name="workID"
                  type="tel"
                  value={formData.workID}
                  onChange={handleChange}
                  placeholder="Enter your staff id"
                  className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400"
                />
              </div>

              <div className="flex flex-col">
                <label className="text-sm text-gray-600 font-medium">
                  Role
                </label>
                <select
                  className="px-4 py-2 border rounded-md bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-400"
                  value={formData.role}
                  name="role"
                  onChange={handleChange}
                >
                  <option value="" disabled>
                    Select Role
                  </option>
                  <option value="admin">Admin</option>
                  <option value="member">Member</option>
                </select>
              </div>

              <div className="flex flex-col">
                <label className="text-sm text-gray-600 font-medium">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter email"
                  className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400"
                />
              </div>

              <div className="flex flex-col">
                <label className="text-sm text-gray-600 font-medium">
                  Contact
                </label>
                <input
                  name="contact"
                  type="tel"
                  value={formData.contact}
                  onChange={handleChange}
                  placeholder="Enter phone number"
                  className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400"
                />
              </div>

              <div className="flex flex-col">
                <label className="text-sm text-gray-600 font-medium">
                  Position
                </label>
                <select
                  className="px-4 py-2 border rounded-md bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-400"
                  value={formData.position}
                  name="position"
                  onChange={handleChange}
                >
                  <option value="" disabled>Select Role</option>
                  <option value="CEO">CEO</option>
                  <option value="CONSULTANT">CONSULTANT</option>
                  <option value="DEVELOPER">DEVELOPER</option>
                  <option value="MARKETING/SALES OFFICER">
                    MARKETING/SALES OFFICER
                  </option>
                  <option value="MARKETING/SALES LEAD">
                    MARKETING/SALES LEAD
                  </option>
                  <option value="OPERATIONS LEAD">OPERATIONS LEAD</option>
                  <option value="TECHNICAL LEAD">TECHNICAL LEAD</option>
                  <option value="INTERN">INTERN</option>
                  <option value="SERVICE PERSONNEL">SERVICE PERSONNEL</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 mt-5">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex items-center gap-1 px-4 py-2 text-white bg-red-500 hover:bg-red-600 rounded-md transition"
                >
                  <MdCancel className="text-lg" />
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`flex items-center gap-1 px-4 py-2 bg-blue-900 hover:bg-blue-950 text-white rounded-md transition cursor-pointer ${
                    loading
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-blue-900 hover:bg-blue-950 text-white"
                  } `}
                  disabled={loading}
                >
                  <MdSave className="text-lg" />
                  {loading ? "Saving..." : "Save Attendee"}
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      )}

      {/* confirm modal popUp */}
      {logoutModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-[rgba(0,0,0,0.5)] z-50 p-5">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-lg p-6 max-w-sm w-full"
          >
            <h3 className="text-lg font-bold text-[#283144] mb-4">
              Are you sure you want to Log Out?
            </h3>
            <div className="flex justify-end gap-4">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={cancelLogOut}
                className="bg-gray-300 text-[#283144] px-4 py-2 rounded-lg"
              >
                Cancel
              </motion.button>

              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={HandleLogout}
                className="bg-red-500 text-white px-4 py-2 rounded-lg"
              >
                Yes, Log Out
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default HrDashboard;