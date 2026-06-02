'use client';

import React from 'react';
import { useAuth } from '@/components/auth-provider';
import { useRouter, usePathname } from 'next/navigation';
import { 
  BarChart3, 
  MessageCircle, 
  Users, 
  Sparkles,
  Settings,
  BrainCircuit,
  LogOut,
  Menu,
  X
} from 'lucide-react';
import Link from 'next/link';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  React.useEffect(() => {
    if (!loading && !user) {
      router.push('/');
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#f8fafc]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  return (
    <div className="flex h-screen bg-[#f8fafc] overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-100 hidden md:flex flex-col shrink-0 relative z-20">
        <NavContent user={user} pathname={pathname} setMobileMenuOpen={setMobileMenuOpen} handleLogout={handleLogout} />
      </aside>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-40 flex">
          <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />
          <aside className="w-64 bg-white shadow-xl relative z-50 flex flex-col h-full transform transition-transform">
            <NavContent user={user} pathname={pathname} setMobileMenuOpen={setMobileMenuOpen} handleLogout={handleLogout} />
          </aside>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative min-w-0">
        <header className="md:hidden h-14 bg-white border-b border-slate-100 flex items-center px-4 shrink-0">
          <button onClick={() => setMobileMenuOpen(true)} className="p-2 -ml-2 text-slate-600">
            <Menu className="w-5 h-5" />
          </button>
          <span className="font-display font-semibold text-lg text-slate-900 ml-2">LeadPilot</span>
        </header>
        {children}
      </main>
    </div>
  );
}

function NavContent({ user, pathname, setMobileMenuOpen, handleLogout }: any) {
  return (
    <>
      <div className="h-16 flex items-center px-6 border-b border-slate-100 justify-between">
        <Link href="/dashboard" className="flex items-center gap-2 text-blue-600" onClick={() => setMobileMenuOpen(false)}>
          <BrainCircuit className="w-6 h-6" />
          <span className="font-display font-semibold text-xl text-slate-900 tracking-tight">
            LeadPilot
          </span>
        </Link>
        <button className="md:hidden text-slate-500" onClick={() => setMobileMenuOpen(false)}>
          <X className="w-5 h-5" />
        </button>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        <SidebarItem href="/dashboard" icon={BarChart3} label="Overview" active={pathname === '/dashboard'} onClick={() => setMobileMenuOpen(false)} />
        <SidebarItem href="/dashboard/leads" icon={Users} label="Lead Pipeline" active={pathname === '/dashboard/leads'} onClick={() => setMobileMenuOpen(false)} />
        <SidebarItem href="/dashboard/followups" icon={MessageCircle} label="Follow-Ups" active={pathname === '/dashboard/followups'} onClick={() => setMobileMenuOpen(false)} />
        <SidebarItem href="/dashboard/insights" icon={Sparkles} label="AI Insights" active={pathname === '/dashboard/insights'} onClick={() => setMobileMenuOpen(false)} />
        <SidebarItem href="/dashboard/whatsapp" icon={MessageCircle} label="WhatsApp Sync" active={pathname === '/dashboard/whatsapp'} onClick={() => setMobileMenuOpen(false)} />
      </nav>

      <div className="p-4 border-t border-slate-100">
        <SidebarItem href="/dashboard/settings" icon={Settings} label="Settings" active={pathname === '/dashboard/settings'} onClick={() => setMobileMenuOpen(false)} />
        <div className="mt-4 flex items-center justify-between px-3">
          <div className="flex items-center gap-3 min-w-0">
            {user?.photoURL ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={user.photoURL} alt={user.displayName || 'User'} className="w-8 h-8 rounded-full border border-slate-200" referrerPolicy="no-referrer" />
            ) : (
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center text-white font-medium text-sm shadow-inner shrink-0">
                {user?.displayName ? user.displayName.charAt(0) : 'U'}
              </div>
            )}
            <div className="flex-1 min-w-0 pr-2">
              <p className="text-sm font-medium text-slate-900 truncate">{user?.displayName || 'Agent'}</p>
              <p className="text-xs text-slate-500 truncate">{user?.email}</p>
            </div>
          </div>
          <button onClick={handleLogout} className="p-1.5 text-slate-400 hover:text-red-500 transition-colors rounded-lg hover:bg-slate-50 shrink-0">
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </>
  );
}

function SidebarItem({ icon: Icon, label, active, badge, href, onClick }: any) {
  return (
    <Link 
      href={href}
      onClick={onClick}
      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all ${
        active 
          ? 'bg-blue-50 text-blue-700' 
          : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
      }`}
    >
      <div className="flex items-center gap-3">
        <Icon className={`w-5 h-5 ${active ? 'text-blue-600' : 'text-slate-400'}`} />
        <span className="font-medium text-sm">{label}</span>
      </div>
      {badge && (
        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
          active ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-700'
        }`}>
          {badge}
        </span>
      )}
    </Link>
  );
}
