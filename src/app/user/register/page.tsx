"use client";

import type React from "react";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FcGoogle } from "react-icons/fc";
import { useRegister } from "@/src/hooks/use-register";
import {
  ArrowLeft,
  Eye,
  EyeOff,
  Facebook,
  Mail,
  User,
  UserPlus,
} from "lucide-react";
import { RecaptchaWrapper } from "@/src/lib/recaptcha-wrapper";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const router = useRouter();
  const { mutate: signUp, isPending: isLoading, error } = useRegister();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreeToTerms) return;
    const recaptchaTokenInput = document.getElementById(
      "recaptcha-token"
    ) as HTMLInputElement | null;
    const recaptchaToken = recaptchaTokenInput?.value || "";
    signUp(
      { email, password, name, recaptchaToken },
      {
        onSuccess: () => {
          router.push("/");
        },
      }
    );
  };

  const handleGoogleRegister = () => {
    // In a real application, this would initiate the Google OAuth flow
    // For this example, we'll just simulate a successful registration
    router.push("/");
  };

  const handleFacebookRegister = () => {
    // In a real application, this would initiate the Facebook OAuth flow
    // For this example, we'll just simulate a successful registration
    router.push("/");
  };

  // Calculate password strength
  const getPasswordStrength = () => {
    if (!password) return 0;

    let strength = 0;

    // Length check
    if (password.length >= 8) strength += 1;

    // Contains number
    if (/\d/.test(password)) strength += 1;

    // Contains lowercase
    if (/[a-z]/.test(password)) strength += 1;

    // Contains uppercase
    if (/[A-Z]/.test(password)) strength += 1;

    // Contains special char
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;

    return Math.min(strength, 4);
  };

  const passwordStrength = getPasswordStrength();

  const strengthLabels = ["Weak", "Fair", "Good", "Strong"];
  const strengthColors = [
    "bg-red-500",
    "bg-yellow-500",
    "bg-yellow-400",
    "bg-green-500",
  ];

  return (
    <div className="bg-green-50 dark:bg-green-900 min-h-screen flex items-center justify-center">
      <Link
        href="/"
        className="absolute top-20 left-8 flex items-center text-sm text-gray-600 hover:text-green-600 transition-colors"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to home
      </Link>

      <div className="w-full max-w-md mx-auto">
        <div className="flex flex-col space-y-2 text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight">
            Create an account
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Join our community and start sharing
          </p>
        </div>

        <div className="flex flex-col space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={handleGoogleRegister}
              disabled={isLoading}
              className="flex items-center justify-center px-4 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-200"
            >
              <FcGoogle className="h-5 w-5 mr-2" />
              <span>Google</span>
            </button>

            <button
              onClick={handleFacebookRegister}
              disabled={isLoading}
              className="flex items-center justify-center px-4 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-200"
            >
              <Facebook className="h-5 w-5 mr-2 text-blue-600" />
              <span>Facebook</span>
            </button>
          </div>

          <div className="relative flex justify-center text-sm">
            <span className="px-2 text-gray-500">Or continue with email</span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <RecaptchaWrapper action="create-user" />
            <div className="space-y-1">
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                Full Name
              </label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="block w-full pl-10 py-2.5 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                  placeholder="John Doe"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email Address
              </label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 py-2.5 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                  placeholder="johndoe@example.com"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <div className="relative rounded-md shadow-sm">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pr-10 py-2.5 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                  placeholder="••••••••"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-gray-400 hover:text-gray-500 focus:outline-none"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Password strength indicator */}
              {password && (
                <div className="mt-2">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-gray-500">
                      Password strength:
                    </span>
                    <span className="text-xs font-medium text-gray-700">
                      {passwordStrength > 0
                        ? strengthLabels[passwordStrength - 1]
                        : "Very weak"}
                    </span>
                  </div>
                  <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${
                        passwordStrength > 0
                          ? strengthColors[passwordStrength - 1]
                          : "bg-red-300"
                      }`}
                      style={{ width: `${(passwordStrength / 4) * 100}%` }}
                    ></div>
                  </div>
                  <ul className="text-xs text-gray-500 mt-2 space-y-1">
                    <li className="flex items-center">
                      <span
                        className={`inline-block w-3 h-3 mr-2 rounded-full ${
                          password.length >= 8 ? "bg-green-500" : "bg-gray-300"
                        }`}
                      ></span>
                      At least 8 characters
                    </li>
                    <li className="flex items-center">
                      <span
                        className={`inline-block w-3 h-3 mr-2 rounded-full ${
                          /[A-Z]/.test(password)
                            ? "bg-green-500"
                            : "bg-gray-300"
                        }`}
                      ></span>
                      Contains uppercase letter
                    </li>
                    <li className="flex items-center">
                      <span
                        className={`inline-block w-3 h-3 mr-2 rounded-full ${
                          /[0-9]/.test(password)
                            ? "bg-green-500"
                            : "bg-gray-300"
                        }`}
                      ></span>
                      Contains number
                    </li>
                    <li className="flex items-center">
                      <span
                        className={`inline-block w-3 h-3 mr-2 rounded-full ${
                          /[^A-Za-z0-9]/.test(password)
                            ? "bg-green-500"
                            : "bg-gray-300"
                        }`}
                      ></span>
                      Contains special character
                    </li>
                  </ul>
                </div>
              )}
            </div>

            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="terms"
                  name="terms"
                  type="checkbox"
                  checked={agreeToTerms}
                  onChange={(e) => setAgreeToTerms(e.target.checked)}
                  className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="terms" className="text-gray-600">
                  I agree to the{" "}
                  <Link
                    href="/terms-and-conditions"
                    className="text-green-600 hover:text-green-500"
                    target="_blank"
                  >
                    Terms and Conditions
                  </Link>{" "}
                  and{" "}
                  <Link
                    href="/data-privacy"
                    className="text-green-600 hover:text-green-500"
                    target="_blank"
                  >
                    Privacy Policy
                  </Link>
                </label>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || !agreeToTerms}
              className="w-full flex justify-center items-center px-4 py-2.5 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-200"
            >
              {isLoading ? (
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              ) : (
                <UserPlus className="mr-2 h-4 w-4" />
              )}
              {isLoading ? "Creating account..." : "Create account"}
            </button>
          </form>
        </div>

        <p className="mt-8 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link
            href="/user/login"
            className="font-medium text-green-600 hover:text-green-500"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
