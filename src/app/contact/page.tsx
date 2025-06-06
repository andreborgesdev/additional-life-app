"use client";

import type React from "react";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import {
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  HelpCircle, // Added HelpCircle icon
  Users, // Added Users icon
} from "lucide-react";

export default function ContactPage() {
  const { t } = useTranslation("common"); // Ensure namespace is common
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the form data to your backend
    console.log("Form submitted:", { name, email, message });
    // Reset form fields
    setName("");
    setEmail("");
    setMessage("");
    // Show a success message (in a real app, you'd want to handle this more robustly)
    alert(t("contact.form.successMessage"));
  };

  return (
    <div className="bg-green-50 dark:bg-green-900 min-h-screen">
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-4xl md:text-5xl font-bold text-green-800 dark:text-green-100 text-center mb-8">
          {t("contact.title")}
        </h1>

        <div className="max-w-4xl mx-auto bg-white dark:bg-green-800 rounded-lg shadow-lg p-8 mb-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-2xl font-semibold text-green-700 dark:text-green-200 mb-4">
                {t("contact.getInTouch.title")}
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-6">
                {t("contact.getInTouch.description")}
              </p>
              <div className="space-y-4">
                <div className="flex items-center">
                  <Mail className="h-6 w-6 text-green-600 mr-2" />
                  <span className="text-gray-700 dark:text-gray-300">
                    {t("contact.details.email")}
                  </span>
                </div>
                <div className="flex items-center">
                  <Phone className="h-6 w-6 text-green-600 mr-2" />
                  <span className="text-gray-700 dark:text-gray-300">
                    {t("contact.details.phone")}
                  </span>
                </div>
                <div className="flex items-center">
                  <MapPin className="h-6 w-6 text-green-600 mr-2" />
                  <span className="text-gray-700 dark:text-gray-300">
                    {t("contact.details.address")}
                  </span>
                </div>
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-green-700 dark:text-green-200 mb-4">
                {t("contact.form.title")}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    {t("contact.form.nameLabel")}
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 dark:bg-green-700 dark:border-green-600 dark:text-white"
                  />
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    {t("contact.form.emailLabel")}
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 dark:bg-green-700 dark:border-green-600 dark:text-white"
                  />
                </div>
                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    {t("contact.form.messageLabel")}
                  </label>
                  <textarea
                    id="message"
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 dark:bg-green-700 dark:border-green-600 dark:text-white"
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="w-full bg-green-600 text-white rounded-md py-2 px-4 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors duration-300"
                >
                  {t("contact.form.submitButton")}
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-semibold text-green-700 dark:text-green-200 mb-4 text-center">
            {t("contact.otherWays.title")}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-green-800 rounded-lg shadow-md p-6 flex flex-col items-center text-center">
              <h3 className="text-xl font-semibold text-green-700 dark:text-green-200 mb-2">
                {t("contact.otherWays.followUs")}
              </h3>
              <div className="flex space-x-4 mt-2">
                <a
                  href="#"
                  className="text-green-600 hover:text-green-700 transition-colors duration-300"
                >
                  <Facebook className="h-6 w-6" />
                </a>
                <a
                  href="#"
                  className="text-green-600 hover:text-green-700 transition-colors duration-300"
                >
                  <Twitter className="h-6 w-6" />
                </a>
                <a
                  href="#"
                  className="text-green-600 hover:text-green-700 transition-colors duration-300"
                >
                  <Instagram className="h-6 w-6" />
                </a>
              </div>
            </div>
            <div className="bg-white dark:bg-green-800 rounded-lg shadow-md p-6 flex flex-col items-center text-center">
              <HelpCircle className="h-12 w-12 text-green-500 mb-4" />
              <h3 className="text-xl font-semibold text-green-700 dark:text-green-200 mb-2">
                {t("contact.otherWays.faqTitle")}
              </h3>
              <a
                href="/faq" // Assuming you have a FAQ page
                className="text-green-600 hover:text-green-700 transition-colors duration-300 mt-2"
              >
                {t("contact.otherWays.faqLinkText")}
              </a>
            </div>
            <div className="bg-white dark:bg-green-800 rounded-lg shadow-md p-6 flex flex-col items-center text-center">
              <Users className="h-12 w-12 text-green-500 mb-4" />
              <h3 className="text-xl font-semibold text-green-700 dark:text-green-200 mb-2">
                {t("contact.otherWays.communityTitle")}
              </h3>
              <a
                href="/community" // Assuming you have a community page/forum
                className="text-green-600 hover:text-green-700 transition-colors duration-300 mt-2"
              >
                {t("contact.otherWays.communityLinkText")}
              </a>
            </div>
          </div>
        </div> */}
      </div>
    </div>
  );
}
