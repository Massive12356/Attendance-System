import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { MdApartment, MdWorkOutline } from "react-icons/md";
import {
  FaSignOutAlt,
  FaBuilding,
} from "react-icons/fa";
import {
  Home,
  Users,
  UserPlus,
  Calendar,
  Building,
  FileText,
  Settings,
  UserIcon,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { IoIosArrowDown } from "react-icons/io";


const DashSideBar = ({ isOpen, setIsOpen, isCollapsed }) => {
  const [openEmployees, setOpenEmployees] = useState(false);
  const [openOrganization, setOrganization] = useState(false);
  const [showModal , setShowModal] = useState(false);
  const navigate = useNavigate();
  
  const toggleEmployees = () => setOpenEmployees((prev) => !prev);
  const toggleOrganization = () => setOrganization((prev) => !prev);

  const activeLink =
    "flex items-center gap-3 px-4 py-3 bg-blue-100 text-blue-900 font-medium rounded-lg";
  const normalLink =
    "flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-100 transition-all duration-200 rounded-lg";

    const popupModal = ()=>{
      setShowModal(true);
    }

    const handleLogout = () => {
      setShowModal(false);
      navigate("/");
    };

    const cancelLogOut = () => {
      setShowModal(false);
    };

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/10 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <motion.aside
        className={`
    fixed z-50 top-0 left-0 h-full bg-white shadow-md border-r border-gray-200 p-1
    transform md:translate-x-0 md:static md:flex flex-col transition-[width] duration-300 ease-in-out
    ${isOpen ? "translate-x-0" : "-translate-x-full"}
    ${isCollapsed ? "w-20" : "w-64"}
  `}
      >
        {/* Logo / Title */}
        <div className="flex items-center p-4 border-b-2 border-gray-200">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <Building className="w-5 h-5 text-white" />
          </div>

          {!isCollapsed && (
            <div className="ml-3">
              <h1 className="font-bold text-lg text-gray-800 ">
                AttendanceHub
              </h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Dashboard v1.0
              </p>
            </div>
          )}
        </div>

        {/* Navigation Links */}
        <aside className="flex flex-col overflow-y-auto p-1 pl-3 mt-3 h-[65%]">
          <NavLink
            to="/insight-center"
            end
            className={({ isActive }) => (isActive ? activeLink : normalLink)}
          >
            <Home size={20} />
            {!isCollapsed && "Overview"}
          </NavLink>

          {/* Employees */}
          <div className="mt-1.5">
            <button
              onClick={toggleEmployees}
              className="w-full text-left flex items-center justify-between px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-all duration-200"
            >
              <div className="flex items-center gap-3">
                <Users size={20} />
                {!isCollapsed && "Attendance"}
              </div>

              {!isCollapsed && (
                <motion.span
                  animate={{ rotate: openEmployees ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="text-gray-500"
                >
                  <IoIosArrowDown size={16} />
                </motion.span>
              )}
            </button>

            <AnimatePresence>
              {openEmployees && !isCollapsed && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="pl-8 text-sm space-y-1 "
                >
                  <NavLink
                    to="/insight-center/create"
                    className={({ isActive }) =>
                      isActive
                        ? activeLink + " text-sm"
                        : normalLink + " text-sm"
                    }
                  >
                    <UserPlus size={16} />
                    Create Staff
                  </NavLink>
                  <NavLink
                    to="/insight-center/attendList"
                    className={({ isActive }) =>
                      isActive
                        ? activeLink + " text-sm"
                        : normalLink + " text-sm"
                    }
                  >
                    <UserIcon size={16} />
                    Staff List
                  </NavLink>

                  {/* <NavLink
                    to="/insight-center/attend"
                    className={({ isActive }) =>
                      isActive
                        ? activeLink + " text-sm"
                        : normalLink + " text-sm"
                    }
                  >
                    <FileText size={16} />
                    Stat Attendance
                  </NavLink> */}

                  <NavLink
                    to="/insight-center/view"
                    className={({ isActive }) =>
                      isActive
                        ? activeLink + " text-sm"
                        : normalLink + " text-sm"
                    }
                  >
                    <FileText size={16} />
                    View Attendance
                  </NavLink>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Organization */}
          <div className="hidden">
            <button
              onClick={toggleOrganization}
              className="w-full text-left flex items-center justify-between px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-900 transition-all duration-200"
            >
              <div className="flex items-center gap-3">
                <FaBuilding size={20} />
                Organization
              </div>
              <motion.span
                animate={{ rotate: openOrganization ? 180 : 0 }}
                transition={{ duration: 0.3 }}
                className="text-gray-500"
              >
                <IoIosArrowDown size={16} />
              </motion.span>
            </button>

            <AnimatePresence>
              {openOrganization && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="pl-8 text-sm space-y-1"
                >
                  <NavLink
                    to="/insight-center/departments"
                    className={({ isActive }) =>
                      isActive
                        ? activeLink + " text-sm"
                        : normalLink + " text-sm"
                    }
                  >
                    <MdApartment size={16} />
                    Departments
                  </NavLink>
                  <NavLink
                    to="/insight-center/jobPostings"
                    className={({ isActive }) =>
                      isActive
                        ? activeLink + " text-sm"
                        : normalLink + " text-sm"
                    }
                  >
                    <MdWorkOutline size={16} />
                    Job Postings
                  </NavLink>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </aside>

        {/* Footer */}
        <div className="border-t border-gray-200 mt-auto space-y-2 pt-2">
          {/* <NavLink
            to=""
            className={({ isActive }) => (isActive ? activeLink : normalLink)}
          >
            <Settings size={16} />
            {!isCollapsed && "Settings"}
          </NavLink> */}

          <button
            onClick={popupModal}
            className="flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-100 transition-all duration-200 w-full"
          >
            <FaSignOutAlt size={16} />
            {!isCollapsed && "Logout"}
          </button>
        </div>

        {/* confirm modal popUp */}
      </motion.aside>
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-[9999] p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-2xl shadow-2xl p-6 max-w-md w-full"
          >
            {/* Header */}
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-100">
                <FaSignOutAlt className="text-red-500 text-xl" />
              </div>
            </div>

            {/* Subtext */}
            <p className="text-gray-600 mb-6">
              Are you sure you want to log out? You’ll need to sign in again to
              access your dashboard.
            </p>

            {/* Footer buttons */}
            <div className="flex justify-end gap-3">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={cancelLogOut}
                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
              >
                Cancel
              </motion.button>

              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={handleLogout}
                className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition"
              >
                Yes, Log Out
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
};

export default DashSideBar;
