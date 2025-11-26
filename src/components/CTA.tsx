export default function CTA() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-red-600">
      <div className="max-w-4xl mx-auto text-center text-white fade-in-up">
        <h2 className="text-4xl md:text-5xl font-black mb-6">Join Pakistan's Largest Gym Network Today</h2>
        <p className="text-xl mb-8 text-red-100">
          Get instant access to 195+ gyms with one membership. Download the app now.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="bg-white text-red-600 px-8 py-3 rounded font-bold hover:bg-gray-100 transition-colors">
            Download iOS
          </button>
          <button className="bg-white text-red-600 px-8 py-3 rounded font-bold hover:bg-gray-100 transition-colors">
            Download Android
          </button>
        </div>
      </div>
    </section>
  )
}
