"use client"

import { motion } from "framer-motion"
import { useForm } from "react-hook-form"
import { Send } from "lucide-react"

export default function Contact() {
  const { register, handleSubmit, reset } = useForm()

  const onSubmit = (data) => {
    console.log(data)
    alert("Thank you for reaching out! We will be in touch soon.")
    reset()
  }

  return (
    <section id="contact" className="py-20 px-4 bg-slate-900/50">
      <div className="max-w-2xl mx-auto">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <h2 className="text-5xl font-display font-bold mb-4">Get In Touch</h2>
          <p className="text-gray-400 text-lg">Have questions? We'd love to hear from you</p>
        </motion.div>

        <motion.form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-6"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold mb-2">Name</label>
              <input
                {...register("name")}
                placeholder="Your name"
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-gray-100 placeholder-gray-500 focus:border-cyan-400 focus:outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-bold mb-2">Email</label>
              <input
                {...register("email")}
                type="email"
                placeholder="Your email"
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-gray-100 placeholder-gray-500 focus:border-cyan-400 focus:outline-none transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold mb-2">Phone</label>
            <input
              {...register("phone")}
              placeholder="Your phone"
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-gray-100 placeholder-gray-500 focus:border-cyan-400 focus:outline-none transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-bold mb-2">Message</label>
            <textarea
              {...register("message")}
              placeholder="Your message"
              rows="5"
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-gray-100 placeholder-gray-500 focus:border-cyan-400 focus:outline-none transition-colors resize-none"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 py-4 rounded-lg font-bold text-lg hover:shadow-2xl hover:shadow-cyan-400/50 transition-all flex items-center justify-center gap-2"
          >
            Send Message <Send size={20} />
          </button>
        </motion.form>
      </div>
    </section>
  )
}
