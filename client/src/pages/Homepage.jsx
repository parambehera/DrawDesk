

import React from "react";
import { useNavigate } from "react-router-dom";

export default function HomePage() {
  const navigate = useNavigate();
  const goToDashboard = () => {
    navigate("/dashboard");
  };

  return (
    <main className="min-h-screen w-full bg-linear-to-b from-[#f5f9ff] via-[#eef4ff] to-[#f7fbff]">
      {/* Full width wrapper */}
      <div className="w-full">
        {/* Full width main card */}
        <div className="w-full rounded-none bg-white/60 backdrop-blur-xl shadow-[0_30px_80px_rgba(0,0,0,0.08)] border-y border-white/70 overflow-hidden">
          {/* HERO */}
          <section className="w-full px-6 md:px-14 lg:px-20 pb-10 pt-10">
            <div className="rounded-3xl bg-white/70 border border-white shadow-sm p-8 md:p-12">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
                {/* Left Text */}
                <div>
                  <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight">
                    Collaborate Live:
                    <br />
                    DrawDesk
                    <br />
                    Made Simple
                  </h1>

                  <p className="mt-6 text-gray-600 text-lg max-w-md">
                    Brainstorm, plan, and design together with a smooth real-time
                    whiteboard experience.
                  </p>

                  <p className="mt-4 text-gray-500">
                    Start instantly. Share with friends. Build faster.
                  </p>

                  {/* Buttons */}
                  <div className="mt-7 flex flex-col sm:flex-row gap-4">
                    <button
                      onClick={goToDashboard}
                      className="px-6 py-3 rounded-xl bg-linear-to-r from-blue-600 to-indigo-600 text-white font-semibold shadow-md hover:shadow-lg hover:scale-[1.02] transition"
                    >
                      Get Started
                    </button>

                    <button
                      onClick={() =>
                        document
                          .getElementById("features")
                          ?.scrollIntoView({ behavior: "smooth" })
                      }
                      className="px-6 py-3 rounded-xl bg-white border border-gray-200 text-gray-700 font-semibold shadow-sm hover:shadow-md transition"
                    >
                      Explore Features
                    </button>
                  </div>

                  {/* Extra CTA in body */}
                 
                </div>

                {/* Right Illustration */}
                <div className="flex justify-center md:justify-end">
                  <div className="relative w-full max-w-md">
                    <img
                      src="/hero.png"
                      alt="Collaboration illustration"
                      className="w-full drop-shadow-xl"
                    />

                    {/* Soft blob behind */}
                    <div className="absolute -z-10 -right-6 -top-6 h-64 w-64 rounded-full bg-linear-to-br from-blue-200 via-indigo-200 to-purple-200 blur-2xl opacity-70" />
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* FEATURES */}
          <section
            id="features"
            className="w-full px-6 md:px-14 lg:px-20 pb-12"
          >
            <div className="flex items-end justify-between gap-6 mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Features</h2>
                <p className="text-gray-600 mt-1">
                  Everything you need to create and share ideas visually.
                </p>
              </div>

              <div className="hidden md:block">
                <button
                  onClick={goToDashboard}
                  className="px-5 py-2 rounded-xl bg-white border border-gray-200 text-gray-700 font-semibold shadow-sm hover:shadow-md transition"
                >
                  Open Dashboard
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <FeatureCard
                icon="✍️"
                title="Real-time Whiteboard"
                desc="Draw, write, and brainstorm together instantly"
              />
              <FeatureCard
                icon="📤"
                title="Export as PNG"
                desc="Download your whiteboard as a clean PNG anytime"
              />
              <FeatureCard
                icon="🔗"
                title="Share Board Link"
                desc="Send the board link and collaborate with anyone"
              />
              <FeatureCard
                icon="📌"
                title="Sticky Notes & Shapes"
                desc="Explain ideas faster using notes, arrows and shapes"
              />
              <FeatureCard
                icon="♾️"
                title="Unlimited Boards"
                desc="Create as many boards as you want without limits"
              />
              <FeatureCard
                icon="⚡"
                title="Smooth Experience"
                desc="Fast, responsive UI designed for clean collaboration"
              />
            </div>

            {/* Bottom Get Started Button */}
            <div className="mt-10 flex justify-center">
              <button
                onClick={goToDashboard}
                className="px-8 py-3 rounded-2xl bg-linear-to-r from-blue-600 to-indigo-600 text-white font-bold shadow-md hover:shadow-xl hover:scale-[1.02] transition cursor-pointer"
              >
                Get Started Now
              </button>
            </div>
          </section>

          {/* FOOTER */}
          <footer className="w-full px-6 md:px-14 lg:px-20 py-8 border-t border-gray-200 bg-white/40">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              {/* Footer left */}
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-xl bg-linear-to-br from-blue-500 to-indigo-500 flex items-center justify-center shadow-md">
                  <span className="text-white font-bold text-lg">D</span>
                </div>
                <span className="text-xl font-semibold text-gray-900">
                    DrawDesk
                </span>
              </div>

              {/* Footer links */}
              <div className="flex flex-wrap gap-x-10 gap-y-2 text-gray-600 font-medium">
                <FooterCol title="Product" links={["Features", "Dashboard"]} />
                <FooterCol title="Company" links={["Integrations", "About"]} />
                <FooterCol title="Support" links={["Contact", "Help Center"]} />
                <FooterCol title="Legal" links={["Terms of Service", "Privacy Policy"]} />
              </div>

              {/* Social icons */}
              <div className="flex items-center gap-4">
                <SocialIcon label="Twitter" />
                <SocialIcon label="LinkedIn" />
                <SocialIcon label="Facebook" />
              </div>
            </div>
          </footer>
        </div>
      </div>
    </main>
  );
}

/* ------------------ Components ------------------ */

function FeatureCard({ icon, title, desc }) {
  return (
    <div className="group rounded-2xl bg-white shadow-sm border border-gray-100 p-6 hover:shadow-lg hover:-translate-y-1 transition duration-300">
      <div className="flex items-start gap-4">
        <div className="h-12 w-12 rounded-xl bg-blue-50 flex items-center justify-center text-xl group-hover:scale-110 transition">
          {icon}
        </div>
        <div>
          <h3 className="font-bold text-gray-900">{title}</h3>
          <p className="text-gray-600 mt-1">{desc}</p>
        </div>
      </div>
    </div>
  );
}

function FooterCol({ title, links }) {
  return (
    <div className="min-w-[130px]">
      <p className="text-gray-900 font-semibold">{title}</p>
      <div className="mt-2 flex flex-col gap-1">
        {links.map((l) => (
          <a
            key={l}
            href={l === "Dashboard" ? "/dashboard" : "#"}
            className="text-gray-600 hover:text-blue-600 transition"
          >
            {l}
          </a>
        ))}
      </div>
    </div>
  );
}

function SocialIcon({ label }) {
  return (
    <button
      className="h-10 w-10 rounded-full bg-white border border-gray-200 shadow-sm hover:shadow-md transition flex items-center justify-center text-gray-600"
      aria-label={label}
    >
      {label === "Twitter" ? "𝕏" : label === "LinkedIn" ? "in" : "f"}
    </button>
  );
}
