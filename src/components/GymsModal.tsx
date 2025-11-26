"use client"

import { motion, AnimatePresence } from "framer-motion"
import { X } from "lucide-react"

interface GymsModalProps {
  onClose: () => void
}

const gyms = [
  { id: 1, name: "Iron Fitness Hub", location: "Karachi", members: 1200 },
  { id: 2, name: "PowerBox Gym", location: "Lahore", members: 980 },
  { id: 3, name: "FitZone Elite", location: "Islamabad", members: 750 },
  { id: 4, name: "Strength Arsenal", location: "Rawalpindi", members: 650 },
  { id: 5, name: "Pro Fitness Center", location: "Faisalabad", members: 540 },
  { id: 6, name: "Athletic Peak", location: "Multan", members: 420 },
  { id: 7, name: "Body Builder Gym", location: "Hyderabad", members: 380 },
  { id: 8, name: "Ultimate Fitness", location: "Peshawar", members: 290 },
]

export default function GymsModal({ onClose }: GymsModalProps) {
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
          className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto p-8 relative"
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ duration: 0.3 }}
          onClick={(e) => e.stopPropagation()}
        >
          <motion.button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 z-10"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <X size={24} />
          </motion.button>

          <motion.h2
            className="text-2xl font-black text-slate-900 mb-2"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            Our Partner Gyms
          </motion.h2>
          <motion.p
            className="text-gray-600 mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.15 }}
          >
            Access to 195+ premium gyms across Pakistan
          </motion.p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {gyms.map((gym, i) => (
              <motion.div
                key={gym.id}
                className="border border-gray-200 rounded-lg p-4 hover:border-red-600 hover:shadow-lg transition-all"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ y: -5, boxShadow: "0 10px 25px rgba(220, 38, 38, 0.1)" }}
              >
                <h3 className="font-black text-slate-900">{gym.name}</h3>
                <p className="text-sm text-gray-600">{gym.location}</p>
                <p className="text-xs text-gray-500 mt-2">{gym.members} Active Members</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
