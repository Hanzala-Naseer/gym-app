"use client"

import { motion } from "framer-motion"
import { Dumbbell, Zap, Users, Leaf, Award } from "lucide-react"

export default function Programs() {
  const programs = [
    {
      icon: Dumbbell,
      title: "Bodybuilding",
      description: "Build massive muscle with intense strength training programs designed for maximum gains.",
    },
    {
      icon: Zap,
      title: "Fat Loss",
      description: "High-intensity interval training combined with nutrition coaching for rapid fat loss.",
    },
    {
      icon: Users,
      title: "CrossFit",
      description: "Functional fitness training that builds strength, endurance, and community spirit.",
    },
    {
      icon: Leaf,
      title: "Yoga",
      description: "Flexibility and mindfulness training for balance, peace, and body awareness.",
    },
    {
      icon: Award,
      title: "Personal Training",
      description: "One-on-one coaching customized to your specific fitness goals and needs.",
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

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  }

  return (
    <section id="programs" className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <h2 className="text-5xl font-display font-bold mb-4">Our Programs</h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Choose from our diverse range of programs designed for every fitness level and goal
          </p>
        </motion.div>

        <motion.div
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {programs.map((program, idx) => {
            const Icon = program.icon
            return (
              <motion.div
                key={idx}
                className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 hover:border-cyan-400 hover:shadow-lg hover:shadow-cyan-400/20 transition-all group cursor-pointer"
                variants={cardVariants}
                whileHover={{ scale: 1.05, y: -5 }}
              >
                <div className="mb-4 inline-block p-3 bg-gradient-to-br from-cyan-400/20 to-blue-500/20 rounded-lg group-hover:from-cyan-400/40 group-hover:to-blue-500/40 transition-all">
                  <Icon className="text-cyan-400" size={28} />
                </div>
                <h3 className="text-xl font-bold mb-2">{program.title}</h3>
                <p className="text-gray-400">{program.description}</p>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
