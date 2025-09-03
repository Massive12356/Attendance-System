import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// 🔹 FlipDigit component
function FlipDigit({ value, theme, digitSize }) {
  const isDark = theme === "dark";

  return (
    <div
      className="relative perspective-1000"
      style={{ width: digitSize * 0.8, height: digitSize * 1.2 }}
    >
      <AnimatePresence mode="popLayout">
        <motion.div
          key={value}
          initial={{ rotateX: -90, opacity: 0 }}
          animate={{ rotateX: 0, opacity: 1 }}
          exit={{ rotateX: 90, opacity: 0 }}
          transition={{ duration: 0.5 }}
          className={`absolute inset-0 flex items-center justify-center font-mono font-bold rounded-lg shadow-lg ${
            isDark ? "bg-gray-900 text-white" : "bg-white text-gray-900"
          }`}
          style={{
            fontSize: digitSize, // scales with size
            backfaceVisibility: "hidden",
          }}
        >
          {value}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

// 🔹 FlipClock (Digital mode)
export default function AnimatedClock({
  timezone = undefined,
  showSeconds = true,
  theme = "light",
  size = 100, // smaller default
  variant = "digital",
}) {
  const [now, setNow] = useState(new Date());

  // Helper to get time in a specific timezone
  function getNowInZone(tz) {
    if (!tz) return new Date();
    const parts = new Intl.DateTimeFormat("en-US", {
      timeZone: tz,
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
      hour12: false,
    }).formatToParts(new Date());

    const obj = {};
    for (const p of parts) obj[p.type] = p.value;
    return new Date(2000, 0, 1, obj.hour, obj.minute, obj.second);
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(getNowInZone(timezone));
    }, 1000);
    return () => clearInterval(interval);
  }, [timezone]);

  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");

  return (
    <div
      className="flex space-x-2 p-4 rounded-lg"
    >
      {/* Hours */}
      <FlipDigit value={hours[0]} theme={theme} digitSize={size * 0.4} />
      <FlipDigit value={hours[1]} theme={theme} digitSize={size * 0.4} />
      <span
        className="flex items-center font-mono"
        style={{
          fontSize: size * 0.4,
          color:"white",
        }}
      >
        :
      </span>
      {/* Minutes */}
      <FlipDigit value={minutes[0]} theme={theme} digitSize={size * 0.4} />
      <FlipDigit value={minutes[1]} theme={theme} digitSize={size * 0.4} />
      {showSeconds && (
        <>
          <span
            className="flex items-center font-mono"
            style={{
              fontSize: size * 0.4,
              color:  "white",
            }}
          >
            :
          </span>
          <FlipDigit value={seconds[0]} theme={theme} digitSize={size * 0.4} />
          <FlipDigit value={seconds[1]} theme={theme} digitSize={size * 0.4} />
        </>
      )}
    </div>
  );
}
