import React from 'react';
import { DashboardIcon, ListIcon, UserCircleIcon } from './icons/Icons';
import type { User } from '../types';

type View = 'dashboard' | 'issues';

interface SidebarProps {
  user: User;
  currentView: View;
  setCurrentView: (view: View) => void;
  // 1. New props for responsiveness
  isOpen: boolean;
  onClose: () => void;
}

const NavItem: React.FC<{
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick: () => void;
}> = ({ icon, label, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`flex items-center w-full px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-200 ${isActive
      ? 'bg-blue-600 text-white'
      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
      }`}
  >
    {icon}
    <span className="ml-3">{label}</span>
  </button>
);

export const Sidebar: React.FC<SidebarProps> = ({ user, currentView, setCurrentView, isOpen, onClose }) => {
  return (
    <>
      {/* 2. Mobile Overlay (Black background that closes menu on click) */}
      <div
        className={`fixed inset-0 z-20 bg-black bg-opacity-50 transition-opacity md:hidden ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* 3. Sidebar Container with Responsive Classes */}
      <div
        className={`
          fixed inset-y-0 left-0 z-30 flex flex-col w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700
          transform transition-transform duration-300 ease-in-out
          md:translate-x-0 md:static md:inset-auto
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <div className="p-4">
          <div className="flex items-center space-x-2 px-2">
            {/* START OF LOGO REPLACEMENT: Replaced SVG with img tag */}
            <img
              src="/FinalLogo.png" // Your logo path
              alt="App Logo"
              className="w-8 h-8 rounded-lg" // Matching the original SVG size and adding rounded corners
            />
            {/* END OF LOGO REPLACEMENT */}
            <span className="text-xl font-bold text-gray-800 dark:text-white">Praje Power</span>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          <NavItem
            icon={<DashboardIcon className="w-5 h-5" />}
            label="Dashboard"
            isActive={currentView === 'dashboard'}
            onClick={() => setCurrentView('dashboard')}
          />
          <NavItem
            icon={<ListIcon className="w-5 h-5" />}
            label="All Issues"
            isActive={currentView === 'issues'}
            onClick={() => setCurrentView('issues')}
          />
        </nav>

        <div className="border-t border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center space-x-3 p-2">
            <UserCircleIcon className="w-10 h-10 text-gray-400" />
            <div>
              <p className="font-semibold text-sm text-gray-800 dark:text-white">{user.name}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{user.role}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};