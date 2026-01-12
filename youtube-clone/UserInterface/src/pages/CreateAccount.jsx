import { useState } from "react";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import signupIcon from "../assets/signin-icon/icon-signup.png";
import googleIcon from "../assets/login-icon/google-icon.png";
import api from "../utils/axios";

function CreateAccount() {
  const navigate = useNavigate();

  // ======================
  // STATE
  // ======================
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

  // ======================
  // HELPERS
  // ======================
  const mapFormToBackendPayload = (form) => {
    return {
      name: `${form.firstName} ${form.lastName}`.trim(),
      email: form.email.toLowerCase(),
      password: form.password,
    };
  };

  // ======================
  // HANDLERS
  // ======================
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validate = () => {
    const err = {};

    if (!form.firstName.trim()) err.firstName = true;
    if (!form.lastName.trim()) err.lastName = true;
    if (!form.email.trim()) err.email = true;
    if (form.password.length < 6) err.password = true;
    if (form.password !== form.confirm) err.confirm = true;

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");

    if (!validate()) return;

    try {
      setLoading(true);

      const payload = mapFormToBackendPayload(form);

      await api.post("/auth/register", payload);

      navigate("/login");
    } catch (err) {
      setServerError(
        err.response?.data?.message || "Account creation failed"
      );
    } finally {
      setLoading(false);
    }
  };

  // ======================
  // UI
  // ======================
  return (
    <div className="min-h-screen bg-blur-md flex items-center justify-center px-4">
      <div className="bg-white rounded-lg shadow-md w-full max-w-4xl p-8">
        <form onSubmit={handleSubmit}>
          <div className="grid md:grid-cols-2 gap-8">

            {/* LEFT */}
            <div>
              <img
                src={googleIcon}
                alt="Google"
                className="h-8 mb-2 select-none"
              />

              <h2 className="text-xl font-medium mb-6">
                Create your Google Account
              </h2>

              {/* Names */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <input
                  name="firstName"
                  value={form.firstName}
                  onChange={handleChange}
                  placeholder="First name"
                  className={`border rounded px-3 py-2 outline-none
                  ${errors.firstName ? "border-red-500" : ""}`}
                />
                <input
                  name="lastName"
                  value={form.lastName}
                  onChange={handleChange}
                  placeholder="Last name"
                  className={`border rounded px-3 py-2 outline-none
                  ${errors.lastName ? "border-red-500" : ""}`}
                />
              </div>

              {/* Email */}
              <div className="mb-4">
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Email address"
                  className={`w-full border rounded px-3 py-2 outline-none
                  ${errors.email ? "border-red-500" : ""}`}
                />
              </div>

              {/* Passwords */}
              <div className="grid grid-cols-2 gap-4 mb-2">
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Password"
                    className={`w-full border rounded px-3 py-2 outline-none
                    ${errors.password ? "border-red-500" : ""}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((p) => !p)}
                    className="absolute right-3 top-2.5 text-gray-400"
                  >
                    {showPassword ? (
                      <EyeSlashIcon className="w-5 h-5" />
                    ) : (
                      <EyeIcon className="w-5 h-5" />
                    )}
                  </button>
                </div>

                <div className="relative">
                  <input
                    type={showConfirm ? "text" : "password"}
                    name="confirm"
                    value={form.confirm}
                    onChange={handleChange}
                    placeholder="Confirm"
                    className={`w-full border rounded px-3 py-2 outline-none
                    ${errors.confirm ? "border-red-500" : ""}`}
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
                </div>
              </div>

              <p className="text-sm text-gray-500 mb-4">
                Use 6 or more characters with a mix of letters, numbers & symbols
              </p>

              {serverError && (
                <p className="text-red-500 text-sm mb-3">{serverError}</p>
              )}

              {/* Actions */}
              <div className="flex items-center justify-between">
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
                  className={`bg-blue-600 text-white px-6 py-2 rounded transition
                  ${loading ? "opacity-60 cursor-not-allowed" : "hover:bg-blue-700"}`}
                >
                  {loading ? "Creating..." : "Create Account"}
                </button>
              </div>
            </div>

            
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
