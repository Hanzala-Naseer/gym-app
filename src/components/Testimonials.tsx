"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight, Star } from "lucide-react"

export default function Testimonials() {
  const [current, setCurrent] = useState(0)

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Fitness Enthusiast",
      content: "GYM Key completely changed how I work out. I can try new gyms without long-term commitments. Love it!",
      rating: 5,
      image: "/woman-portrait.png",
    },
    {
      name: "Mike Chen",
      role: "Professional Athlete",
      content:
        "The ease of finding and accessing gyms across different cities has been a game-changer for my training routine.",
      rating: 5,
      image: "/thoughtful-man-portrait.png",
    },
    {
      name: "Emma Davis",
      role: "Yoga Instructor",
      content:
        "As a trainer, I love how GYM Key connects me with clients. The tracking features are incredibly useful.",
      rating: 5,
      image: "/woman-fitness-trainer.png",
    },
  ]

  const next = () => setCurrent((current + 1) % testimonials.length)
  const prev = () => setCurrent((current - 1 + testimonials.length) % testimonials.length)

  return (
    <section id="testimonials" className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-50">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">What Users Say</h2>
          <p className="text-xl text-slate-600">Join the community of fitness lovers</p>
        </div>

        <div className="bg-white rounded-2xl p-8 md:p-12 card-shadow">
          <div className="flex gap-1 mb-4">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={20} className="fill-yellow-400 text-yellow-400" />
            ))}
          </div>
          <p className="text-2xl md:text-3xl font-bold mb-8 text-slate-900">{testimonials[current].content}</p>
          <div className="flex items-center gap-4">
            <img
              src={testimonials[current].image || "/placeholder.svg"}
              alt={testimonials[current].name}
              className="w-16 h-16 rounded-full object-cover"
            />
            <div>
              <p className="font-bold text-lg">{testimonials[current].name}</p>
              <p className="text-slate-600">{testimonials[current].role}</p>
            </div>
          </div>

          <div className="flex gap-4 mt-8">
            <button onClick={prev} className="p-3 rounded-full bg-slate-100 hover:bg-slate-200 transition-colors">
              <ChevronLeft size={24} />
            </button>
            <button
              onClick={next}
              className="p-3 rounded-full bg-purple-600 text-white hover:bg-purple-700 transition-colors"
            >
              <ChevronRight size={24} />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
