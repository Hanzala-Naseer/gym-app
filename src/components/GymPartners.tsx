export default function GymPartners() {
  const partners = [
    { name: "Convert", logo: "/convert-gym-logo.jpg" },
    { name: "Fitastic", logo: "/fitastic-gym-logo.jpg" },
    { name: "IronBox", logo: "/ironbox-gym-logo.jpg" },
    { name: "PowerHouse", logo: "/powerhouse-gym-logo.jpg" },
    { name: "Grit Fit", logo: "/grit-fit-gym-logo.jpg" },
    { name: "Balance", logo: "/balance-lifestyle-logo.jpg" },
  ]

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex justify-center mb-4">
            <span className="section-divider"></span>
          </div>
          <p className="text-red-600 font-bold text-sm mb-2 tracking-wide">BEST FITNESS CLUBS</p>
          <h2 className="text-4xl md:text-5xl font-black mb-4">
            SOME OF OUR <span className="text-red-600">GYM PARTNERS</span> ACROSS PAKISTAN
          </h2>
        </div>

        {/* Partners Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {partners.map((partner) => (
            <div key={partner.name} className="card-gym p-6 flex items-center justify-center h-32 bg-gray-50">
              <img
                src={partner.logo || "/placeholder.svg"}
                alt={partner.name}
                className="w-full h-full object-contain p-4"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
