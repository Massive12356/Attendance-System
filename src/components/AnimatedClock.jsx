import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

// AnimatedClock.jsx
// Props:
// - size (number) - diameter in px for analog, font-size base for digital
// - variant: 'analog' | 'digital' | 'both'
// - timezone: IANA timezone string (e.g. 'Africa/Accra') or undefined for local
// - showSeconds: boolean
// - smooth: boolean (smooth second hand)
// - theme: 'light' | 'dark'
// - showNumbers: boolean (for analog)

export default function AnimatedClock({
  size = 200,
  variant = "analog",
  timezone = undefined,
  showSeconds = true,
  smooth = true,
  theme = "light",
  showNumbers = true,
}) {
  const [now, setNow] = useState(() => new Date());
  const rafRef = useRef(null);

  // Helper: get time in a specific timezone using Intl
  function getNowInZone(tz) {
    if (!tz) return new Date();
    // Convert to parts and rebuild a Date in local time representing that wall-clock time
    const parts = new Intl.DateTimeFormat("en-US", {
      timeZone: tz,
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
      hour12: false,
    }).formatToParts(new Date());

    const obj = {};
    for (const p of parts) obj[p.type] = p.value;
    // month in Date constructor is 0-based
    return new Date(
      obj.year,
      parseInt(obj.month, 10) - 1,
      obj.day,
      obj.hour,
      obj.minute,
      obj.second
    );
  }

  // Smooth ticking for analog using requestAnimationFrame
  useEffect(() => {
    if (variant === "analog" || variant === "both") {
      const update = () => {
        setNow(getNowInZone(timezone));
        rafRef.current = requestAnimationFrame(update);
      };

      if (smooth) {
        rafRef.current = requestAnimationFrame(update);
        return () => cancelAnimationFrame(rafRef.current);
      }
    }
    // If not smooth (or not analog), fall back to interval
    const interval = setInterval(() => setNow(getNowInZone(timezone)), 1000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timezone, smooth, variant]);

  // Compute angles
  const seconds = now.getSeconds() + now.getMilliseconds() / 1000;
  const minutes = now.getMinutes() + seconds / 60;
  const hours = (now.getHours() % 12) + minutes / 60;

  const secondDeg = (seconds / 60) * 360;
  const minuteDeg = (minutes / 60) * 360;
  const hourDeg = (hours / 12) * 360;

  // Styles
  const wrapperStyle = {
    width: variant === "digital" ? "auto" : `${size}px`,
    height: variant === "digital" ? "auto" : `${size}px`,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
  };

  const clockFaceSize = size;
  const centerSize = Math.max(6, Math.round(size * 0.04));

  const isDark = theme === "dark";

  // Digital formatted time
  function formatDigital(date) {
    const opts = { hour: "2-digit", minute: "2-digit" };
    if (showSeconds) opts.second = "2-digit";
    if (timezone) opts.timeZone = timezone;
    opts.hour12 = false;
    return new Intl.DateTimeFormat("en-GB", opts).format(date);
  }

  return (
    <div className="inline-flex flex-col items-center" style={wrapperStyle}>
      {(variant === "analog" || variant === "both") && (
        <div
          className={`relative rounded-full flex items-center justify-center shadow-md p-2 ${
            isDark ? "bg-gray-900 text-white" : "bg-white text-gray-900"
          }`}
          style={{ width: clockFaceSize, height: clockFaceSize }}
          aria-label={"Analog clock"}
          role="img"
        >
          {/* Tick marks */}
          <div className="absolute inset-0">
            {/* 60 ticks */}
            {Array.from({ length: 60 }).map((_, i) => {
              const tickStyle = {
                transform: `rotate(${i * 6}deg) translateY(-${
                  clockFaceSize / 2 - 6
                }px)`,
                transformOrigin: "center center",
              };
              const isHour = i % 5 === 0;
              return (
                <div
                  key={i}
                  style={tickStyle}
                  className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 origin-center ${
                    isHour ? "w-1.5 h-4" : "w-0.5 h-2"
                  } ${isDark ? "bg-white" : "bg-gray-700"}`}
                />
              );
            })}
          </div>

          {/* Optional numbers */}
          {showNumbers && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              {Array.from({ length: 12 }).map((_, i) => {
                const angle = (i + 1) * 30;
                const rad = (angle * Math.PI) / 180;
                const r = clockFaceSize * 0.36;
                const x = Math.sin(rad) * r;
                const y = -Math.cos(rad) * r;
                return (
                  <div
                    key={i}
                    style={{ transform: `translate(${x}px, ${y}px)` }}
                    className={`absolute text-sm font-medium ${
                      isDark ? "text-white" : "text-gray-800"
                    }`}
                    aria-hidden
                  >
                    {i + 1}
                  </div>
                );
              })}
            </div>
          )}

          {/* Hour hand */}
          <div
            className="absolute origin-center"
            style={{ transform: `rotate(${hourDeg}deg)` }}
          >
            <div
              style={{
                width: `${clockFaceSize * 0.02}px`,
                height: `${clockFaceSize * 0.28}px`,
                borderRadius: `${clockFaceSize * 0.01}px`,
                transform: "translateY(-40%)",
              }}
              className={`${isDark ? "bg-white" : "bg-gray-900"}`}
            />
          </div>

          {/* Minute hand */}
          <div
            className="absolute origin-center"
            style={{ transform: `rotate(${minuteDeg}deg)` }}
          >
            <div
              style={{
                width: `${clockFaceSize * 0.012}px`,
                height: `${clockFaceSize * 0.38}px`,
                borderRadius: `${clockFaceSize * 0.01}px`,
                transform: "translateY(-45%)",
              }}
              className={`${isDark ? "bg-white" : "bg-gray-800"}`}
            />
          </div>

          {/* Second hand */}
          {showSeconds && (
            <div
              className="absolute origin-center"
              style={{ transform: `rotate(${secondDeg}deg)` }}
            >
              <div
                style={{
                  width: `${clockFaceSize * 0.006}px`,
                  height: `${clockFaceSize * 0.45}px`,
                  borderRadius: `${clockFaceSize * 0.004}px`,
                  transform: "translateY(-48%)",
                }}
                className={`relative ${isDark ? "bg-red-400" : "bg-red-600"}`}
              >
                {/* tail */}
                <div
                  style={{
                    position: "absolute",
                    bottom: "-20%",
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: `${clockFaceSize * 0.02}px`,
                    height: `${clockFaceSize * 0.02}px`,
                    borderRadius: "9999px",
                    background: isDark ? "#fff" : "#fff",
                  }}
                />
              </div>
            </div>
          )}

          {/* center dot */}
          <div
            style={{ width: centerSize, height: centerSize }}
            className={`absolute rounded-full ${
              isDark ? "bg-gray-200" : "bg-gray-800"
            }`}
          />
        </div>
      )}

      {(variant === "digital" || variant === "both") && (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className={`mt-3 font-mono text-center ${
            isDark ? "text-white" : "text-gray-900"
          }`}
          style={{ fontSize: Math.max(14, Math.round(size * 0.12)) }}
          aria-label="Digital clock"
        >
          {formatDigital(getNowInZone(timezone))}
        </motion.div>
      )}
    </div>
  );
}
