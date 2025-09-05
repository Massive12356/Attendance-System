import {
  Users,
  UserCheck,
  UserX,
  TrendingUp,
  TrendingDown,
  FileText,
} from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import useAttendanceStore from "../../../store/useAttendanceStore";
import { useMemo, useEffect } from "react";

const HrDashboard = () => {
  // ✅ Get data from Zustand store
  const { attendances, todayAttendance, attendees, loading } =
    useAttendanceStore();

  // ✅ Assuming you also have a staff list length (or fetchAllAttendees)
  const totalStaff = attendees.length; // replace with your staff API count later

  // ✅ Calculate today's stats
  const todayStats = useMemo(() => {
    if (!todayAttendance || !Array.isArray(todayAttendance)) {
      return { present: 0, absent: totalStaff, late: 0 };
    }

    const present = todayAttendance.length;
    const late = todayAttendance.filter(
      (a) => a.status?.toLowerCase() === "late"
    ).length;
    const absent = Math.max(totalStaff - present, 0);

    return { present, absent, late };
  }, [todayAttendance, totalStaff]);

  // ✅ Group daily stats
  const dailyStats = useMemo(() => {
    if (!attendances || !Array.isArray(attendances)) return {};

    const grouped = attendances.reduce((acc, record) => {
      const day = new Date(record.date).toISOString().split("T")[0];
      acc[day] = acc[day] || { present: 0, late: 0 };
      acc[day].present += 1;
      if (record.status?.toLowerCase() === "late") {
        acc[day].late += 1;
      }
      return acc;
    }, {});

    // compute absent for each day
    Object.keys(grouped).forEach((day) => {
      grouped[day].absent = Math.max(totalStaff - grouped[day].present, 0);
    });

    return grouped;
  }, [attendances, totalStaff]);

  // ✅ Extract trends: today vs yesterday
  const trends = useMemo(() => {
    const dates = Object.keys(dailyStats).sort();
    if (dates.length < 1) return null;

    const todayKey = dates[dates.length - 1];
    const yesterdayKey = dates[dates.length - 2];

    const today = dailyStats[todayKey] || { present: 0, absent: 0, late: 0 };
    const yesterday = dailyStats[yesterdayKey] || {
      present: 0,
      absent: 0,
      late: 0,
    };

    const calcChange = (todayVal, yesterdayVal) => {
      if (yesterdayVal === 0) return 100; // fallback
      return Math.round(((todayVal - yesterdayVal) / yesterdayVal) * 100);
    };

    return {
      attendanceTrend: calcChange(today.present, yesterday.present),
      presentTrend: calcChange(today.present, yesterday.present),
      absentTrend: calcChange(today.absent, yesterday.absent),
      lateTrend: calcChange(today.late, yesterday.late),
    };
  }, [dailyStats]);

  // Resolve a human-friendly staff name from attendees; fall back to the ID
  const resolveStaffName = (id) => {
    const key = String(id ?? "");
    const match = (Array.isArray(attendees) ? attendees : []).find((a) => {
      const ids = [
        a?.ID,
        a?.id,
        a?.staffID,
        a?.workID,
        a?.employeeId,
        a?.empId,
      ].map(String);
      return ids.includes(key);
    });

    const full =
      match?.name ||
      match?.fullName ||
      [match?.firstName, match?.lastName].filter(Boolean).join(" ").trim();

    return full && full.length ? full : `Staff ${key}`;
  };

  // Pick the best timestamp for the activity (prefer check-in event time)
  const getRecordTimestamp = (r) => {
    // Your API has: date (ISO), createdAt (ISO), checkIn ("HH:mm:ss")
    // Prefer createdAt (usually the check-in creation), else date.
    const base = r?.createdAt || r?.date;
    if (base) return new Date(base);

    // Fallback: combine date + checkIn if provided
    if (r?.date && r?.checkIn) {
      const d = r.date.split("T")[0];
      return new Date(`${d}T${r.checkIn}`);
    }

    // Last resort: now (prevents crashes)
    return new Date();
  };

  // Map status to label + dot color used in your UI
  const statusMeta = (status) => {
    const s = String(status || "").toLowerCase();
    if (s === "late") return { text: "late check-in", dot: "bg-yellow-500" };
    // treat "early", "present", anything else as a normal check-in
    return { text: "checked in", dot: "bg-green-500" };
  };

  // "2 minutes ago" / "15 minutes ago" / "just now"
  const timeAgo = (ts) => {
    const now = new Date();
    const diffMs = now - ts;
    const mins = Math.floor(diffMs / 60000);
    if (mins < 1) return "just now";
    if (mins < 60) return `${mins} minute${mins > 1 ? "s" : ""} ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs} hour${hrs > 1 ? "s" : ""} ago`;
    const days = Math.floor(hrs / 24);
    return `${days} day${days > 1 ? "s" : ""} ago`;
  };


  const recentActivities = useMemo(() => {
    if (!Array.isArray(todayAttendance)) return [];

    return todayAttendance
      .map((r) => {
        const ts = getRecordTimestamp(r);
        const { text, dot } = statusMeta(r?.status);
        return {
          id: r?.id || r?.staffID || r?.ID,
          name: resolveStaffName(r?.staffID || r?.ID),
          label: text,
          dotClass: dot,
          ts,
        };
      })
      .sort((a, b) => b.ts - a.ts) // latest first
      .slice(0, 10); // show the latest N items (adjust as you like)
  }, [todayAttendance, attendees]);


  useEffect(() => {
    console.log("todayAttendance =>", todayAttendance);
  }, [todayAttendance]);

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
              <span className="text-2xl font-bold text-gray-900 mr-1">
                {todayStats.present}
              </span>{" "}
              of {totalStaff} staff
            </p>
            {trends && (
              <p
                className={`flex items-center text-xs gap-1 ${
                  trends.attendanceTrend >= 0
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {trends.attendanceTrend >= 0 ? (
                  <TrendingUp className="w-4 h-4 text-green-500" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-red-500" />
                )}
                {trends.attendanceTrend}% from yesterday
              </p>
            )}
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
                <span className="text-2xl font-bold text-gray-900 mr-1">
                  {todayStats.present}
                </span>{" "}
                {Math.round((todayStats.present / totalStaff) * 100)}%
              </p>
              {trends && (
                <p
                  className={`flex items-center text-xs gap-1 ${
                    trends.presentTrend >= 0 ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {trends.presentTrend >= 0 ? (
                    <TrendingUp className="w-4 h-4 text-green-500" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-red-500" />
                  )}
                  {trends.presentTrend}% from yesterday
                </p>
              )}
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
                <span className="text-2xl font-bold text-gray-900 mr-1">
                  {todayStats.absent}
                </span>{" "}
                {Math.round((todayStats.absent / totalStaff) * 100)}%
              </p>
              {trends && (
                <p
                  className={`flex items-center text-xs gap-1 ${
                    trends.absentTrend >= 0 ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {trends.absentTrend >= 0 ? (
                    <TrendingUp className="w-4 h-4 text-green-500" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-red-500" />
                  )}
                  {trends.absentTrend}% from yesterday
                </p>
              )}
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
                <span className="text-2xl font-bold text-gray-900 mr-1">
                  {todayStats.late}
                </span>{" "}
                {Math.round((todayStats.late / totalStaff) * 100)}%
              </p>
              {trends && (
                <p
                  className={`flex items-center text-xs gap-1 ${
                    trends.lateTrend >= 0 ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {trends.lateTrend >= 0 ? (
                    <TrendingUp className="w-4 h-4 text-green-500" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-red-500" />
                  )}
                  {trends.lateTrend}% from yesterday
                </p>
              )}
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

            <Link to={"/insight-center/create"}>
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
            {recentActivities.length === 0 ? (
              <p className="text-sm text-gray-500">No activity yet today</p>
            ) : (
              recentActivities.map((item) => (
                <div
                  key={`${item.id}-${item.ts.toISOString()}`}
                  className="flex items-start space-x-4"
                >
                  <div
                    className={`w-2 h-2 ${item.dotClass} rounded-full mt-2`}
                  ></div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {item.name} {item.label}
                    </p>
                    <p className="text-xs text-gray-500">{timeAgo(item.ts)}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HrDashboard;
