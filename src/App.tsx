import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { UserProvider, useUser } from "@/contexts/UserContext";

// Pages
import Onboarding from "./pages/Onboarding";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import Tracking from "./pages/Tracking";
import History from "./pages/History";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Protected Route wrapper
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useUser();
  
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
}

// App Routes with User Context
function AppRoutes() {
  const { isAuthenticated } = useUser();

  return (
    <Routes>
      {/* Public Routes */}
      <Route 
        path="/" 
        element={isAuthenticated ? <Navigate to="/home" replace /> : <Onboarding />} 
      />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      {/* Protected Routes */}
      <Route path="/home" element={
        <ProtectedRoute><Home /></ProtectedRoute>
      } />
      <Route path="/tracking" element={
        <ProtectedRoute><Tracking /></ProtectedRoute>
      } />
      <Route path="/history" element={
        <ProtectedRoute><History /></ProtectedRoute>
      } />
      <Route path="/profile" element={
        <ProtectedRoute><Profile /></ProtectedRoute>
      } />

      {/* Catch-all */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner position="top-center" />
      <BrowserRouter>
        <UserProvider>
          <AppRoutes />
        </UserProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
