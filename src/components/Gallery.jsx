"use client"

import { motion } from "framer-motion"

export default function Gallery() {
  const images = [
    { height: "md:h-80", query: "gym equipment dumbbells" },
    { height: "md:h-96", query: "bodybuilder posing muscles" },
    { height: "md:h-80", query: "crossfit training rope" },
    { height: "md:h-80", query: "yoga meditation stretching" },
    { height: "md:h-96", query: "group fitness class" },
    { height: "md:h-80", query: "gym workout cardio" },
  ]

  return (
    <section id="gallery" className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <h2 className="text-5xl font-display font-bold mb-4">Gallery</h2>
          <p className="text-gray-400 text-lg">Check out our state-of-the-art facilities</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {images.map((img, idx) => (
            <motion.div
              key={idx}
              className={`h-64 ${img.height} relative rounded-xl overflow-hidden group cursor-pointer`}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.05 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05 }}
            >
              <img
                src={`/.jpg?height=400&width=400&query=${img.query}`}
                alt={`Gallery ${idx + 1}`}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-cyan-400 font-bold">View</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
