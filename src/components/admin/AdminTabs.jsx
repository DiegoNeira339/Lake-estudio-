"use client";

export default function AdminTabs({ activeTab, onTabChange, stats }) {
  const tabs = [
    { id: 'reservas', label: '📅 Citas', count: stats?.reservasCount },
    { id: 'galeria', label: '📸 Galería', count: stats?.fotosCount },
    { id: 'servicios', label: '✨ Servicios', count: stats?.serviciosCount },
    { id: 'horarios', label: '⏰ Horarios', count: stats?.horariosCount },
  ];

  return (
    <div className="flex gap-4 mb-8 border-b-2 border-gray-200 pb-4 overflow-x-auto scrollbar-hide">
      {tabs.map(tab => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`font-bold px-6 py-2 rounded-full transition-colors whitespace-nowrap ${
            activeTab === tab.id 
              ? 'bg-lake-dark text-white shadow-md' 
              : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
          }`}
        >
          {tab.label}
          {tab.count !== undefined && (
            <span className="ml-2 bg-white/50 px-2 py-0.5 rounded-full text-xs font-bold">
              {tab.count}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}