"use client";

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/components/auth-provider';
import { db } from '@/lib/firebase';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { CheckCircle2, Clock, MessageSquare, Send, Bot, AlertCircle } from 'lucide-react';

export default function FollowUpsPage() {
  const { user } = useAuth();
  const [followups, setFollowups] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const q = query(
      collection(db, 'followups'),
      where('userId', '==', user.uid)
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setFollowups(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [user]);

  const pendingFollowups = followups.filter(f => f.status === 'pending');
  const pastFollowups = followups.filter(f => f.status === 'sent' || f.status === 'dismissed');

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-[#f8fafc]">
      <div className="max-w-5xl mx-auto space-y-6">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-display font-semibold text-slate-900 tracking-tight">AI Follow-Up Queue</h1>
            <p className="text-slate-500 mt-1">Review and approve AI-generated messages before they send.</p>
          </div>
          <div className="flex items-center gap-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 px-4 py-2 rounded-full shadow-sm">
             <AlertCircle className="w-4 h-4 text-amber-500" />
             <span>{pendingFollowups.length} Pending Approvals</span>
          </div>
        </header>

        <div className="space-y-4">
          {followups.length === 0 ? (
            <div className="text-center p-12 bg-white rounded-2xl border border-slate-200">
              <p className="text-slate-500">No follow-ups generated yet. Once leads go cold, AI will draft messages here.</p>
            </div>
          ) : (
            followups.map((item) => (
              <FollowUpCard key={item.id} data={item} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

function FollowUpCard({ data }: { data: any }) {
  const isPending = data.status === 'pending';
  
  return (
    <div className={`bg-white rounded-2xl border transition-all shadow-sm flex flex-col md:flex-row gap-6 p-6
      ${isPending ? 'border-blue-200 relative overflow-hidden' : 'border-slate-200 opacity-70'}
    `}>
      {isPending && <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500"></div>}
      
      <div className="md:w-1/3 shrink-0">
        <div className="flex items-center justify-between mb-4">
          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
            isPending ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'
          }`}>
            {isPending ? 'Action Required' : 'Sent Successfully'}
          </span>
        </div>
        <div>
          <h3 className="font-semibold text-slate-900">{data.leadName || 'Unknown Lead'}</h3>
          <p className="text-sm text-slate-500 mt-0.5">{data.leadPhone}</p>
        </div>
        <div className="mt-4 flex items-center gap-2 text-xs text-slate-500">
           {isPending ? <Clock className="w-4 h-4 text-slate-400" /> : <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
           <span>{isPending ? 'Due Today' : 'Sent Yesterday'}</span>
        </div>
      </div>
      
      <div className="flex-1 bg-slate-50 rounded-xl p-4 border border-slate-100 relative">
        <div className="flex items-center gap-2 mb-3">
          <Bot className="w-4 h-4 text-purple-600" />
          <span className="text-xs font-medium text-slate-600 uppercase tracking-wider">AI Generated Draft</span>
        </div>
        <p className="text-sm text-slate-700 leading-relaxed italic">&quot;{data.messageDraft}&quot;</p>
        
        {isPending && (
          <div className="mt-6 flex flex-wrap gap-3">
            <button className="flex-1 sm:flex-none px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors shadow-sm flex items-center justify-center gap-2">
              <Send className="w-4 h-4" />
              Approve & Send Now
            </button>
            <button className="flex-1 sm:flex-none px-6 py-2.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-lg text-sm font-medium transition-colors">
              Edit Draft
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
