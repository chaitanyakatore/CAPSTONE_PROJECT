import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import InputField from "../components/InputField";

interface FormData {
  email: string;
  password: string;
}

interface FormErrors {
  email: string;
  password: string;
}

// Decoding interface based on your JWT structure
interface DecodedToken {
  roleId: number; // Adjust based on your JWT structure
  // Add other properties you expect from the decoded token if needed
}

// Function to decode the JWT manually
function parseJwt(token: string): DecodedToken | null {
  try {
    const base64Url = token.split('.')[1]; // Get the payload part
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/'); // Replace URL-safe characters
    const jsonPayload = decodeURIComponent(
      atob(base64) // Decode Base64
        .split('')
        .map((c) => `%${('00' + c.charCodeAt(0).toString(16)).slice(-2)}`)
        .join('')
    );

    return JSON.parse(jsonPayload); // Parse JSON string to object
  } catch (e) {
    console.error("Error decoding JWT", e);
    return null; // Return null if decoding fails
  }
}

const SignIn: React.FC = () => {
  const navigate = useNavigate();

  // Form data state
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
  });

  // UI states
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({
    email: "",
    password: "",
  });
  const [apiError, setApiError] = useState("");

  // Email validation
  const validateEmail = (email: string): string => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) return "Email is required";
    if (!emailRegex.test(email)) return "Please enter a valid email address";
    return "";
  };

  // Handle input changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear errors when user types
    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
    setApiError("");
  };

  // Handle form submission
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    const emailError = validateEmail(formData.email);
    if (emailError) {
      setErrors((prev) => ({
        ...prev,
        email: emailError,
      }));
      return;
    }

    if (!formData.password) {
      setErrors((prev) => ({
        ...prev,
        password: "Password is required",
      }));
      return;
    }

    setIsLoading(true);
    setApiError("");

    try {
      const response = await axios.post(
        "http://localhost:3000/api/users/login",
        formData
      );

      if (response.data.token) {
        // Store the token
        const token = response.data.token;
        if (rememberMe) {
          localStorage.setItem("token", response.data.token);
        } else {
          localStorage.setItem("token", response.data.token);
        }

        // Decode the JWT to extract user information
        const decodedToken = parseJwt(token); // Decode the JWT manually
        if (decodedToken) {
          const roleId = decodedToken.roleId; // Adjust this based on your JWT structure

          // Configure axios defaults for future requests
          axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

          // Redirect to appropriate dashboard based on user roleId
          if (roleId === 1) {
            navigate("/user-dashboard");
          } else if (roleId === 2) {
            navigate("/designer-dashboard");
          } else {
            setApiError("Unauthorized role");
          }
        } else {
          setApiError("Failed to decode token");
        }
      }
    } catch (error: any) {
      if (error.response?.status === 401) {
        setApiError("Invalid email or password");
      } else if (error.response?.data?.message) {
        setApiError(error.response.data.message);
      } else {
        setApiError("An error occurred. Please try again later.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Handle forgot password
  const handleForgotPassword = () => {
    navigate("/forgot-password");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="flex bg-white shadow-lg rounded-lg w-full max-w-3xl">
        {/* Left Side: Brand Information */}
        <div className="w-1/2 p-8 bg-blue-600 text-white rounded-l-lg">
          <h2 className="text-3xl font-bold mb-6">Welcome Back!</h2>
          <p className="mb-6">
            Sign in to access your personalized dashboard and continue your
            journey with us.
          </p>
          <ul className="space-y-4">
            <li className="flex items-center">
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
              Secure Authentication
            </li>
            <li className="flex items-center">
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
              Personalized Experience
            </li>
            <li className="flex items-center">
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
              24/7 Support
            </li>
          </ul>
        </div>

        {/* Right Side: Login Form */}
        <div className="w-1/2 p-8">
          <h2 className="text-2xl font-bold text-center mb-6">Sign In</h2>

          {apiError && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {apiError}
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSignIn}>
            <InputField
              label="Email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              type="email"
              placeholder="Enter your email"
              required
            />

            <div className="relative">
              <InputField
                label="Password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                required
              />
              <button
                type="button"
                className="absolute right-3 top-9 text-gray-500"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="mr-2"
                />
                <span className="text-sm text-gray-600">Remember me</span>
              </label>
              <button
                type="button"
                onClick={handleForgotPassword}
                className="text-sm text-blue-600 hover:underline"
              >
                Forgot password?
              </button>
            </div>

            <Button
              text={isLoading ? "Signing in..." : "Sign In"}
              disabled={isLoading}
              className={`w-full ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
            />
          </form>

          <div className="mt-4 text-center">
            <span className="text-sm text-gray-600">
              Don't have an account?{" "}
              <a href="/signup" className="text-blue-600 hover:underline">
                Sign up
              </a>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
