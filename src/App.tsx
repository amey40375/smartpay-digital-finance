
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import AuthGuard from "./components/AuthGuard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CustomerDashboard from "./pages/CustomerDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import LoanApplication from "./pages/LoanApplication";
import Balance from "./pages/Balance";
import Withdraw from "./pages/Withdraw";
import Bills from "./pages/Bills";
import TopUp from "./pages/TopUp";
import Profile from "./pages/Profile";
import AdminCustomers from "./pages/AdminCustomers";
import AdminLoans from "./pages/AdminLoans";
import AdminWithdrawals from "./pages/AdminWithdrawals";
import AdminTopUps from "./pages/AdminTopUps";
import AdminBills from "./pages/AdminBills";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <div className="mobile-container bg-gray-50 min-h-screen">
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/" element={
                <AuthGuard>
                  <CustomerDashboard />
                </AuthGuard>
              } />
              <Route path="/admin" element={
                <AuthGuard adminOnly>
                  <AdminDashboard />
                </AuthGuard>
              } />
              <Route path="/loan-application" element={
                <AuthGuard>
                  <LoanApplication />
                </AuthGuard>
              } />
              <Route path="/balance" element={
                <AuthGuard>
                  <Balance />
                </AuthGuard>
              } />
              <Route path="/withdraw" element={
                <AuthGuard>
                  <Withdraw />
                </AuthGuard>
              } />
              <Route path="/bills" element={
                <AuthGuard>
                  <Bills />
                </AuthGuard>
              } />
              <Route path="/topup" element={
                <AuthGuard>
                  <TopUp />
                </AuthGuard>
              } />
              <Route path="/profile" element={
                <AuthGuard>
                  <Profile />
                </AuthGuard>
              } />
              <Route path="/admin/customers" element={
                <AuthGuard adminOnly>
                  <AdminCustomers />
                </AuthGuard>
              } />
              <Route path="/admin/loans" element={
                <AuthGuard adminOnly>
                  <AdminLoans />
                </AuthGuard>
              } />
              <Route path="/admin/withdrawals" element={
                <AuthGuard adminOnly>
                  <AdminWithdrawals />
                </AuthGuard>
              } />
              <Route path="/admin/topups" element={
                <AuthGuard adminOnly>
                  <AdminTopUps />
                </AuthGuard>
              } />
              <Route path="/admin/bills" element={
                <AuthGuard adminOnly>
                  <AdminBills />
                </AuthGuard>
              } />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </div>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
