import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import About from "./pages/About";
import ReportWaste from "./pages/ReportWaste";
import Wallet from "./pages/Wallet";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import AuthPage from "./pages/AuthPage";
import DonateItems from "@/pages/DonateItems";

// *** ADDED IMPORTS ***
import { UserProvider, useUser } from "./UserContext";
import AdminPanel from "./pages/AdminPanel";
import WorkerPage from "./pages/WorkerPage";
import RoleSwitcher from "./components/RoleSwitcher";

const queryClient = new QueryClient();

// *** ADDED PrivateRoute component for role protection ***
function PrivateRoute({ children, allowedRole }: { children: JSX.Element; allowedRole: string }) {
  const { role } = useUser();
  return role === allowedRole ? children : <Navigate to="/auth" replace />;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      {/* Wrap with UserProvider */}
      <UserProvider>
        {/* BrowserRouter must be above RoleSwitcher */}
        <BrowserRouter>
          <RoleSwitcher /> {/* Moved inside BrowserRouter */}
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/about" element={<About />} />
            <Route path="/report" element={<ReportWaste />} />
            <Route path="/wallet" element={<Wallet />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/donate" element={<DonateItems />} />

            {/* Admin protected route */}
            <Route
              path="/admin"
              element={
                <PrivateRoute allowedRole="admin">
                  <AdminPanel />
                </PrivateRoute>
              }
            />

            {/* Worker protected route */}
            <Route
              path="/worker"
              element={
                <PrivateRoute allowedRole="worker">
                  <WorkerPage />
                </PrivateRoute>
              }
            />

            {/* Catch all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </UserProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
