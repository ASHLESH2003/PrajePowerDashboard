import React, { useMemo } from 'react';
import { Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend as RechartsLegend } from 'recharts';
import type { Issue } from '../types';
import { StatCard } from './StatCard';
import { DocumentReportIcon, ClockIcon, CheckCircleIcon, PlusCircleIcon } from './icons/Icons';

interface DashboardProps {
  issues: Issue[];
  stats: {
    total: number;
    resolved: number;
    inProgress: number;
    newIssues: number;
  };
}

// COLORS mapped to: [New, In Progress, Resolved]
// New: Blue, In Progress: Yellow/Amber, Resolved: Green
const COLORS = ['#3B82F6', '#F59E0B', '#10B981'];

export const Dashboard: React.FC<DashboardProps> = ({ issues, stats }) => {

  const statusData = useMemo(() => {
      return [
        { name: 'New', value: stats.newIssues },        // Index 0 -> Blue
        { name: 'In Progress', value: stats.inProgress }, // Index 1 -> Yellow
        { name: 'Resolved', value: stats.resolved },      // Index 2 -> Green
    ];
  }, [stats]);

  return (
    <div className="space-y-6">
      {/* STATS GRID: 1 col on mobile, 2 on tablet, 4 on desktop */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
        <StatCard 
            title="Total Issues" 
            value={stats.total} 
            icon={<DocumentReportIcon className="w-8 h-8" />} 
        />
        <StatCard 
            title="New Issues" 
            value={stats.newIssues} 
            icon={<PlusCircleIcon className="w-8 h-8" />} 
            color="blue" 
        />
        <StatCard 
            title="In Progress" 
            value={stats.inProgress} 
            icon={<ClockIcon className="w-8 h-8" />} 
            color="amber" 
        />
        <StatCard 
            title="Resolved" 
            value={stats.resolved} 
            icon={<CheckCircleIcon className="w-8 h-8" />} 
            color="emerald" 
        />
      </div>
      
      {/* CHART SECTION: Responsive padding and height */}
      <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Issues by Status</h3>
        
        {/* Container controls the height based on screen size */}
        <div className="h-[300px] sm:h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
            <PieChart>
                <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius="80%" 
                fill="#8884d8"
                dataKey="value"
                nameKey="name"
                >
                {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
                </Pie>
                <Tooltip
                contentStyle={{
                    backgroundColor: 'rgba(31, 41, 55, 0.9)',
                    borderColor: 'rgba(75, 85, 99, 0.5)',
                    color: '#fff',
                    borderRadius: '0.5rem',
                    fontSize: '0.875rem'
                }}
                />
                <RechartsLegend 
                    wrapperStyle={{ paddingTop: '20px' }}
                    verticalAlign="bottom" 
                    height={36}
                />
            </PieChart>
            </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};