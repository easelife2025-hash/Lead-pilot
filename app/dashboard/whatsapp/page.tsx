"use client";

import React, { useState, useEffect } from 'react';
import { MessageCircle, CheckCircle2, QrCode, AlertCircle, RefreshCw } from 'lucide-react';
import { useAuth } from '@/components/auth-provider';
import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

export default function WhatsAppPage() {
  const { user } = useAuth();
  const [status, setStatus] = useState<'disconnected' | 'connecting' | 'connected'>('disconnected');

  useEffect(() => {
    if (!user) return;
    const fetchStatus = async () => {
      const docRef = doc(db, 'whatsapp', user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setStatus(docSnap.data().status || 'disconnected');
      }
    };
    fetchStatus();
  }, [user]);

  const setServerStatus = async (newStatus: 'disconnected' | 'connecting' | 'connected') => {
    setStatus(newStatus);
    if (!user) return;
    await setDoc(doc(db, 'whatsapp', user.uid), { status: newStatus }, { merge: true });
  };

  const handleConnect = () => {
    setServerStatus('connecting');
    setTimeout(() => {
      setServerStatus('connected');
    }, 2000);
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-[#f8fafc]">
      <div className="max-w-3xl mx-auto space-y-6">
        <header>
          <h1 className="text-3xl font-display font-semibold text-slate-900 tracking-tight">WhatsApp Sync</h1>
          <p className="text-slate-500 mt-1">Connect your WhatsApp Business account to automate follow-ups.</p>
        </header>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden p-8">
          {status === 'disconnected' && (
            <div className="text-center flex flex-col items-center">
              <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mb-6">
                <MessageCircle className="w-10 h-10 text-green-500" />
              </div>
              <h2 className="text-xl font-bold text-slate-900 mb-3">Connect WhatsApp Business</h2>
              <p className="text-slate-600 mb-8 max-w-md">Scan a QR code to securely link your WhatsApp account. We will sync leads and allow you to send automated AI responses.</p>
              <button 
                onClick={handleConnect}
                className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-full font-medium transition-colors shadow-sm shadow-green-600/20"
              >
                Link Account Now
              </button>
            </div>
          )}

          {status === 'connecting' && (
            <div className="text-center flex flex-col items-center py-12">
              <RefreshCw className="w-12 h-12 text-blue-500 animate-spin mb-6" />
              <h2 className="text-xl font-bold text-slate-900 mb-2">Generating Secure Token...</h2>
              <p className="text-slate-500">Please wait while we establish a secure connection.</p>
            </div>
          )}

          {status === 'connected' && (
            <div className="flex flex-col md:flex-row gap-8 items-start">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle2 className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">Successfully Connected</h2>
                    <p className="text-sm text-green-600 font-medium">WhatsApp Business API is active.</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-slate-900 text-sm">Automated Follow-ups Enabled</h4>
                      <p className="text-xs text-slate-600 mt-1">AI will now draft responses for leads that have been silent for more than 24 hours.</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="w-full md:w-64 shrink-0 bg-slate-50 border border-slate-200 rounded-2xl p-6 text-center">
                <div className="w-16 h-16 bg-white rounded-2xl shadow-sm border border-slate-200 flex items-center justify-center mx-auto mb-4">
                  <QrCode className="w-8 h-8 text-slate-400" />
                </div>
                <h4 className="font-medium text-slate-900 text-sm mb-1">Session Active</h4>
                <p className="text-xs text-slate-500 mb-4">Logged in as +1 (555) 019-2834</p>
                <button 
                  onClick={() => setServerStatus('disconnected')}
                  className="w-full py-2 text-red-600 hover:bg-red-50 rounded-lg text-sm font-medium transition-colors"
                >
                  Disconnect
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
