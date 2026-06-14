import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createBrowserRouter, RouterProvider, Outlet, Navigate, useLocation } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import AppLayout from "@/components/layout/layout.tsx";
import Login from "./pages/login-page/login.tsx";
import Signup from "./pages/signup/Signup.tsx";
import Landing from "./pages/landing/landing.tsx"
import NotFound from "./pages/error404/404.tsx";
import Settings from "./pages/Settings/Settings.tsx";
import Marketplace from "./pages/marketplace/marketplace.tsx";
import ProductDetail from "./pages/product-details/productDetails.tsx";
import Profile from "./pages/profile/profile.tsx"
import ForgotPassword from "./pages/forgot-password/forgotPassword.tsx";
import ResetPassword from "./pages/reset-password/ResetPassword.tsx";
import Builder from "./pages/builder/Builder.tsx";

// 🔒 ROUTE GUARD FOR GUESTS: Redirects to login if there's no auth token
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const token = localStorage.getItem('token');
  const location = useLocation();

  if (!token) {
    // If a guest tries to access this route, bounce them back to /login
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <>{children}</>;
};

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 1,
    },
  },
});

const router = createBrowserRouter([
  {
    element: <AppLayout><Outlet /></AppLayout>,
    children: [
      /* 🌍 Public Pages (Guests can see these) */
      { path: "/", element: <Landing /> },
      { path: "/marketplace", element: <Marketplace /> },
      { path: "/marketplace/:id", element: <ProductDetail /> },
      { path: "/builder", element: <Builder /> },
      
      /* 🔒 Protected Pages (Guests get kicked out to login screen) */
      { 
        path: "/settings", 
        element: <ProtectedRoute><Settings /></ProtectedRoute> 
      },
      { 
        path: "/profile", 
        element: <ProtectedRoute><Profile /></ProtectedRoute> 
      },
    ],
  },
  { path: "/login", element: <Login /> },
  { path: "/signup", element: <Signup /> },
  { path: "/forgotPassword", element: <ForgotPassword /> },
  { path: "/reset-password", element: <ResetPassword /> },
  { path: "*", element: <NotFound /> }
]);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <RouterProvider router={router} />
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;