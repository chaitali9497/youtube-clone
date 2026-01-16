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

  const isValidEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const mapFormToBackendPayload = () => ({
    name: `${form.firstName} ${form.lastName}`.trim(),
    email: form.email.toLowerCase(),
    password: form.password,
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const validate = () => {
    const err = {};

    if (!form.firstName.trim()) err.firstName = "First name is required";
    if (!form.lastName.trim()) err.lastName = "Last name is required";

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");

    if (!validate()) return;

    try {
      setLoading(true);
      await api.post("/auth/register", mapFormToBackendPayload());
      navigate("/login");
    } catch (err) {
      setServerError(
        err.response?.data?.message || "Account creation failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-blur-md flex items-center justify-center px-4">
      <div className="bg-white rounded-lg shadow-md w-full max-w-4xl p-8">
        <form onSubmit={handleSubmit}>
          <div className="grid md:grid-cols-2 gap-8">

            <div>
              <img src={googleIcon} alt="Google" className="h-8 mb-2" />
              <h2 className="text-xl font-medium mb-6">
                Create your Google Account
              </h2>

              {/* CUSTOM ALERT */}
              <AlertBox
                type="error"
                message={serverError}
                onClose={() => setServerError("")}
              />

              {/* rest of your form stays SAME */}
              {/* (inputs, checklist, buttons – unchanged) */}
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
