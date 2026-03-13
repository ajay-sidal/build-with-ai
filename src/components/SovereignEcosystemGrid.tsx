"use client";

import { DESIGN_TOKENS } from "@/constants/design-tokens";
import { motion } from "framer-motion";
import {
  Shield,
  Server,
  Code2,
  GraduationCap,
  ArrowRight,
  Sparkles,
  Wallet,
  Lock,
} from "lucide-react";
import Link from "next/link";

const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0 },
};

const staggerContainer = {
  show: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

// Gold Standard Typography Styles
const cardTitleBaseStyles = {
  fontFamily: DESIGN_TOKENS.typography.fontFamily,
  fontWeight: 800, // font-black
  letterSpacing: DESIGN_TOKENS.typography.tracking.widest, // 0.2em
  color: DESIGN_TOKENS.colors.text.primary, // #ffffff
};

const sectionHeaderStyles = {
  ...cardTitleBaseStyles,
  fontWeight: 900, // font-black for section headers
};

export default function SovereignEcosystemGrid() {
  return (
    <section className="py-24 relative z-10 bg-[#0a0a0a]">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
          variants={fadeUp}
          transition={{ duration: 0.4 }}
          className="text-center mb-16"
        >
          <h2
            className="text-4xl md:text-5xl font-black text-white mb-4"
            style={sectionHeaderStyles}
          >
            The Sovereign{" "}
            <span
              className="text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-teal-400"
              style={{ color: DESIGN_TOKENS.colors.brand.tealGlow }}
            >
              Ecosystem
            </span>
          </h2>
          <p className="text-neutral-400 text-lg max-w-2xl mx-auto font-medium">
            Build, scale, and tokenize your digital presence.
          </p>
        </motion.div>

        {/* Bento Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-7xl mx-auto"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
          variants={staggerContainer}
        >
          {/* Sovereign Domains - 2 Col Span */}
          <motion.div
            variants={fadeUp}
            transition={{ duration: 0.35 }}
            className="md:col-span-2"
          >
            <Link href="/products/domains/registration" className="block h-full">
              <div
                className="group h-full bg-[#0a0a0a] border rounded-3xl p-8 md:p-10 transition-all duration-300 hover:shadow-lg"
                style={{
                  borderColor: DESIGN_TOKENS.colors.border.subtle,
                  boxShadow: DESIGN_TOKENS.effects.cardShadow,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = DESIGN_TOKENS.colors.brand.teal;
                  e.currentTarget.style.boxShadow = `0 8px 32px 0 rgba(20, 184, 166, 0.15)`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = DESIGN_TOKENS.colors.border.subtle;
                  e.currentTarget.style.boxShadow = DESIGN_TOKENS.effects.cardShadow;
                }}
              >
                <div className="flex items-center gap-4 mb-6">
                  <div
                    className="rounded-xl border p-3"
                    style={{
                      borderColor: DESIGN_TOKENS.colors.border.subtle,
                      backgroundColor: DESIGN_TOKENS.colors.background.surface,
                    }}
                  >
                    <Wallet size={28} className="text-teal-400" />
                  </div>
                  <h3
                    className="text-2xl md:text-3xl font-black text-white uppercase"
                    style={cardTitleBaseStyles}
                  >
                    Sovereign Domains
                  </h3>
                </div>
                <p className="text-neutral-400 leading-relaxed mb-8">
                  Every domain purchased natively bridges to a Web3 Smart Wallet.
                  Your digital identity, secured on-chain.
                </p>
                <div className="flex items-center gap-2 text-sm font-bold uppercase" style={{ color: DESIGN_TOKENS.colors.brand.teal, letterSpacing: "0.15em" }}>
                  <span>Explore Engine</span>
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          </motion.div>

          {/* SSL Sanctuary - 1 Col Span */}
          <motion.div
            variants={fadeUp}
            transition={{ duration: 0.35, delay: 0.1 }}
          >
            <Link href="/ssl" className="block h-full">
              <div
                className="group h-full bg-[#0a0a0a] border rounded-3xl p-8 md:p-10 transition-all duration-300 hover:shadow-lg"
                style={{
                  borderColor: DESIGN_TOKENS.colors.border.subtle,
                  boxShadow: DESIGN_TOKENS.effects.cardShadow,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = DESIGN_TOKENS.colors.brand.teal;
                  e.currentTarget.style.boxShadow = `0 8px 32px 0 rgba(20, 184, 166, 0.15)`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = DESIGN_TOKENS.colors.border.subtle;
                  e.currentTarget.style.boxShadow = DESIGN_TOKENS.effects.cardShadow;
                }}
              >
                <div className="flex items-center gap-4 mb-6">
                  <div
                    className="rounded-xl border p-3"
                    style={{
                      borderColor: DESIGN_TOKENS.colors.border.subtle,
                      backgroundColor: DESIGN_TOKENS.colors.background.surface,
                    }}
                  >
                    <Lock size={28} className="text-teal-400" />
                  </div>
                  <h3
                    className="text-xl md:text-2xl font-black text-white uppercase"
                    style={cardTitleBaseStyles}
                  >
                    SSL Sanctuary
                  </h3>
                </div>
                <p className="text-neutral-400 text-sm leading-relaxed mb-8">
                  Bank-grade 256-bit encryption for total security.
                </p>
                <div className="flex items-center gap-2 text-sm font-bold uppercase" style={{ color: DESIGN_TOKENS.colors.brand.teal, letterSpacing: "0.15em" }}>
                  <span>Secure Now</span>
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          </motion.div>

          {/* Enterprise Hosting - 1 Col Span */}
          <motion.div
            variants={fadeUp}
            transition={{ duration: 0.35, delay: 0.2 }}
          >
            <Link href="/products/dns/hosting" className="block h-full">
              <div
                className="group h-full bg-[#0a0a0a] border rounded-3xl p-8 md:p-10 transition-all duration-300 hover:shadow-lg"
                style={{
                  borderColor: DESIGN_TOKENS.colors.border.subtle,
                  boxShadow: DESIGN_TOKENS.effects.cardShadow,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = DESIGN_TOKENS.colors.brand.teal;
                  e.currentTarget.style.boxShadow = `0 8px 32px 0 rgba(20, 184, 166, 0.15)`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = DESIGN_TOKENS.colors.border.subtle;
                  e.currentTarget.style.boxShadow = DESIGN_TOKENS.effects.cardShadow;
                }}
              >
                <div className="flex items-center gap-4 mb-6">
                  <div
                    className="rounded-xl border p-3"
                    style={{
                      borderColor: DESIGN_TOKENS.colors.border.subtle,
                      backgroundColor: DESIGN_TOKENS.colors.background.surface,
                    }}
                  >
                    <Server size={28} className="text-teal-400" />
                  </div>
                  <h3
                    className="text-xl md:text-2xl font-black text-white uppercase"
                    style={cardTitleBaseStyles}
                  >
                    Enterprise Hosting
                  </h3>
                </div>
                <p className="text-neutral-400 text-sm leading-relaxed mb-8">
                  Dedicated server environments with{" "}
                  <span className="text-teal-400 font-semibold">Premium Architecture</span>.
                </p>
                <div className="flex items-center gap-2 text-sm font-bold uppercase" style={{ color: DESIGN_TOKENS.colors.brand.teal, letterSpacing: "0.15em" }}>
                  <span>Deploy Server</span>
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          </motion.div>

          {/* DFY Agency Protocol - 2 Col Span */}
          <motion.div
            variants={fadeUp}
            transition={{ duration: 0.35, delay: 0.3 }}
            className="md:col-span-2"
          >
            <Link href="/services/ai-design" className="block h-full">
              <div
                className="group h-full bg-[#0a0a0a] border rounded-3xl p-8 md:p-10 transition-all duration-300 hover:shadow-lg"
                style={{
                  borderColor: DESIGN_TOKENS.colors.border.subtle,
                  boxShadow: DESIGN_TOKENS.effects.cardShadow,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = DESIGN_TOKENS.colors.brand.teal;
                  e.currentTarget.style.boxShadow = `0 8px 32px 0 rgba(20, 184, 166, 0.15)`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = DESIGN_TOKENS.colors.border.subtle;
                  e.currentTarget.style.boxShadow = DESIGN_TOKENS.effects.cardShadow;
                }}
              >
                <div className="flex items-center gap-4 mb-6">
                  <div
                    className="rounded-xl border p-3"
                    style={{
                      borderColor: DESIGN_TOKENS.colors.border.subtle,
                      backgroundColor: DESIGN_TOKENS.colors.background.surface,
                    }}
                  >
                    <Code2 size={28} className="text-teal-400" />
                  </div>
                  <h3
                    className="text-2xl md:text-3xl font-black text-white uppercase"
                    style={cardTitleBaseStyles}
                  >
                    DFY Agency Protocol
                  </h3>
                </div>
                <p className="text-neutral-400 leading-relaxed mb-8">
                  Custom Web3-ready platforms designed by{" "}
                  <span className="text-teal-400 font-semibold">Elite Architects</span>.
                  From concept to deployment, we build your digital sovereignty.
                </p>
                <div className="flex items-center gap-2 text-sm font-bold uppercase" style={{ color: DESIGN_TOKENS.colors.brand.tealGlow, letterSpacing: "0.15em" }}>
                  <span>View Portfolio</span>
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          </motion.div>

          {/* MARZ Academy - Special Feature Card */}
          <motion.div
            variants={fadeUp}
            transition={{ duration: 0.35, delay: 0.4 }}
          >
            <Link href="/academy" className="block h-full">
              <div
                className="group relative h-full bg-gradient-to-br from-[#0a0a0a] to-[#0f0f0f] border rounded-3xl p-8 md:p-10 transition-all duration-300 overflow-hidden"
                style={{
                  borderColor: DESIGN_TOKENS.colors.border.subtle,
                  boxShadow: DESIGN_TOKENS.effects.cardShadow,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = DESIGN_TOKENS.colors.brand.tealGlow;
                  e.currentTarget.style.boxShadow = `0 12px 48px 0 rgba(45, 212, 191, 0.25)`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = DESIGN_TOKENS.colors.border.subtle;
                  e.currentTarget.style.boxShadow = DESIGN_TOKENS.effects.cardShadow;
                }}
              >
                {/* Animated gradient overlay on hover */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{
                    background: DESIGN_TOKENS.effects.glassGradient,
                  }}
                />

                {/* Sparkle effect */}
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Sparkles size={20} className="text-teal-400 animate-pulse" />
                </div>

                <div className="relative z-10">
                  <div className="flex items-center gap-4 mb-6">
                    <div
                      className="rounded-xl border p-3 bg-teal-500/10"
                      style={{
                        borderColor: `rgba(20, 184, 166, 0.3)`,
                      }}
                    >
                      <GraduationCap size={28} className="text-teal-400" />
                    </div>
                    <h3
                      className="text-xl md:text-2xl font-black text-white uppercase"
                      style={cardTitleBaseStyles}
                    >
                      MARZ Academy
                    </h3>
                  </div>
                  <p className="text-neutral-400 text-sm leading-relaxed mb-6">
                    Master the Sovereignty Protocol. Learn to bridge, tokenize, and earn.
                  </p>

                  {/* Feature badges */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    <span className="rounded-full border px-3 py-1 text-xs font-medium" style={{
                      borderColor: `rgba(20, 184, 166, 0.3)`,
                      backgroundColor: `rgba(20, 184, 166, 0.05)`,
                      color: DESIGN_TOKENS.colors.brand.tealGlow,
                    }}>
                      Free Course
                    </span>
                    <span className="rounded-full border px-3 py-1 text-xs font-medium" style={{
                      borderColor: `rgba(20, 184, 166, 0.3)`,
                      backgroundColor: `rgba(20, 184, 166, 0.05)`,
                      color: DESIGN_TOKENS.colors.brand.tealGlow,
                    }}>
                      50 Credits
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-sm font-bold uppercase" style={{ color: DESIGN_TOKENS.colors.brand.tealGlow, letterSpacing: "0.15em" }}>
                    <span>Start Learning</span>
                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
