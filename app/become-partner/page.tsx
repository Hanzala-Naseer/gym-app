"use client"

import Navbar from "@/src/components/Navbar"
import Footer from "@/src/components/Footer"
import { motion } from "framer-motion"
import { ArrowRight, CheckCircle, Users, Zap, TrendingUp } from "lucide-react"

export default function BecomePartnerPage() {
  const benefits = [
    { icon: <Users size={24} />, title: "Expand Reach", desc: "Access our 50,000+ active members" },
    { icon: <TrendingUp size={24} />, title: "Increase Revenue", desc: "Boost your gym's revenue by 40-60%" },
    { icon: <Zap size={24} />, title: "Digital Marketing", desc: "Get featured on our platform" },
    { icon: <CheckCircle size={24} />, title: "Premium Support", desc: "24/7 dedicated partner support" },
  ]

  const steps = [
    { num: 1, title: "Apply", desc: "Fill out our partner application form" },
    { num: 2, title: "Verification", desc: "Our team verifies your gym details" },
    { num: 3, title: "Integration", desc: "Integrate with our member system" },
    { num: 4, title: "Go Live", desc: "Start receiving GYM Key members" },
  ]

  return (
    <div className="bg-white text-slate-900 min-h-screen">
      <Navbar />

      <div className="pt-20">
        <motion.section
          className="relative h-96 bg-cover bg-center overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <img
            src="/modern-gym-fitness-center-with-equipment.jpg"
            alt="GYM Key Partner"
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
                Become a GYM Key Partner
              </motion.h1>
              <motion.p
                className="text-xl text-red-100 mb-8"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                Join Pakistan's largest gym network and grow your business with us
              </motion.p>
            </div>
          </div>
        </motion.section>

        {/* Benefits */}
        <section className="py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <motion.h2
              className="text-4xl font-black text-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              Why Partner With GYM Key?
            </motion.h2>
            <div className="grid md:grid-cols-4 gap-8">
              {benefits.map((benefit, i) => (
                <motion.div
                  key={i}
                  className="bg-slate-50 p-8 rounded-lg text-center hover:shadow-lg transition-shadow"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ y: -5 }}
                >
                  <div className="text-red-600 mb-4 flex justify-center">{benefit.icon}</div>
                  <h3 className="font-bold text-lg mb-2">{benefit.title}</h3>
                  <p className="text-slate-600 text-sm">{benefit.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-16 px-4 bg-slate-50">
          <div className="max-w-4xl mx-auto">
            <motion.h2
              className="text-4xl font-black text-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              How It Works
            </motion.h2>
            <div className="grid md:grid-cols-4 gap-6">
              {steps.map((step, i) => (
                <motion.div
                  key={i}
                  className="relative"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <div className="bg-white p-6 rounded-lg border-2 border-red-600">
                    <div className="w-10 h-10 bg-red-600 text-white rounded-full flex items-center justify-center font-bold mb-4">
                      {step.num}
                    </div>
                    <h3 className="font-bold text-lg mb-2">{step.title}</h3>
                    <p className="text-slate-600 text-sm">{step.desc}</p>
                  </div>
                  {i < 3 && (
                    <div className="hidden md:block absolute top-1/2 -right-3 transform -translate-y-1/2">
                      <ArrowRight className="text-red-600" size={24} />
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 px-4">
          <div className="max-w-2xl mx-auto text-center">
            <motion.h2
              className="text-3xl font-black mb-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              Ready to Grow Your Business?
            </motion.h2>
            <motion.button
              className="btn-gym px-8 py-4 text-lg font-bold"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Apply Now
            </motion.button>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  )
}
