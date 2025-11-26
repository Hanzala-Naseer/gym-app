"use client"

import Navbar from "@/src/components/Navbar"
import Footer from "@/src/components/Footer"
import { motion } from "framer-motion"
import { Calendar, User, ArrowRight } from "lucide-react"

export default function BlogsPage() {
  const blogs = [
    {
      title: "10 Best Exercises for Home Workouts",
      author: "Ali Khan",
      date: "Dec 15, 2024",
      excerpt: "Discover the most effective exercises you can do at home without any equipment.",
      category: "Fitness",
      image: "/home-workout-exercises-fitness-training.jpg",
    },
    {
      title: "Nutrition Tips for Muscle Gain",
      author: "Sarah Ahmed",
      date: "Dec 10, 2024",
      excerpt: "Learn how to optimize your diet for maximum muscle growth and recovery.",
      category: "Nutrition",
      image: "/healthy-nutrition-diet-muscle-building-foods.jpg",
    },
    {
      title: "Mental Health Benefits of Gym",
      author: "Dr. Hassan",
      date: "Dec 5, 2024",
      excerpt: "Explore how regular exercise improves mental wellbeing and reduces stress.",
      category: "Health",
      image: "/mental-health-fitness-exercise-wellness.jpg",
    },
    {
      title: "HIIT Training for Weight Loss",
      author: "Fatima Khan",
      date: "Nov 28, 2024",
      excerpt: "High-intensity interval training explained and how it burns calories effectively.",
      category: "Fitness",
      image: "/hiit-training-cardio-weight-loss-exercise.jpg",
    },
    {
      title: "Yoga for Beginners Guide",
      author: "Aisha Malik",
      date: "Nov 20, 2024",
      excerpt: "A comprehensive beginner's guide to starting your yoga journey.",
      category: "Wellness",
      image: "/yoga-beginner-stretching-meditation.jpg",
    },
    {
      title: "Post-Workout Recovery Essentials",
      author: "Ahmed Shah",
      date: "Nov 15, 2024",
      excerpt: "Everything you need to know about proper recovery after intense workouts.",
      category: "Recovery",
      image: "/post-workout-recovery-stretching-rest.jpg",
    },
  ]

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
            src="/fitness-blog-expert-tips-training-guides.jpg"
            alt="Fitness Blog"
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
                Fitness Blog
              </motion.h1>
              <motion.p
                className="text-xl text-purple-100"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                Expert tips, fitness guides, and wellness insights
              </motion.p>
            </div>
          </div>
        </motion.section>

        {/* Blog Posts */}
        <section className="py-16 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="space-y-6">
              {blogs.map((blog, i) => (
                <motion.article
                  key={i}
                  className="bg-slate-50 rounded-lg overflow-hidden hover:shadow-lg transition-shadow group cursor-pointer flex"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ x: 5 }}
                >
                  {/* Blog Image */}
                  <div className="w-40 h-40 flex-shrink-0 overflow-hidden">
                    <img
                      src={blog.image || "/placeholder.svg"}
                      alt={blog.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  {/* Blog Content */}
                  <div className="flex-1 p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="bg-red-600 text-white px-3 py-1 rounded-full text-xs font-bold">
                        {blog.category}
                      </span>
                    </div>
                    <h2 className="text-2xl font-black mb-3 group-hover:text-red-600 transition-colors">
                      {blog.title}
                    </h2>
                    <p className="text-slate-600 mb-4">{blog.excerpt}</p>
                    <div className="flex items-center gap-6 text-sm text-slate-500">
                      <div className="flex items-center gap-2">
                        <User size={16} />
                        <span>{blog.author}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar size={16} />
                        <span>{blog.date}</span>
                      </div>
                    </div>
                  </div>
                  <motion.div className="text-red-600 pr-4 flex items-center" whileHover={{ x: 5 }}>
                    <ArrowRight size={24} />
                  </motion.div>
                </motion.article>
              ))}
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  )
}
