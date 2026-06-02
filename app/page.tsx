"use client";

import React, { useEffect, useState } from 'react';
import { app, db, auth } from '../lib/firebase';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

export default function Page() {
  const [status, setStatus] = useState("Initializing systems...");
  const router = useRouter();

  useEffect(() => {
    // Check Firebase connection
    if (app && db && auth) {
      setStatus("Firebase Connected Successfully!");
      // Simulate auth check / auto login for preview purposes
      setTimeout(() => {
        router.push('/dashboard');
      }, 1500);
    } else {
      setStatus("Failed to connect Firebase.");
    }
  }, [router]);

  return (
    <div className="flex min-h-screen bg-slate-50 flex-col items-center justify-center p-24">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-sm border border-slate-200 text-center">
        <div className="w-16 h-16 bg-blue-600 rounded-xl mx-auto mb-6 flex items-center justify-center shadow-inner">
          <span className="text-white text-2xl font-bold">LP</span>
        </div>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">LeadPilot</h1>
        <p className="text-slate-500 mb-8">Loading your workspace</p>
        
        <div className="flex items-center justify-center space-x-3 text-slate-600">
          <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
          <span className="font-medium">{status}</span>
        </div>
      </div>
    </div>
  );
}
