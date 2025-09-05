
import { Suspense,lazy, useEffect } from 'react'
import { Toaster } from 'react-hot-toast'
import { BrowserRouter,Routes,Route } from 'react-router-dom'
import './App.css'
import Spinner from './components/Spinner'
import { setInitialTheme } from './utils/themeManager'
import DarkModeToggle from './components/DarkModeToggle'
import useAttendanceStore from '../store/useAttendanceStore' // Zustand Store
import ProtectedRoute from './components/ProtectedRoute'

// lazy loading pages
const AttendancePage = lazy(()=>import('./components/AttendancePage'));
const Login = lazy(()=>import('./components/Login'));
const HRLayout = lazy(()=>import('./layouts/HRLayout'))
const HrDashboard = lazy(()=>import('./pages/hrAdmin/HrDashboard'));
const CheckinPage = lazy(()=>import('./components/CheckinPage'));
const IdentityCheckPage = lazy(()=>import('./components/IdentityCheckPage'));
const DarkText = lazy(()=>import('./components/DarkText'));
const AttendanceListPage = lazy(()=>import('./pages/hrAdmin/AttendanceListPage'))
const Attendance = lazy(()=>import('./pages/hrAdmin/Attendance'))
const CreateStaff = lazy(()=>import('./pages/hrAdmin/CreateStaff'))
const ViewAttendance = lazy(()=>import('./pages/hrAdmin/ViewAttendance'));

function App() {

  const { fetchAllAttendance, fetchAllAttendees, fetchTodayAttendance } =
    useAttendanceStore();

   useEffect(() => {
     // Preload data when app loads
     fetchAllAttendance();
     fetchAllAttendees();
     fetchTodayAttendance();
   }, []);

  useEffect(()=>{
    setInitialTheme();
  },[])
  return (
    <>
      <DarkModeToggle />
      {/* Toaster Configuration */}
      <Toaster
        toastOptions={{
          success: {
            style: {
              background: "#4caf50",
              color: "#fff",
              fontWeight: "bold",
              padding: "12px 20px",
              borderRadius: "8px",
            },
            iconTheme: {
              primary: "#fff",
              secondary: "#4caf50",
            },
          },
          error: {
            style: {
              background: "#f44336",
              color: "#fff",
              fontWeight: "bold",
              padding: "12px 20px",
              borderRadius: "8px",
            },
            iconTheme: {
              primary: "#fff",
              secondary: "#f44336",
            },
          },
        }}
        position="top-right"
        reverseOrder={false}
      />
      {/* Routing with lazy-loading */}
      <BrowserRouter>
        <Suspense fallback={<Spinner />}>
          <Routes>
            {/* public routes */}
            <Route path="/" element={<AttendancePage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/check-in" element={<CheckinPage />} />
            <Route path="/identityCheck" element={<IdentityCheckPage />} />
            <Route path="/darkText" element={<DarkText />} />

            {/* Hr management */}
            <Route
              path="/insight-center"
              element={
                <ProtectedRoute role='admin'>
                  <HRLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<HrDashboard />} />
              <Route path="attendList" element={<AttendanceListPage />} />
              <Route path='attend' element={<Attendance/>}/>
              <Route path='create' element={<CreateStaff/>}/>
              <Route path='view' element={<ViewAttendance/>}/>
            </Route>
          </Routes>
        </Suspense>
      </BrowserRouter>
    </>
  );
}

export default App
