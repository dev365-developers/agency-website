"use client";
import React, { useEffect, useRef, useState } from "react";
import { UserPlus, FileText, Palette, Rocket, RefreshCw, Check } from "lucide-react";

// Simplified scroll progress hook
function useScrollProgress(containerRef: React.RefObject<HTMLDivElement | null>) {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      
      const container = containerRef.current;
      const rect = container.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      const start = rect.top + window.scrollY - windowHeight * 0.1;
      const end = rect.top + window.scrollY + rect.height - windowHeight * 0.5;
      const current = window.scrollY;
      
      const progress = Math.max(0, Math.min(1, (current - start) / (end - start)));
      setScrollProgress(progress);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [containerRef]);

  return scrollProgress;
}

interface TimelineEntry {
  icon: React.ElementType;
  number: string;
  title: string;
  description: string;
  highlight: string;
  content: React.ReactNode;
}

const steps: TimelineEntry[] = [
  {
    icon: UserPlus,
    number: "01",
    title: "Sign Up & Login",
    description: "Create your account in minutes with just your email. No credit card required to get started.",
    highlight: "Quick & easy setup",
    content: (
      <div>
        <p className="text-white/70 text-xs md:text-sm font-normal mb-8">
          Getting started is simple. Sign up with your email, verify your account, and you're ready to request your website.
        </p>
        <div className="mb-8">
          <div className="flex gap-2 items-center text-white/60 text-xs md:text-sm mb-2">
            <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
            No credit card needed
          </div>
          <div className="flex gap-2 items-center text-white/60 text-xs md:text-sm mb-2">
            <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
            Email verification only
          </div>
          <div className="flex gap-2 items-center text-white/60 text-xs md:text-sm mb-2">
            <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
            Instant access to dashboard
          </div>
        </div>
      </div>
    ),
  },
  {
    icon: FileText,
    number: "02",
    title: "Request a Website",
    description: "Fill out a simple form telling us about your business, goals, and design preferences. The more details, the better.",
    highlight: "Tell us your vision",
    content: (
      <div>
        <p className="text-white/70 text-xs md:text-sm font-normal mb-8">
          Share your business requirements, target audience, preferred colors, and any specific features you need. Our team reviews every detail.
        </p>
        <div className="mb-8">
          <div className="flex gap-2 items-center text-white/60 text-xs md:text-sm mb-2">
            <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
            Simple questionnaire
          </div>
          <div className="flex gap-2 items-center text-white/60 text-xs md:text-sm mb-2">
            <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
            Upload logos & brand assets
          </div>
          <div className="flex gap-2 items-center text-white/60 text-xs md:text-sm mb-2">
            <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
            Share reference websites
          </div>
          <div className="flex gap-2 items-center text-white/60 text-xs md:text-sm mb-2">
            <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
            Specify key features needed
          </div>
        </div>
      </div>
    ),
  },
  {
    icon: Palette,
    number: "03",
    title: "We Build It for Free",
    description: "Our expert team designs and develops your custom website at no upfront cost. You only start paying once you're happy and ready to launch.",
    highlight: "Zero upfront investment",
    content: (
      <div>
        <p className="text-white/70 text-xs md:text-sm font-normal mb-4">
          Our designers and developers bring your vision to life. We handle everything from design mockups to full development, testing, and quality assurance.
        </p>
        <p className="text-white/70 text-xs md:text-sm font-normal mb-8">
          Review the website, request unlimited revisions, and approve only when it's perfect.
        </p>
        <div className="mb-8">
          <div className="flex gap-2 items-center text-white/60 text-xs md:text-sm mb-2">
            <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
            Custom design from scratch
          </div>
          <div className="flex gap-2 items-center text-white/60 text-xs md:text-sm mb-2">
            <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
            Mobile-responsive development
          </div>
          <div className="flex gap-2 items-center text-white/60 text-xs md:text-sm mb-2">
            <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
            SEO optimization included
          </div>
          <div className="flex gap-2 items-center text-white/60 text-xs md:text-sm mb-2">
            <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
            Unlimited revision rounds
          </div>
          <div className="flex gap-2 items-center text-white/60 text-xs md:text-sm mb-2">
            <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
            Quality testing before launch
          </div>
        </div>
      </div>
    ),
  },
  {
    icon: Rocket,
    number: "04",
    title: "Launch & Go Live",
    description: "Once approved, we deploy your website to our high-performance hosting platform. Your site goes live within hours.",
    highlight: "Fast deployment",
    content: (
      <div>
        <p className="text-white/70 text-xs md:text-sm font-normal mb-8">
          We handle all technical aspects including domain setup, SSL certificates, hosting configuration, and initial launch. You just sit back and watch your website come to life.
        </p>
        <div className="mb-8">
          <div className="flex gap-2 items-center text-white/60 text-xs md:text-sm mb-2">
            <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
            Secure HTTPS included
          </div>
          <div className="flex gap-2 items-center text-white/60 text-xs md:text-sm mb-2">
            <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
            Fast global CDN
          </div>
          <div className="flex gap-2 items-center text-white/60 text-xs md:text-sm mb-2">
            <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
            99.9% uptime guarantee
          </div>
          <div className="flex gap-2 items-center text-white/60 text-xs md:text-sm mb-2">
            <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
            Automatic backups
          </div>
        </div>
      </div>
    ),
  },
  {
    icon: RefreshCw,
    number: "05",
    title: "Pay Monthly",
    description: "Simple subscription keeps your site live, maintained, and updated. Cancel anytime with no penalties or hidden fees.",
    highlight: "Affordable & flexible",
    content: (
      <div>
        <p className="text-white/70 text-xs md:text-sm font-normal mb-4">
          Your monthly subscription covers hosting, maintenance, security updates, technical support, and minor content changes. Everything you need to keep your website running smoothly.
        </p>
        <div className="mb-8">
          <div className="flex gap-2 items-center text-white/60 text-xs md:text-sm mb-2">
            <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
            All-inclusive hosting
          </div>
          <div className="flex gap-2 items-center text-white/60 text-xs md:text-sm mb-2">
            <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
            Regular security patches
          </div>
          <div className="flex gap-2 items-center text-white/60 text-xs md:text-sm mb-2">
            <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
            Minor content updates
          </div>
          <div className="flex gap-2 items-center text-white/60 text-xs md:text-sm mb-2">
            <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
            24/7 technical support
          </div>
          <div className="flex gap-2 items-center text-white/60 text-xs md:text-sm mb-2">
            <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
            Performance monitoring
          </div>
          <div className="flex gap-2 items-center text-white/60 text-xs md:text-sm mb-2">
            <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
            Cancel anytime, no lock-in
          </div>
        </div>
      </div>
    ),
  },
];

export default function HowItWorksSection() {
  const ref = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);
  const scrollProgress = useScrollProgress(containerRef);

  useEffect(() => {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      setHeight(rect.height);
    }
  }, [ref]);

  return (
    <div
      className="relative w-full bg-black font-sans md:px-10"
      ref={containerRef}
    >
      {/* Header Section */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-10">
        <div className="text-center max-w-3xl mx-auto mb-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm mb-6">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-sm font-medium text-white/70">
              Simple Process
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 text-white leading-tight">
            How It Works
          </h2>
          <p className="text-white/60 text-sm sm:text-base md:text-lg max-w-2xl mx-auto">
            From signup to launch in 5 simple steps. No technical knowledge required, no upfront costs, just a website that works.
          </p>
        </div>
      </div>

      {/* Timeline Section */}
      <div ref={ref} className="relative max-w-7xl mx-auto pb-20">
        {steps.map((item, index) => (
          <div
            key={index}
            className="flex justify-start pt-5 md:pt-30 md:gap-10"
          >
            <div className="sticky flex flex-col md:flex-row z-40 items-center top-40 self-start max-w-xs lg:max-w-sm md:w-full">
              <div className="h-10 absolute left-3 md:left-3 w-10 rounded-full bg-black flex items-center justify-center border-2 border-white/10">
                <div className="h-6 w-6 rounded-full bg-gradient-to-br from-white/20 to-white/10 flex items-center justify-center">
                  {React.createElement(item.icon, { className: "w-3 h-3 text-white" })}
                </div>
              </div>
              <h3 className="hidden md:block text-xl md:pl-20 md:text-5xl font-bold text-white/50">
                {item.title}
              </h3>
            </div>

            <div className="relative pl-20 pr-4 md:pl-4 w-full">
              <h3 className="md:hidden block text-2xl mb-4 text-left font-bold text-white/50">
                {item.title}
              </h3>

              {/* Card Content */}
              <div className="group relative p-6 rounded-xl overflow-hidden transition-all duration-300 border border-white/10 bg-white/5 backdrop-blur-sm hover:bg-white/10 hover:border-white/20 mb-8">
                {/* Dot pattern background */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[length:4px_4px]" />
                </div>

                <div className="relative flex flex-col space-y-3 mb-4">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-white/10 group-hover:bg-white/20 transition-all duration-300">
                      {React.createElement(item.icon, { className: "w-5 h-5 text-white" })}
                    </div>
                    <span className="text-3xl font-bold text-white/20">
                      {item.number}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm text-white/60 leading-snug font-[425]">
                      {item.description}
                    </p>
                  </div>

                  <div className="pt-2">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/10 backdrop-blur-sm group-hover:bg-white/20 transition-colors duration-300">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                      <span className="text-xs font-medium text-white/70">
                        {item.highlight}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Content */}
                {item.content}

                {/* Gradient border effect */}
                <div className="absolute inset-0 -z-10 rounded-xl p-px bg-gradient-to-br from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            </div>
          </div>
        ))}

        {/* Animated Line */}
        <div
          style={{
            height: height + "px",
          }}
          className="absolute md:left-8 left-8 top-0 overflow-hidden w-[2px] bg-[linear-gradient(to_bottom,var(--tw-gradient-stops))] from-transparent from-[0%] via-white/20 to-transparent to-[99%] [mask-image:linear-gradient(to_bottom,transparent_0%,black_10%,black_90%,transparent_100%)]"
        >
          <div 
            className="absolute inset-x-0 top-0 w-[2px] bg-gradient-to-t from-white via-white/50 to-transparent from-[0%] via-[10%] rounded-full transition-all duration-300 ease-out"
            style={{
              height: `${scrollProgress * 100}%`,
              opacity: Math.min(scrollProgress * 2, 1),
            }}
          />
        </div>
      </div>
    </div>
  );
}