import { lazy, Suspense } from "react";
import { createBrowserRouter } from "react-router-dom";

import App from "../App";
import Auth from "../Layout/Auth";
import Loader from "../components/Loader";
import Main from "../Layout/Main";

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
  {
    element: <Main />,
    errorElement: withSuspense(ErrorPage),
    children: [
      {
        index: true,
        element: withSuspense(Home),
      },
      {
        path: "watch/:id",
        element: withSuspense(Watch),
      },
      {
        path: "create-channel",
        element: withSuspense(CreateChannel),
      },
      {
        path: "channel/:channelId",
        element: withSuspense(Channel),
      },
      {
        path: "/upload",
        element: <UploadVideo />,
      },
    ],
  },
  {
    element: <Auth />,
    children: [
      {
        path: "create-account",
        element: withSuspense(CreateAccount),
      },
      {
        path: "login",
        element: withSuspense(Login),
      },
    ],
  },
]);


export default router;
