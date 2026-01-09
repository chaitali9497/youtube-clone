import { Link, useRouteError } from "react-router-dom";

function ErrorPage() {
  const error = useRouteError();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 text-center px-4">
      <h1 className="text-6xl font-bold text-blue-600">404</h1>
      <p className="text-xl mt-2">Page not found</p>

      <p className="text-gray-500 mt-4 mb-6">
        {error?.statusText || error?.message || "Something went wrong"}
      </p>

      <Link
        to="/"
        className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Go Home
      </Link>
    </div>
  );
}

export default ErrorPage;
