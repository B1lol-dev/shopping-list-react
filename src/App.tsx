import { lazy } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import DashboardLayout from "./components/layout/DashboardLayout";

// pages
const Login = lazy(() => import("./pages/auth/Login"));
const Signup = lazy(() => import("./pages/auth/Signup"));
const Dashboard = lazy(() => import("./pages/dashboard/Dashboard"));
const Group = lazy(() => import("./pages/group/Group"));
const NotFound = lazy(() => import("./pages/not-found/NotFound"));

const App = () => {
  return (
    <>
      <Toaster position="top-center" />
      <Routes>
        <Route path="/" element={<DashboardLayout />}>
          <Route path="/" element={<Navigate to="/dashboard" />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dashboard/group/:id" element={<Group />} />
        </Route>

        <Route path="/login" element={<Login />} />
        <Route path="/sign-up" element={<Signup />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};

export default App;
