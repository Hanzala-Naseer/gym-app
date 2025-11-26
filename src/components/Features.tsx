"use client"

import { motion } from "framer-motion"

export default function Features() {
  const features = [
    {
      title: "195+ Gyms",
      description: "Access to the largest network of gyms across Pakistan",
    },
    {
      title: "One Membership",
      description: "Single membership works across all partner gyms",
    },
    {
      title: "QR Access",
      description: "Instant access with just a QR code scan",
    },
    {
      title: "Track Progress",
      description: "Monitor your fitness journey across different gyms",
    },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  }

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <motion.div
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          {features.map((feature, i) => (
            <motion.div key={i} variants={itemVariants}>
              <motion.div
                className="card-gym p-8 bg-white"
                whileHover={{ y: -8, boxShadow: "0 20px 40px rgba(220, 38, 38, 0.15)" }}
                transition={{ duration: 0.3 }}
              >
                <h3 className="text-xl font-black mb-4 tracking-tight">{feature.title}</h3>
                <p className="text-slate-600">{feature.description}</p>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
