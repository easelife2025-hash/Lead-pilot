"use client";

import React, { useState, useEffect } from 'react';
import { Settings as SettingsIcon, Save } from 'lucide-react';
import { useAuth } from '@/components/auth-provider';
import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

export default function SettingsPage() {
  const { user } = useAuth();
  const [autoDraft, setAutoDraft] = useState(true);
  const [tone, setTone] = useState("Professional & Polished");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) return;
    const fetchSettings = async () => {
      const docRef = doc(db, 'settings', user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.autoDraft !== undefined) setAutoDraft(data.autoDraft);
        if (data.tone) setTone(data.tone);
      }
    };
    fetchSettings();
  }, [user]);

  const saveSettings = async () => {
    if (!user) return;
    setSaving(true);
    try {
      await setDoc(doc(db, 'settings', user.uid), {
        autoDraft,
        tone
      }, { merge: true });
    } catch (e) {
      console.error(e);
    }
    setTimeout(() => setSaving(false), 500); // UI feedback
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-[#f8fafc]">
      <div className="max-w-4xl mx-auto space-y-6">
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-display font-semibold text-slate-900 tracking-tight">Settings</h1>
            <p className="text-slate-500 mt-1">Manage your account preferences and integrations.</p>
          </div>
          <button 
            onClick={saveSettings}
            disabled={saving}
            className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-full text-sm font-medium transition-colors disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Saving...' : 'Save Settings'}
          </button>
        </header>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden p-6">
          <h2 className="text-lg font-semibold text-slate-900 border-b border-slate-100 pb-4 mb-6">Profile Information</h2>
          <div className="space-y-4 max-w-md">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
              <input type="text" readOnly value={user?.displayName || ''} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm opacity-70" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
              <input type="text" readOnly value={user?.email || ''} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm opacity-70" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden p-6">
          <h2 className="text-lg font-semibold text-slate-900 border-b border-slate-100 pb-4 mb-6">AI Copilot Settings</h2>
          <div className="space-y-6">
             <div className="flex items-center justify-between">
               <div>
                  <h4 className="font-medium text-slate-900">Auto-Draft Follow Ups</h4>
                  <p className="text-sm text-slate-500">Allow AI to automatically prepare draft messages for leads silent &gt; 24h.</p>
               </div>
               <div 
                 onClick={() => setAutoDraft(!autoDraft)}
                 className={`w-11 h-6 rounded-full relative cursor-pointer shadow-inner transition-colors ${autoDraft ? 'bg-blue-600' : 'bg-slate-300'}`}
               >
                 <div className={`absolute top-1 bottom-1 w-4 bg-white rounded-full transition-all ${autoDraft ? 'right-1' : 'left-1'}`}></div>
               </div>
             </div>
             <div className="flex items-center justify-between">
               <div>
                  <h4 className="font-medium text-slate-900">Tone of Voice</h4>
                  <p className="text-sm text-slate-500">Adjust the personality of the AI-generated responses.</p>
               </div>
               <select 
                 value={tone}
                 onChange={(e) => setTone(e.target.value)}
                 className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
               >
                 <option value="Professional & Polished">Professional & Polished</option>
                 <option value="Friendly & Casual">Friendly & Casual</option>
                 <option value="Direct & Concise">Direct & Concise</option>
               </select>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
