import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
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
      { path: "/", element: <Landing /> },
      { path: "/settings", element: <Settings /> },
      { path: "/marketplace", element: <Marketplace /> },
      { path: "/marketplace/:id", element: <ProductDetail /> },
      { path: "/profile", element: <Profile /> }
    ],
  },
  { path: "/login", element: <Login /> },
  { path: "/signup", element: <Signup /> },
  { path: "/forgotPassword", element: <ForgotPassword /> },
  { path: "/resetPassword/:token", element: <ResetPassword /> },
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