import { Toaster } from "@/components/ui/toaster";
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
import { UserProvider, useUser } from "./UserContext";
import AdminPanel from "./pages/AdminPanel";
import WorkerPage from "./pages/WorkerPage";
import Navbar from "./components/Navbar";

const queryClient = new QueryClient();

function PrivateRoute({ children, allowedRole }: { children: JSX.Element; allowedRole: "admin" | "worker" | "user" }) {
  const { currentUser, loading } = useUser();
  if (loading) return null;
  if (!currentUser) return <Navigate to="/auth" replace />;
  if (currentUser.role !== allowedRole) return <Navigate to="/" replace />;
  return children;
}

function UserRoute({ children }: { children: JSX.Element }) {
  const { currentUser, loading } = useUser();
  if (loading) return null;
  if (!currentUser) return <Navigate to="/auth" replace />;
  if (currentUser.role !== "user") return <Navigate to="/" replace />;
  return children;
}

const AppRoutes = () => (
  <BrowserRouter>
    <Navbar />
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/about" element={<About />} />
      <Route path="/auth" element={<AuthPage />} />

      <Route
        path="/report"
        element={
          <UserRoute>
            <ReportWaste />
          </UserRoute>
        }
      />
      <Route
        path="/wallet"
        element={
          <UserRoute>
            <Wallet />
          </UserRoute>
        }
      />
      <Route
        path="/dashboard"
        element={
          <UserRoute>
            <Dashboard />
          </UserRoute>
        }
      />
      <Route
        path="/donate"
        element={
          <UserRoute>
            <DonateItems />
          </UserRoute>
        }
      />

      <Route
        path="/admin"
        element={
          <PrivateRoute allowedRole="admin">
            <AdminPanel />
          </PrivateRoute>
        }
      />

      <Route
        path="/worker"
        element={
          <PrivateRoute allowedRole="worker">
            <WorkerPage />
          </PrivateRoute>
        }
      />

      <Route path="*" element={<NotFound />} />
    </Routes>
  </BrowserRouter>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <UserProvider>
        <AppRoutes />
      </UserProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
