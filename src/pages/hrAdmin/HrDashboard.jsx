import React from "react";
import { Users, UserCheck, UserX,TrendingUp, FileText } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const HrDashboard = () => {
  return (
    <div className="space-y-7">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Overview Dashboard</h1>
        <p className="text-gray-600  mt-1">
          Today's attendance summary and key metrics
        </p>
      </div>

      {/* statistical cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Attendance today div */}
        <div className="flex flex-row items-center justify-between w-[100%] h-[140px] bg-white border-2 border-gray-200 rounded-2xl p-5">
          <div className="space-y-2 leading-relaxed">
            <p className="text-sm font-medium text-gray-600">
              Attendance Today
            </p>
            <p className="text-sm font-medium text-blue-600">
              <span className="text-2xl font-bold text-gray-900 mr-1">0</span>{" "}
              of 5 staff
            </p>
            <p className="flex items-center text-xs text-green-600 gap-1">
              <TrendingUp className="w-4 h-4 text-green-500" /> +5% from
              yesterday
            </p>
          </div>

          {/* icon */}
          <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-blue-100">
            <Users className="w-6 h-6 text-blue-700" />
          </div>
        </div>

        {/* Present Staff div */}
        <div className="w-[100%] h-[140px] bg-white border-2/1 border-gray-200 rounded-2xl">
          <div className="flex flex-row items-center justify-between w-[100%] h-[140px] bg-white border-2 border-gray-200 rounded-2xl p-5">
            <div className="space-y-2 leading-relaxed">
              <p className="text-sm font-medium text-gray-600">Present Staff</p>
              <p className="text-sm font-medium text-green-600">
                <span className="text-2xl font-bold text-gray-900 mr-1">0</span>{" "}
                0%
              </p>
              <p className="flex items-center text-xs text-green-600 gap-1">
                <TrendingUp className="w-4 h-4 text-green-500" /> +2% from
                yesterday
              </p>
            </div>

            {/* icon */}
            <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-green-100">
              <UserCheck className="w-6 h-6 text-green-700" />
            </div>
          </div>
        </div>

        {/* Absent Staff div */}
        <div className="w-[100%] h-[140px] bg-white border-2/1 border-gray-200 rounded-2xl">
          <div className="flex flex-row items-center justify-between w-[100%] h-[140px] bg-white border-2 border-gray-200 rounded-2xl p-5">
            <div className="space-y-2 leading-relaxed">
              <p className="text-sm font-medium text-gray-600">Absent Staff</p>
              <p className="text-sm font-medium text-red-600">
                <span className="text-2xl font-bold text-gray-900 mr-1">0</span>{" "}
                0%
              </p>
              {/* <p className="flex items-center text-xs text-green-600 gap-1">
                <TrendingUp className="w-4 h-4 text-green-500" /> +2% from
                yesterday
              </p> */}
            </div>

            {/* icon */}
            <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-red-100">
              <UserX className="w-6 h-6 text-red-700" />
            </div>
          </div>
        </div>

        {/* Late Check-ins div */}
        <div className="w-[100%] h-[140px] bg-white border-2/1 border-gray-200 rounded-2xl">
          <div className="flex flex-row items-center justify-between w-[100%] h-[140px] bg-white border-2 border-gray-200 rounded-2xl p-5">
            <div className="space-y-2 leading-relaxed">
              <p className="text-sm font-medium text-gray-600">
                Late Check-ins
              </p>
              <p className="text-sm font-medium text-yellow-600">
                <span className="text-2xl font-bold text-gray-900 mr-1">0</span>{" "}
                0%
              </p>
              <p className="flex items-center text-xs text-green-600 gap-1">
                <TrendingUp className="w-4 h-4 text-green-500" /> +2% from
                yesterday
              </p>
            </div>

            {/* icon */}
            <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-yellow-100">
              <UserCheck className="w-6 h-6 text-yellow-700" />
            </div>
          </div>
        </div>
      </div>

      {/* quick links & Recent Activity */}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* quick links div */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200  transition-all duration-200 ">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              Quick Actions
            </h3>
          </div>

          <div className="p-6 space-y-4">
            <motion.button
              className="w-full text-left p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors duration-200 cursor-pointer"
              whileTap={{ scale: 0.95 }}
            >
              <div className="flex items-center">
                <FileText className="w-6 h-6 text-blue-600" />
                <div className="ml-4">
                  <p className="font-medium text-gray-900">View Attendance</p>
                  <p className="text-sm text-gray-600">
                    View All staff Attendance and History
                  </p>
                </div>
              </div>
            </motion.button>

            <Link to={"insight-center/create"}>
              <motion.button
                className="w-full text-left p-4 rounded-lg border border-gray-200 hover:bg-gray-50  transition-colors duration-200 cursor-pointer"
                whileTap={{ scale: 0.95 }}
              >
                <div className="flex items-center">
                  <Users className="w-6 h-6 text-green-600" />
                  <div className="ml-4">
                    <p className="font-medium text-gray-900">Add New Staff</p>
                    <p className="text-sm text-gray-600">
                      Register a new Staff
                    </p>
                  </div>
                </div>
              </motion.button>
            </Link>
          </div>
        </div>

        {/* Recent Activity */}

        <div className="bg-white rounded-xl shadow-sm border border-gray-200  transition-all duration-200 ">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              Recent Activity
            </h3>
          </div>

          <div className="p-6 space-y-4">
            <div className="flex items-start space-x-4">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  Kofi checked in
                </p>
                <p className="text-xs text-gray-500">2 minutes ago</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  Kwadwo Adu Manu late check-in
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  15 minutes ago
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  Kojo Nkrumah checked in
                </p>
                <p className="text-xs text-gray-500">2 minutes ago</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HrDashboard;
