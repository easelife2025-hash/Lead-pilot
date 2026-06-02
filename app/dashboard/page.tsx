"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import type { Variants } from 'motion/react';
import { 
  Bell, 
  Search, 
  ChevronRight, 
  MessageCircle,
  ArrowUpRight,
  Sparkles,
  Filter,
  UserPlus,
  ArrowRight,
  Clock
} from 'lucide-react';
import Image from 'next/image';
import { useAuth } from '@/components/auth-provider';
import { db } from '@/lib/firebase';
import { collection, query, where, onSnapshot } from 'firebase/firestore';

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } }
};

export default function DashboardOverview() {
  const { user } = useAuth();
  const [leads, setLeads] = useState<any[]>([]);
  const [followups, setFollowups] = useState<any[]>([]);
  
  useEffect(() => {
    if (!user) return;
    
    const leadsQ = query(collection(db, 'leads'), where('userId', '==', user.uid));
    const unsubLeads = onSnapshot(leadsQ, (snap) => setLeads(snap.docs.map(d => ({id: d.id, ...d.data()}))));
    
    const followupsQ = query(collection(db, 'followups'), where('userId', '==', user.uid));
    const unsubFollowups = onSnapshot(followupsQ, (snap) => setFollowups(snap.docs.map(d => ({id: d.id, ...d.data()}))));
    
    return () => {
      unsubLeads();
      unsubFollowups();
    };
  }, [user]);

  const hotLeads = leads.filter(l => l.status === 'hot').length;
  const warmLeads = leads.filter(l => l.status === 'warm').length;
  const coldLeads = leads.filter(l => l.status === 'cold').length;
  const totalRevenue = leads.reduce((acc, l) => acc + (l.potentialRevenue || 0), 0);
  
  const pendingFollowups = followups.filter(f => f.status === 'pending');
  const recentActivities = [
    ...leads.map(l => ({ type: 'lead', title: 'New Lead Added', desc: `${l.name} added to pipeline.`, date: l.createdAt?.toDate() || new Date() })),
    ...followups.filter(f => f.status === 'sent').map(f => ({ type: 'whatsapp', title: 'Follow-up Sent', desc: `Automated message sent to ${f.leadName || 'lead'}`, date: f.createdAt?.toDate() || new Date() }))
  ].sort((a, b) => b.date.getTime() - a.date.getTime()).slice(0, 5);

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-[#f8fafc]">
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-display font-semibold text-slate-900 tracking-tight">Overview</h1>
          <p className="text-slate-500 mt-1">Here&apos;s what your AI Copilot has been doing today.</p>
        </div>
      </motion.header>

      {/* Stats Row */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8"
      >
        <StatCard title="Hot Leads" value={hotLeads} trend="Active" trendLabel="pipeline" icon={<Sparkles className="w-4 h-4 text-orange-500" />} color="orange" delay={0.1} />
        <StatCard title="Warm Leads" value={warmLeads} trend="Active" trendLabel="pipeline" icon={<MessageCircle className="w-4 h-4 text-blue-500" />} color="blue" delay={0.2} />
        <StatCard title="Cold Leads" value={coldLeads} trend="Sleeping" trendLabel="pipeline" icon={<Filter className="w-4 h-4 text-slate-500" />} color="slate" delay={0.3} />
        <StatCard title="Potential Revenue" value={`$${totalRevenue.toLocaleString()}`} trend="Total" trendLabel="pipeline" icon={<ArrowUpRight className="w-4 h-4 text-emerald-500" />} color="emerald" delay={0.4} />
      </motion.div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8"
      >
        
        {/* Left Column: AI Actions */}
        <div className="lg:col-span-2 space-y-6">
          <motion.div variants={itemVariants} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
              <h2 className="font-semibold text-slate-900">Follow-Ups Due Today</h2>
            </div>
            <div className="divide-y divide-slate-100">
              {pendingFollowups.length === 0 ? (
                <div className="p-8 text-center text-slate-400">No pending follow-ups.</div>
              ) : (
                pendingFollowups.slice(0, 5).map(f => (
                  <InterventionRow 
                    key={f.id}
                    name={f.leadName || 'Unknown Lead'}
                    phone={f.leadPhone || ''}
                    time={f.dueAt || 'Pending'}
                    message={f.messageDraft}
                  />
                ))
              )}
            </div>
          </motion.div>

          {/* AI Suggestions */}
          <motion.div variants={itemVariants} className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl border border-blue-100 p-6 shadow-sm relative overflow-hidden">
            <div className="absolute -top-6 -right-6 w-24 h-24 bg-purple-200 rounded-full blur-2xl opacity-50 pointer-events-none"></div>
            <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-blue-200 rounded-full blur-2xl opacity-50 pointer-events-none"></div>
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-5 h-5 text-purple-600" />
                <h3 className="font-semibold text-slate-900">AI Recommendations</h3>
              </div>
              <div className="space-y-3">
                <SuggestionCard 
                  title="Re-engage Cold Leads"
                  description={`You have ${coldLeads} cold leads in your pipeline. I can draft updates to re-engage them.`}
                  action="Generate Drafts"
                />
                {pendingFollowups.length > 0 && (
                  <SuggestionCard 
                    title="Follow-ups Pending"
                    description={`You have ${pendingFollowups.length} follow-ups waiting for your approval.`}
                    action="View Follow-ups"
                  />
                )}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Right Column: Recent Activity */}
        <div className="space-y-6">
          <motion.div variants={itemVariants} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <h2 className="font-semibold text-slate-900 mb-6">Recent Activity Timeline</h2>
            
            <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent">
              {recentActivities.length === 0 ? (
                <div className="text-center text-sm text-slate-400 py-4">No recent activity.</div>
              ) : (
                recentActivities.map((act, idx) => (
                  <TimelineItem 
                    key={idx} 
                    type={act.type} 
                    title={act.title} 
                    desc={act.desc} 
                  />
                ))
              )}
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}

function StatCard({ title, value, trend, trendLabel, icon, color, delay }: any) {
  return (
    <motion.div 
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
      } as Variants}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm group cursor-default"
    >
      <div className="flex justify-between items-start mb-2">
        <p className="text-sm font-medium text-slate-500">{title}</p>
        <div className={`w-8 h-8 rounded-full bg-${color}-50 flex items-center justify-center text-${color}-600 group-hover:scale-110 transition-transform`}>
          {icon}
        </div>
      </div>
      <h3 className="text-3xl font-display font-semibold text-slate-900 mb-2">{value}</h3>
      <div className="flex items-center gap-1.5">
        <span className={`text-xs font-medium text-${color}-600 bg-${color}-50 px-1.5 py-0.5 rounded`}>
          {trend}
        </span>
        <span className="text-xs text-slate-500">{trendLabel}</span>
      </div>
    </motion.div>
  );
}

function InterventionRow({ name, phone, time, message }: any) {
  return (
    <div className="p-4 sm:px-6 hover:bg-slate-50 transition-colors group flex items-start gap-4 cursor-pointer">
      <div className="relative w-10 h-10 shrink-0 hidden sm:flex items-center justify-center bg-blue-100 text-blue-600 rounded-full font-bold">
        {name.charAt(0)}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center justify-between mb-1 gap-2">
          <h4 className="font-medium text-slate-900 text-sm truncate">{name}</h4>
          <span className="text-xs text-slate-500 whitespace-nowrap flex items-center gap-1 bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full"><Clock className="w-3 h-3" /> {time}</span>
        </div>
        <div className="flex flex-wrap items-center gap-2 mb-2">
          <span className="text-xs text-slate-500">{phone}</span>
        </div>
        <p className="text-sm text-slate-600 truncate">{message}</p>
      </div>
      <div className="shrink-0 pt-2 opacity-0 group-hover:opacity-100 transition-opacity translate-x-2 group-hover:translate-x-0">
        <ChevronRight className="w-5 h-5 text-slate-400" />
      </div>
    </div>
  );
}

function SuggestionCard({ title, description, action }: any) {
  return (
    <motion.div 
      whileHover={{ y: -2 }}
      className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-sm border border-white"
    >
      <h4 className="font-medium text-slate-900 text-sm mb-1">{title}</h4>
      <p className="text-xs text-slate-600 mb-3 leading-relaxed">{description}</p>
      <button className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 group">
        {action}
        <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
      </button>
    </motion.div>
  );
}

function TimelineItem({ type, title, desc }: any) {
  const getIcon = () => {
    switch (type) {
      case 'whatsapp': return <MessageCircle className="w-3.5 h-3.5 text-emerald-500" />;
      case 'ai': return <Sparkles className="w-3.5 h-3.5 text-purple-500" />;
      case 'lead': return <UserPlus className="w-3.5 h-3.5 text-blue-500" />;
      default: return <Bell className="w-3.5 h-3.5 text-slate-500" />;
    }
  };
  
  return (
    <div className="relative flex items-start gap-4 group">
      <div className="relative z-10 w-8 h-8 rounded-full bg-white border-2 border-slate-200 flex items-center justify-center shrink-0 group-hover:border-blue-500 transition-colors">
        {getIcon()}
      </div>
      <div className="flex-1 pt-1.5 pb-4">
        <h4 className="text-sm font-medium text-slate-900">{title}</h4>
        <p className="text-xs text-slate-600 mt-0.5">{desc}</p>
      </div>
    </div>
  );
}

