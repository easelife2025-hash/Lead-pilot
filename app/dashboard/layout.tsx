"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Home, Users, MessageSquare, Settings, LogOut, PieChart } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { auth } from '../../lib/firebase';
import { onAuthStateChanged, signOut, User } from 'firebase/auth';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        router.push('/');
      } else {
        setUser(currentUser);
      }
      setIsInitializing(false);
    });
    return () => unsubscribe();
  }, [router]);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      router.push('/');
    } catch (error) {
      console.error("Sign out error", error);
    }
  };

  const navigation = [
    { name: 'Overview', href: '/dashboard', icon: Home },
    { name: 'Leads', href: '/dashboard/leads', icon: Users },
    { name: 'Messages', href: '/dashboard/whatsapp', icon: MessageSquare },
    { name: 'Insights', href: '/dashboard/insights', icon: PieChart },
    { name: 'Settings', href: '/dashboard/settings', icon: Settings },
  ];

  if (isInitializing || !user) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <p className="text-slate-500 font-medium animate-pulse">Loading dashboard...</p>
      </div>
    );
  }

  const initials = user?.displayName
    ? user.displayName.split(' ').map((n: string) => n[0]).join('').toUpperCase().substring(0, 2)
    : 'U';

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Sidebar */}
      <div className="w-64 bg-slate-900 border-r border-slate-800 text-slate-300 flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-slate-800">
          <span className="text-xl font-bold text-white flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-sm">LP</span>
            </div>
            LeadPilot
          </span>
        </div>
        
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive 
                    ? 'bg-blue-600 text-white' 
                    : 'hover:bg-slate-800 hover:text-white'
                }`}
              >
                <item.icon className="w-5 h-5" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <div className="mb-4 px-3">
            <p className="text-sm font-medium text-white truncate">{user.displayName || 'User'}</p>
            <p className="text-xs text-slate-500 truncate">{user.email}</p>
          </div>
          <button 
            onClick={handleSignOut}
            className="flex items-center gap-3 px-3 py-2 w-full text-left rounded-md text-sm font-medium text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Sign Out
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8">
          <h2 className="text-xl font-semibold text-slate-800 capitalize">
            {pathname.split('/').pop() || 'Dashboard'}
          </h2>
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-sm font-medium text-slate-600" title={user.email || ''}>
              {initials}
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
