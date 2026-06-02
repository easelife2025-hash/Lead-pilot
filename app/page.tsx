"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, useScroll, useTransform } from 'motion/react';
import { ArrowRight, BrainCircuit, MessageCircle, BarChart3, Users, Zap, Shield, Play } from 'lucide-react';
import { useAuth } from '@/components/auth-provider';
import { useRouter } from 'next/navigation';

const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
};

export default function LandingPage() {
  const { user, loginWithGoogle, loading } = useAuth();
  const router = useRouter();
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95]);

  useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard');
    }
  }, [user, loading, router]);

  if (!loading && user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans selection:bg-blue-100 selection:text-blue-900 flex flex-col overflow-hidden">
      {/* Navigation */}
      <motion.nav 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="border-b border-white/20 bg-white/60 backdrop-blur-xl sticky top-0 z-50 shadow-sm shadow-slate-200/20"
      >
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 text-blue-600">
            <BrainCircuit className="w-7 h-7" />
            <span className="font-display font-bold text-2xl tracking-tight text-slate-900">LeadPilot</span>
          </div>
          <div className="flex items-center gap-4">
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={loginWithGoogle}
              disabled={loading}
              className="px-6 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-full font-medium transition-all shadow-sm hover:shadow active:scale-95 disabled:opacity-50"
            >
              Sign In
            </motion.button>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <main className="flex-1 relative">
        {/* Background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[400px] bg-blue-100/40 rounded-[100%] blur-3xl -z-10 pointer-events-none"></div>

        <section className="px-6 pt-32 pb-32 max-w-5xl mx-auto relative">
          <motion.div 
            style={{ opacity, scale }}
            variants={staggerContainer}
            initial="hidden"
            animate="show"
            className="flex flex-col items-center text-center"
          >
            <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white text-blue-600 font-medium text-sm mb-8 border border-blue-100 shadow-sm">
              <SparkleIcon className="w-4 h-4" />
              <span>AI-Powered Real Estate Assistant</span>
            </motion.div>
            
            <motion.h1 variants={fadeUp} className="text-5xl md:text-7xl font-display font-bold tracking-tight text-slate-900 leading-[1.1] mb-8 max-w-4xl">
              Don&apos;t let <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">WhatsApp leads</span> go cold.
            </motion.h1>
            
            <motion.p variants={fadeUp} className="text-xl text-slate-600 mb-12 max-w-2xl mx-auto leading-relaxed">
              Automate follow-ups, resurrect cold leads, and close more deals with a smart AI copilot that acts like your personal assistant.
            </motion.p>
            
            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={loginWithGoogle}
                className="w-full sm:w-auto px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-medium text-lg transition-all shadow-lg shadow-blue-600/25 hover:shadow-xl hover:-translate-y-0.5 flex items-center justify-center gap-2 group"
              >
                Get Started Free <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </motion.button>
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full sm:w-auto px-8 py-4 bg-white hover:bg-slate-50 text-slate-900 rounded-full font-medium text-lg transition-all shadow-sm border border-slate-200 flex items-center justify-center gap-2"
              >
                <Play className="w-4 h-4" /> Watch Demo
              </motion.button>
            </motion.div>
          </motion.div>
        </section>

        {/* Features Grid */}
        <section className="bg-white border-y border-slate-200 py-32 px-6 relative z-10">
          <div className="max-w-7xl mx-auto">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5 }}
              className="text-center mb-20"
            >
              <h2 className="text-3xl md:text-5xl font-display font-bold text-slate-900 mb-6 tracking-tight">Everything you need to close more deals</h2>
              <p className="text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed">LeadPilot integrates directly into your workflow to make sure no potential client slips through the cracks.</p>
            </motion.div>
            
            <motion.div 
              variants={staggerContainer}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-100px" }}
              className="grid md:grid-cols-3 gap-8"
            >
              <FeatureCard 
                icon={<MessageCircle className="w-7 h-7 text-emerald-500" />}
                title="WhatsApp Sync"
                desc="Automatically import and sync conversations. Identify buying intent and prioritize follow-ups effortlessly."
              />
              <FeatureCard 
                icon={<BrainCircuit className="w-7 h-7 text-purple-500" />}
                title="AI Follow-Up Drafter"
                desc="Generate context-aware responses instantly. Save hours of typing and send the perfect message every time."
              />
              <FeatureCard 
                icon={<BarChart3 className="w-7 h-7 text-blue-500" />}
                title="Pipeline Insights"
                desc="Track your hot, warm, and cold leads with actionable metrics and revenue projections at a glance."
              />
            </motion.div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-slate-50 py-12 px-6 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2 text-slate-900">
            <BrainCircuit className="w-5 h-5 text-blue-600" />
            <span className="font-display font-semibold">LeadPilot</span>
          </div>
          <p className="text-sm text-slate-500">
            &copy; {new Date().getFullYear()} LeadPilot. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

function SparkleIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
      <path d="M5 3v4" />
      <path d="M19 17v4" />
      <path d="M3 5h4" />
      <path d="M17 19h4" />
    </svg>
  );
}

function FeatureCard({ icon, title, desc }: any) {
  return (
    <motion.div 
      variants={fadeUp}
      whileHover={{ y: -8, transition: { duration: 0.2 } }}
      className="flex flex-col bg-slate-50 rounded-3xl p-8 border border-slate-200 transition-shadow hover:shadow-lg hover:shadow-slate-200/50 hover:bg-white"
    >
      <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center mb-6 shadow-sm border border-slate-100">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-slate-900 mb-3">{title}</h3>
      <p className="text-slate-600 leading-relaxed text-sm">{desc}</p>
    </motion.div>
  );
}

