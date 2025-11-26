"use client"

import { motion } from "framer-motion"
import { useState } from "react"

export default function Trainers() {
  const trainers = [
    {
      name: "Alex Johnson",
      specialty: "Bodybuilding Coach",
      image: "/male-fitness-trainer-professional-photo.jpg",
      bio: "20+ years experience in competitive bodybuilding",
    },
    {
      name: "Sarah Williams",
      specialty: "Fat Loss Specialist",
      image: "/female-fitness-trainer-professional-photo.jpg",
      bio: "Certified nutrition expert and HIIT specialist",
    },
    {
      name: "Marcus Chen",
      specialty: "CrossFit Champion",
      image: "/male-crossfit-trainer-athletic-photo.jpg",
      bio: "National CrossFit competitor and certified coach",
    },
    {
      name: "Emma Thompson",
      specialty: "Yoga & Wellness",
      image: "/female-yoga-instructor-peaceful-photo.jpg",
      bio: "Holistic wellness practitioner and meditation guide",
    },
  ]

  const [flipped, setFlipped] = useState({})

  return (
    <section id="trainers" className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <h2 className="text-5xl font-display font-bold mb-4">Meet Our Trainers</h2>
          <p className="text-gray-400 text-lg">Expert coaches ready to guide your journey</p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {trainers.map((trainer, idx) => (
            <motion.div
              key={idx}
              className="h-80 cursor-pointer"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              viewport={{ once: true }}
            >
              <motion.div
                className="w-full h-full relative"
                style={{ transformStyle: "preserve-3d" }}
                animate={{
                  rotateY: flipped[idx] ? 180 : 0,
                }}
                transition={{ duration: 0.6 }}
                onClick={() => setFlipped({ ...flipped, [idx]: !flipped[idx] })}
              >
                {/* Front */}
                <div
                  className="absolute w-full h-full bg-slate-800 rounded-xl overflow-hidden"
                  style={{ backfaceVisibility: "hidden" }}
                >
                  <img
                    src={trainer.image || "/placeholder.svg"}
                    alt={trainer.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="text-xl font-bold">{trainer.name}</h3>
                    <p className="text-cyan-400 text-sm">{trainer.specialty}</p>
                  </div>
                </div>

                {/* Back */}
                <div
                  className="absolute w-full h-full bg-gradient-to-br from-cyan-400/20 to-blue-500/20 rounded-xl p-6 flex flex-col items-center justify-center border border-cyan-400"
                  style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
                >
                  <p className="text-center text-gray-100">{trainer.bio}</p>
                  <p className="text-cyan-400 text-sm mt-4">Click to flip</p>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
