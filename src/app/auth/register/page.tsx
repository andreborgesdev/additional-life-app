"use client";

import type React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FcGoogle } from "react-icons/fc";
import { RegistrationError, useRegister } from "@/src/hooks/auth/use-register";
import { ArrowLeft, Eye, EyeOff, Mail, User, UserPlus } from "lucide-react";
import { RecaptchaWrapper } from "@/src/lib/recaptcha-wrapper";
import { useGoogleLogin } from "@/src/hooks/auth/use-login-google";
import { toast } from "@/src/hooks/use-toast";
import { useTranslation } from "react-i18next";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [validationTriggered, setValidationTriggered] = useState(false);
  const router = useRouter();
  const { mutate: signUp, isPending: isLoading } = useRegister();
  const { mutate: googleLogin } = useGoogleLogin();
  // const { mutate: facebookLogin } = useFacebookLogin();
  const { t } = useTranslation("common");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationTriggered(true);

    if (!agreeToTerms || password !== confirmPassword) return;

    const recaptchaTokenInput = document.getElementById(
      "recaptcha-token",
    ) as HTMLInputElement | null;

    const recaptchaToken = recaptchaTokenInput?.value || "";

    signUp(
      { email, password, name, recaptchaToken },
      {
        onSuccess: (data) => {
          toast({
            title: t("auth.registration_successful"),
            description: data.message + " " + t("auth.redirecting_login"),
            variant: "success",
          });
          router.push("/auth/login");
        },
        onError: (err: RegistrationError) => {
          console.log("Registration error:", err);
          let toastTitle = t("auth.registration_failed");
          let toastDescription = t("auth.unexpected_error");

          if (err.status === 409) {
            toastTitle = t("auth.email_already_registered");
            toastDescription = t("auth.email_in_use");
          }

          toast({
            title: toastTitle,
            description: toastDescription,
            variant: "destructive",
          });
        },
      },
    );
  };

  const handleGoogleRegister = () => {
    googleLogin();
  };

  // const handleFacebookRegister = () => {
  //   facebookLogin();
  // };

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

  const strengthLabels = [
    t("auth.password_strength.weak"),
    t("auth.password_strength.fair"),
    t("auth.password_strength.good"),
    t("auth.password_strength.strong"),
  ];
  const strengthColors = ["bg-red-500", "bg-yellow-500", "bg-yellow-400", "bg-green-500"];

  const passwordsMatch = password === confirmPassword;
  const showPasswordMismatch = validationTriggered && confirmPassword.length > 0 && !passwordsMatch;

  return (
    <div className="bg-green-50 dark:bg-green-800 min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <Link
        href="/"
        className="absolute top-24 left-8 flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-500 transition-colors"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        {t("auth.back_to_home")}
      </Link>

      <div className="w-full max-w-md mx-auto bg-white dark:bg-gray-800 p-8 rounded-xl shadow-2xl">
        <div className="flex flex-col space-y-2 text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
            {t("auth.create_account")}
          </h1>
          <p className="text-gray-500 dark:text-gray-400">{t("auth.join_community")}</p>
        </div>

        <div className="flex flex-col space-y-6">
          <div className="flex justify-center">
            <button
              onClick={handleGoogleRegister}
              disabled={isLoading}
              className="flex items-center justify-center px-10 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 dark:focus:ring-offset-gray-800 transition-colors duration-200"
            >
              <FcGoogle className="h-5 w-5 mr-2" />
              <span>{t("auth.google")}</span>
            </button>

            {/* <button
              onClick={handleFacebookRegister}
              disabled={isLoading}
              className="flex items-center justify-center px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 dark:focus:ring-offset-gray-800 transition-colors duration-200"
            >
              <Facebook className="h-5 w-5 mr-2 text-blue-600" />
              <span>Facebook</span>
            </button> */}
          </div>

          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
              {t("auth.or_continue_with_email")}
            </span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <RecaptchaWrapper action="create-user" />
            <div className="space-y-1">
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                {t("auth.full_name")}
              </label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                </div>
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="block w-full pl-10 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-green-500 focus:border-green-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                  placeholder={t("auth.name_placeholder")}
                />
              </div>
            </div>

            <div className="space-y-1">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                {t("auth.email_address")}
              </label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-green-500 focus:border-green-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                  placeholder={t("auth.email_placeholder")}
                />
              </div>
            </div>

            <div className="space-y-1">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                {t("auth.password")}
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
                  className="block w-full pl-4 pr-10 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-green-500 focus:border-green-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                  placeholder={t("auth.password_placeholder")}
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-gray-400 dark:text-gray-500 hover:text-gray-500 dark:hover:text-gray-400 focus:outline-none"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              {password && (
                <div className="mt-2">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {t("auth.password_strength.label")}
                    </span>
                    <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                      {passwordStrength > 0
                        ? strengthLabels[passwordStrength - 1]
                        : t("auth.password_strength.very_weak")}
                    </span>
                  </div>
                  <div className="h-1.5 w-full bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${
                        passwordStrength > 0 ? strengthColors[passwordStrength - 1] : "bg-red-300"
                      }`}
                      style={{ width: `${(passwordStrength / 4) * 100}%` }}
                    ></div>
                  </div>
                  <ul className="text-xs text-gray-500 dark:text-gray-400 mt-2 space-y-1">
                    <li className="flex items-center">
                      <span
                        className={`inline-block w-3 h-3 mr-2 rounded-full ${
                          password.length >= 8 ? "bg-green-500" : "bg-gray-300 dark:bg-gray-500"
                        }`}
                      ></span>
                      {t("auth.password_requirements.min_length")}
                    </li>
                    <li className="flex items-center">
                      <span
                        className={`inline-block w-3 h-3 mr-2 rounded-full ${
                          /[A-Z]/.test(password) ? "bg-green-500" : "bg-gray-300 dark:bg-gray-500"
                        }`}
                      ></span>
                      {t("auth.password_requirements.uppercase")}
                    </li>
                    <li className="flex items-center">
                      <span
                        className={`inline-block w-3 h-3 mr-2 rounded-full ${
                          /[0-9]/.test(password) ? "bg-green-500" : "bg-gray-300 dark:bg-gray-500"
                        }`}
                      ></span>
                      {t("auth.password_requirements.number")}
                    </li>
                    <li className="flex items-center">
                      <span
                        className={`inline-block w-3 h-3 mr-2 rounded-full ${
                          /[^A-Za-z0-9]/.test(password)
                            ? "bg-green-500"
                            : "bg-gray-300 dark:bg-gray-500"
                        }`}
                      ></span>
                      {t("auth.password_requirements.special_char")}
                    </li>
                  </ul>
                </div>
              )}
            </div>

            <div className="space-y-1">
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                {t("auth.confirm_password")}
              </label>
              <div className="relative rounded-md shadow-sm">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={`block w-full pl-4 pr-10 py-2.5 border rounded-lg focus:ring-green-500 focus:border-green-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 ${
                    showPasswordMismatch
                      ? "border-red-500 dark:border-red-400"
                      : "border-gray-300 dark:border-gray-600"
                  }`}
                  placeholder={t("auth.confirm_password_placeholder")}
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="text-gray-400 dark:text-gray-500 hover:text-gray-500 dark:hover:text-gray-400 focus:outline-none"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>
              {validationTriggered && showPasswordMismatch && (
                <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                  {t("auth.passwords_do_not_match")}
                </p>
              )}
              {validationTriggered && confirmPassword.length > 0 && passwordsMatch && (
                <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                  {t("auth.passwords_match")}
                </p>
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
                  className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 dark:focus:ring-offset-gray-800"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="terms" className="text-gray-700 dark:text-gray-300">
                  {t("auth.agree_to")}{" "}
                  <Link
                    href="/terms-and-conditions"
                    className="text-green-600 hover:text-green-500 dark:text-green-400 dark:hover:text-green-300"
                    target="_blank"
                  >
                    {t("auth.terms_and_conditions")}
                  </Link>{" "}
                  {t("auth.and")}{" "}
                  <Link
                    href="/data-privacy"
                    className="text-green-600 hover:text-green-500 dark:text-green-400 dark:hover:text-green-300"
                    target="_blank"
                  >
                    {t("auth.privacy_policy")}
                  </Link>
                </label>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || !agreeToTerms}
              className="w-full flex justify-center items-center px-4 py-2.5 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 dark:focus:ring-offset-gray-800 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
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
              {isLoading ? t("auth.creating_account") : t("auth.create_account")}
            </button>
          </form>
        </div>

        <p className="mt-8 text-center text-sm text-gray-600 dark:text-gray-400">
          {t("auth.already_have_account")}{" "}
          <Link
            href="/auth/login"
            className="font-medium text-green-600 hover:text-green-500 dark:text-green-400 dark:hover:text-green-300"
          >
            {t("auth.sign_in")}
          </Link>
        </p>
      </div>
    </div>
  );
}
