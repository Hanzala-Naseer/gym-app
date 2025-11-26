"use client"

import type React from "react"

import Navbar from "@/src/components/Navbar"
import Footer from "@/src/components/Footer"
import { motion } from "framer-motion"
import { Mail, Lock, Eye, EyeOff } from "lucide-react"
import { useState } from "react"

export default function PartnerLoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({ email: "", password: "" })
  const [loginAttempt, setLoginAttempt] = useState(false)

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setLoginAttempt(true)
    setTimeout(() => setLoginAttempt(false), 3000)
  }

  return (
    <div className="bg-white text-slate-900 min-h-screen">
      <Navbar />

      <div className="pt-24 pb-16 flex items-center justify-center min-h-screen">
        <div className="w-full max-w-md">
          <motion.div
            className="bg-slate-50 rounded-lg shadow-lg p-8"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
          >
            {/* Header */}
            <div className="text-center mb-8">
              <motion.div
                className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2 }}
              >
                <span className="text-white font-black text-xl">GK</span>
              </motion.div>
              <motion.h1
                className="text-3xl font-black mb-2"
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                Partner Login
              </motion.h1>
              <motion.p
                className="text-slate-600"
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                Access your gym dashboard
              </motion.p>
            </div>

            {/* Form */}
            <motion.form
              className="space-y-6"
              onSubmit={handleLogin}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              {/* Email Field */}
              <div>
                <label className="block font-bold mb-2 text-slate-700">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 text-slate-400" size={20} />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="partner@gym.com"
                    className="w-full pl-10 pr-4 py-3 border-2 border-slate-200 rounded-lg focus:border-red-600 focus:outline-none transition-colors"
                    required
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label className="block font-bold mb-2 text-slate-700">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 text-slate-400" size={20} />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-3 border-2 border-slate-200 rounded-lg focus:border-red-600 focus:outline-none transition-colors"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              {/* Remember & Forgot */}
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4" />
                  <span>Remember me</span>
                </label>
                <a href="#" className="text-red-600 hover:text-red-700 font-semibold">
                  Forgot Password?
                </a>
              </div>

              {/* Login Button */}
              <motion.button
                type="submit"
                className="w-full btn-gym py-3 font-black text-lg"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Sign In
              </motion.button>

              {/* Success Message */}
              {loginAttempt && (
                <motion.div
                  className="bg-green-100 text-green-700 p-4 rounded-lg font-semibold text-center"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  Login successful! Redirecting to dashboard...
                </motion.div>
              )}
            </motion.form>

            {/* Sign Up Link */}
            <motion.p
              className="text-center mt-6 text-slate-600"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              Don't have an account?{" "}
              <a href="/become-partner" className="text-red-600 hover:text-red-700 font-bold">
                Become a Partner
              </a>
            </motion.p>
          </motion.div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
