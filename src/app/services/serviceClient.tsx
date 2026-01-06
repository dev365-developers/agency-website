'use client';
import React from 'react';
import { Check } from 'lucide-react';



// GridPattern Component
function GridPattern({ 
  width = 40, 
  height = 40, 
  x = -1, 
  y = -1, 
  squares = [] as [number, number][], 
  className = '' 
}: {
  width?: number;
  height?: number;
  x?: number;
  y?: number;
  squares?: [number, number][];
  className?: string;
}) {
  const id = React.useId();

  return (
    <svg
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 h-full w-full fill-white/10 stroke-white/20 ${className}`}
    >
      <defs>
        <pattern
          id={id}
          width={width}
          height={height}
          patternUnits="userSpaceOnUse"
          x={x}
          y={y}
        >
          <path d={`M.5 ${height}V.5H${width}`} fill="none" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" strokeWidth={0} fill={`url(#${id})`} />
      {squares && (
        <svg x={x} y={y} className="overflow-visible">
          {squares.map(([x, y]) => (
            <rect
              strokeWidth="0"
              key={`${x}-${y}`}
              width={width - 1}
              height={height - 1}
              x={x * width + 1}
              y={y * height + 1}
            />
          ))}
        </svg>
      )}
    </svg>
  );
}

const FeatureTitle = ({ children }: { children?: React.ReactNode }) => {
  return (
    <p className="max-w-5xl text-left tracking-tight text-white text-xl md:text-2xl md:leading-snug font-semibold">
      {children}
    </p>
  );
};

const FeatureDescription = ({ children }: { children?: React.ReactNode }) => {
  return (
    <p className="text-sm md:text-base max-w-sm text-left text-white/70 my-2">
      {children}
    </p>
  );
};

// Service Image Component
const ServiceImage = ({ imageUrl, alt }: { imageUrl: string; alt: string }) => {
  return (
    <div className="relative flex py-8 px-4 h-full justify-center items-center">
      <div className="w-full max-w-md mx-auto rounded-lg overflow-hidden shadow-2xl">
        <img 
          src={imageUrl} 
          alt={alt}
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
};

export default function ServicesPage() {
  const features = [
    {
      title: "Website Design & Development",
      description: "Custom-built websites tailored to your business. We create modern, fast, and conversion-focused digital experiences.",
      imageUrl: "/services1.png",
      alt: "Website Design and Development",
      className: "col-span-1 md:col-span-4 lg:col-span-4 border-b md:border-r border-white/10",
    },
    {
      title: "Hosting, Maintenance & Security",
      description: "We don't just deliver your website and disappear — we run it for you. Complete infrastructure management.",
      imageUrl: "/services2.png",
      alt: "Hosting, Maintenance & Security",
      className: "col-span-1 md:col-span-2 lg:col-span-2 border-b border-white/10",
    },
    {
      title: "Ongoing Updates & Support",
      description: "Continuous improvements without surprise invoices. Regular updates through our flexible subscription model.",
      imageUrl: "/services3.png",
      alt: "Ongoing Updates & Support",
      className: "col-span-1 md:col-span-3 lg:col-span-3 border-b md:border-r border-white/10",
    },
    {
      title: "Growth & Optimization",
      description: "Your website grows with your business. Continuous performance, SEO, and UX optimization.",
      imageUrl: "/services4.png",
      alt: "Growth & Optimization",
      className: "col-span-1 md:col-span-3 lg:col-span-3 border-b md:border-none border-white/10",
    },
  ];

  return (
    <div className="min-h-screen bg-black">
      {/* Hero Section */}
      <section className="relative py-10 lg:py-20 bg-black overflow-hidden">
        <GridPattern
          width={40}
          height={40}
          x={-1}
          y={-1}
          squares={[
            [4, 4], [5, 1], [8, 2], [6, 6], [10, 3], [12, 8],
            [15, 5], [18, 12], [20, 7], [22, 15], [25, 10], [28, 18],
          ]}
          className="[mask-image:radial-gradient(400px_circle_at_center,white,transparent)] sm:[mask-image:radial-gradient(800px_circle_at_center,white,transparent)]"
        />
        
        <div className="relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="px-8">
            <h4 className="text-3xl lg:text-5xl lg:leading-tight max-w-5xl mx-auto text-center tracking-tight font-medium text-white">
              We build websites.
              <br />
              Then we run them for you.
            </h4>

            <p className="text-sm lg:text-base max-w-2xl my-4 mx-auto text-white/70 text-center font-normal">
              Professional website development with complete hosting, maintenance, and growth services. 
              No surprises, no hassle — just a website that works.
            </p>
          </div>
        </div>
      </section>

      {/* Services Bento Grid */}
      <section className="relative pb-20 bg-black">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="relative">
            <div className="grid grid-cols-1 md:grid-cols-6 lg:grid-cols-6 xl:border rounded-md border-white/10">
              {features.map((feature) => (
                <div key={feature.title} className={`p-4 sm:p-8 relative overflow-hidden ${feature.className}`}>
                  <FeatureTitle>{feature.title}</FeatureTitle>
                  <FeatureDescription>{feature.description}</FeatureDescription>
                  <ServiceImage imageUrl={feature.imageUrl} alt={feature.alt} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Why Subscription - Comparison */}
      {/* <section className="relative py-16 bg-black">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4">
              Why Subscription Over One-Time Build?
            </h2>
            <p className="text-base sm:text-lg text-white/70 max-w-2xl mx-auto">
              Traditional agencies charge tens of thousands upfront, then disappear. We believe in a better model.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            <div className="relative overflow-hidden rounded-md border border-red-500/30 bg-red-500/5 p-8 backdrop-blur-sm">
              <div className="absolute top-4 right-4">
                <span className="text-red-400 text-2xl">✗</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-6">Traditional One-Time</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3 text-sm text-white/70">
                  <span className="text-red-400 mt-0.5">•</span>
                  <span>₹50,000 - ₹2,00,000 upfront</span>
                </li>
                <li className="flex items-start gap-3 text-sm text-white/70">
                  <span className="text-red-400 mt-0.5">•</span>
                  <span>Agency disappears after launch</span>
                </li>
                <li className="flex items-start gap-3 text-sm text-white/70">
                  <span className="text-red-400 mt-0.5">•</span>
                  <span>Hourly rates for every small change</span>
                </li>
                <li className="flex items-start gap-3 text-sm text-white/70">
                  <span className="text-red-400 mt-0.5">•</span>
                  <span>Security & updates = extra cost</span>
                </li>
                <li className="flex items-start gap-3 text-sm text-white/70">
                  <span className="text-red-400 mt-0.5">•</span>
                  <span>Hosting issues? Not their problem</span>
                </li>
              </ul>
            </div>

            <div className="relative overflow-hidden rounded-md border border-green-400/30 bg-green-400/5 p-8 backdrop-blur-sm">
              <div className="absolute top-4 right-4">
                <span className="text-green-400 text-2xl">✓</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-6">Our Subscription</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3 text-sm text-white/70">
                  <Check className="h-5 w-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <span>From ₹599/month, predictable</span>
                </li>
                <li className="flex items-start gap-3 text-sm text-white/70">
                  <Check className="h-5 w-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <span>We're your long-term partner</span>
                </li>
                <li className="flex items-start gap-3 text-sm text-white/70">
                  <Check className="h-5 w-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <span>Regular updates included</span>
                </li>
                <li className="flex items-start gap-3 text-sm text-white/70">
                  <Check className="h-5 w-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <span>Security, hosting, backups covered</span>
                </li>
                <li className="flex items-start gap-3 text-sm text-white/70">
                  <Check className="h-5 w-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <span>We fix it, you don't worry</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section> */}
    </div>
  );
}