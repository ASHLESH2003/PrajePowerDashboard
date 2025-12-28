import React from 'react';
import type { Issue, User } from '../types';
import { StatusBadge } from './StatusBadge';
import { PriorityBadge } from './PriorityBadge';

interface IssueListProps {
  user: User;
  issues: Issue[];
  onSelectIssue: (issue: Issue) => void;
}

export const IssueList: React.FC<IssueListProps> = ({ issues, onSelectIssue }) => {
  return (
    <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-lg">
       <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">All Issues</h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">ID</th>
              <th scope="col" className="px-6 py-3">Title</th>
              <th scope="col" className="px-6 py-3">Category</th>
              {/* NEW COLUMN */}
              <th scope="col" className="px-6 py-3">Location</th> 
              <th scope="col" className="px-6 py-3">Priority</th>
              <th scope="col" className="px-6 py-3">Status</th>
              <th scope="col" className="px-6 py-3">Reported On</th>
            </tr>
          </thead>
          <tbody>
            {issues.map(issue => (
              <tr 
                key={issue.id} 
                onClick={() => onSelectIssue(issue)}
                className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 cursor-pointer"
              >
                <td className="px-6 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap">{issue.id.slice(0, 8)}...</td>
                <td className="px-6 py-4">{issue.title}</td>
                <td className="px-6 py-4">{issue.category}</td>
                
                {/* NEW LOCATION CELL */}
                <td className="px-6 py-4">
                    {issue.location ? (
                        <div className="flex flex-col space-y-1" onClick={(e) => e.stopPropagation()}>
                            <span className="text-xs text-gray-500">
                                {issue.location.lat.toFixed(4)}, {issue.location.lng.toFixed(4)}
                            </span>
                            <a 
                                href={`https://www.google.com/maps/search/?api=1&query=${issue.location.lat},${issue.location.lng}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs text-blue-600 hover:text-blue-800 hover:underline flex items-center"
                            >
                                View on Map
                                <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                            </a>
                        </div>
                    ) : (
                        <span className="text-gray-400">N/A</span>
                    )}
                </td>

                <td className="px-6 py-4"><PriorityBadge priority={issue.priority} /></td>
                <td className="px-6 py-4"><StatusBadge status={issue.status} /></td>
                <td className="px-6 py-4">{issue.reportedAt.toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};