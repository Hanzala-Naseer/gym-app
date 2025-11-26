"use client"

import { Search, QrCode, Dumbbell } from "lucide-react"

export default function HowItWorks() {
  const steps = [
    {
      icon: Search,
      title: "Find Gym",
      description: "Browse hundreds of premium gyms in your area with instant availability",
    },
    {
      icon: QrCode,
      title: "Scan QR",
      description: "Simply scan the QR code at the gym entrance to check in",
    },
    {
      icon: Dumbbell,
      title: "Start Workout",
      description: "Access all gym facilities and track your fitness journey in real-time",
    },
  ]

  return (
    <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">How It Works</h2>
          <p className="text-xl text-slate-600">Three simple steps to your next great workout</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, idx) => {
            const Icon = step.icon
            return (
              <div
                key={idx}
                className="bg-white p-8 rounded-2xl card-shadow text-center fade-in"
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-6">
                  <Icon className="text-purple-600" size={32} />
                </div>
                <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                <p className="text-slate-600">{step.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
