"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Sparkles, BrainCircuit, RefreshCw, MessageSquare } from 'lucide-react';
import { useAuth } from '@/components/auth-provider';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

export default function InsightsPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [insights, setInsights] = useState<string>('');

  const generateInsights = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const q = query(collection(db, 'leads'), where('userId', '==', user.uid));
      const snapshot = await getDocs(q);
      const leads = snapshot.docs.map(doc => doc.data());
      
      const hot = leads.filter(l => l.status === 'hot').length;
      const warm = leads.filter(l => l.status === 'warm').length;
      const cold = leads.filter(l => l.status === 'cold').length;

      const response = await fetch('/api/gemini/insights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ hot, warm, cold })
      });
      const data = await response.json();
      setInsights(data.text);
    } catch (e) {
      console.error(e);
      setInsights("Failed to generate insights.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-[#f8fafc]">
      <div className="max-w-4xl mx-auto space-y-6">
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-display font-semibold text-slate-900 tracking-tight">AI Insights</h1>
            <p className="text-slate-500 mt-1">Let Gemini analyze your pipeline and suggest next steps.</p>
          </div>
          <button 
            onClick={generateInsights}
            disabled={loading}
            className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:opacity-90 text-white px-5 py-2.5 rounded-full text-sm font-medium transition-all shadow-sm shadow-purple-600/20 disabled:opacity-50"
          >
            {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            <span>{loading ? 'Analyzing...' : 'Generate New Insights'}</span>
          </button>
        </header>

        {insights ? (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8"
          >
            <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4">
              <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center">
                <BrainCircuit className="w-5 h-5 text-purple-600" />
              </div>
              <h2 className="text-xl font-semibold text-slate-900">LeadPilot Strategy Report</h2>
            </div>
            <div className="prose prose-slate prose-p:leading-relaxed prose-headings:font-display">
               <div dangerouslySetInnerHTML={{ __html: insights.replace(/\n/g, '<br/>') }} />
            </div>
          </motion.div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200 border-dashed shadow-sm p-12 text-center flex flex-col items-center">
             <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center mb-4">
                <BrainCircuit className="w-8 h-8 text-slate-300" />
             </div>
             <h3 className="text-lg font-medium text-slate-900 mb-2">No active insights</h3>
             <p className="text-slate-500 max-w-sm mb-6">Click the generate button above to have Gemini review your recent lead activity and propose follow-up strategies.</p>
          </div>
        )}
      </div>
    </div>
  );
}
