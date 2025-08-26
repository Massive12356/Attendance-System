import React, { useState, useRef, useEffect } from "react";
import { FiPrinter } from "react-icons/fi";
import { AiOutlineUserAdd } from "react-icons/ai";
import { MdCancel, MdSave } from "react-icons/md";
import { FaUserPlus, FaArrowRight } from "react-icons/fa";
import { motion } from "framer-motion";
import sukuLogo from "../../assets/logo.png";
import { Link } from "react-router-dom";
import useAttendanceStore from "../../../store/useAttendanceStore"; // from zustand
import toast from "react-hot-toast/headless";

const AttendanceListPage = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [formData, setFormData] = useState("");
  const tableRef = useRef();

  const {
    attendees,
    fetchAllAttendees,
    loading,
    registerAttendee,
    error,
    successMessage,
    resetStatus,
  } = useAttendanceStore();

  useEffect(() => {
    fetchAllAttendees();
  }, [fetchAllAttendees]);

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
    font-size: 12px; /* Make print text more compact */
  }

  table {
    width: 100%;
    border-collapse: collapse;
    border: 1px solid #333;
  }

  th, td {
    border: 1px solid #333;
    padding: 6px 8px;
    text-align: center; /* ✅ Center all table content */
    vertical-align: middle; /* ✅ Center vertically too */
  }

  thead {
    background-color: #0d3b66; /* Dark blue for header */
    color: white;
  }

  tr:nth-child(even) {
    background-color: #f8f8f8; /* Light zebra stripes */
  }

  /* Watermark stays subtle */
  .print-watermark {
    position: fixed;
    top: 50%;
    left: 50%;
    width: 300px;
    height: 300px;
    transform: translate(-50%, -50%);
    opacity: 0.08;
    z-index: -1;
    pointer-events: none;
  }

  .print-watermark img {
    width: 100%;
    height: auto;
  }
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
  const filteredAttendees = attendees.filter((attendee) => {
    // Text search filter (safe with optional chaining)
    const matchSearch =
      attendee.position?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      attendee.fullName?.toLowerCase().includes(searchQuery.toLowerCase());

    let matchesDate = true;

    // Date filter only if a date is selected
    if (selectedDate) {
      const created = new Date(attendee.createdAt);
      const selected = new Date(selectedDate);

      // Ensure both dates are valid before comparing
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

  // handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    await registerAttendee(formData);
    toast.success("Attendee registered successfully.");
    setFormData({
      fullName: "",
      workID: "",
      role: "",
      email: "",
      position: "",
      contact: "",
    });
    setShowModal(false);
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
      resetStatus();
    }

    if (successMessage) {
      toast.success(successMessage);
      resetStatus();
    }
  }, [error, successMessage]);

  return (
    <div className="min-h-screen flex flex-col bg-[#F4F2EE] p-4 overflow-hidden">
      {/* Watermark hidden from screen but useful for structure */}
      <div className="print-watermark hidden" aria-hidden="true">
        <img src={sukuLogo} alt="Company Watermark" />
      </div>

      {/* Top Nav */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">HR Created Attendance List</h1>
        <Link to={"/insight-center"}>
          <motion.button
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 bg- px-4 py-2 rounded-lg text-black  cursor-pointer"
          >
            <FaArrowRight size={20} className="font-light" />
          </motion.button>
        </Link>
      </div>

      {/* Filters and Actions */}
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between mb-4">
        {/* Date Filter */}
        <div className="flex flex-col w-full md:w-auto">
          <label
            htmlFor="dateFilter"
            className="text-sm  text-gray-700 mb-1 font-bold"
          >
            Filter by Date
          </label>
          <input
            id="dateFilter"
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-4 py-2 rounded-lg outline-none bg-white border border-gray-300 text-black w-full md:w-[200px]"
          />
        </div>

        {/* Search Field */}
        <div className="flex flex-col w-full md:w-auto">
          <label
            htmlFor="searchFilter"
            className="text-sm text-gray-700 mb-1 font-bold"
          >
            Search Attendee
          </label>
          <input
            id="searchFilter"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by Name, Position"
            className="px-4 py-2 rounded-lg bg-white border outline-none border-gray-300 text-black w-full md:w-64"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowModal(true)}
            className="flex items-center justify-center gap-2 bg-blue-900 hover:bg-blue-950 cursor-pointer px-4 py-2 rounded-lg text-white font-semibold w-full sm:w-auto"
          >
            <AiOutlineUserAdd size={20} /> Create Attendee
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handlePrint}
            className="bg-white hover:bg-gray-50 font-semibold px-4 py-2 rounded-lg border flex items-center justify-center gap-2 border-gray-300 text-black w-full sm:w-auto"
          >
            <FiPrinter size={18} /> Print List
          </motion.button>
        </div>
      </div>

      {/* Table Container (Scrolls only if overflow) */}
      <div
        className="flex-1 overflow-auto"
        ref={tableRef}
        style={{ maxHeight: "500px" }}
      >
        <table className="w-full border border-white">
          <thead className="bg-blue-950/90 text-white sticky top-0 z-10 text-sm font-semibold">
            <tr>
              <th className="py-3 px-4 text-left">Staff ID</th>
              <th className="py-3 px-4 text-left">Full Name</th>
              <th className="py-3 px-4 text-left">Position</th>
              <th className="py-3 px-4 text-left">Email</th>
              <th className="py-3 px-4 text-left">Contact</th>
              <th className="py-3 px-4 text-left">Role</th>
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
            ) : filteredAttendees.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center py-6 text-gray-500">
                  No Attendees records found
                </td>
              </tr>
            ) : (
              filteredAttendees.map((entry) => (
                <tr
                  key={entry._id}
                  className="border-t border-gray-500 text-sm text-gray-700 hover:bg-gray-200 font-bold transition-colors duration-150 bg-white"
                >
                  <td className="py-4 px-3">{entry.staffID}</td>

                  <td className="py-4 px-3">{entry.fullName}</td>
                  <td className="py-4 px-3">{entry.position}</td>
                  <td className="py-4 px-3">{entry.email}</td>
                  <td className="py-4 px-3">{entry.contact}</td>
                  <td className="py-4 px-3">{entry.role}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
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
                  <option value="visitor">Visitor</option>
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
                <input
                  type="text"
                  name="position"
                  value={formData.position}
                  onChange={handleChange}
                  placeholder="e.g. Developer, HR Officer"
                  className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400"
                />
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
    </div>
  );
};

export default AttendanceListPage;
