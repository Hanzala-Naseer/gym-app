"use client"

import Navbar from "@/src/components/Navbar"
import Footer from "@/src/components/Footer"
import { motion } from "framer-motion"
import { Calendar, MapPin } from "lucide-react"

export default function NewsPage() {
  const news = [
    {
      title: "GYM Key Expands to 15 New Cities",
      date: "Dec 20, 2024",
      location: "Pakistan",
      content: "GYM Key announces expansion to 15 new cities with 50 additional partner gyms.",
      image: "/gym-expansion-new-cities-launch.jpg",
    },
    {
      title: "Partnership with Leading Health Brand",
      date: "Dec 18, 2024",
      location: "Lahore",
      content: "GYM Key partners with a leading health supplement brand for exclusive member benefits.",
      image: "/health-brand-partnership-fitness-supplements.jpg",
    },
    {
      title: "Annual Fitness Challenge 2024 Results",
      date: "Dec 15, 2024",
      location: "Multiple Cities",
      content: "Over 5,000 members participated in our annual fitness challenge. Winners announced!",
      image: "/fitness-challenge-competition-winners-awards.jpg",
    },
    {
      title: "New AI-Powered Fitness Tracking Feature",
      date: "Dec 10, 2024",
      location: "Digital",
      content: "Introducing our new AI-powered workout tracking and personalized fitness recommendations.",
      image: "/ai-technology-fitness-tracking-innovation.jpg",
    },
    {
      title: "Corporate Wellness Summit 2024",
      date: "Dec 5, 2024",
      location: "Karachi",
      content: "Leading companies gathered to discuss employee wellness strategies and fitness trends.",
      image: "/corporate-wellness-summit-conference-meeting.jpg",
    },
    {
      title: "GYM Key Wins Best Fitness App Award",
      date: "Nov 30, 2024",
      location: "Pakistan",
      content: "GYM Key recognized as the best fitness membership app in the region.",
      image: "/gym-key-award-recognition-best-app.jpg",
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
            src="/news-updates-announcements-fitness-industry.jpg"
            alt="News Updates"
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
                Latest News & Updates
              </motion.h1>
              <motion.p
                className="text-xl text-orange-100"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                Stay updated with GYM Key announcements and industry news
              </motion.p>
            </div>
          </div>
        </motion.section>

        {/* News Grid */}
        <section className="py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {news.map((item, i) => (
                <motion.article
                  key={i}
                  className="bg-slate-50 rounded-lg overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ y: -5 }}
                >
                  {/* News Image */}
                  <div className="h-40 overflow-hidden">
                    <img
                      src={item.image || "/placeholder.svg"}
                      alt={item.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-4 mb-3 text-sm text-slate-500">
                      <div className="flex items-center gap-1">
                        <Calendar size={14} />
                        <span>{item.date}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin size={14} />
                        <span>{item.location}</span>
                      </div>
                    </div>
                    <h3 className="text-lg font-black mb-3 hover:text-red-600 transition-colors">{item.title}</h3>
                    <p className="text-slate-600 text-sm">{item.content}</p>
                  </div>
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
