import { MapPin, Star } from "lucide-react"

export default function PartnerGyms() {
  const gyms = [
    {
      name: "FitZone Elite",
      location: "New York, NY",
      rating: 4.8,
      image: "/modern-gym-interior.png",
    },
    {
      name: "PowerHouse Gym",
      location: "Los Angeles, CA",
      rating: 4.9,
      image: "/gym-equipment-weights.jpg",
    },
    {
      name: "CrossFit Central",
      location: "Chicago, IL",
      rating: 4.7,
      image: "/crossfit-gym-training.png",
    },
    {
      name: "Yoga & Wellness",
      location: "San Francisco, CA",
      rating: 4.6,
      image: "/yoga-studio-wellness.jpg",
    },
  ]

  return (
    <section id="gyms" className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Partner Gyms</h2>
          <p className="text-xl text-slate-600">Join thousands of premium fitness facilities</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {gyms.map((gym, idx) => (
            <div key={idx} className="bg-white rounded-2xl overflow-hidden card-shadow fade-in">
              <img src={gym.image || "/placeholder.svg"} alt={gym.name} className="w-full h-48 object-cover" />
              <div className="p-6">
                <h3 className="text-lg font-bold mb-2">{gym.name}</h3>
                <div className="flex items-center gap-2 text-slate-600 mb-3">
                  <MapPin size={16} />
                  <span className="text-sm">{gym.location}</span>
                </div>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      className={i < Math.floor(gym.rating) ? "fill-yellow-400 text-yellow-400" : "text-slate-300"}
                    />
                  ))}
                  <span className="text-sm font-semibold ml-2">{gym.rating}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
