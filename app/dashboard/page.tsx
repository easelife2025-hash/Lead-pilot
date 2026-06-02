export default function DashboardOverview() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-sm font-medium text-slate-500">Total Leads</h3>
          <p className="text-3xl font-bold text-slate-900 mt-2">1,248</p>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-green-600 font-medium">+12%</span>
            <span className="text-slate-500 ml-2">from last month</span>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-sm font-medium text-slate-500">Active Conversations</h3>
          <p className="text-3xl font-bold text-slate-900 mt-2">84</p>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-green-600 font-medium">+5%</span>
            <span className="text-slate-500 ml-2">from last week</span>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-sm font-medium text-slate-500">Conversion Rate</h3>
          <p className="text-3xl font-bold text-slate-900 mt-2">24.8%</p>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-green-600 font-medium">+2.1%</span>
            <span className="text-slate-500 ml-2">from last month</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 line-clamp-6 min-h-[400px] flex items-center justify-center">
        <div className="text-center text-slate-500">
          <p>Main dashboard overview widgets will appear here.</p>
          <p className="text-sm mt-2">Connecting to Firebase for real-time updates...</p>
        </div>
      </div>
    </div>
  );
}
