import { useState } from "react";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import signupIcon from "../assets/signin-icon/icon-signup.png";
import googleIcon from "../assets/login-icon/google-icon.png";

function CreateAccount() {
  const navigate = useNavigate();

  // form state
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    username: "",
    password: "",
    confirm: "",
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // handle input
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // validation
  const validate = () => {
    const err = {};

    if (!form.firstName.trim()) err.firstName = true;
    if (!form.lastName.trim()) err.lastName = true;
    if (!form.username.trim()) err.username = true;
    if (form.password.length < 8) err.password = true;
    if (form.password !== form.confirm) err.confirm = true;

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  // submit
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    console.log("Form submitted ", form);
  };

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
                  className={`border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none
                  ${errors.firstName ? "border-red-500" : ""}`}
                />
                <input
                  name="lastName"
                  value={form.lastName}
                  onChange={handleChange}
                  placeholder="Last name"
                  className={`border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none
                  ${errors.lastName ? "border-red-500" : ""}`}
                />
              </div>

              {/* Username */}
              <div className="mb-2">
                <div className="flex">
                  <input
                    name="username"
                    value={form.username}
                    onChange={handleChange}
                    placeholder="Username"
                    className={`flex-1 border rounded-l px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none
                    ${errors.username ? "border-red-500" : ""}`}
                  />
                  <span className="border border-l-0 rounded-r px-3 py-2 bg-gray-50 text-gray-500">
                    @gmail.com
                  </span>
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  You can use letters, numbers & periods
                </p>
              </div>

              <button
                type="button"
                className="text-blue-600 text-sm font-medium mb-4 hover:underline"
              >
                Use my current email address instead
              </button>

              {/* Passwords */}
              <div className="grid grid-cols-2 gap-4 mb-2">
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Password"
                    className={`w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none
                    ${errors.password ? "border-red-500" : ""}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3 top-2.5 text-gray-400"
                    title={showPassword ? "Hide password" : "Show password"}
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
                    className={`w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none
                    ${errors.confirm ? "border-red-500" : ""}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm((prev) => !prev)}
                    className="absolute right-3 top-2.5 text-gray-400"
                    title={showConfirm ? "Hide password" : "Show password"}
                  >
                    {showConfirm ? (
                      <EyeSlashIcon className="w-5 h-5" />
                    ) : (
                      <EyeIcon className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              <p className="text-sm text-gray-500 mb-6">
                Use 8 or more characters with a mix of letters, numbers & symbols
              </p>

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
                  className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
                >
                  Next
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
