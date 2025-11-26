"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { motion } from "framer-motion"

interface FitnessJourneyProps {
  onCardClick: (cardType: string) => void
}

const journeyCards = [
  {
    id: 1,
    image: "/gym-trainer-workout.jpg",
    title: "Strength Training",
    description:
      "Build muscle and increase your strength with our professional trainers and state-of-the-art equipment.",
  },
  {
    id: 2,
    image: "/woman-fitness-exercise.jpg",
    title: "Cardio & Fitness",
    description: "Improve your cardiovascular health with our comprehensive cardio programs and fitness classes.",
  },
  {
    id: 3,
    image: "/gym-workout-equipment.jpg",
    title: "Equipment Access",
    description: "Get access to premium gym equipment across all our 195+ partner gyms nationwide.",
  },
  {
    id: 4,
    image: "/athletic-training.jpg",
    title: "Professional Training",
    description: "Work with certified trainers to achieve your fitness goals with personalized training plans.",
  },
]

export default function FitnessJourney({ onCardClick }: FitnessJourneyProps) {
  const [scrollPos, setScrollPos] = useState(0)

  const scroll = (direction: "left" | "right") => {
    const container = document.getElementById("journey-carousel")
    if (container) {
      const scrollAmount = 300
      const newPos = direction === "left" ? scrollPos - scrollAmount : scrollPos + scrollAmount
      container.scrollLeft = newPos
      setScrollPos(newPos)
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  }

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          <motion.div className="flex justify-center mb-4" variants={itemVariants}>
            <span className="section-divider"></span>
          </motion.div>
          <motion.p className="text-red-600 font-black text-sm mb-2 tracking-widest" variants={itemVariants}>
            GYM KEY
          </motion.p>
          <motion.h2 className="text-4xl md:text-5xl font-black mb-4" variants={itemVariants}>
            START YOUR <span className="text-red-600">FITNESS</span> JOURNEY
          </motion.h2>
          <motion.p className="text-slate-600 text-lg text-balance" variants={itemVariants}>
            Join thousands of fitness enthusiasts achieving their goals with GYM Key
          </motion.p>
        </motion.div>

        {/* Carousel */}
        <div className="relative">
          <div id="journey-carousel" className="carousel-container flex gap-6 pb-4 overflow-x-auto scroll-smooth">
            {journeyCards.map((card, i) => (
              <motion.div
                key={card.id}
                className="carousel-item flex-shrink-0"
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
              >
                <motion.button
                  onClick={() => onCardClick(card.title)}
                  className="w-64 h-80 overflow-hidden group cursor-pointer rounded-lg relative block bg-gray-900"
                  whileHover={{ y: -10, boxShadow: "0 20px 40px rgba(220, 38, 38, 0.2)" }}
                  transition={{ duration: 0.3 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <img
                    src={card.image || "/placeholder.svg"}
                    alt={card.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors duration-300 flex items-end p-4">
                    <div>
                      <h3 className="text-white font-black text-xl mb-2">{card.title}</h3>
                      <p className="text-white/90 text-xs font-semibold line-clamp-2 group-hover:line-clamp-none">
                        {card.description}
                      </p>
                    </div>
                  </div>
                </motion.button>
              </motion.div>
            ))}
          </div>

          {/* Carousel Controls */}
          <motion.button
            onClick={() => scroll("left")}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-16 bg-red-600 text-white p-2 rounded-full hover:bg-red-700 transition-colors"
            aria-label="Scroll left"
            whileHover={{ scale: 1.15, boxShadow: "0 10px 25px rgba(220, 38, 38, 0.4)" }}
            whileTap={{ scale: 0.9 }}
          >
            <ChevronLeft size={24} />
          </motion.button>
          <motion.button
            onClick={() => scroll("right")}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-16 bg-red-600 text-white p-2 rounded-full hover:bg-red-700 transition-colors"
            aria-label="Scroll right"
            whileHover={{ scale: 1.15, boxShadow: "0 10px 25px rgba(220, 38, 38, 0.4)" }}
            whileTap={{ scale: 0.9 }}
          >
            <ChevronRight size={24} />
          </motion.button>

          {/* Pagination dots */}
          <div className="flex justify-center gap-2 mt-8">
            {journeyCards.map((_, i) => (
              <motion.button
                key={i}
                className={`w-2 h-2 rounded-full transition-colors ${i === 0 ? "bg-red-600" : "bg-gray-300"}`}
                whileHover={{ scale: 1.3 }}
                whileTap={{ scale: 0.8 }}
              />
            ))}
          </div>
        </div>

        {/* CTA in carousel */}
        <motion.div
          className="mt-16 text-center bg-slate-900 text-white rounded-lg p-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          whileHover={{ boxShadow: "0 20px 40px rgba(0, 0, 0, 0.3)" }}
        >
          <h3 className="text-3xl font-black mb-4 tracking-tight">START YOUR FITNESS JOURNEY WITH GYM KEY</h3>
          <p className="text-gray-300 mb-6 text-lg font-semibold">WORKOUT WHENEVER, WHEREVER!</p>
          <motion.button
            className="bg-red-600 text-white px-8 py-3 rounded font-black hover:bg-red-700 transition-colors tracking-wide"
            whileHover={{ scale: 1.08, boxShadow: "0 10px 25px rgba(220, 38, 38, 0.4)" }}
            whileTap={{ scale: 0.95 }}
          >
            DOWNLOAD NOW
          </motion.button>
        </motion.div>
      </div>
    </section>
  )
}
