"use client";

export default function StatCard({ icon, label, value, bgClass, borderClass, iconSize = "text-4xl" }) {
  return (
    <div className={`bg-lake-pink/20 border-2 border-lake-pink rounded-3xl p-6 flex items-center gap-4 shadow-sm ${bgClass} ${borderClass}`}>
      <div className={iconSize}>{icon}</div>
      <div>
        <p className="text-sm text-gray-600 font-bold uppercase">{label}</p>
        <p className="text-3xl font-extrabold text-lake-dark">{value}</p>
      </div>
    </div>
  );
}