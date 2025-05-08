"use client";

import type React from "react";

import { useState } from "react";
import {
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
} from "lucide-react";

export default function ContactPage() {
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
    alert("Thank you for your message. We'll get back to you soon!");
  };

  return (
    <div className="bg-green-50 dark:bg-green-900 min-h-screen">
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-4xl md:text-5xl font-bold text-green-800 dark:text-green-100 text-center mb-8">
          Contact Us
        </h1>

        <div className="max-w-4xl mx-auto bg-white dark:bg-green-800 rounded-lg shadow-lg p-8 mb-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-2xl font-semibold text-green-700 dark:text-green-200 mb-4">
                Get in Touch
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-6">
                We'd love to hear from you! Whether you have a question about
                our platform, need help with your account, or want to share your
                Additional Life experience, we're here to help.
              </p>
              <div className="space-y-4">
                <div className="flex items-center">
                  <Mail className="h-6 w-6 text-green-600 mr-2" />
                  <span className="text-gray-700 dark:text-gray-300">
                    support@additionallife.com
                  </span>
                </div>
                <div className="flex items-center">
                  <Phone className="h-6 w-6 text-green-600 mr-2" />
                  <span className="text-gray-700 dark:text-gray-300">
                    +1 (555) 123-4567
                  </span>
                </div>
                <div className="flex items-center">
                  <MapPin className="h-6 w-6 text-green-600 mr-2" />
                  <span className="text-gray-700 dark:text-gray-300">
                    123 Green Street, Eco City, EC 12345
                  </span>
                </div>
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-green-700 dark:text-green-200 mb-4">
                Send Us a Message
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Name
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
                    Email
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
                    Message
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
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-semibold text-green-700 dark:text-green-200 mb-4 text-center">
            Other Ways to Connect
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-green-800 rounded-lg shadow-md p-6 flex flex-col items-center text-center">
              <h3 className="text-xl font-semibold text-green-700 dark:text-green-200 mb-2">
                Follow Us
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
              <h3 className="text-xl font-semibold text-green-700 dark:text-green-200 mb-2">
                FAQ
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Find answers to common questions about Additional Life.
              </p>
              <a
                href="/faq"
                className="mt-2 text-green-600 hover:text-green-700 transition-colors duration-300"
              >
                View FAQ
              </a>
            </div>
            <div className="bg-white dark:bg-green-800 rounded-lg shadow-md p-6 flex flex-col items-center text-center">
              <h3 className="text-xl font-semibold text-green-700 dark:text-green-200 mb-2">
                Community Forum
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Join discussions and share experiences with other members.
              </p>
              <a
                href="/forum"
                className="mt-2 text-green-600 hover:text-green-700 transition-colors duration-300"
              >
                Visit Forum
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
