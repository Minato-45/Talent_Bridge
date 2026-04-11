import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Jobs from "./pages/Jobs";
import JobDetail from "./pages/JobDetail";
import FindTalent from "./pages/FindTalent";
import UploadJob from "./pages/UploadJob";
import EmployerDashboard from "./pages/EmployerDashboard";
import SeekerDashboard from "./pages/SeekerDashboard";
import AdminDashboard from "./pages/AdminDashboard";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="min-h-screen flex flex-col bg-gray-50">
          <Navbar />
          <main className="flex-1">
            <Routes>
              {/* Public routes */}
              <Route
                path="/"
                element={<Home />}
              />
              <Route
                path="/login"
                element={<Login />}
              />
              <Route
                path="/register"
                element={<Register />}
              />
              <Route
                path="/jobs"
                element={<Jobs />}
              />
              <Route
                path="/jobs/:id"
                element={<JobDetail />}
              />
              <Route
                path="/find-talent"
                element={<FindTalent />}
              />
              <Route
                path="/upload-job"
                element={<UploadJob />}
              />

              {/* Employer routes */}
              <Route
                path="/employer/dashboard/*"
                element={
                  <ProtectedRoute roles={["recruiter"]}>
                    <EmployerDashboard />
                  </ProtectedRoute>
                }
              />

              {/* Seeker routes */}
              <Route
                path="/seeker/dashboard/*"
                element={
                  <ProtectedRoute roles={["jobseeker"]}>
                    <SeekerDashboard />
                  </ProtectedRoute>
                }
              />

              {/* Admin routes */}
              <Route
                path="/admin/*"
                element={
                  <ProtectedRoute roles={["admin"]}>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />

              {/* Catch-all */}
              <Route
                path="*"
                element={
                  <div className="text-center py-20 text-gray-500">
                    Page not found
                  </div>
                }
              />
            </Routes>
          </main>
        </div>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar
          newestOnTop
        />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
