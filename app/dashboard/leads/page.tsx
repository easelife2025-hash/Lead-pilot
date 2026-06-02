export default function LeadsPage() {
  const leads = [
    { id: 1, name: 'Alice Smith', email: 'alice@example.com', status: 'New', date: 'Oct 24' },
    { id: 2, name: 'Bob Jones', email: 'bob@example.com', status: 'Contacted', date: 'Oct 23' },
    { id: 3, name: 'Charlie Davis', email: 'charlie@example.com', status: 'Qualified', date: 'Oct 22' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-900">All Leads</h2>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
          Import Leads
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50">
              <th className="px-6 py-4 font-medium text-slate-500 text-sm">Name</th>
              <th className="px-6 py-4 font-medium text-slate-500 text-sm">Email</th>
              <th className="px-6 py-4 font-medium text-slate-500 text-sm">Status</th>
              <th className="px-6 py-4 font-medium text-slate-500 text-sm">Added</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 text-sm">
            {leads.map((lead) => (
              <tr key={lead.id} className="hover:bg-slate-50">
                <td className="px-6 py-4 font-medium text-slate-900">{lead.name}</td>
                <td className="px-6 py-4 text-slate-500">{lead.email}</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    lead.status === 'New' ? 'bg-blue-100 text-blue-800' :
                    lead.status === 'Contacted' ? 'bg-amber-100 text-amber-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {lead.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-slate-500">{lead.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
