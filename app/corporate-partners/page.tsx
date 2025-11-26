"use client"

import Navbar from "@/src/components/Navbar"
import Footer from "@/src/components/Footer"
import { motion } from "framer-motion"
import { Building2, Briefcase, Award, BarChart3 } from "lucide-react"

export default function CorporatePartnersPage() {
  const packages = [
    {
      name: "Startup",
      price: "PKR 50,000",
      employees: "Up to 50",
      features: ["Basic membership", "Quarterly reports", "Email support"],
    },
    {
      name: "Business",
      price: "PKR 150,000",
      employees: "Up to 200",
      features: ["Priority membership", "Monthly reports", "Dedicated manager", "Wellness program"],
      highlighted: true,
    },
    {
      name: "Enterprise",
      price: "Custom",
      employees: "Unlimited",
      features: ["White-glove service", "Real-time analytics", "Custom programs", "24/7 support"],
    },
  ]

  return (
    <div className="bg-white text-slate-900 min-h-screen">
      <Navbar />

      <div className="pt-24 pb-16">
        {/* Hero with Image */}
        <motion.section
          className="relative h-96 bg-cover bg-center overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <img
            src="/corporate-office-employees-fitness-wellness-progra.jpg"
            alt="Corporate Wellness"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="max-w-4xl mx-auto text-center text-white px-4">
              <motion.h1
                className="text-5xl font-black mb-6"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                Corporate Wellness Programs
              </motion.h1>
              <motion.p
                className="text-xl text-blue-100 mb-8"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                Empower your employees with world-class fitness facilities
              </motion.p>
            </div>
          </div>
        </motion.section>

        {/* Benefits */}
        <section className="py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-4 gap-8">
              {[
                { icon: <Building2 size={24} />, title: "Employee Health", desc: "Improve employee wellbeing" },
                { icon: <BarChart3 size={24} />, title: "Productivity", desc: "Boost overall productivity by 25%" },
                { icon: <Award size={24} />, title: "Retention", desc: "Reduce turnover rates" },
                { icon: <Briefcase size={24} />, title: "Customized", desc: "Tailored to your needs" },
              ].map((benefit, i) => (
                <motion.div
                  key={i}
                  className="bg-slate-50 p-8 rounded-lg text-center"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ y: -5 }}
                >
                  <div className="text-blue-600 mb-4 flex justify-center">{benefit.icon}</div>
                  <h3 className="font-bold text-lg mb-2">{benefit.title}</h3>
                  <p className="text-slate-600 text-sm">{benefit.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Packages */}
        <section className="py-16 px-4 bg-slate-50">
          <div className="max-w-6xl mx-auto">
            <motion.h2
              className="text-4xl font-black text-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              Our Packages
            </motion.h2>
            <div className="grid md:grid-cols-3 gap-8">
              {packages.map((pkg, i) => (
                <motion.div
                  key={i}
                  className={`rounded-lg p-8 ${
                    pkg.highlighted ? "bg-red-600 text-white shadow-xl scale-105" : "bg-white border-2 border-slate-200"
                  }`}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ y: -5 }}
                >
                  <h3 className="text-2xl font-bold mb-2">{pkg.name}</h3>
                  <p className={`text-3xl font-black mb-2 ${pkg.highlighted ? "text-white" : "text-red-600"}`}>
                    {pkg.price}
                  </p>
                  <p className={`mb-6 ${pkg.highlighted ? "text-red-100" : "text-slate-600"}`}>{pkg.employees}</p>
                  <ul className="space-y-3">
                    {pkg.features.map((feature, j) => (
                      <li key={j} className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${pkg.highlighted ? "bg-white" : "bg-red-600"}`}></span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <motion.button
                    className={`w-full mt-8 py-2 rounded-lg font-bold ${
                      pkg.highlighted ? "bg-white text-red-600" : "bg-red-600 text-white hover:bg-red-700"
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Get Started
                  </motion.button>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  )
}
