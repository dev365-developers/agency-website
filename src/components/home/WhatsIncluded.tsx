"use client"

import React from 'react';
import { Palette, Zap, Globe, Wrench, Shield, Smartphone, TrendingUp, MessageSquare } from 'lucide-react';

type FeatureType = {
  title: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  description: string;
};

type FeatureCardProps = React.ComponentProps<'div'> & {
  feature: FeatureType;
};

function FeatureCard({ feature, className, ...props }: FeatureCardProps) {
  const [pattern, setPattern] = React.useState<number[][]>([]);

  React.useEffect(() => {
    setPattern(genRandomPattern());
  }, []);

  return (
    <div className={`relative overflow-hidden p-6 bg-black backdrop-blur-sm border border-white/[0.08] hover:bg-white/[0.04] hover:border-white/[0.12] transition-all duration-300 ${className || ''}`} {...props}>
      <div className="pointer-events-none absolute top-0 left-1/2 -mt-2 -ml-20 h-full w-full [mask-image:linear-gradient(white,transparent)]">
        <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-white/10 [mask-image:radial-gradient(farthest-side_at_top,white,transparent)] opacity-100">
          <GridPattern
            width={20}
            height={20}
            x="-12"
            y="4"
            squares={pattern}
            className="absolute inset-0 h-full w-full mix-blend-overlay fill-white/5 stroke-white/25"
          />
        </div>
      </div>
      <feature.icon className="size-6 text-white/75" strokeWidth={1.5} aria-hidden />
      <h3 className="mt-6 text-base font-semibold text-white">{feature.title}</h3>
      <p className="relative z-20 mt-2 text-sm font-light text-white/60 leading-relaxed">{feature.description}</p>
    </div>
  );
}

function GridPattern({
  width,
  height,
  x,
  y,
  squares,
  ...props
}: React.ComponentProps<'svg'> & { width: number; height: number; x: string; y: string; squares?: number[][] }) {
  const patternId = React.useId();

  return (
    <svg aria-hidden="true" {...props}>
      <defs>
        <pattern id={patternId} width={width} height={height} patternUnits="userSpaceOnUse" x={x} y={y}>
          <path d={`M.5 ${height}V.5H${width}`} fill="none" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" strokeWidth={0} fill={`url(#${patternId})`} />
      {squares && squares.length > 0 && (
        <svg x={x} y={y} className="overflow-visible">
          {squares.map(([x, y], index) => (
            <rect strokeWidth="0" key={index} width={width + 1} height={height + 1} x={x * width} y={y * height} />
          ))}
        </svg>
      )}
    </svg>
  );
}

function genRandomPattern(length?: number): number[][] {
  length = length ?? 5;
  return Array.from({ length }, () => [
    Math.floor(Math.random() * 4) + 7,
    Math.floor(Math.random() * 6) + 1,
  ]);
}

const features: FeatureType[] = [
  {
    title: 'Custom Website Design',
    icon: Palette,
    description: 'A unique, professionally designed website tailored to your brand and business goals.',
  },
  {
    title: 'Fast Performance',
    icon: Zap,
    description: 'Optimized for speed with lightning-fast load times that keep visitors engaged.',
  },
  {
    title: 'Domain & Hosting',
    icon: Globe,
    description: 'Premium hosting infrastructure and domain management included in your subscription.',
  },
  {
    title: 'Maintenance & Updates',
    icon: Wrench,
    description: 'Regular updates, bug fixes, and improvements to keep your site running smoothly.',
  },
  {
    title: 'Security & Backups',
    icon: Shield,
    description: 'Enterprise-grade security measures and automated daily backups for peace of mind.',
  },
  {
    title: 'Mobile Responsive',
    icon: Smartphone,
    description: 'Flawless experience across all devices, from smartphones to desktop computers.',
  },
  {
    title: 'SEO Optimized',
    icon: TrendingUp,
    description: 'Built-in SEO best practices to help your website rank higher in search results.',
  },
  {
    title: 'Support & Changes',
    icon: MessageSquare,
    description: 'Unlimited support and content updates to keep your website fresh and relevant.',
  },
];

export default function WhatsIncluded() {
  return (
    <section className="relative py-20 md:py-32 bg-black overflow-hidden">
      
      <div className="relative z-10 mx-auto w-full max-w-7xl px-6 lg:px-8">
        {/* Section Header */}
        <div className="mx-auto max-w-3xl text-center mb-16">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 px-4 py-1.5 text-xs text-white/90">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
            </span>
            All-Inclusive Package
          </div>
          
          <h2 className="text-3xl font-bold tracking-tight text-white md:text-4xl lg:text-5xl mb-4">
            What's Included in Your
            <br />
            <span className="bg-gradient-to-r from-white via-gray-100 to-white/80 bg-clip-text text-transparent">
              Subscription
            </span>
          </h2>
          
          <p className="text-lg text-white/70 font-light">
            Everything you need to succeed online. No hidden fees, no surprises.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 gap-px bg-white/10 rounded-lg overflow-hidden sm:grid-cols-2 lg:grid-cols-4 mb-12">
          {features.map((feature, i) => (
            <FeatureCard key={i} feature={feature} />
          ))}
        </div>

        {/* Bottom Text */}
        <div className="text-center">
          <p className="text-xl font-semibold text-white mb-2">
            Everything is included. No hidden fees.
          </p>
          <p className="text-white/60 text-sm">
            One simple monthly price covers it all
          </p>
        </div>
      </div>
    </section>
  );
}