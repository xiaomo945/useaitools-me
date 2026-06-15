export default function StatsBanner() {
  const stats = [
    { value: '1,300+', label: 'AI Tools', icon: '🛠️' },
    { value: '20+', label: 'Categories', icon: '📂' },
    { value: '700+', label: 'Reviews', icon: '⭐' },
    { value: 'Weekly', label: 'Updates', icon: '🔄' },
  ];

  return (
    <div className="mb-8 sm:mb-16 mx-auto max-w-4xl">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="text-center p-4 rounded-2xl bg-white dark:bg-gray-900 border border-slate-200/60 dark:border-gray-800 shadow-sm">
            <div className="text-2xl mb-1">{stat.icon}</div>
            <div className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">{stat.value}</div>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">{stat.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}