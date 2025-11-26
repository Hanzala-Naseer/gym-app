"use client"

import type React from "react"

import Navbar from "@/src/components/Navbar"
import Footer from "@/src/components/Footer"
import { motion } from "framer-motion"
import { Phone, Mail, MapPin, Send } from "lucide-react"
import { useState } from "react"

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" })
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 3000)
  }

  const contacts = [
    { icon: <Phone size={24} />, title: "Phone", info: "+92-300-123-4567", color: "bg-red-600" },
    { icon: <Mail size={24} />, title: "Email", info: "support@gympassport.pk", color: "bg-blue-600" },
    {
      icon: <MapPin size={24} />,
      title: "Address",
      info: "123 Fitness Street, Lahore, Pakistan",
      color: "bg-green-600",
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
            src="/contact-support-team-communication-help.jpg"
            alt="Contact Us"
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
                Contact Us
              </motion.h1>
              <motion.p
                className="text-xl text-teal-100"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                Get in touch with our team. We're here to help!
              </motion.p>
            </div>
          </div>
        </motion.section>

        {/* Contact Grid */}
        <section className="py-16 px-4">
          <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8 mb-16">
            {contacts.map((contact, i) => (
              <motion.div
                key={i}
                className="bg-slate-50 p-8 rounded-lg text-center hover:shadow-lg transition-shadow"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <div
                  className={`${contact.color} w-16 h-16 rounded-full flex items-center justify-center text-white mx-auto mb-4`}
                >
                  {contact.icon}
                </div>
                <h3 className="text-xl font-bold mb-2">{contact.title}</h3>
                <p className="text-slate-600">{contact.info}</p>
              </motion.div>
            ))}
          </div>

          {/* Contact Form */}
          <div className="max-w-2xl mx-auto">
            <motion.form
              className="bg-slate-50 p-8 rounded-lg"
              onSubmit={handleSubmit}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div className="space-y-6">
                <div>
                  <label className="block font-bold mb-2">Full Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 border-2 border-slate-200 rounded-lg focus:border-red-600 focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold mb-2">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2 border-2 border-slate-200 rounded-lg focus:border-red-600 focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold mb-2">Message</label>
                  <textarea
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    rows={5}
                    className="w-full px-4 py-2 border-2 border-slate-200 rounded-lg focus:border-red-600 focus:outline-none"
                    required
                  />
                </div>
                <motion.button
                  type="submit"
                  className="w-full btn-gym py-3 font-bold flex items-center justify-center gap-2"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Send size={20} />
                  Send Message
                </motion.button>
                {submitted && (
                  <motion.div
                    className="bg-green-100 text-green-700 p-4 rounded-lg font-semibold text-center"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    Thank you! Your message has been sent successfully.
                  </motion.div>
                )}
              </div>
            </motion.form>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  )
}
