import { Check } from "lucide-react"

export default function Pricing() {
  const plans = [
    {
      name: "Basic",
      price: "$9.99",
      period: "/month",
      description: "Perfect for casual gym goers",
      features: ["Access to 500+ gyms", "QR code check-in", "Basic workout tracking", "Monthly analytics"],
      highlighted: false,
    },
    {
      name: "Pro",
      price: "$19.99",
      period: "/month",
      description: "For dedicated fitness enthusiasts",
      features: [
        "Access to 2000+ gyms",
        "Priority check-in",
        "Advanced tracking & AI coaching",
        "Weekly reports & insights",
        "Personal trainer access",
      ],
      highlighted: true,
    },
    {
      name: "Elite",
      price: "$29.99",
      period: "/month",
      description: "Premium fitness experience",
      features: [
        "Unlimited gym access",
        "VIP support 24/7",
        "Custom workout programs",
        "Nutrition coaching",
        "Family account sharing",
      ],
      highlighted: false,
    },
  ]

  return (
    <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Simple, Transparent Pricing</h2>
          <p className="text-xl text-slate-600">Choose the plan that fits your fitness goals</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan, idx) => (
            <div
              key={idx}
              className={`rounded-2xl p-8 fade-in ${
                plan.highlighted
                  ? "bg-purple-600 text-white shadow-2xl transform md:scale-105"
                  : "bg-slate-50 text-slate-900 card-shadow"
              }`}
              style={{ animationDelay: `${idx * 100}ms` }}
            >
              <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
              <p className={plan.highlighted ? "text-purple-200" : "text-slate-600"}>{plan.description}</p>
              <div className="my-6">
                <span className="text-4xl font-bold">{plan.price}</span>
                <span className={plan.highlighted ? "text-purple-200" : "text-slate-600"}>{plan.period}</span>
              </div>

              <button
                className={
                  plan.highlighted
                    ? "btn-primary w-full bg-white text-purple-600 hover:bg-slate-100 mb-8"
                    : "btn-primary w-full mb-8"
                }
              >
                Get Started
              </button>

              <ul className="space-y-4">
                {plan.features.map((feature, fIdx) => (
                  <li key={fIdx} className="flex items-start gap-3">
                    <Check size={20} className="flex-shrink-0 mt-1" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
