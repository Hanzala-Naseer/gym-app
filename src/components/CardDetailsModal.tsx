"use client"

import { motion, AnimatePresence } from "framer-motion"
import { X } from "lucide-react"

interface CardDetailsModalProps {
  cardType: string
  onClose: () => void
}

const cardDetails: Record<string, { title: string; description: string; benefits: string[] }> = {
  "Strength Training": {
    title: "Strength Training",
    description:
      "Build muscle and increase your strength with our professional trainers and state-of-the-art equipment.",
    benefits: [
      "Access to premium weightlifting equipment",
      "Personalized strength training programs",
      "Professional certified trainers",
      "Nutrition guidance included",
      "Monthly progress tracking",
    ],
  },
  "Cardio & Fitness": {
    title: "Cardio & Fitness",
    description: "Improve your cardiovascular health with our comprehensive cardio programs and fitness classes.",
    benefits: [
      "Advanced cardio machines and equipment",
      "Group fitness classes (Zumba, Aerobics, Spinning)",
      "Cardio training programs for all levels",
      "Heart rate monitoring technology",
      "Flexible class schedules",
    ],
  },
  "Equipment Access": {
    title: "Equipment Access",
    description: "Get access to premium gym equipment across all our 195+ partner gyms nationwide.",
    benefits: [
      "Access to 195+ gyms nationwide",
      "Standardized equipment across all locations",
      "24/7 gym access",
      "No membership lock-in",
      "Visit any gym, anytime",
    ],
  },
  "Professional Training": {
    title: "Professional Training",
    description: "Work with certified trainers to achieve your fitness goals with personalized training plans.",
    benefits: [
      "One-on-one personal training sessions",
      "Customized workout plans",
      "Form and technique correction",
      "Injury prevention guidance",
      "Flexible training schedules",
    ],
  },
}

export default function CardDetailsModal({ cardType, onClose }: CardDetailsModalProps) {
  const details = cardDetails[cardType] || cardDetails["Strength Training"]

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="bg-white rounded-lg max-w-md w-full p-8 relative"
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ duration: 0.3 }}
          onClick={(e) => e.stopPropagation()}
        >
          <motion.button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <X size={24} />
          </motion.button>

          <motion.h2
            className="text-2xl font-black text-slate-900 mb-3 text-red-600"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            {details.title}
          </motion.h2>

          <motion.p
            className="text-gray-600 mb-6 text-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.15 }}
          >
            {details.description}
          </motion.p>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
            <h3 className="font-black text-slate-900 mb-4">Key Benefits:</h3>
            <ul className="space-y-2">
              {details.benefits.map((benefit, i) => (
                <motion.li
                  key={i}
                  className="flex items-start gap-3"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.25 + i * 0.05 }}
                >
                  <span className="text-red-600 font-black mt-1">✓</span>
                  <span className="text-gray-700 text-sm">{benefit}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          <motion.button
            className="w-full bg-red-600 text-white py-2 rounded-lg font-black hover:bg-red-700 transition-colors mt-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Get Started
          </motion.button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
