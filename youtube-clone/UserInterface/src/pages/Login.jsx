import { useState } from "react";
import { useNavigate } from "react-router-dom";
import signupIcon from "../assets/login-icon/google-icon.png";
import api from "../utils/axios";



function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");



const handleLogin = async () => {
  setError("");

  if (!email || !password) {
    setError("Email and password are required");
    return;
  }

  try {
    const { data } = await api.post("/auth/login", {
      email: email.toLowerCase().trim(),
      password,
    });

    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
    localStorage.setItem("isLoggedIn", "true");

    navigate("/");
  } catch (err) {
    setError(err.response?.data?.message || "Invalid email or password");
  }
};



  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
  <div className="
    w-full max-w-md rounded-xl px-10 py-10
    bg-white/80 backdrop-blur-md
    shadow-lg border border-white/30
  ">

        <img
          src={signupIcon}
          className="mb-5"
          alt="Google"
        />

        <h1 className="text-2xl font-normal text-gray-900">Sign in</h1>
        <p className="text-sm text-gray-600 mb-6">
          Use your Google Account
        </p>

        <div className="space-y-4">
          <input
            className="input"
            placeholder="Email or phone"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            className="input"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {error && (
          <p className="text-red-500 text-sm mt-3">{error}</p>
        )}

        <button className="mt-3 text-sm text-blue-600 font-medium hover:underline">
          Forgot email?
        </button>

        <p className="text-sm text-gray-600 mt-8">
          Not your computer? Use Guest mode to sign in privately.
          <span className="text-blue-600 ml-1 hover:underline cursor-pointer">
            Learn more
          </span>
        </p>

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
