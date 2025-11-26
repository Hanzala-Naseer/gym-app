"use client"

import Navbar from "@/src/components/Navbar"
import Footer from "@/src/components/Footer"
import { motion } from "framer-motion"
import { MapPin, Phone, Clock, Star } from "lucide-react"
import { useState } from "react"

export default function GymsPage() {
  const [selectedCity, setSelectedCity] = useState("all")

  const gyms = [
    {
      name: "PowerFit Lahore",
      city: "Lahore",
      area: "DHA",
      members: 1200,
      rating: 4.8,
      phone: "042-123-4567",
      hours: "6AM - 10PM",
    },
    {
      name: "Elite Gym Karachi",
      city: "Karachi",
      area: "Clifton",
      members: 950,
      rating: 4.7,
      phone: "021-987-6543",
      hours: "6AM - 11PM",
    },
    {
      name: "BodyForge Islamabad",
      city: "Islamabad",
      area: "F-7",
      members: 800,
      rating: 4.9,
      phone: "051-345-6789",
      hours: "6AM - 10PM",
    },
    {
      name: "FitZone Lahore",
      city: "Lahore",
      area: "Gulberg",
      members: 1100,
      rating: 4.6,
      phone: "042-111-2222",
      hours: "6AM - 10PM",
    },
    {
      name: "StrongArm Karachi",
      city: "Karachi",
      area: "Defence",
      members: 880,
      rating: 4.8,
      phone: "021-444-5555",
      hours: "6AM - 11PM",
    },
    {
      name: "ProFit Islamabad",
      city: "Islamabad",
      area: "G-9",
      members: 750,
      rating: 4.7,
      phone: "051-666-7777",
      hours: "6AM - 10PM",
    },
    {
      name: "IronHouse Lahore",
      city: "Lahore",
      area: "Mall Road",
      members: 1300,
      rating: 4.9,
      phone: "042-888-9999",
      hours: "6AM - 11PM",
    },
    {
      name: "VitalFit Karachi",
      city: "Karachi",
      area: "Zamzama",
      members: 920,
      rating: 4.7,
      phone: "021-333-4444",
      hours: "5AM - 11PM",
    },
  ]

  const cities = ["all", ...new Set(gyms.map((g) => g.city))]
  const filteredGyms = selectedCity === "all" ? gyms : gyms.filter((g) => g.city === selectedCity)

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
            src="/195-gyms-fitness-center-facilities-pakistan.jpg"
            alt="GYM Key Gyms"
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
                195+ Gyms Across Pakistan
              </motion.h1>
              <motion.p
                className="text-xl text-red-100"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                Find and explore all our partner gyms
              </motion.p>
            </div>
          </div>
        </motion.section>

        {/* Filter */}
        <section className="py-12 px-4 border-b border-slate-200">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">Filter by City</h2>
            <div className="flex flex-wrap gap-3">
              {cities.map((city) => (
                <motion.button
                  key={city}
                  onClick={() => setSelectedCity(city)}
                  className={`px-6 py-2 rounded-full font-semibold transition-colors ${
                    selectedCity === city ? "bg-red-600 text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {city === "all" ? "All Cities" : city}
                </motion.button>
              ))}
            </div>
          </div>
        </section>

        {/* Gyms Grid */}
        <section className="py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredGyms.map((gym, i) => (
                <motion.div
                  key={i}
                  className="bg-slate-50 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ y: -5 }}
                >
                  <div className="bg-red-600 h-24"></div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2">{gym.name}</h3>
                    <div className="space-y-3 mb-4">
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <MapPin size={16} />
                        <span>
                          {gym.area}, {gym.city}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <Phone size={16} />
                        <span>{gym.phone}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <Clock size={16} />
                        <span>{gym.hours}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                      <div className="flex items-center gap-1">
                        <Star size={16} className="text-yellow-500" fill="currentColor" />
                        <span className="font-bold">{gym.rating}</span>
                      </div>
                      <span className="text-sm text-slate-500">{gym.members} members</span>
                    </div>
                  </div>
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
