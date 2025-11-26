"use client"

import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { useState } from "react"
import { Menu, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

export default function Navbar() {
  const router = useRouter()
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  const navVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: -5 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  }

  const mobileMenuVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: { opacity: 1, height: "auto", transition: { duration: 0.3 } },
    exit: { opacity: 0, height: 0, transition: { duration: 0.2 } },
  }

  const mobileItemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
  }

  const navItems = [
    { label: "HOME", href: "/" },
    { label: "BECOME A GYM KEY PARTNER", href: "/become-partner" },
    { label: "CORPORATE PARTNERS", href: "/corporate-partners" },
    { label: "GYMS", href: "/gyms" },
    { label: "BLOGS", href: "/blogs" },
    { label: "NEWS", href: "/news" },
    { label: "CONTACT US", href: "/contact" },
  ]

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/"
    }
    return pathname.startsWith(href)
  }

  const handleNavClick = () => {
    setIsOpen(false)
  }

  return (
    <motion.nav
      className="fixed top-0 w-full bg-white z-50 border-b border-gray-100 shadow-sm"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <motion.div
            className="flex items-center gap-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            whileHover={{ scale: 1.05 }}
            onClick={() => router.push("/")}
          >
            <motion.div
              className="w-8 h-8 bg-red-600 rounded flex items-center justify-center cursor-pointer"
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="text-white font-black text-sm">GK</span>
            </motion.div>
            <span className="text-xl font-black tracking-tight cursor-pointer">GYM Key</span>
          </motion.div>

          {/* Desktop Menu */}
          <motion.div
            className="hidden md:flex space-x-8 items-center"
            variants={navVariants}
            initial="hidden"
            animate="visible"
          >
            {navItems.map((item, i) => (
              <motion.div key={i} variants={itemVariants}>
                <Link
                  href={item.href}
                  className={`font-bold text-sm tracking-wide transition-colors ${
                    isActive(item.href) ? "text-red-600" : "text-slate-700 hover:text-red-600"
                  }`}
                  onClick={handleNavClick}
                >
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    {item.label}
                  </motion.div>
                </Link>
              </motion.div>
            ))}
          </motion.div>

          {/* CTA Button */}
          <motion.div
            className="hidden md:block"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Link href="/partner-login">
              <motion.button
                className="btn-gym text-sm font-black tracking-wide"
                whileHover={{ scale: 1.08, boxShadow: "0 10px 25px rgba(220, 38, 38, 0.3)" }}
                whileTap={{ scale: 0.95 }}
                onClick={handleNavClick}
              >
                PARTNER LOGIN
              </motion.button>
            </Link>
          </motion.div>

          {/* Mobile Menu Button */}
          <motion.button
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <AnimatePresence mode="wait">
              {isOpen ? (
                <motion.div
                  key="close"
                  initial={{ opacity: 0, rotate: -90 }}
                  animate={{ opacity: 1, rotate: 0 }}
                  exit={{ opacity: 0, rotate: 90 }}
                  transition={{ duration: 0.2 }}
                >
                  <X size={24} />
                </motion.div>
              ) : (
                <motion.div
                  key="open"
                  initial={{ opacity: 0, rotate: 90 }}
                  animate={{ opacity: 1, rotate: 0 }}
                  exit={{ opacity: 0, rotate: -90 }}
                  transition={{ duration: 0.2 }}
                >
                  <Menu size={24} />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              className="md:hidden pb-4 space-y-2 border-t border-gray-100"
              variants={mobileMenuVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              {navItems.map((item, i) => (
                <motion.div
                  key={i}
                  variants={mobileItemVariants}
                  custom={i}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: i * 0.05 }}
                >
                  <Link
                    href={item.href}
                    className={`block w-full text-left py-2 font-semibold transition-colors ${
                      isActive(item.href) ? "text-red-600" : "text-slate-700 hover:text-red-600"
                    }`}
                    onClick={handleNavClick}
                  >
                    {item.label}
                  </Link>
                </motion.div>
              ))}
              <motion.div
                variants={mobileItemVariants}
                custom={7}
                initial="hidden"
                animate="visible"
                transition={{ delay: 0.35 }}
              >
                <Link href="/partner-login">
                  <motion.button
                    className="btn-gym w-full mt-2 font-black tracking-wide"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleNavClick}
                  >
                    PARTNER LOGIN
                  </motion.button>
                </Link>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  )
}
