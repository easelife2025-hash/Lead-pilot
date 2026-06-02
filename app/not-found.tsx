export default function NotFound() {
  return (
    <div className="flex h-screen items-center justify-center bg-slate-50">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-slate-800">404 - Not Found</h2>
        <p className="text-slate-500 mt-2">Could not find requested resource</p>
      </div>
    </div>
  );
}
