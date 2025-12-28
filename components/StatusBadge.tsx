
import React from 'react';
import { Status } from '../types';

interface StatusBadgeProps {
  status: Status;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className = '' }) => {
  const baseClasses = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium';
  
  const colorClasses = {
    [Status.New]: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    [Status.InProgress]: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    [Status.Resolved]: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    [Status.Closed]: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
  };

  return (
    <span className={`${baseClasses} ${colorClasses[status]} ${className}`}>
      {status}
    </span>
  );
};
