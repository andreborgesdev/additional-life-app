"use client"

import Link from "next/link"
import { Facebook, Twitter, Instagram } from "lucide-react"
import { useState, useEffect } from "react"

export default function Footer() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <footer className="bg-green-800 dark:bg-green-950 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-semibold mb-4">About Additional Life</h3>
            <p className="text-green-200 dark:text-green-300">
              Additional Life is a platform dedicated to promoting sustainability and reducing waste by connecting
              people who want to give away items they no longer need.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-green-200 dark:text-green-300 hover:text-white">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/how-it-works" className="text-green-200 dark:text-green-300 hover:text-white">
                  How It Works
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-green-200 dark:text-green-300 hover:text-white">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-green-200 dark:text-green-300 hover:text-white">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-4">Connect With Us</h3>
            <div className="flex space-x-4 mb-4">
              <a href="#" className="text-green-200 dark:text-green-300 hover:text-white">
                <Facebook size={24} />
              </a>
              <a href="#" className="text-green-200 dark:text-green-300 hover:text-white">
                <Twitter size={24} />
              </a>
              <a href="#" className="text-green-200 dark:text-green-300 hover:text-white">
                <Instagram size={24} />
              </a>
            </div>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/terms-and-conditions"
                  className="text-green-200 dark:text-green-300 hover:text-white text-sm"
                >
                  Terms and Conditions
                </Link>
              </li>
              <li>
                <Link href="/data-privacy" className="text-green-200 dark:text-green-300 hover:text-white text-sm">
                  Data Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 text-center text-green-200 dark:text-green-300">
          <p>&copy; {new Date().getFullYear()} Additional Life. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

