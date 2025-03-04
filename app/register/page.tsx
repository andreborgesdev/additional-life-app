"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { FcGoogle } from "react-icons/fc"

export default function RegisterPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically send the registration data to your backend
    // For this example, we'll just set a flag in localStorage
    localStorage.setItem("isLoggedIn", "true")
    router.push("/")
  }

  const handleGoogleRegister = () => {
    // In a real application, this would initiate the Google OAuth flow
    // For this example, we'll just simulate a successful registration
    localStorage.setItem("isLoggedIn", "true")
    router.push("/")
  }

  return (
    <div className="bg-green-50 dark:bg-green-900 min-h-screen flex items-center justify-center">
      <div className="bg-white dark:bg-green-800 p-8 rounded-lg shadow-md w-96">
        <h1 className="text-2xl font-bold text-green-800 dark:text-green-100 mb-6 text-center">Register</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
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
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
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
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 dark:bg-green-700 dark:border-green-600 dark:text-white"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-green-600 text-white rounded-md py-2 px-4 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors duration-300"
          >
            Register
          </button>
        </form>
        <div className="mt-4">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white dark:bg-green-800 text-gray-500">Or continue with</span>
            </div>
          </div>
          <div className="mt-6">
            <button
              onClick={handleGoogleRegister}
              className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-green-700 hover:bg-gray-50 dark:hover:bg-green-600"
            >
              <FcGoogle className="h-5 w-5 mr-2" />
              Sign up with Google
            </button>
          </div>
        </div>
        <p className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300"
          >
            Log in here
          </Link>
        </p>
      </div>
    </div>
  )
}

