export default function AppMockup() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="fade-in">
            <img src="/mobile-app-phone-mockup.jpg" alt="GYM Key mobile app" className="w-full max-w-sm mx-auto" />
          </div>

          <div className="fade-in">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Available on iOS & Android</h2>
            <p className="text-xl text-slate-600 mb-6 leading-relaxed">
              Download the GYM Key app and carry thousands of gyms in your pocket. Get personalized recommendations,
              track your progress, and connect with the fitness community.
            </p>
            <ul className="space-y-4 mb-8">
              <li className="flex items-center gap-3">
                <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                <span className="text-lg">Real-time gym availability</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                <span className="text-lg">Integrated workout tracking</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                <span className="text-lg">Social fitness challenges</span>
              </li>
            </ul>
            <button className="btn-primary">Download Now</button>
          </div>
        </div>
      </div>
    </section>
  )
}
