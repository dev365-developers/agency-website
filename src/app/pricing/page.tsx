'use client';
import type { Metadata } from "next";
import React, { useState } from 'react';
import { Zap, Sparkles, Building2, Check } from 'lucide-react';


export const metadata: Metadata = {
  title: "Pricing — dev365 Website Plans",
  description:
    "View dev365 pricing plans. Get a professional business website built for free with simple monthly pricing.",
};

type FREQUENCY = 'monthly' | 'yearly';

// Pricing Table Components
function PricingTable({ className = '', ...props }: React.ComponentProps<'table'>) {
  return (
    <div className="relative w-full overflow-x-auto">
      <table className={`w-full text-sm ${className}`} {...props} />
    </div>
  );
}

function PricingTableHeader({ ...props }: React.ComponentProps<'thead'>) {
  return <thead {...props} />;
}

function PricingTableBody({ className = '', ...props }: React.ComponentProps<'tbody'>) {
  return (
    <tbody className={`[&_tr]:divide-x [&_tr]:divide-white/10 [&_tr]:border-b [&_tr]:border-white/10 ${className}`} {...props} />
  );
}

function PricingTableRow({ ...props }: React.ComponentProps<'tr'>) {
  return <tr {...props} />;
}

function PricingTableCell({ className = '', children, ...props }: React.ComponentProps<'td'> & { children: any }) {
  return (
    <td className={`p-2 sm:p-4 align-middle whitespace-nowrap ${className}`} {...props}>
      {children === true ? (
        <Check aria-hidden="true" className="size-3 sm:size-4 text-white mx-auto" strokeWidth={2} />
      ) : children === false ? (
        <span className="text-white/30 text-lg sm:text-xl block text-center">—</span>
      ) : (
        children
      )}
    </td>
  );
}

function PricingTableHead({ className = '', ...props }: React.ComponentProps<'th'>) {
  return (
    <th className={`p-2 text-left align-middle font-medium whitespace-nowrap text-xs sm:text-sm ${className}`} {...props} />
  );
}

function PricingTablePlan({ 
  name, 
  badge, 
  price, 
  compareAt, 
  icon: Icon, 
  children, 
  className = '',
  highlighted = false,
  ...props 
}: React.ComponentProps<'div'> & {
  name: string;
  badge: string;
  price: string;
  compareAt?: string;
  icon: React.ComponentType<any>;
  highlighted?: boolean;
}) {
  return (
    <div
      className={`relative h-full overflow-hidden rounded-lg border p-2 sm:p-3 font-normal backdrop-blur-sm ${
        highlighted 
          ? 'bg-white/10 border-white' 
          : 'bg-white/5 border-white/30'
      } ${className}`}
      {...props}
    >
      <div className="flex items-center gap-1 sm:gap-2">
        <div className="flex items-center justify-center rounded-full border border-white/30 p-1 sm:p-1.5">
          <Icon className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-white" />
        </div>
        <h3 className="text-white/80 font-mono text-xs sm:text-sm">{name}</h3>
        <span className="ml-auto rounded-full border border-white/30 bg-white/5 px-1.5 sm:px-2 py-0.5 text-[9px] sm:text-[10px] font-normal text-white/80">
          {badge}
        </span>
      </div>

      <div className="mt-3 sm:mt-4 flex items-baseline gap-1 sm:gap-2">
        <span className="text-xl sm:text-3xl font-bold text-white">{price}</span>
        {compareAt && (
          <span className="text-white/50 text-xs sm:text-sm line-through">
            {compareAt}
          </span>
        )}
      </div>
      <div className="relative z-10 mt-3 sm:mt-4">{children}</div>
    </div>
  );
}

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

// Plans Data
const PLANS = [
  {
    name: 'Basic',
    badge: 'For Startups',
    info: 'Best for small businesses & solo founders',
    icon: Zap,
    price: { monthly: 599, yearly: 6168 },
    compareAt: { monthly: 899, yearly: 9240 },
  },
  {
    name: 'Pro',
    badge: 'For Growing Teams',
    info: 'Most popular for growing startups',
    icon: Sparkles,
    price: { monthly: 1599, yearly: 16469 },
    compareAt: { monthly: 1999, yearly: 20589 },
    highlighted: true,
  },
  {
    name: 'Enterprise',
    badge: 'For Large Teams',
    info: 'For large teams & complex requirements',
    icon: Building2,
    price: { monthly: 0, yearly: 0 },
  },
];

// Comparison Data
const COMPARISON_SECTIONS = [
  {
    category: 'Website Setup',
    features: [
      { label: 'Website built for free', values: [true, true, true] },
      { label: 'Pages', values: ['Up to 5', 'Unlimited', 'Unlimited'] },
      { label: 'Custom design & sections', values: [false, true, true] },
      { label: 'CMS / Blog integration', values: [false, true, true] },
      { label: 'Admin dashboard', values: [true, true, true] },
    ],
  },
  {
    category: 'Hosting & Infrastructure',
    features: [
      { label: 'Hosting included', values: [true, true, true] },
      { label: 'SSL & security included', values: [true, true, true] },
      { label: 'Custom domain support', values: [true, true, true] },
      { label: 'Performance optimization', values: [false, true, true] },
      { label: 'Custom hosting & scaling setup', values: [false, false, true] },
    ],
  },
  {
    category: 'Maintenance & Updates',
    features: [
      { label: 'Monthly maintenance & updates', values: [true, true, true] },
      { label: 'Content changes / month', values: ['1–2', '5–8', 'Unlimited'] },
      { label: 'Bug fixes', values: [true, true, true] },
      { label: 'Feature enhancements', values: [false, true, true] },
    ],
  },
  {
    category: 'Support',
    features: [
      { label: 'Email support', values: [true, true, true] },
      { label: 'Priority support', values: [false, true, true] },
      { label: 'Dedicated account manager', values: [false, false, true] },
      { label: 'SLA-backed support', values: [false, false, true] },
    ],
  },
  {
    category: 'Design & Features',
    features: [
      { label: 'Mobile responsive design', values: [true, true, true] },
      { label: 'Basic SEO setup', values: [true, true, true] },
      { label: 'Advanced SEO structure', values: [false, true, true] },
      { label: 'Advanced integrations & APIs', values: [false, false, true] },
      { label: 'Security & uptime monitoring', values: [false, false, true] },
    ],
  },
];

export default function PricingPage() {
  const [frequency, setFrequency] = useState<FREQUENCY>('monthly');

  const handleButtonClick = (plan: typeof PLANS[0]) => {
    if (plan.price.monthly === 0) {
      window.location.href = 'mailto:contact@yourcompany.com';
    } else {
      alert(`Opening signup for ${plan.name} plan`);
    }
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Hero Section */}
      <section className="relative pb-20 sm:pb-32 bg-black overflow-hidden">
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
        
        <div className="relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 pt-12 sm:pt-20">
          <div className="mx-auto max-w-3xl text-center mb-8 sm:mb-12">
            
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-white mb-4 sm:mb-6">
              Transparent pricing.
              <br />
              Powerful websites.
              <br/>
              No surprises.
            </h2>

            <PricingFrequencyToggle frequency={frequency} setFrequency={setFrequency} />
          </div>
        </div>
      </section>

      {/* Pricing Table - Overlapping Hero */}
      <section className="relative -mt-12 sm:-mt-20 pb-12 bg-black z-20">
        <div className="mx-auto w-full max-w-5xl px-4 sm:px-6">
          <div className="overflow-x-auto">
            <PricingTable className="mx-auto min-w-[640px]">
              <PricingTableHeader>
                <PricingTableRow>
                  <th className="w-48" />
                  {PLANS.map((plan) => (
                    <th key={plan.name} className="p-1 w-52">
                      <PricingTablePlan
                        name={plan.name}
                        badge={plan.badge}
                        price={
                          plan.price.monthly === 0
                            ? 'Custom'
                            : `₹${(frequency === 'monthly' ? plan.price.monthly : plan.price.yearly).toLocaleString('en-IN')}`
                        }
                        compareAt={
                          plan.compareAt
                            ? `₹${(frequency === 'monthly' ? plan.compareAt.monthly : plan.compareAt.yearly).toLocaleString('en-IN')}`
                            : undefined
                        }
                        icon={plan.icon}
                        highlighted={plan.highlighted}
                      >
                        <button
                          onClick={() => handleButtonClick(plan)}
                          className={`w-full rounded-lg text-xs sm:text-sm font-semibold py-2 sm:py-2.5 px-3 sm:px-4 transition-all ${
                            plan.highlighted
                              ? 'border border-white bg-white text-black hover:bg-white/90'
                              : 'border border-white/30 bg-white/5 text-white hover:bg-white/10'
                          }`}
                        >
                          {plan.price.monthly === 0 ? 'Contact Sales' : 'Get Started'}
                        </button>
                      </PricingTablePlan>
                    </th>
                  ))}
                </PricingTableRow>
              </PricingTableHeader>
              <PricingTableBody>
                {COMPARISON_SECTIONS.map((section) => (
                  <React.Fragment key={section.category}>
                    <PricingTableRow>
                      <PricingTableHead
                        colSpan={4}
                        className="bg-white/[0.03] text-white font-semibold text-xs sm:text-sm pt-3 sm:pt-4"
                      >
                        {section.category}
                      </PricingTableHead>
                    </PricingTableRow>
                    {section.features.map((feature, index) => (
                      <PricingTableRow key={index}>
                        <PricingTableHead className="text-white/80 text-xs sm:text-sm">
                          {feature.label}
                        </PricingTableHead>
                        {feature.values.map((value, idx) => (
                          <PricingTableCell key={idx} className="text-center">
                            {value === true ? (
                              true
                            ) : value === false ? (
                              false
                            ) : (
                              <span className="text-white/80 text-xs sm:text-sm">{value}</span>
                            )}
                          </PricingTableCell>
                        ))}
                      </PricingTableRow>
                    ))}
                  </React.Fragment>
                ))}
              </PricingTableBody>
            </PricingTable>
          </div>
          <div className="mt-4 text-center text-white/50 text-xs sm:hidden">
            ← Scroll horizontally to view all plans →
          </div>
        </div>
      </section>
    </div>
  );
}

function PricingFrequencyToggle({
  frequency,
  setFrequency,
}: {
  frequency: FREQUENCY;
  setFrequency: React.Dispatch<React.SetStateAction<FREQUENCY>>;
}) {
  const frequencies: FREQUENCY[] = ['monthly', 'yearly'];
  
  return (
    <div className="relative mx-auto flex w-fit rounded-full border border-white/30 bg-white/5 backdrop-blur-sm p-1">
      {frequencies.map((freq) => (
        <button
          key={freq}
          onClick={() => setFrequency(freq)}
          className="relative px-4 sm:px-6 py-1.5 sm:py-2 text-xs sm:text-sm capitalize text-white/80 transition-colors"
        >
          <span className="relative z-10">{freq}</span>
          {frequency === freq && (
            <span
              className="absolute inset-0 z-0 rounded-full bg-white/20 transition-all duration-300"
            />
          )}
        </button>
      ))}
      {frequency === 'yearly' && (
        <div className="absolute -top-7 sm:-top-8 right-0 bg-green-400 text-black text-[10px] sm:text-xs px-2 sm:px-3 py-0.5 sm:py-1 rounded-full font-medium">
          Save 14%
        </div>
      )}
    </div>
  );
}