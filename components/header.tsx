"use client"

import Link from "next/link"
import { Search, Menu, Sun, Moon, PlusCircle } from "lucide-react"
import { useState, useEffect } from "react"

export default function Header() {
  const [mounted, setMounted] = useState(false)
  const [darkMode, setDarkMode] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    setMounted(true)
    setDarkMode(document.documentElement.classList.contains("dark"))

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode
    setDarkMode(newDarkMode)
    document.documentElement.classList.toggle("dark", newDarkMode)
    localStorage.setItem("color-mode", newDarkMode ? "dark" : "light")
  }

  if (!mounted) return null

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-transparent shadow-md" : "bg-green-600 dark:bg-green-800"
      }`}
    >
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link
          href="/"
          className={`text-2xl font-bold ${isScrolled ? "text-green-800 dark:text-green-200" : "text-white"}`}
        >
          Additional Life
        </Link>
        <nav className="hidden md:flex space-x-4">
          <Link
            href="/categories"
            className={`hover:text-green-200 ${isScrolled ? "text-green-800 dark:text-green-200" : "text-white"}`}
          >
            Categories
          </Link>
          <Link
            href="/about"
            className={`hover:text-green-200 ${isScrolled ? "text-green-800 dark:text-green-200" : "text-white"}`}
          >
            About
          </Link>
          <Link
            href="/contact"
            className={`hover:text-green-200 ${isScrolled ? "text-green-800 dark:text-green-200" : "text-white"}`}
          >
            Contact
          </Link>
          <Link
            href="/create-product"
            className={`hover:text-green-200 ${isScrolled ? "text-green-800 dark:text-green-200" : "text-white"}`}
          >
            <PlusCircle className="inline-block mr-1" size={18} />
            Add Item
          </Link>
        </nav>
        <div className="flex items-center space-x-4">
          <form className="relative">
            <input
              type="text"
              placeholder="Search items..."
              className="py-1 px-3 pr-8 rounded-full text-green-800 dark:text-green-100 bg-white dark:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-400"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-green-600 dark:text-green-300"
            >
              <Search size={18} />
            </button>
          </form>
          <button
            onClick={toggleDarkMode}
            className={`p-2 rounded-full hover:bg-green-700 dark:hover:bg-green-600 ${isScrolled ? "text-green-800 dark:text-green-200" : "text-white"}`}
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <button className={`md:hidden ${isScrolled ? "text-green-800 dark:text-green-200" : "text-white"}`}>
            <Menu size={24} />
          </button>
        </div>
      </div>
    </header>
  )
}

