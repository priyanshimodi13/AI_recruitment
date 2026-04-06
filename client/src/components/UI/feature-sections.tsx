import React from "react";
import { Zap, Paintbrush, Settings } from "lucide-react";

export function FeatureSectionsImage() {
  return (
    <section className="w-full py-16">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <h1 className="text-4xl font-semibold text-white">Powerful Features</h1>
        <p className="text-lg text-slate-400 mt-4">
          Everything you need to manage, track, and grow your career, securely and efficiently.
        </p>
      </div>

      {/* Card Block */}
      <div className="flex flex-wrap items-start justify-center gap-10">
        <div className="max-w-80 group hover:-translate-y-2 transition duration-300">
          <div className="rounded-xl overflow-hidden shadow-lg shadow-purple-500/10">
            <img
              className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
              src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800"
              alt="Data Insights"
            />
          </div>
          <h3 className="text-lg font-semibold text-white mt-6">Feedback analyser</h3>
          <p className="text-sm text-slate-400 mt-2">
            Get instant insights into your career with live dashboards and AI analysis.
          </p>
        </div>

        <div className="max-w-80 group hover:-translate-y-2 transition duration-300">
          <div className="rounded-xl overflow-hidden shadow-lg shadow-purple-500/10">
            <img
              className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
              src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=800"
              alt="User Management"
            />
          </div>
          <h3 className="text-lg font-semibold text-white mt-6">User management</h3>
          <p className="text-sm text-slate-400 mt-2">
            Control your privacy and seamlessly adapt your resume to every job.
          </p>
        </div>

        <div className="max-w-80 group hover:-translate-y-2 transition duration-300">
          <div className="rounded-xl overflow-hidden shadow-lg shadow-purple-500/10">
            <img
              className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
              src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800"
              alt="Performance"
            />
          </div>
          <h3 className="text-lg font-semibold text-white mt-6">Better tracking</h3>
          <p className="text-sm text-slate-400 mt-2">
            Never lose track of your applications with built-in ATS integration.
          </p>
        </div>
      </div>
    </section>
  );
}


export function FeatureSectionsBlocks() {
  const featuresData = [
    {
      icon: <Zap className="text-purple-500 w-8 h-8 mt-4" aria-hidden="true" />,
      title: "Lightning-fast setup",
      description: "Launch production-ready resumes in minutes with AI-assisted generation.",
    },
    {
      icon: <Paintbrush className="text-purple-500 w-8 h-8 mt-4" aria-hidden="true" />,
      title: "Pixel perfect",
      description: "Modern CVs that easily bypass recruiter Applicant Tracking Systems.",
    },
    {
      icon: <Settings className="text-purple-500 w-8 h-8 mt-4" aria-hidden="true" />,
      title: "Highly customizable",
      description: "Adjust your career story with single-click AI optimization checks.",
    },
  ];

  return (
    <section className="w-full py-24">
      {/* Header */}
      <div className="text-center">
        <p className="font-medium text-purple-400 px-6 py-1.5 rounded-full bg-purple-950/50 border border-purple-800/50 w-max mx-auto shadow-lg shadow-purple-500/20">
          Features
        </p>
        <h2 className="text-4xl lg:text-5xl font-semibold mt-8 text-white relative inline-block">
          Built for builders
          <div className="absolute -bottom-2 delay-100 left-0 w-full h-1 bg-gradient-to-r from-purple-600 to-transparent"></div>
        </h2>
        <p className="mt-6 text-lg text-slate-400 max-w-xl mx-auto">
          Components, patterns and pages — everything you need to ship your career to the next level.
        </p>
      </div>

      {/* Cards */}
      <div className="mt-16 px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 place-items-center max-w-6xl mx-auto">
        {featuresData.map((feature, index) => (
          <div
            key={index}
            className={`hover:-translate-y-2 hover:shadow-[0_0_30px_rgba(147,51,234,0.3)] transition-all duration-300 w-full ${
              index === 1
                ? "p-[2px] rounded-[17px] bg-gradient-to-br from-[#A46BFF] to-[#33507C]"
                : "p-[1px] rounded-[17px] bg-gradient-to-br from-white/10 to-white/5"
            }`}
          >
            <div className="p-8 rounded-2xl space-y-5 h-full bg-[#0f172a] text-white">
              <div className="bg-purple-500/10 w-max p-3 rounded-xl border border-purple-500/20">
                 {feature.icon}
              </div>
              <h3 className="text-xl font-bold">{feature.title}</h3>
              <p className="text-slate-400 leading-relaxed text-base pb-2">
                {feature.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
