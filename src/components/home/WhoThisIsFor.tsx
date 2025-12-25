'use client';
import React, { useId } from 'react';
import { motion } from 'framer-motion';

// GridPattern Component
interface GridPatternProps {
  width?: number;
  height?: number;
  x?: number;
  y?: number;
  squares?: Array<[x: number, y: number]>;
  strokeDasharray?: string;
  className?: string;
  [key: string]: unknown;
}

function GridPattern({
  width = 40,
  height = 40,
  x = -1,
  y = -1,
  strokeDasharray = "0",
  squares,
  className,
  ...props
}: GridPatternProps) {
  const id = useId();

  return (
    <svg
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 h-full w-full fill-white/10 stroke-white/20 ${className || ''}`}
      {...props}
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
          <path
            d={`M.5 ${height}V.5H${width}`}
            fill="none"
            strokeDasharray={strokeDasharray}
          />
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

export default function WhoThisIsForSection() {
  return (
    <section className="relative pb-10 md:pb-20 bg-black overflow-hidden">
      {/* Animated Grid Pattern Background */}
      <GridPattern
        width={40}
        height={40}
        x={-1}
        y={-1}
        squares={[
          [3, 3],
          [7, 2],
          [12, 5],
          [16, 8],
          [20, 4],
          [24, 11],
          [28, 6],
          [32, 14],
        ]}
        className="[mask-image:radial-gradient(900px_circle_at_center,white,transparent)]"
      />
      
      <div className="relative z-10 mx-auto w-full max-w-7xl px-6 lg:px-8">
        {/* Section Header */}
        <div className="mx-auto max-w-3xl text-center mb-20">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 px-4 py-1.5 text-xs text-white/90">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
            </span>
            Perfect Fit Assessment
          </div>
          
          <h2 className="text-3xl font-bold tracking-tight text-white md:text-4xl lg:text-5xl mb-4">
            Who This Is
            <br />
            <span className="bg-gradient-to-r from-white via-gray-100 to-white/80 bg-clip-text text-transparent">
              Perfect For
            </span>
          </h2>
          
          <p className="text-lg text-white/70 font-light">
            We're selective about who we work with to ensure mutual success
          </p>
        </div>

        {/* Two Column Layout - Full Width */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 max-w-5xl mx-auto">
          {/* Left Side - Perfect For */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="relative flex items-center justify-center"
          >
            <div className="w-full max-w-md">
              <img
                src="/c1.png"
                alt="Perfect for growing startups and businesses"
                className="w-full h-auto object-contain"
              />
            </div>
          </motion.div>

          {/* Right Side - Not For */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="relative flex items-center justify-center"
          >
            <div className="w-full max-w-md">
              <img
                src="/c2.png"
                alt="Not for one-time or DIY users"
                className="w-full h-auto object-contain"
              />
            </div>
          </motion.div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <p className="text-white/70 text-sm">
            Not sure if we're the right fit?{' '}
            <a href="/contact" className="text-white underline hover:text-white/80 transition-colors">
              Let's talk
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}