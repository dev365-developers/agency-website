'use client';

import React from 'react';
import { Check } from 'lucide-react';

export default function WhySection() {
  const problems = [
    {
      title: 'Agencies charge ₹50k–₹2L upfront',
      description: 'Massive initial investment before you even see results'
    },
    {
      title: 'Hidden maintenance costs',
      description: 'Surprise bills for updates, security patches, and bug fixes'
    },
    {
      title: 'Hosting & updates are extra',
      description: 'You\'re left managing technical details you never signed up for'
    },
    {
      title: 'Developers disappear after delivery',
      description: 'Good luck getting support when something breaks'
    }
  ];

  return (
    <section className="relative w-full bg-black py-12 sm:py-16 lg:py-20 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 -left-1/4 w-64 h-64 sm:w-96 sm:h-96 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-1/4 w-64 h-64 sm:w-96 sm:h-96 bg-white/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Two Column Layout */}
        <div className="grid md:grid-cols-2 gap-8 sm:gap-10 lg:gap-16 xl:gap-20 items-center">
          {/* Left - Content */}
          <div className="space-y-6 sm:space-y-8">
            {/* Main Headline */}
            <div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-3 sm:mb-4 leading-tight">
                Why Pay More<br />When You Can Pay Less?
              </h2>
              <p className="text-base sm:text-lg text-white/60">
                Traditional agencies force you to pay thousands upfront. We built a better way.
              </p>
            </div>

            {/* Problems List */}
            <div className="space-y-4 sm:space-y-6 pt-2 sm:pt-4">
              {problems.map((problem, index) => (
                <div key={index} className="flex gap-3 sm:gap-4">
                  <div className="flex-shrink-0 mt-0.5 sm:mt-1">
                    <Check className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold mb-1 text-base sm:text-lg">
                      {problem.title}
                    </h3>
                    <p className="text-sm sm:text-base text-white/60 leading-relaxed">
                      {problem.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right - Image */}
          <div className="relative w-full">
            {/* Image Container with Aspect Ratio */}
            <div className="relative w-full aspect-[4/3] sm:aspect-[16/10] md:aspect-[4/3] lg:aspect-video overflow-hidden">
              <img
                src="/why.png"
                alt="Modern web development"
                className="w-full h-full object-cover object-center opacity-70"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}