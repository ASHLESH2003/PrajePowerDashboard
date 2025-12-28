import React from 'react';
import { BellIcon, LogoutIcon } from './icons/Icons';
import { useAuth } from '../contexts/AuthContext';
import type { User } from '../types';

// 1. Updated props interface to accept the onMenuClick function
interface HeaderProps {
  user: User;
  onMenuClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ user, onMenuClick }) => {
  const { logout } = useAuth();

  return (
    <header className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 h-16 flex-shrink-0">
      <div className="flex items-center">
        {/* 2. Added Hamburger Button (Mobile Only) */}
        <button
          onClick={onMenuClick}
          className="p-2 mr-3 -ml-2 text-gray-600 rounded-md md:hidden hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-gray-300 dark:hover:bg-gray-700"
          aria-label="Open sidebar"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        {/* Original Title */}
        <h1 className="text-xl font-semibold text-gray-800 dark:text-white">Issue Resolution Dashboard</h1>
      </div>

      {/* Original User Controls */}
      <div className="flex items-center space-x-4">
        <span className="text-sm text-gray-600 dark:text-gray-300 hidden sm:block">Welcome, {user.name}</span>
        <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
          <BellIcon className="h-6 w-6 text-gray-500 dark:text-gray-400" />
        </button>
        <button onClick={logout} className="flex items-center p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 text-sm text-gray-600 dark:text-gray-300">
          <LogoutIcon className="h-5 w-5 text-gray-500 dark:text-gray-400 mr-2" />
          Logout
        </button>
      </div>
    </header>
  );
};