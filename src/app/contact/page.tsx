import type { Metadata } from "next";
'use client';
import React, { useState } from 'react';
import { Zap, Users, Settings } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const metadata: Metadata = {
  title: "Contact dev365 — Talk to Our Team",
  description:
    "Contact dev365 to get your business website built for free. Talk to our team today.",
};

// GridPattern Component (reused from pricing)
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

const INDUSTRIES = [
  'Technology / SaaS',
  'E-commerce / Retail',
  'Healthcare / Medical',
  'Finance / Fintech',
  'Education / E-learning',
  'Real Estate',
  'Manufacturing',
  'Consulting / Agency',
  'Other',
];

const BUDGET_RANGES = [
  '₹10k–₹25k / month',
  '₹25k–₹50k / month',
  '₹50k+ / month',
  'Not sure (Let\'s discuss)',
];

const FAQS = [
  {
    question: 'Is this form only for Enterprise plans?',
    answer: 'Yes. This form is intended for businesses with custom requirements, larger scopes, or Enterprise-level needs. If you\'re looking for standard plans, you can get started directly from our pricing page.',
  },
  {
    question: 'How soon will someone contact me?',
    answer: 'We usually respond within 24–48 business hours. For urgent or high-priority requests, we may reach out sooner.',
  },
  {
    question: 'Do you offer a free consultation?',
    answer: 'Yes. The first discussion is completely free and helps us understand your requirements before proposing a solution.',
  },
  {
    question: 'Is there any commitment after submitting this form?',
    answer: 'No. Submitting this form does not obligate you to purchase anything. It\'s simply the first step to explore a custom solution.',
  },
  {
    question: 'Can you work with existing websites or products?',
    answer: 'Absolutely. We can improve, redesign, scale, or maintain existing websites depending on your needs.',
  },
  {
    question: 'What happens after I submit the form?',
    answer: 'After submission: (1) Our team reviews your request, (2) We contact you to clarify requirements, (3) A custom plan, timeline, and pricing are shared.',
  },
  {
    question: 'Can I switch to a standard plan later?',
    answer: 'Yes. If your requirements change, we can transition you to a standard subscription plan when applicable.',
  },
  {
    question: 'Do you work with international clients?',
    answer: 'Yes. We work with clients globally and support flexible communication methods.',
  },
]

export default function ContactSalesPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    companyEmail: '',
    phoneNumber: '',
    industry: '',
    companySize: '',
    message: '',
    agreeToTerms: false,
  });

  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const handleSubmit = () => {
    // Validate required fields
    if (!formData.firstName || !formData.lastName || !formData.companyEmail || 
        !formData.phoneNumber || !formData.industry || !formData.message || !formData.agreeToTerms) {
      alert('Please fill in all required fields and agree to the terms.');
      return;
    }

    console.log('Form submitted:', formData);
    alert('Thank you! We\'ll get back to you within 24–48 hours.');
    
    // Reset form
    setFormData({
      firstName: '',
      lastName: '',
      companyEmail: '',
      phoneNumber: '',
      industry: '',
      companySize: '',
      message: '',
      agreeToTerms: false,
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    });
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Hero Section */}
      <section className="relative pb-8 sm:pb-12 bg-black overflow-hidden">
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
        
        <div className="relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 pt-32 sm:pt-40">
          <div className="mx-auto max-w-6xl">
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-start">
              {/* Left Side - Content */}
              <div className="space-y-8">
                <div>
                  <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white mb-4">
                    Let's Build Something Tailored for Your Business
                  </h1>
                  <p className="text-base sm:text-lg text-white/60">
                    Welcome to the future of web development with our enterprise-grade solutions. We're dedicated to helping businesses like yours achieve peak efficiency and collaboration. Take the leap into innovation.
                  </p>
                </div>

                {/* Features */}
                <div className="space-y-6">
                  <FeatureItem 
                    icon={Zap}
                    title="Lightning-Fast Delivery"
                    description="Get your custom website or app built and deployed quickly without compromising on quality or performance."
                  />
                  <FeatureItem 
                    icon={Users}
                    title="Dedicated Support Team"
                    description="Work directly with our expert team who understand your unique requirements and provide ongoing support."
                  />
                  <FeatureItem 
                    icon={Settings}
                    title="Fully Customizable Solutions"
                    description="Tailor every aspect of your project to align seamlessly with your business workflows and goals."
                  />
                </div>
              </div>

              {/* Right Side - Form */}
              <div className="lg:sticky lg:top-8">
                <div className="rounded-lg border border-white/30 bg-white/5 backdrop-blur-sm p-6 sm:p-8">
                  <h2 className="text-white text-xl font-semibold mb-2">
                    Fill out this quick form and we'll get back to you shortly
                  </h2>
                  <p className="text-white/50 text-sm mb-6">
                    Tell us about your project and we'll respond within 24-48 hours.
                  </p>

                  <div className="space-y-4">
                    {/* Name Fields */}
                    <div className="grid grid-cols-2 gap-3">
                      <FormField
                        label="First Name"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        placeholder="ex: Robie"
                        small
                      />
                      <FormField
                        label="Last Name"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        placeholder="ex: Dhana"
                        small
                      />
                    </div>

                    {/* Email and Phone */}
                    <div className="grid grid-cols-2 gap-3">
                      <FormField
                        label="Company Email"
                        name="companyEmail"
                        type="email"
                        value={formData.companyEmail}
                        onChange={handleChange}
                        placeholder="ex: robie@taskmanly.com"
                        small
                      />
                      <FormField
                        label="Phone Number"
                        name="phoneNumber"
                        type="tel"
                        value={formData.phoneNumber}
                        onChange={handleChange}
                        placeholder="ex: +9854973740381"
                        small
                      />
                    </div>

                    {/* Industry and Company Size */}
                    <div className="grid grid-cols-2 gap-3">
                      <FormSelect
                        label="Industry"
                        name="industry"
                        value={formData.industry}
                        onChange={handleChange}
                        options={INDUSTRIES}
                        placeholder="Select industry"
                        small
                      />
                      <FormSelect
                        label="Company Size"
                        name="companySize"
                        value={formData.companySize}
                        onChange={handleChange}
                        options={BUDGET_RANGES}
                        placeholder="Select budget"
                        small
                      />
                    </div>

                    {/* Message */}
                    <FormTextarea
                      label="Give a short description of your project"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Enter your message"
                      rows={3}
                    />

                    {/* Terms Checkbox */}
                    <div className="flex items-start gap-2">
                      <input
                        type="checkbox"
                        id="agreeToTerms"
                        name="agreeToTerms"
                        checked={formData.agreeToTerms}
                        onChange={handleChange}
                        className="mt-1 h-4 w-4 rounded border-white/30 bg-white/5 text-white focus:ring-2 focus:ring-white/50 cursor-pointer"
                      />
                      <label htmlFor="agreeToTerms" className="text-white/70 text-xs">
                        By checking this box you agree to our{' '}
                        <a href="#" className="text-blue-400 hover:underline">Terms of Service</a>
                        {' '}and{' '}
                        <a href="#" className="text-blue-400 hover:underline">Privacy Policy</a>
                      </label>
                    </div>

                    {/* Submit Button */}
                    <button
                      onClick={handleSubmit}
                      className="w-full rounded-lg bg-blue-600 text-white font-semibold py-3 px-6 text-base transition-all hover:bg-blue-700"
                    >
                      Submit
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
<section className="relative py-15 bg-black">
  <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
    <div className="text-center mb-12">
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4">
        Frequently Asked Questions
      </h2>
    </div>

    <div className="grid md:grid-cols-2 gap-4">
      {FAQS.map((faq, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: index * 0.05 }}
          className="rounded-sm border border-white/30 bg-white/5 backdrop-blur-sm overflow-hidden self-start"
        >
          <button
            onClick={() => setOpenFaq(openFaq === index ? null : index)}
            className="w-full text-left p-5 flex items-start justify-between gap-4 hover:bg-white/10 transition-colors"
          >
            <span className="text-white font-medium text-sm sm:text-base pr-4">
              {faq.question}
            </span>
            <motion.span
              animate={{ rotate: openFaq === index ? 180 : 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="text-white/60 text-xl flex-shrink-0"
            >
              ﹀
            </motion.span>
          </button>
          <AnimatePresence>
            {openFaq === index && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                <div className="px-5 pb-5 pt-2 bg-white/60">
                  <p className="text-black text-sm sm:text-base leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      ))}
    </div>
  </div>
</section>
    </div>
  );
}

function FeatureItem({ icon: Icon, title, description }: { icon: React.ComponentType<any>; title: string; description: string }) {
  return (
    <div className="flex items-start gap-4">
      <div className="flex items-center justify-center rounded-full border border-white/30 p-2.5 flex-shrink-0 bg-white/5">
        <Icon className="h-5 w-5 text-white" />
      </div>
      <div>
        <h3 className="text-white font-semibold text-base mb-1">{title}</h3>
        <p className="text-white/60 text-sm leading-relaxed">{description}</p>
      </div>
    </div>
  );
}

function FormField({
  label,
  name,
  type = 'text',
  value,
  onChange,
  placeholder,
  small = false,
}: {
  label: string;
  name: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  small?: boolean;
}) {
  return (
    <div>
      <label htmlFor={name} className="block text-white text-xs font-medium mb-1.5">
        {label}
      </label>
      <input
        type={type}
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full rounded-lg border border-white/30 bg-white/5 backdrop-blur-sm px-3 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm ${
          small ? 'py-2' : 'py-2.5'
        }`}
      />
    </div>
  );
}

function FormSelect({
  label,
  name,
  value,
  onChange,
  options,
  placeholder,
  small = false,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: string[];
  placeholder: string;
  small?: boolean;
}) {
  return (
    <div>
      <label htmlFor={name} className="block text-white text-xs font-medium mb-1.5">
        {label}
      </label>
      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        className={`w-full rounded-lg border border-white/30 bg-white/5 backdrop-blur-sm px-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all appearance-none cursor-pointer text-sm ${
          small ? 'py-2' : 'py-2.5'
        }`}
        style={{
          backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='rgba(255,255,255,0.6)' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
          backgroundPosition: 'right 0.5rem center',
          backgroundRepeat: 'no-repeat',
          backgroundSize: '1.5em 1.5em',
          paddingRight: '2.5rem',
        }}
      >
        <option value="" disabled className="bg-black">{placeholder}</option>
        {options.map((option) => (
          <option key={option} value={option} className="bg-black">
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}

function FormTextarea({
  label,
  name,
  value,
  onChange,
  placeholder,
  rows = 3,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  rows?: number;
}) {
  return (
    <div>
      <label htmlFor={name} className="block text-white text-xs font-medium mb-1.5">
        {label}
      </label>
      <textarea
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        className="w-full rounded-lg border border-white/30 bg-white/5 backdrop-blur-sm px-3 py-2 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-none text-sm"
      />
    </div>
  );
}