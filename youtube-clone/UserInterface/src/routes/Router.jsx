import { lazy, Suspense } from "react";
import { createBrowserRouter } from "react-router-dom";

import Main from "../Layout/Main";
import Auth from "../Layout/Auth";
import Loader from "../components/Loader";

import ProtectedRoute from "../routes/ProtectedRoute";
import PublicRoute from "../routes/PublicRoute";

// Lazy pages
const Home = lazy(() => import("../pages/Home"));
const Watch = lazy(() => import("../pages/Watch"));
const CreateAccount = lazy(() => import("../pages/CreateAccount"));
const Login = lazy(() => import("../pages/Login"));
const ErrorPage = lazy(() => import("../pages/Error"));
const CreateChannel = lazy(() => import("../pages/CreateChannel"));
const Channel = lazy(() => import("../pages/Channel"));
import UploadVideo from "../pages/UploadVideo";

const withSuspense = (Component) => (
  <Suspense fallback={<Loader />}>
    <Component />
  </Suspense>
);

const router = createBrowserRouter([
  /* ================= PUBLIC ================= */
  {
    element: <Main />,
    errorElement: withSuspense(ErrorPage),
    children: [
      {
        index: true,
        element: withSuspense(Home), //  SEARCH WORKS
      },
      {
        path: "watch/:id",
        element: withSuspense(Watch), //  WATCH WORKS
      },
    ],
  },

  /* ================= PROTECTED ================= */
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <Main />,
        children: [
          {
            path: "create-channel",
            element: withSuspense(CreateChannel),
          },
          {
            path: "channel/:channelId",
            element: withSuspense(Channel),
          },
          {
            path: "upload",
            element: <UploadVideo />,
          },
        ],
      },
    ],
  },

  /* ================= AUTH ONLY ================= */
  {
    element: <PublicRoute />,
    children: [
      {
        element: <Auth />,
        children: [
          {
            path: "login",
            element: withSuspense(Login),
          },
          {
            path: "create-account",
            element: withSuspense(CreateAccount),
          },
        ],
      },
    ],
  },
]);

export default router;
