import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Webcam from "react-webcam";
import Loading from "./Loading";
import useAttendanceStore from "../../store/useAttendanceStore";
import { MdCallEnd } from "react-icons/md";
import { FiCamera } from "react-icons/fi";

const CheckinPage = () => {
  const [pin, setPin] = useState("");
  const [activeKey, setActiveKey] = useState(null); // for visual feedback
  const [loadingType, setLoadingType] = useState(null);
  const [showCamera, setShowCamera] = useState(false);
  const webcamRef = useRef(null);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const [cameraError, setCameraError] = useState(null);
  const navigate = useNavigate();

  const videoConstraints = {
    width: 1280,
    height: 720,
    facingMode: "user",
  };

  function dataURLtoFile(dataurl, filename) {
    const arr = dataurl.split(",");
    const mimeMatch = arr[0].match(/:(.*?);/);
    const mime = mimeMatch ? mimeMatch[1] : "";
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }

    return new File([u8arr], filename, { type: mime });
  }

  const {
    checkInAttendance,
    checkOutAttendance,
    loading,
    error,
    successMessage,
    resetStatus,
    fetchAllAttendance,
  } = useAttendanceStore();

  // Handle PIN keypad clicks
  const handleKeyClick = (value) => {
    if (!value) return;

    setActiveKey(value);
    setTimeout(() => setActiveKey(null), 150);

    if (value === "del") {
      setPin(pin.slice(0, -1));
    } else if (pin.length < 6) {
      setPin(pin + value);
    }
  };

  // Handle Check In / Out
  const handleCheck = async (type) => {
    if (pin.length < 4) {
      toast.error("PIN must be at least 4 digits");
      return;
    }

    if (type === "Check In") {
      setShowCamera(true);
    } else {
      setLoadingType(type);
      try {
        await checkOutAttendance(pin);
        toast.success("Checked-Out successfully");
        navigate("/");
      } catch {
      } finally {
        setLoadingType(null);
      }
    }
  };

  const captureAndSubmit = async () => {
    if (!isCameraReady || !webcamRef.current) {
      toast.error("Camera is not ready");
      setCameraError("Camera not ready");
      return;
    }

    setIsCapturing(true);
    setCameraError(null);

    try {
      const screenshot = webcamRef.current.getScreenshot();
      if (!screenshot) {
        toast.error("Failed to capture image");
        setCameraError("No image captured");
        return;
      }

      const imageFile = dataURLtoFile(screenshot, "selfie.jpg");
      const formData = new FormData();
      formData.append("ID", pin);
      formData.append("images", imageFile);

      setLoadingType("Check In");

      await checkInAttendance(formData);
      toast.success("Checked-In successfully");
      navigate("/");
    } catch (err) {
      console.error("Capture/Submit failed:", err);
      toast.error("Failed to submit check-in");
      setCameraError("Submission failed");
    } finally {
      setIsCapturing(false);
      setLoadingType(null);
      setShowCamera(false);
    }
  };

  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage);
      resetStatus();
    }
    if (error) {
      toast.error(error);
      resetStatus();
    }
  }, [successMessage, error]);

  useEffect(() => {
    fetchAllAttendance(true);
  }, []);

  // Keyboard input handling
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!!loadingType && loading) return;

      // handling number keys
      if (e.key >= "0" && e.key <= "9") {
        handleKeyClick(e.key);
      } else if (e.key === "Backspace") {
        handleKeyClick("del");
      }

      //shortcut for check in and check out
      // Shortcut keys for Check In / Check Out
      if (e.key === "Enter" && !e.shiftKey) {
        handleCheck("Check In");
      } else if (e.key === "Enter" && e.shiftKey) {
        handleCheck("Check Out");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [pin, loadingType, loading]);

  const isLoading = !!loadingType && loading;

  return (
    <div className="bg-black min-h-screen w-full flex flex-col p-4 text-white">
      <Link to="/identityCheck" className="mb-4">
        <div className="flex items-center gap-2 text-white">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#ffffff"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M15 18l-6-6 6-6" />
          </svg>
          <p className="text-sm md:text-base">Back</p>
        </div>
      </Link>

      {!showCamera ? (
        <div className="flex flex-col items-center justify-center flex-1">
          <h1 className="text-2xl md:text-3xl font-semibold mb-2 text-center">
            Enter Your Staff <strong>PIN</strong>
          </h1>
          <p className="text-sm text-gray-300 text-center mb-4 max-w-md">
            For security reasons, please enter your unique Staff PIN to proceed
            with check-in or check-out.
          </p>

          <div className="fixed hidden  bottom-4 left-4 bg-black text-white px-4 py-3 rounded-lg shadow-lg md:flex flex-col gap-1 text-sm z-50">
            <span>⌨️ Enter → Check-In</span>
            <span>⌨️ Shift + Enter → Check-Out</span>
          </div>

          <div className="mb-4 text-2xl tracking-widest font-mono border border-gray-700 rounded-xl px-4 py-1 min-w-[220px] h-10 text-center shadow-sm bg-zinc-900 text-gray-500">
            {pin.split("").map((_, index) => (
              <span key={index} className="mx-1">
                •
              </span>
            ))}
          </div>

          <div className="grid grid-cols-3 gap-4 max-w-xs mb-8">
            {["1", "2", "3", "4", "5", "6", "7", "8", "9", "", "0", "del"].map(
              (key, index) => (
                <button
                  key={index}
                  className={`text-xl h-16 w-16 flex items-center justify-center rounded-full transition-all duration-200 font-semibold ${
                    key === "del"
                      ? activeKey === key
                        ? "bg-red-800"
                        : "bg-red-700 hover:bg-red-600"
                      : key
                      ? activeKey === key
                        ? "bg-gray-900"
                        : "bg-gray-800 hover:bg-gray-700"
                      : "pointer-events-none"
                  }`}
                  onClick={() => handleKeyClick(key)}
                  disabled={isLoading}
                >
                  {key === "del" ? "⌫" : key}
                </button>
              )
            )}
          </div>

          <div className="flex gap-6">
            <button
              onClick={() => handleCheck("Check In")}
              className={`bg-green-600 hover:bg-green-500 px-6 py-2 rounded-full text-white font-semibold ${
                isLoading ? "opacity-70 cursor-not-allowed" : ""
              }`}
              disabled={isLoading}
            >
              {loadingType === "Check In" ? <Loading /> : <>Check In</>}
            </button>
            <button
              onClick={() => handleCheck("Check Out")}
              className={`bg-yellow-600 hover:bg-yellow-500 px-6 py-2 rounded-full text-white font-semibold ${
                isLoading ? "opacity-70 cursor-not-allowed" : ""
              }`}
              disabled={isLoading}
            >
              {loadingType === "Check Out" ? <Loading /> : <>Check Out</>}
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center flex-1">
          <h2 className="text-xl font-bold bg-zinc-900 mb-2 p-4 rounded-lg">
            {cameraError ? "⚠️ Camera Error" : "Take a quick selfie"}
          </h2>

          {cameraError && (
            <p className="text-sm text-red-400 mb-2">{cameraError}</p>
          )}

          <Webcam
            ref={webcamRef}
            audio={false}
            name="images"
            screenshotFormat="image/jpeg"
            videoConstraints={videoConstraints}
            onUserMedia={() => {
              setIsCameraReady(true);
              toast.success("Camera is ready!");
            }}
            onUserMediaError={(err) => {
              console.error("Camera error", err);
              setCameraError("Camera access denied or not supported");
            }}
            className="rounded-lg w-200 h-100"
          />

          <div className="w-full flex justify-center items-center gap-3 mt-4">
            <button
              onClick={() => navigate(-1)}
              className="w-14 h-14 bg-red-600 hover:bg-red-500 rounded-full flex items-center justify-center text-white shadow-lg"
              title="Go Back"
            >
              <MdCallEnd size={24} />
            </button>

            <button
              onClick={captureAndSubmit}
              disabled={isCapturing || isLoading}
              className={`flex items-center gap-2 px-6 py-3 rounded-full text-white font-semibold shadow-lg ${
                isCapturing || isLoading
                  ? "bg-gray-600 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-500"
              }`}
            >
              <FiCamera size={20} />
              {isCapturing || isLoading ? "Submitting..." : "Capture"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CheckinPage;
