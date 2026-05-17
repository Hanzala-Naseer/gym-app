import { Link } from "react-router-dom";
import {
  Dumbbell,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  HeartPulse,
  Brain,
  Waves,
  Salad,
  Building2,
  Star,
  Play,
  ShieldCheck,
  MapPin,
  Smartphone,
  Users,
  QrCode,
} from "lucide-react";

import { Button } from "@/components/ui/button";

const wellnessServices = [
  {
    icon: Dumbbell,
    title: "Gyms & Fitness Clubs",
    desc: "Access premium gyms, fitness clubs, and training facilities with one membership.",
    image:
      "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=1200&auto=format&fit=crop",
  },
  {
    icon: Waves,
    title: "Pools & Recovery",
    desc: "Swimming pools, sauna access, recovery lounges, and wellness facilities.",
    image:
      "https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=1200&auto=format&fit=crop",
  },
  {
    icon: Salad,
    title: "Diet & Nutrition",
    desc: "Get personalized nutrition and meal planning from certified experts.",
    image:
      "https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=1200&auto=format&fit=crop",
  },
  {
    icon: Brain,
    title: "Mental Wellness",
    desc: "Professional consultations for mental health, stress, and wellbeing.",
    image:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=1200&auto=format&fit=crop",
  },
];

const steps = [
  {
    icon: Smartphone,
    title: "Download the App",
    desc: "Get started in seconds with our iOS and Android apps.",
  },
  {
    icon: CheckCircle2,
    title: "Choose Your Plan",
    desc: "Select a wellness membership tailored to your lifestyle.",
  },
  {
    icon: MapPin,
    title: "Find Nearby Venues",
    desc: "Discover gyms, pools, trainers, and wellness centers near you.",
  },
  {
    icon: QrCode,
    title: "Scan & Start",
    desc: "Use instant QR check-ins and enjoy your session seamlessly.",
  },
];

const testimonials = [
  {
    name: "Ahmed Raza",
    role: "Fitness Enthusiast",
    quote:
      "The flexibility is incredible. I can workout at multiple gyms without being locked into one location.",
  },
  {
    name: "Sara Khan",
    role: "Corporate Professional",
    quote:
      "GymKey helped me stay consistent with fitness despite my hectic work schedule.",
  },
  {
    name: "Ali Hassan",
    role: "Gym Owner",
    quote:
      "Partnering with GymKey brought new members and recurring revenue to our facility.",
  },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-[#fdf8f3] text-[#2c1a0e] overflow-hidden">
      {/* ========================================================= */}
      {/* Background Effects */}
      {/* ========================================================= */}

      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-[#885210]/10 blur-3xl" />

        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-[#fdb56c]/10 blur-3xl" />
      </div>

      {/* ========================================================= */}
      {/* Navbar */}
      {/* ========================================================= */}

      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/75 backdrop-blur-2xl border-b border-[#eadfce]">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#2c1a0e] flex items-center justify-center shadow-xl">
              <Dumbbell className="w-6 h-6 text-[#fdb56c]" />
            </div>

            <div>
              <h1 className="font-black text-xl text-[#2c1a0e]">GymKey</h1>

              <p className="text-[10px] tracking-[0.25em] uppercase text-[#885210] font-bold">
                Wellness Platform
              </p>
            </div>
          </Link>

          {/* Nav Links */}
          <div className="hidden lg:flex items-center gap-8 text-sm font-semibold text-[#5e534b]">
            <a
              href="#venues"
              className="hover:text-[#885210] transition-colors"
            >
              Venues
            </a>

            <a
              href="#wellness"
              className="hover:text-[#885210] transition-colors"
            >
              Wellness
            </a>

            <a
              href="#partners"
              className="hover:text-[#885210] transition-colors"
            >
              Partners
            </a>

            <a
              href="#testimonials"
              className="hover:text-[#885210] transition-colors"
            >
              Testimonials
            </a>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <Link to="/login">
              <Button
                variant="ghost"
                className="rounded-2xl px-6 text-[#2c1a0e]"
              >
                Login
              </Button>
            </Link>

            <Link to="/signup">
              <Button className="rounded-2xl bg-[#885210] hover:bg-[#6f420d] text-white px-7 shadow-xl">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* ========================================================= */}
      {/* Hero Section */}
      {/* ========================================================= */}

      <section className="relative pt-36 pb-24 px-6">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          {/* Left */}
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#eadfce] bg-white shadow-lg mb-7">
              <Sparkles className="w-4 h-4 text-[#885210]" />

              <span className="text-sm font-semibold text-[#885210]">
                One app for all your wellness needs
              </span>
            </div>

            <h1 className="text-5xl md:text-6xl xl:text-7xl font-black leading-[0.95] tracking-tight text-[#2c1a0e]">
              Access gyms,
              <span className="block text-[#885210] mt-3">
                pools & wellness
              </span>
              <span className="block mt-3">with one membership.</span>
            </h1>

            <p className="mt-8 text-lg leading-relaxed text-[#6f6258] max-w-2xl">
              GymKey connects you to premium gyms, fitness studios, swimming
              pools, nutrition experts, and wellness services — all through a
              single modern platform.
            </p>

            {/* Buttons */}
            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <Link to="/signup">
                <Button className="h-16 px-8 rounded-2xl bg-[#885210] hover:bg-[#6f420d] text-white text-lg font-bold shadow-[0_20px_60px_rgba(136,82,16,0.3)]">
                  Download App
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>

              <Button
                variant="outline"
                className="h-16 px-8 rounded-2xl border-[#eadfce] bg-white text-lg"
              >
                <Play className="mr-2 w-5 h-5" />
                Watch Demo
              </Button>
            </div>

            {/* Stats */}
            <div className="mt-12 grid grid-cols-3 gap-5">
              {[
                ["315+", "Fitness Venues"],
                ["50K+", "Active Members"],
                ["100+", "Partner Brands"],
              ].map(([value, label]) => (
                <div
                  key={label}
                  className="rounded-3xl bg-white border border-[#eadfce] p-5 shadow-lg"
                >
                  <h3 className="text-3xl font-black text-[#2c1a0e]">
                    {value}
                  </h3>

                  <p className="text-sm text-[#6f6258] mt-1">{label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right Hero Image */}
          <div className="relative">
            <div className="absolute inset-0 bg-[#885210]/10 blur-3xl rounded-full scale-110" />

            <div className="relative rounded-[40px] overflow-hidden shadow-[0_40px_120px_rgba(44,26,14,0.18)] border border-white/40">
              <img
                src="https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=1600&auto=format&fit=crop"
                alt="Fitness App"
                className="w-full h-[700px] object-cover"
              />

              {/* Floating Card */}
              <div className="absolute bottom-6 left-6 right-6 rounded-3xl bg-white/85 backdrop-blur-xl border border-white/40 p-5 shadow-2xl">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-[#885210] flex items-center justify-center">
                    <HeartPulse className="w-7 h-7 text-white" />
                  </div>

                  <div>
                    <h3 className="text-xl font-black text-[#2c1a0e]">
                      Complete Wellness
                    </h3>

                    <p className="text-[#6f6258] text-sm mt-1">
                      Physical fitness, mental wellness, nutrition & recovery —
                      all in one ecosystem.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* Wellness Services */}
      {/* ========================================================= */}

      <section id="wellness" className="py-24 px-6 bg-white relative">
        <div className="max-w-7xl mx-auto">
          {/* Heading */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 rounded-full bg-[#f4ede3] px-4 py-2 mb-5">
              <Sparkles className="w-4 h-4 text-[#885210]" />

              <span className="text-sm font-semibold text-[#885210]">
                More than just a gym membership
              </span>
            </div>

            <h2 className="text-4xl md:text-5xl font-black text-[#2c1a0e]">
              Everything for your
              <span className="block mt-2 text-[#885210]">
                complete wellbeing
              </span>
            </h2>

            <p className="max-w-2xl mx-auto mt-6 text-lg text-[#6f6258]">
              GymKey brings together physical fitness, recovery, mental
              wellness, nutrition, and lifestyle services into one premium
              platform.
            </p>
          </div>

          {/* Cards */}
          <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-8">
            {wellnessServices.map((service) => (
              <div
                key={service.title}
                className="group overflow-hidden rounded-[32px] bg-[#fffaf5] border border-[#eadfce] shadow-xl hover:-translate-y-2 transition-all duration-500"
              >
                <div className="relative h-60 overflow-hidden">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                  <div className="absolute bottom-5 left-5 w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md border border-white/20 flex items-center justify-center">
                    <service.icon className="w-7 h-7 text-white" />
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-2xl font-black text-[#2c1a0e]">
                    {service.title}
                  </h3>

                  <p className="mt-3 text-[#6f6258] leading-relaxed">
                    {service.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* Gym Owners */}
      {/* ========================================================= */}

      <section
        id="partners"
        className="py-24 px-6 bg-[#2c1a0e] relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(253,181,108,0.12),transparent_30%)]" />

        <div className="max-w-7xl mx-auto relative z-10 grid lg:grid-cols-2 gap-16 items-center">
          {/* Image */}
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1571902943202-507ec2618e8f?q=80&w=1600&auto=format&fit=crop"
              alt="Gym Owner"
              className="rounded-[40px] shadow-2xl object-cover h-[600px] w-full"
            />
          </div>

          {/* Content */}
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 mb-6 backdrop-blur-md">
              <Building2 className="w-4 h-4 text-[#fdb56c]" />

              <span className="text-sm font-semibold text-[#fdb56c]">
                For Gym Owners & Partners
              </span>
            </div>

            <h2 className="text-4xl md:text-5xl font-black text-white leading-tight">
              Grow your fitness
              <span className="block mt-2 text-[#fdb56c]">
                business with GymKey
              </span>
            </h2>

            <p className="mt-6 text-lg text-[#f3e6d7]/70 leading-relaxed">
              Join our wellness ecosystem and unlock a new revenue stream by
              connecting with thousands of active fitness members.
            </p>

            <div className="mt-10 space-y-4">
              {[
                "Reach more active members instantly",
                "Increase recurring monthly revenue",
                "Modern QR-based check-in system",
                "No upfront setup fees",
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-3 rounded-2xl bg-white/5 border border-white/10 p-4"
                >
                  <div className="w-8 h-8 rounded-full bg-[#fdb56c]/20 flex items-center justify-center">
                    <ShieldCheck className="w-4 h-4 text-[#fdb56c]" />
                  </div>

                  <span className="text-white font-medium">{item}</span>
                </div>
              ))}
            </div>

            <div className="mt-10">
              <Button className="h-16 px-8 rounded-2xl bg-[#fdb56c] hover:bg-[#f4a64d] text-[#2c1a0e] font-black text-lg">
                Join the Partnership
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* Steps */}
      {/* ========================================================= */}

      <section className="py-24 px-6 bg-[#fff8f0]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-[#2c1a0e]">
              Getting started is
              <span className="block text-[#885210] mt-2">super simple</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div
                key={step.title}
                className="relative rounded-[32px] bg-white border border-[#eadfce] p-8 shadow-xl"
              >
                <div className="absolute top-5 right-5 text-6xl font-black text-[#f4ede3]">
                  0{index + 1}
                </div>

                <div className="w-16 h-16 rounded-3xl bg-[#2c1a0e] flex items-center justify-center mb-7">
                  <step.icon className="w-8 h-8 text-[#fdb56c]" />
                </div>

                <h3 className="text-2xl font-black text-[#2c1a0e]">
                  {step.title}
                </h3>

                <p className="mt-4 text-[#6f6258] leading-relaxed">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* Testimonials */}
      {/* ========================================================= */}

      <section id="testimonials" className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-[#2c1a0e]">
              What our community says
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <div
                key={testimonial.name}
                className="rounded-[32px] bg-[#fff8f0] border border-[#eadfce] p-8 shadow-xl"
              >
                <div className="flex items-center gap-1 text-[#f59e0b] mb-5">
                  {[1, 2, 3, 4, 5].map((item) => (
                    <Star key={item} className="w-5 h-5 fill-current" />
                  ))}
                </div>

                <p className="text-[#5e534b] leading-relaxed text-lg">
                  “{testimonial.quote}”
                </p>

                <div className="mt-8">
                  <h4 className="font-black text-[#2c1a0e] text-lg">
                    {testimonial.name}
                  </h4>

                  <p className="text-[#885210] text-sm font-medium">
                    {testimonial.role}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* CTA */}
      {/* ========================================================= */}

      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto rounded-[40px] overflow-hidden relative">
          <div className="absolute inset-0">
            <img
              src="https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=1600&auto=format&fit=crop"
              alt="Fitness"
              className="w-full h-full object-cover"
            />

            <div className="absolute inset-0 bg-[#2c1a0e]/80" />
          </div>

          <div className="relative z-10 text-center px-8 py-24">
            <h2 className="text-5xl md:text-6xl font-black text-white leading-tight">
              Your wellness
              <span className="block mt-2 text-[#fdb56c]">
                journey starts here.
              </span>
            </h2>

            <p className="max-w-2xl mx-auto mt-6 text-lg text-[#f3e6d7]/80">
              Join thousands of members discovering gyms, wellness spaces,
              pools, and fitness experiences through GymKey.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row justify-center gap-5">
              <Button className="h-16 px-10 rounded-2xl bg-[#fdb56c] hover:bg-[#f4a64d] text-[#2c1a0e] font-black text-lg">
                Get The App
              </Button>

              <Button
                variant="outline"
                className="h-16 px-10 rounded-2xl border-white/20 bg-white/10 text-white backdrop-blur-md"
              >
                Explore Venues
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* Footer */}
      {/* ========================================================= */}

      <footer className="bg-[#1b1008] border-t border-[#3a2414] py-14 px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-[#885210] flex items-center justify-center">
                <Dumbbell className="w-6 h-6 text-white" />
              </div>

              <div>
                <h3 className="text-white font-black text-xl">GymKey</h3>

                <p className="text-[#fdb56c] text-xs uppercase tracking-[0.25em]">
                  Wellness Platform
                </p>
              </div>
            </div>

            <p className="mt-5 text-[#f3e6d7]/60 leading-relaxed">
              Access gyms, pools, wellness services, and fitness experiences
              with one modern membership platform.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-white font-bold mb-5">Quick Links</h4>

            <div className="space-y-3 text-[#f3e6d7]/70">
              <p>Venues</p>
              <p>Pricing</p>
              <p>Partners</p>
              <p>Blogs</p>
            </div>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-white font-bold mb-5">Company</h4>

            <div className="space-y-3 text-[#f3e6d7]/70">
              <p>About Us</p>
              <p>Privacy Policy</p>
              <p>Terms of Service</p>
              <p>Contact</p>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-bold mb-5">Contact</h4>

            <div className="space-y-3 text-[#f3e6d7]/70">
              <p>Lahore, Pakistan</p>
              <p>support@gymkey.com</p>
              <p>+92 300 0000000</p>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-white/10 text-center text-[#f3e6d7]/50 text-sm">
          © 2026 GymKey. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
