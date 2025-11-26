"use client"
import { useState } from "react"
import Navbar from "@/src/components/Navbar"
import Hero from "@/src/components/Hero"
import FitnessJourney from "@/src/components/FitnessJourney"
import GymPartners from "@/src/components/GymPartners"
import Features from "@/src/components/Features"
import CTA from "@/src/components/CTA"
import Footer from "@/src/components/Footer"
import CardDetailsModal from "@/src/components/CardDetailsModal"

export default function Page() {
  const [selectedCardDetail, setSelectedCardDetail] = useState<string | null>(null)

  return (
    <div className="bg-white text-slate-900 overflow-hidden">
      <Navbar />
      <Hero />
      <FitnessJourney onCardClick={setSelectedCardDetail} />
      <GymPartners />
      <Features />
      <CTA />
      <Footer />

      {selectedCardDetail && (
        <CardDetailsModal cardType={selectedCardDetail} onClose={() => setSelectedCardDetail(null)} />
      )}
    </div>
  )
}
