"use client";
import React from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { Facebook, Instagram, Youtube, Linkedin, Frame } from 'lucide-react';

interface FooterLink {
  title: string;
  href: string;
  icon?: React.ComponentType<{ className?: string }>;
}

interface FooterSection {
  label: string;
  links: FooterLink[];
}

const footerLinks: FooterSection[] = [
  {
    label: 'Product',
    links: [
      { title: 'Features', href: '#features' },
      { title: 'Pricing', href: '#pricing' },
      { title: 'Testimonials', href: '#testimonials' },
      { title: 'Integration', href: '/' },
    ],
  },
  {
    label: 'Company',
    links: [
      { title: 'FAQs', href: '/faqs' },
      { title: 'About Us', href: '/about' },
      { title: 'Privacy Policy', href: '/privacy' },
      { title: 'Terms of Services', href: '/terms' },
    ],
  },
  {
    label: 'Resources',
    links: [
      { title: 'Blog', href: '/blog' },
      { title: 'Changelog', href: '/changelog' },
      { title: 'Brand', href: '/brand' },
      { title: 'Help', href: '/help' },
    ],
  },
  {
    label: 'Social Links',
    links: [
      { title: 'Facebook', href: '#', icon: Facebook },
      { title: 'Instagram', href: '#', icon: Instagram },
      { title: 'Youtube', href: '#', icon: Youtube },
      { title: 'LinkedIn', href: '#', icon: Linkedin },
    ],
  },
];

interface AnimatedContainerProps {
  delay?: number;
  className?: string;
  children: React.ReactNode;
}

function AnimatedContainer({ className, delay = 0.1, children }: AnimatedContainerProps) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial={{ filter: 'blur(4px)', translateY: -8, opacity: 0 }}
      whileInView={{ filter: 'blur(0px)', translateY: 0, opacity: 1 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.8 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default function Footer() {
  return (
    <footer className="relative w-full bg-black text-white px-6 py-12 lg:py-16">
      {/* Top gradient line */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 h-px w-1/3 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      
      {/* Subtle top overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] via-transparent to-transparent pointer-events-none" />

      <div className="relative max-w-6xl mx-auto">
        <div className="grid w-full gap-8 xl:grid-cols-3 xl:gap-8">
          {/* Brand Section */}
          <AnimatedContainer className="space-y-4">
            <img src="/agency_logo.png" alt="dev365" className="h-10 w-auto" />
            <p className="text-gray-400 mt-8 text-sm md:mt-0">
              © {new Date().getFullYear()} dev365. All rights reserved.
            </p>
          </AnimatedContainer>

          {/* Links Grid */}
          <div className="mt-10 grid grid-cols-2 gap-8 md:grid-cols-4 xl:col-span-2 xl:mt-0">
            {footerLinks.map((section, index) => (
              <AnimatedContainer key={section.label} delay={0.1 + index * 0.1}>
                <div className="mb-10 md:mb-0">
                  <h3 className="text-xs font-semibold text-white mb-4">{section.label}</h3>
                  <ul className="space-y-2 text-sm">
                    {section.links.map((link) => (
                      <li key={link.title}>
                        <a
                          href={link.href}
                          className="text-gray-400 hover:text-white inline-flex items-center transition-all duration-300"
                        >
                          {link.icon && <link.icon className="me-1 w-4 h-4" />}
                          {link.title}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </AnimatedContainer>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}