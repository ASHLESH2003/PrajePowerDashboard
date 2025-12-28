import React from 'react';
import { Priority } from '../types';

interface PriorityBadgeProps {
  priority?: Priority; // Made optional (?)
  className?: string;
}

// Set default value to Priority.High here
export const PriorityBadge: React.FC<PriorityBadgeProps> = ({ priority = Priority.High, className = '' }) => {
  const baseClasses = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium';
  
  const colorClasses = {
    [Priority.Low]: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
    [Priority.Medium]: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    [Priority.High]: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
    [Priority.Critical]: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
  };

  return (
    <span className={`${baseClasses} ${colorClasses[priority]} ${className}`}>
      {priority}
    </span>
  );
};