"use client"
import React from "react"
import { motion } from "framer-motion"

const MissionSection = () => {
  return (
    <section className="relative z-0 flex min-h-[80vh] w-full flex-col items-center justify-center overflow-hidden bg-black">
      {/* Gradient lamp effect */}
      <div className="absolute top-0 isolate z-0 flex w-screen flex-1 items-start justify-center">
        {/* Blur overlay */}
        <div className="absolute top-0 z-50 h-48 w-screen bg-transparent opacity-10 backdrop-blur-md" />

        {/* Main glow */}
        <div className="absolute inset-auto z-50 h-36 w-64 sm:w-80 md:w-[28rem] -translate-y-[-30%] rounded-full bg-white/40 opacity-80 blur-3xl" />

        {/* Lamp effect */}
        <motion.div
          initial={{ width: "5rem" }}
          viewport={{ once: true }}
          transition={{ ease: "easeInOut", delay: 0.3, duration: 0.8 }}
          whileInView={{ width: "8rem" }}
          className="absolute top-0 z-30 h-36 -translate-y-[20%] rounded-full bg-white/40 blur-2xl sm:w-32 md:w-64"
        />

        {/* Top line */}
        <motion.div
          initial={{ width: "10rem" }}
          viewport={{ once: true }}
          transition={{ ease: "easeInOut", delay: 0.3, duration: 0.8 }}
          whileInView={{ width: "20rem" }}
          className="absolute inset-auto z-50 h-0.5 -translate-y-[-10%] bg-white/60 sm:w-96 md:w-[30rem]"
        />

        {/* Left gradient cone */}
        <motion.div
          initial={{ opacity: 0.5, width: "10rem" }}
          whileInView={{ opacity: 1, width: "20rem" }}
          transition={{
            delay: 0.3,
            duration: 0.8,
            ease: "easeInOut",
          }}
          style={{
            backgroundImage: `conic-gradient(var(--conic-position), var(--tw-gradient-stops))`,
          }}
          className="absolute inset-auto right-1/2 h-56 overflow-visible bg-gradient-conic from-white/40 via-transparent to-transparent text-white [--conic-position:from_70deg_at_center_top] sm:w-96 md:w-[30rem]"
        >
          <div className="absolute w-[100%] left-0 bg-black h-40 bottom-0 z-20 [mask-image:linear-gradient(to_top,white,transparent)]" />
          <div className="absolute w-20 sm:w-32 md:w-40 h-[100%] left-0 bg-black bottom-0 z-20 [mask-image:linear-gradient(to_right,white,transparent)]" />
        </motion.div>

        {/* Right gradient cone */}
        <motion.div
          initial={{ opacity: 0.5, width: "10rem" }}
          whileInView={{ opacity: 1, width: "20rem" }}
          transition={{
            delay: 0.3,
            duration: 0.8,
            ease: "easeInOut",
          }}
          style={{
            backgroundImage: `conic-gradient(var(--conic-position), var(--tw-gradient-stops))`,
          }}
          className="absolute inset-auto left-1/2 h-56 bg-gradient-conic from-transparent via-transparent to-white/40 text-white [--conic-position:from_290deg_at_center_top] sm:w-96 md:w-[30rem]"
        >
          <div className="absolute w-20 sm:w-32 md:w-40 h-[100%] right-0 bg-black bottom-0 z-20 [mask-image:linear-gradient(to_left,white,transparent)]" />
          <div className="absolute w-[100%] right-0 bg-black h-40 bottom-0 z-20 [mask-image:linear-gradient(to_top,white,transparent)]" />
        </motion.div>
      </div>

      {/* Content */}
      <div
        className="mt-35 relative z-50 container flex justify-center flex-1 flex-col px-5 md:px-10 gap-4 -translate-y-20"
      >
        <div className="flex flex-col items-center text-center space-y-6 max-w-4xl mx-auto">
          {/* Headline */}
          <h2
            className="text-3xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-white mb-10"
          >
            Our Mission
          </h2>

          {/* Mission statement */}
          <p
            className="text-lg md:text-xl leading-relaxed text-white/70 max-w-3xl font-light"
          >
            Most businesses struggle with outdated websites, unreliable
            freelancers, or expensive agencies. Dev365 was created to offer a
            simpler alternative — modern websites with predictable monthly
            pricing and ongoing support. Dev365 was created to change that. We
            believe a website should be a living part of your business —
            continuously improved, monitored, and supported. Our
            subscription-based model removes uncertainty by offering modern
            design, reliable hosting, and ongoing support under a simple,
            predictable monthly plan. Our mission is to make high-quality web
            development accessible, stress-free, and scalable for growing
            businesses, so founders can focus on building their products while
            we take care of everything behind the scenes.
          </p>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-b from-transparent to-black z-10" />
    </section>
  );
}

export default MissionSection