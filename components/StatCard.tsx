
import React from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color?: 'blue' | 'amber' | 'emerald';
}

export const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color }) => {
  const colorClasses = {
    blue: 'text-blue-500',
    amber: 'text-amber-500',
    emerald: 'text-emerald-500',
  };
  const bgColorClasses = {
    blue: 'bg-blue-100 dark:bg-blue-900/50',
    amber: 'bg-amber-100 dark:bg-amber-900/50',
    emerald: 'bg-emerald-100 dark:bg-emerald-900/50',
  };

  const iconColor = color ? colorClasses[color] : 'text-gray-500';
  const iconBgColor = color ? bgColorClasses[color] : 'bg-gray-100 dark:bg-gray-700';

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
      <div className="flex items-center">
        <div className={`p-3 rounded-full ${iconBgColor} ${iconColor}`}>
          {icon}
        </div>
        <div className="ml-4">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">{title}</p>
          <p className="text-2xl font-semibold text-gray-900 dark:text-white">{value}</p>
        </div>
      </div>
    </div>
  );
};
