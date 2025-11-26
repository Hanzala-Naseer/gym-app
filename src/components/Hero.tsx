"use client"

import { motion } from "framer-motion"

export default function Hero() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  }

  const imageVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  }

  return (
    <section className="pt-32 pb-12 px-4 sm:px-6 lg:px-8 bg-white" id="home">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left content */}
          <motion.div
            className="space-y-6"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            <motion.div className="mb-4" variants={itemVariants}>
              <span className="text-red-600 font-black text-sm tracking-widest">GYM KEY</span>
            </motion.div>
            <motion.h1 className="text-5xl md:text-6xl font-black leading-tight mb-6" variants={itemVariants}>
              ONE MEMBERSHIP AND ACCESS
              <br />
              OVER <span className="text-red-600">195 GYMS</span> ACROSS
              <br />
              PAKISTAN
            </motion.h1>
            <motion.p className="text-lg text-slate-600 mb-6 leading-relaxed" variants={itemVariants}>
              Pakistan's Largest Gym Network.
            </motion.p>
            <motion.p className="text-base text-slate-600 mb-8" variants={itemVariants}>
              Access to the best gyms across lahore, karachi, islamabad and 11 other cities.
            </motion.p>
            <motion.div className="flex flex-col sm:flex-row gap-4" variants={itemVariants}>
              <motion.button
                className="btn-gym text-base font-black tracking-wide"
                whileHover={{ scale: 1.05, boxShadow: "0 10px 30px rgba(220, 38, 38, 0.4)" }}
                whileTap={{ scale: 0.95 }}
              >
                VIEW AVAILABLE GYMS
              </motion.button>
              <div className="flex gap-4">
                <motion.img
                  src="/google-play-badge.png"
                  alt="Google Play"
                  className="h-12 cursor-pointer"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                />
                <motion.img
                  src="/app-store-badge.png"
                  alt="App Store"
                  className="h-12 cursor-pointer"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                />
              </div>
            </motion.div>
          </motion.div>

          {/* Right images - hero grid */}
          <motion.div
            className="grid grid-cols-2 gap-4 auto-rows-[200px]"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            <motion.div
              className="col-span-2 row-span-2 bg-gray-200 rounded-lg overflow-hidden"
              variants={imageVariants}
            >
              <motion.img
                src="/modern-gym-equipment-weights.jpg"
                alt="Gym equipment"
                className="w-full h-full object-cover"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.4 }}
              />
            </motion.div>
            <motion.div className="bg-gray-200 rounded-lg overflow-hidden" variants={imageVariants}>
              <motion.img
                src="/fitness-trainer-man.jpg"
                alt="Fitness trainer"
                className="w-full h-full object-cover"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.4 }}
              />
            </motion.div>
            <motion.div className="bg-gray-200 rounded-lg overflow-hidden" variants={imageVariants}>
              <motion.img
                src="/athletic-man-gym.jpg"
                alt="Athletic training"
                className="w-full h-full object-cover"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.4 }}
              />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
