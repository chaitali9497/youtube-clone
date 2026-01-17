import { useState } from "react";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import signupIcon from "../assets/signin-icon/icon-signup.png";
import googleIcon from "../assets/login-icon/google-icon.png";
import api from "../utils/axios";
import AlertBox from "../components/AlertBox";

/* ================= PASSWORD VALIDATION ================= */
const validateStrongPassword = (password) => {
  if (password.length < 6)
    return "Password must be at least 6 characters";
  if (!/[A-Z]/.test(password))
    return "Password must contain at least one uppercase letter";
  if (!/[a-z]/.test(password))
    return "Password must contain at least one lowercase letter";
  if (!/[0-9]/.test(password))
    return "Password must contain at least one number";
  if (!/[!@#$%^&*]/.test(password))
    return "Password must contain at least one special character";
  return "";
};

function CreateAccount() {
  const navigate = useNavigate();

  /* ================= STATE ================= */
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirm: "",
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  /* ================= HELPERS ================= */
  const isValidEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  /* ================= VALIDATION ================= */
  const validate = () => {
    const err = {};

    if (!form.firstName.trim())
      err.firstName = "First name is required";

    if (!form.lastName.trim())
      err.lastName = "Last name is required";

    if (!form.email.trim())
      err.email = "Email is required";
    else if (!isValidEmail(form.email))
      err.email = "Enter a valid email address";

    const passwordError = validateStrongPassword(form.password);
    if (passwordError) err.password = passwordError;

    if (!form.confirm)
      err.confirm = "Confirm password is required";
    else if (form.password !== form.confirm)
      err.confirm = "Passwords do not match";

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");

    if (!validate()) return;

    try {
      setLoading(true);

      await api.post("/auth/register", {
        name: `${form.firstName} ${form.lastName}`.trim(),
        email: form.email.toLowerCase(),
        password: form.password,
      });

      navigate("/login");
    } catch (err) {
      setServerError(
        err.response?.data?.message || "Account creation failed"
      );
    } finally {
      setLoading(false);
    }
  };

  /* ================= UI ================= */
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="bg-white rounded-lg shadow-md w-full max-w-4xl p-8">
        <form onSubmit={handleSubmit}>
          <div className="grid md:grid-cols-2 gap-8">

            {/* LEFT */}
            <div>
              <img src={googleIcon} alt="Google" className="h-15 mb-2" />

              <h2 className="text-xl font-medium mb-6">
                Create your Google Account
              </h2>

              <AlertBox
                type="error"
                message={serverError}
                onClose={() => setServerError("")}
              />

              {/* NAMES */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <input
                    name="firstName"
                    placeholder="First name"
                    value={form.firstName}
                    onChange={handleChange}
                    className={`w-full border rounded px-3 py-2 ${
                      errors.firstName ? "border-red-500" : ""
                    }`}
                  />
                  {errors.firstName && (
                    <p className="text-xs text-red-500 mt-1">
                      {errors.firstName}
                    </p>
                  )}
                </div>

                <div>
                  <input
                    name="lastName"
                    placeholder="Last name"
                    value={form.lastName}
                    onChange={handleChange}
                    className={`w-full border rounded px-3 py-2 ${
                      errors.lastName ? "border-red-500" : ""
                    }`}
                  />
                  {errors.lastName && (
                    <p className="text-xs text-red-500 mt-1">
                      {errors.lastName}
                    </p>
                  )}
                </div>
              </div>

              {/* EMAIL */}
              <div className="mb-4">
                <input
                  name="email"
                  type="email"
                  autoCapitalize="none"
                  autoCorrect="off"
                  spellCheck={false}
                  placeholder="Email address"
                  value={form.email}
                  onChange={(e) =>
                    handleChange({
                      target: {
                        name: "email",
                        value: e.target.value.toLowerCase(),
                      },
                    })
                  }
                  className={`w-full border rounded px-3 py-2 ${
                    errors.email ? "border-red-500" : ""
                  }`}
                />
                {errors.email && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.email}
                  </p>
                )}
              </div>

              {/* PASSWORDS */}
              <div className="grid grid-cols-2 gap-4 mb-2">
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Password"
                    value={form.password}
                    onChange={handleChange}
                    className={`w-full border rounded px-3 py-2 ${
                      errors.password ? "border-red-500" : ""
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((p) => !p)}
                    className="absolute right-3 top-2.5 text-gray-400"
                  >
                    {showPassword ? (
                      <EyeIcon className="w-5 h-5" />
                    ) : (
                      <EyeSlashIcon className="w-5 h-5" />
                    )}
                  </button>

                  {/* PASSWORD CHECKLIST */}
                  <ul className="text-xs mt-2 space-y-1">
                    <li className={/[A-Z]/.test(form.password) ? "text-green-600" : "text-gray-400"}>
                      • One uppercase letter
                    </li>
                    <li className={/[a-z]/.test(form.password) ? "text-green-600" : "text-gray-400"}>
                      • One lowercase letter
                    </li>
                    <li className={/[0-9]/.test(form.password) ? "text-green-600" : "text-gray-400"}>
                      • One number
                    </li>
                    <li className={/[!@#$%^&*]/.test(form.password) ? "text-green-600" : "text-gray-400"}>
                      • One special character
                    </li>
                    <li className={form.password.length >= 6 ? "text-green-600" : "text-gray-400"}>
                      • At least 6 characters
                    </li>
                  </ul>

                  {errors.password && (
                    <p className="text-xs text-red-500 mt-1">
                      {errors.password}
                    </p>
                  )}
                </div>

                <div className="relative">
                  <input
                    type={showConfirm ? "text" : "password"}
                    name="confirm"
                    placeholder="Confirm"
                    value={form.confirm}
                    onChange={handleChange}
                    className={`w-full border rounded px-3 py-2 ${
                      errors.confirm ? "border-red-500" : ""
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm((p) => !p)}
                    className="absolute right-3 top-2.5 text-gray-400"
                  >
                    {showConfirm ? (
                      <EyeSlashIcon className="w-5 h-5" />
                    ) : (
                      <EyeIcon className="w-5 h-5" />
                    )}
                  </button>

                  {errors.confirm && (
                    <p className="text-xs text-red-500 mt-1">
                      {errors.confirm}
                    </p>
                  )}
                </div>
              </div>

              {/* ACTIONS */}
              <div className="flex justify-between items-center mt-6">
                <button
                  type="button"
                  onClick={() => navigate("/login")}
                  className="text-blue-600 font-medium hover:underline"
                >
                  Sign in instead
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className={`bg-blue-600 text-white px-6 py-2 rounded ${
                    loading
                      ? "opacity-60 cursor-not-allowed"
                      : "hover:bg-blue-700"
                  }`}
                >
                  {loading ? "Creating..." : "Create Account"}
                </button>
              </div>
            </div>

            {/* RIGHT */}
            <div className="hidden md:flex flex-col items-center justify-center text-center">
              <img src={signupIcon} alt="" className="w-48 mb-4" />
              <p className="text-gray-600 max-w-xs">
                One account. All of Google working for you.
              </p>
            </div>

          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateAccount;
