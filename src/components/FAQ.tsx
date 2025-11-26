"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"

export default function FAQ() {
  const [expanded, setExpanded] = useState(0)

  const faqs = [
    {
      question: "How does GYM Key work?",
      answer:
        "Browse available gyms in your area, purchase a plan, and get instant access. Simply scan the QR code at any partner gym to check in.",
    },
    {
      question: "Can I cancel anytime?",
      answer:
        "Yes, you can cancel your subscription anytime without penalties. Your access ends at the end of your billing cycle.",
    },
    {
      question: "What gyms are available?",
      answer:
        "We partner with over 2000 premium gyms across major cities. Check our app or website to see gyms in your area.",
    },
    {
      question: "Do you offer day passes?",
      answer:
        "Yes! In addition to monthly subscriptions, we offer flexible day passes and weekly plans for those who want to try us out first.",
    },
  ]

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Frequently Asked Questions</h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <button
              key={idx}
              onClick={() => setExpanded(expanded === idx ? -1 : idx)}
              className="w-full text-left p-6 rounded-lg border border-slate-200 hover:border-purple-300 transition-colors"
            >
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">{faq.question}</h3>
                <ChevronDown size={24} className={`transition-transform ${expanded === idx ? "rotate-180" : ""}`} />
              </div>
              {expanded === idx && <p className="mt-4 text-slate-600 leading-relaxed">{faq.answer}</p>}
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}
