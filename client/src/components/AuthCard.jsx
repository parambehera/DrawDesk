export default function AuthCard({ title, children }) {
  return (
    <div className="h-[80vh] flex items-center justify-center bg-white">
      <div className="w-full max-w-md bg-white shadow-xl border rounded-2xl p-8">
        <h1 className="text-3xl font-bold text-black mb-6">{title}</h1>
        {children}
      </div>
    </div>
  );
}
