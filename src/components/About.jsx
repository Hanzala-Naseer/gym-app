"use client"

import { motion } from "framer-motion"
import { CheckCircle } from "lucide-react"

export default function About() {
  const features = ["State-of-the-art equipment", "Expert personal trainers", "24/7 gym access", "Nutrition guidance"]

  return (
    <section id="about" className="py-20 px-4 bg-slate-900/50">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        {/* Image */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="relative"
        >
          <img src="/gym-interior-modern-equipment.jpg" alt="Gym" className="rounded-2xl w-full" />
          <div className="absolute -bottom-4 -left-4 w-40 h-40 bg-cyan-400/20 rounded-full blur-3xl" />
        </motion.div>

        {/* Content */}
        <motion.div
          className="space-y-6"
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-5xl font-display font-bold">About IronForce</h2>
          <p className="text-gray-300 text-lg">
            Founded in 2015, IronForce Fitness has been dedicated to helping individuals achieve their fitness goals
            through personalized training, state-of-the-art facilities, and a supportive community.
          </p>
          <p className="text-gray-400">
            Our mission is to empower every member to reach their peak physical and mental potential.
          </p>

          <div className="space-y-3 pt-4">
            {features.map((feature, idx) => (
              <motion.div
                key={idx}
                className="flex items-center gap-3"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                viewport={{ once: true }}
              >
                <CheckCircle className="text-cyan-400" size={24} />
                <span className="text-gray-300">{feature}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
