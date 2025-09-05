import {
  Users,
  UserCheck,
  UserX,
  TrendingUp,
  TrendingDown,
  FileText,
  Info,
} from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import useAttendanceStore from "../../../store/useAttendanceStore";
import { useMemo, useState } from "react";



// ================== TOOLTIP COMPONENTS ==================
const Tooltip = ({ text, visible }) => (
  <div
    className={`absolute top-0 left-0 z-50 w-48 p-2 text-xs text-white bg-gray-800 rounded-md shadow-md transition-opacity duration-200 ${
      visible ? "opacity-100" : "opacity-0 pointer-events-none"
    }`}
    style={{ transform: "translate(-50%, -120%)" }}
  >
    {text}
  </div>
);

const InfoTooltip = ({ text }) => {
  const [visible, setVisible] = useState(false);

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      onClick={() => setVisible((v) => !v)}
    >
      <Info className="w-4 h-4 text-gray-400 cursor-pointer" />
      <Tooltip text={text} visible={visible} />
    </div>
  );
};
// ================== END TOOLTIP COMPONENTS ==================





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

      // ✅ staff lookup
      const staff = attendees.find(
        (a) => a.staffID === r.staffID || a.ID === r.ID || a.id === r.id
      );

      return {
        id: r?.id || r?.staffID || r?.ID,
        name: resolveStaffName(r?.staffID || r?.ID),
        label: text,
        dotClass: dot,
        ts,
        // ✅ include images safely
        image: Array.isArray(r.images) ? r.images : [],
        position: staff?.position || r.position || "N/A", // optional
      };
    })
    .sort((a, b) => b.ts - a.ts) // latest first
    .slice(0, 10); // show the latest N items
}, [todayAttendance, attendees]);


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
        {/* Attendance Today card */}
        <div className="relative flex flex-row items-center justify-between w-[100%] h-[140px] bg-white border-2 border-gray-200 rounded-2xl p-5">
          <div className="space-y-2 leading-relaxed">
            <p className="text-sm font-medium text-gray-600 flex items-center gap-1">
              Attendance Today
              <InfoTooltip text="Total staff checked in today. % compares to yesterday." />
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

          <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-blue-100">
            <Users className="w-6 h-6 text-blue-700" />
          </div>
        </div>

        {/* Present Staff card */}
        <div className="relative flex flex-row items-center justify-between w-[100%] h-[140px] bg-white border-2 border-gray-200 rounded-2xl p-5">
          <div className="space-y-2 leading-relaxed">
            <p className="text-sm font-medium text-gray-600 flex items-center gap-1">
              Present Staff
              <InfoTooltip text="Staff present today. % shows change vs yesterday." />
            </p>
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

          <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-green-100">
            <UserCheck className="w-6 h-6 text-green-700" />
          </div>
        </div>

        {/* Absent Staff card */}
        <div className="relative flex flex-row items-center justify-between w-[100%] h-[140px] bg-white border-2 border-gray-200 rounded-2xl p-5">
          <div className="space-y-2 leading-relaxed">
            <p className="text-sm font-medium text-gray-600 flex items-center gap-1">
              Absent Staff
              <InfoTooltip text="Staff absent today. % shows change vs yesterday." />
            </p>
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

          <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-red-100">
            <UserX className="w-6 h-6 text-red-700" />
          </div>
        </div>

        {/* Late Check-ins card */}
        <div className="relative flex flex-row items-center justify-between w-[100%] h-[140px] bg-white border-2 border-gray-200 rounded-2xl p-5">
          <div className="space-y-2 leading-relaxed">
            <p className="text-sm font-medium text-gray-600 flex items-center gap-1">
              Late Check-ins
              <InfoTooltip text="Staff checked in late today. % change vs yesterday." />
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

          <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-yellow-100">
            <UserCheck className="w-6 h-6 text-yellow-700" />
          </div>
        </div>
      </div>

      {/* quick links & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Links div */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 transition-all duration-200 ">
          <div className="p-6 border-b border-gray-200 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-1">
              Quick Actions
              <InfoTooltip text="Shortcut buttons to quickly view attendance or add new staff." />
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
                className="w-full text-left p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors duration-200 cursor-pointer"
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
        <div className="bg-white w-[100%] rounded-xl shadow-sm border border-gray-200 transition-all duration-200 ">
          <div className="p-6 border-b border-gray-200 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-1">
              Recent Activity
              <InfoTooltip text="Shows the latest staff check-ins and status changes for today. Green = on-time, Yellow = late." />
            </h3>
          </div>

          {/* 👇 Add a fixed max height + scroll */}
          <div className="p-6 space-y-4 max-h-[350px] overflow-y-auto">
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
                  <div className="flex items-center space-x-3">
                    {item.image[0] ? (
                      <img
                        src={item.image[0]}
                        alt={item.name}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs text-gray-500">
                        N/A
                      </div>
                    )}
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {item.name} {item.label}
                      </p>
                      <p className="text-xs text-gray-500">
                        {timeAgo(item.ts)}
                      </p>
                    </div>
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
