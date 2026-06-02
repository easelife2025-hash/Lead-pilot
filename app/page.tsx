"use client";

import React, { useEffect, useState } from 'react';
import { auth } from '../lib/firebase';
import { GoogleAuthProvider, signInWithPopup, onAuthStateChanged } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

export default function Page() {
  const [status, setStatus] = useState("Checking authentication...");
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        router.push('/dashboard');
      } else {
        setIsLoading(false);
        setStatus("");
      }
    });
    return () => unsubscribe();
  }, [router]);

  const handleSignIn = async () => {
    setIsLoading(true);
    setStatus("Signing in...");
    const provider = new GoogleAuthProvider();
    try {
      // In iframes, signInWithPopup can sometimes be blocked, but we'll try it first
      await signInWithPopup(auth, provider);
    } catch (error) {
      const err = error as Error;
      console.error("Auth error:", err);
      setStatus(`Failed: ${err.message}`);
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50 flex-col items-center justify-center p-24">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-sm border border-slate-200 text-center">
        <div className="w-16 h-16 bg-blue-600 rounded-xl mx-auto mb-6 flex items-center justify-center shadow-inner">
          <span className="text-white text-2xl font-bold">LP</span>
        </div>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">LeadPilot</h1>
        <p className="text-slate-500 mb-8">Sign in to your workspace</p>
        
        {isLoading ? (
          <div className="flex items-center justify-center space-x-3 text-slate-600">
            <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
            <span className="font-medium text-sm">{status}</span>
          </div>
        ) : (
          <div className="space-y-4">
            <button
              onClick={handleSignIn}
              className="w-full flex items-center justify-center gap-3 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 px-4 py-3 rounded-xl font-medium transition-colors"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Continue with Google
            </button>
            
            {status && (
              <p className="text-xs text-red-500 max-w-sm mx-auto p-3 bg-red-50 rounded-lg">
                <span className="font-bold block mb-1">Sign-in failed</span>
                {status}
                <br /><br />
                <span className="block italic">Tip: If you get an iframe error or origin mismatch, please refresh and click &quot;Open in New Tab&quot; at the top right of the preview window. Also ensure this preview URL is added to Firebase Authorized Domains.</span>
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
