import { lazy, Suspense } from "react";
import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Loader from "../components/Loader";

// Lazy pages
const Home = lazy(() => import("../pages/Home"));
const CreateAccount = lazy(() => import("../pages/CreateAccount"));
const Login = lazy(() => import("../pages/Login"));
const ErrorPage = lazy(() => import("../pages/Error"));

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />, // Layout (Navbar + Sidebar + Outlet)
    errorElement: (
      <Suspense fallback={<Loader />}>
        <ErrorPage />
      </Suspense>
    ),
    children: [
      {
        index: true, // '/'
        element: (
          <Suspense fallback={<Loader />}>
            <Home />
          </Suspense>
        ),
      },
      {
        path: "create-account", // '/create-account'
        element: (
          <Suspense fallback={<Loader />}>
            <CreateAccount />
          </Suspense>
        ),
      },
      {
        path: "login", // '/login'
        element: (
          <Suspense fallback={<Loader />}>
            <Login />
          </Suspense>
        ),
      },
    ],
  },
]);

export default router;
