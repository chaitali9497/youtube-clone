import { useState } from "react";
import { useNavigate } from "react-router-dom";
import signupIcon from "../assets/login-icon/google-icon.png";
import api from "../utils/axios";
import AlertBox from "../components/AlertBox";
import Loader from "../components/Loader";

function Login() {
  const navigate = useNavigate();

  /* ================= STATE ================= */
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  /* ================= HELPERS ================= */
  const isValidEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const validate = () => {
    const err = {};

    if (!email.trim()) {
      err.email = "Email is required";
    } else if (!isValidEmail(email)) {
      err.email = "Enter a valid email address";
    }

    if (!password) {
      err.password = "Password is required";
    } else if (password.length < 6) {
      err.password = "Password must be at least 6 characters";
    }

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  /* ================= LOGIN ================= */
  const handleLogin = async () => {
    setServerError("");

    if (!validate()) return;

    const startTime = Date.now();

    try {
      setLoading(true);

      const { data } = await api.post("/auth/login", {
        email: email.toLowerCase().trim(),
        password,
      });

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("isLoggedIn", "true");

      // ⏳ ensure loader shows at least 500ms (smooth UX)
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(500 - elapsed, 0);

      setTimeout(() => {
        navigate("/");
      }, remaining);

    } catch (err) {
      setServerError(
        err.response?.data?.message || "Invalid email or password"
      );
      setLoading(false);
    }
  };

  /* ================= CENTER LOADER ================= */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-3">
          <Loader />
          <p className="text-sm text-gray-500">
            Signing you in…
          </p>
        </div>
      </div>
    );
  }

  /* ================= UI ================= */
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div
        className="
          w-full max-w-md rounded-xl px-10 py-10
          bg-white/80 backdrop-blur-md
          shadow-lg border border-white/30
        "
      >
        <img src={signupIcon} className="mb-5" alt="Google" />

        <h1 className="text-2xl font-normal text-gray-900">
          Sign in
        </h1>
        <p className="text-sm text-gray-600 mb-6">
          Use your Google Account
        </p>

        {/* SERVER ERROR */}
        <AlertBox
          type="error"
          message={serverError}
          onClose={() => setServerError("")}
        />

        {/* EMAIL */}
        <div className="mb-4">
          <input
            type="email"
            autoCapitalize="none"
            autoCorrect="off"
            spellCheck={false}
            className={`input w-full ${
              errors.email ? "border-red-500" : ""
            }`}
            placeholder="Email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value.toLowerCase());
              setErrors({ ...errors, email: "" });
            }}
          />
          {errors.email && (
            <p className="text-xs text-red-500 mt-1">
              {errors.email}
            </p>
          )}
        </div>

        {/* PASSWORD */}
        <div className="mb-2">
          <input
            type="password"
            className={`input w-full ${
              errors.password ? "border-red-500" : ""
            }`}
            placeholder="Password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setErrors({ ...errors, password: "" });
            }}
          />
          {errors.password && (
            <p className="text-xs text-red-500 mt-1">
              {errors.password}
            </p>
          )}
        </div>

        <button className="mt-3 text-sm text-blue-600 font-medium hover:underline">
          Forgot email?
        </button>

        <div className="flex justify-between items-center mt-10">
          <button
            onClick={() => navigate("/create-account")}
            className="text-blue-600 font-medium hover:underline"
          >
            Create account
          </button>

          <button
            onClick={handleLogin}
            className="btn-primary"
          >
            Log In
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;
