import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";

// Pages
import Landing from "@/pages/Landing";
import Login from "@/pages/Login";
import Signup from "@/pages/Signup";
import VerifyOtp from "@/pages/VerifyOtp";
import NotFound from "@/pages/NotFound";

// Owner Pages
import OwnerDashboard from "@/pages/owner/OwnerDashboard";
import RegisterGym from "@/pages/owner/RegisterGym";
import MyGym from "@/pages/owner/MyGym";
import QRPage from "@/pages/owner/QRPage";
import Members from "@/pages/owner/Members";
import OwnerSettings from "@/pages/owner/OwnerSettings";

// Admin Pages
import AdminDashboard from "@/pages/admin/AdminDashboard";
import PendingGyms from "@/pages/admin/PendingGyms";
import AllGyms from "@/pages/admin/AllGyms";
import AllMembers from "@/pages/admin/AllMembers";
import AdminCheckins from "@/pages/admin/AdminCheckins";
import AdminSettings from "@/pages/admin/AdminSettings";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/verify-otp" element={<VerifyOtp />} />

            {/* Owner Routes */}
            <Route path="/dashboard/owner" element={
              <ProtectedRoute allowedRoles={['owner']}>
                <OwnerDashboard />
              </ProtectedRoute>
            } />
            <Route path="/dashboard/owner/register-gym" element={
              <ProtectedRoute allowedRoles={['owner']}>
                <RegisterGym />
              </ProtectedRoute>
            } />
            <Route path="/dashboard/owner/my-gym" element={
              <ProtectedRoute allowedRoles={['owner']}>
                <MyGym />
              </ProtectedRoute>
            } />
            <Route path="/dashboard/owner/qr" element={
              <ProtectedRoute allowedRoles={['owner']}>
                <QRPage />
              </ProtectedRoute>
            } />
            <Route path="/dashboard/owner/members" element={
              <ProtectedRoute allowedRoles={['owner']}>
                <Members />
              </ProtectedRoute>
            } />
            <Route path="/dashboard/owner/settings" element={
              <ProtectedRoute allowedRoles={['owner']}>
                <OwnerSettings />
              </ProtectedRoute>
            } />

            {/* Admin Routes */}
            <Route path="/dashboard/admin" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            } />
            <Route path="/dashboard/admin/pending-gyms" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <PendingGyms />
              </ProtectedRoute>
            } />
            <Route path="/dashboard/admin/gyms" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AllGyms />
              </ProtectedRoute>
            } />
            <Route path="/dashboard/admin/members" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AllMembers />
              </ProtectedRoute>
            } />
            <Route path="/dashboard/admin/checkins" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminCheckins />
              </ProtectedRoute>
            } />
            <Route path="/dashboard/admin/settings" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminSettings />
              </ProtectedRoute>
            } />

            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
