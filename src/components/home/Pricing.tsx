'use client';
import React, { useId } from 'react';
import { CheckCircle, Star, Zap, Sparkles, Building2 } from 'lucide-react';
import { motion, Transition } from 'framer-motion';

type FREQUENCY = 'monthly' | 'yearly';
const frequencies: FREQUENCY[] = ['monthly', 'yearly'];

interface Plan {
  name: string;
  info: string;
  price: {
    monthly: number;
    yearly: number;
  };
  features: {
    text: string;
    tooltip?: string;
  }[];
  btn: {
    text: string;
    href: string;
  };
  highlighted?: boolean;
  icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}

const PLANS: Plan[] = [
  {
    name: 'Basic',
    info: 'Best for small businesses & solo founders',
    icon: Zap,
    price: {
      monthly: 599,
      yearly: Math.round(4999 * 12 * 0.85),
    },
    features: [
      { text: 'Website built for free' },
      { text: 'Up to 5 pages' },
      { text: 'Hosting included' },
      { text: 'Monthly maintenance & updates' },
      { text: 'Mobile responsive design' },
      { text: 'Basic SEO setup' },
      { text: 'SSL & security included' },
      { text: '1–2 content changes per month' },
      { text: 'Email support' },
    ],
    btn: {
      text: 'Get Started Free',
      href: '/signup',
    },
  },

  {
    highlighted: true,
    name: 'Pro',
    info: 'Most popular for growing startups',
    icon: Sparkles,
    price: {
      monthly: 3999,
      yearly: Math.round(9999 * 12 * 0.85),
    },
    features: [
      { text: 'Website built for free' },
      { text: 'Unlimited pages' },
      { text: 'Custom design & sections' },
      { text: 'Hosting included' },
      { text: 'Priority support' },
      { text: 'Advanced SEO structure' },
      { text: 'Blog / CMS integration' },
      { text: 'Performance optimization' },
      { text: '5–8 content changes per month' },
    ],
    btn: {
      text: 'Start Building',
      href: '/signup',
    },
  },

  {
    name: 'Enterprise',
    info: 'For large teams & complex requirements',
    icon: Building2,
    price: {
      monthly: 0,
      yearly: 0,
    },
    features: [
      { text: 'Custom pricing based on requirements' },
      { text: 'Fully custom design system' },
      { text: 'Unlimited pages & changes' },
      { text: 'Advanced integrations & APIs' },
      { text: 'Dedicated account manager' },
      { text: 'Custom hosting & scaling setup' },
      { text: 'Security & uptime monitoring' },
      { text: 'SLA-backed support' },
    ],
    btn: {
      text: 'Contact Sales',
      href: '/contact',
    },
  },
];

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

export default function PricingSection() {
  const [frequency, setFrequency] = React.useState<FREQUENCY>('monthly');

  return (
    <section className="relative pb-5 md:pb-10 bg-black overflow-hidden">
      {/* Animated Grid Pattern Background */}
      <GridPattern
        width={40}
        height={40}
        x={-1}
        y={-1}
        squares={[
          [4, 4],
          [5, 1],
          [8, 2],
          [6, 6],
          [10, 3],
          [12, 8],
          [15, 5],
          [18, 12],
          [20, 7],
          [22, 15],
          [25, 10],
          [28, 18],
        ]}
        className="[mask-image:radial-gradient(800px_circle_at_center,white,transparent)]"
      />
      
      <div className="relative z-10 mx-auto w-full max-w-7xl px-6 lg:px-8">
        {/* Section Header */}
        <div className="mx-auto max-w-3xl text-center mb-16">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 px-4 py-1.5 text-xs text-white/90">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
            </span>
            Simple Subscription Pricing
          </div>
          
          <h2 className="text-3xl font-bold tracking-tight text-white md:text-4xl lg:text-5xl mb-4">
            Plans that Scale
            <br />
            <span className="bg-gradient-to-r from-white via-gray-100 to-white/80 bg-clip-text text-transparent">
              with Your Business
            </span>
          </h2>
          
          <p className="text-lg text-white/70 font-light mb-6">
            No hidden fees. No setup costs. Cancel anytime.
          </p>

          {/* Frequency Toggle */}
          <PricingFrequencyToggle frequency={frequency} setFrequency={setFrequency} />
        </div>

        {/* Pricing Cards Grid */}
        <div className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-6 md:grid-cols-3">
          {PLANS.map((plan) => (
            <PricingCard key={plan.name} plan={plan} frequency={frequency} />
          ))}
        </div>

        {/* Important Note */}
        <div className="mt-16 mx-auto max-w-3xl text-center">
          <div className="p-6">
            <p className="text-white/90 text-sm mb-2">
              <strong>Important:</strong> Your website remains active as long as your subscription is active.
            </p>
            <p className="text-white/60 text-xs">
              All plans include hosting, maintenance, security updates, and customer support.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function PricingFrequencyToggle({
  frequency,
  setFrequency,
}: {
  frequency: FREQUENCY;
  setFrequency: React.Dispatch<React.SetStateAction<FREQUENCY>>;
}) {
  return (
    <div className="relative mx-auto flex w-fit rounded-full border border-white/20 bg-white/5 backdrop-blur-sm p-1">
      {frequencies.map((freq) => (
        <button
          key={freq}
          onClick={() => setFrequency(freq)}
          className="relative px-6 py-2 text-sm capitalize text-white/80 transition-colors"
        >
          <span className="relative z-10">{freq}</span>
          {frequency === freq && (
            <motion.span
              layoutId="frequency"
              transition={{ type: 'spring', duration: 0.4 }}
              className="absolute inset-0 z-0 rounded-full bg-white/20"
            />
          )}
        </button>
      ))}
      {frequency === 'yearly' && (
        <div className="absolute -top-8 right-0 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs px-3 py-1 rounded-full font-medium">
          Save 15%
        </div>
      )}
    </div>
  );
}

function PricingCard({ plan, frequency }: { plan: Plan; frequency: FREQUENCY }) {
  const Icon = plan.icon || Zap;
  
  return (
    <div
      className={`relative flex w-full flex-col rounded-2xl border ${
        plan.highlighted 
          ? 'border-white/40 bg-white/[0.08]' 
          : 'border-white/20 bg-white/[0.02]'
      } backdrop-blur-sm transition-all duration-300 hover:bg-white/[0.06] hover:border-white/20`}
    >
      {plan.highlighted && (
        <BorderTrail
          style={{
            boxShadow:
              '0px 0px 60px 30px rgb(255 255 255 / 20%), 0 0 100px 60px rgb(0 0 0 / 50%)',
          }}
          size={100}
        />
      )}

      {/* Card Header */}
      <div className={`rounded-t-2xl border-b ${plan.highlighted ? 'border-white/20 bg-white/[0.05]' : 'border-white/[0.08]'} p-6`}>
        <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
          {plan.highlighted && (
            <p className="bg-gradient-to-r from-white to-white/80 text-black flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold">
              Popular
            </p>
          )}
          {frequency === 'yearly' && plan.price.monthly > 0 && (
            <p className="bg-green-500/20 text-green-300 border border-green-500/30 flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium">
              15% off
            </p>
          )}
        </div>

        <div className="mb-4">
          <Icon className="size-10 text-white/80" strokeWidth={1.5} />
        </div>

        <div className="text-xl font-bold text-white">{plan.name}</div>
        <p className="text-white/60 text-sm font-light mt-1">{plan.info}</p>
        
        <div className="mt-6 flex items-end gap-1">
          {plan.price.monthly === 0 ? (
            <span className="text-3xl font-bold text-white">Custom</span>
          ) : (
            <>
              <span className="text-white/60 text-lg">₹</span>
              <span className="text-4xl font-bold text-white">
                {frequency === 'monthly' 
                  ? plan.price.monthly.toLocaleString('en-IN')
                  : plan.price.yearly.toLocaleString('en-IN')}
              </span>
              <span className="text-white/60 text-sm pb-1">
                /{frequency === 'monthly' ? 'month' : 'year'}
              </span>
            </>
          )}
        </div>
      </div>

      {/* Features List */}
      <div className={`space-y-4 px-6 py-8 flex-grow ${plan.highlighted && 'bg-white/[0.02]'}`}>
        {plan.features.map((feature, index) => (
          <div key={index} className="flex items-start gap-3">
            <CheckCircle className="text-white/80 h-5 w-5 mt-0.5 flex-shrink-0" strokeWidth={2} />
            <p className="text-white/70 text-sm leading-relaxed">{feature.text}</p>
          </div>
        ))}
      </div>

      {/* CTA Button */}
      <div className={`mt-auto w-full border-t ${plan.highlighted ? 'border-white/20 bg-white/[0.05]' : 'border-white/[0.08]'} p-6`}>
        <a
          href={plan.btn.href}
          className={`block w-full text-center rounded-lg px-6 py-3 text-sm font-semibold transition-all duration-200 ${
            plan.highlighted
              ? 'bg-white text-black hover:bg-white/90 shadow-lg shadow-white/20'
              : 'bg-white/10 text-white border border-white/20 hover:bg-white/20 hover:border-white/30'
          }`}
        >
          {plan.btn.text}
        </a>
      </div>
    </div>
  );
}

type BorderTrailProps = {
  className?: string;
  size?: number;
  transition?: Transition;
  delay?: number;
  onAnimationComplete?: () => void;
  style?: React.CSSProperties;
};

function BorderTrail({
  className,
  size = 60,
  transition,
  delay,
  onAnimationComplete,
  style,
}: BorderTrailProps) {
  const BASE_TRANSITION: Transition = {
    repeat: Infinity,
    duration: 5,
    ease: 'linear' as const,
  };

  return (
    <div className="pointer-events-none absolute inset-0 rounded-[inherit] border border-transparent [mask-clip:padding-box,border-box] [mask-composite:intersect] [mask-image:linear-gradient(transparent,transparent),linear-gradient(#000,#000)]">
      <motion.div
        className={`absolute aspect-square bg-white/50 ${className || ''}`}
        style={{
          width: size,
          offsetPath: `rect(0 auto auto 0 round ${size}px)`,
          ...style,
        }}
        animate={{
          offsetDistance: ['0%', '100%'],
        }}
        transition={transition ?? { ...BASE_TRANSITION, delay }}
        onAnimationComplete={onAnimationComplete}
      />
    </div>
  );
}