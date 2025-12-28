import React, { useState, useCallback, useMemo } from 'react';
import { useIssues } from './hooks/useIssues';
// We don't need direct supabase import here anymore, the hook handles it
import type { Issue } from './types';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { IssueList } from './components/IssueList';
import { IssueDetailModal } from './components/IssueDetailModal';
import { useAuth } from './contexts/AuthContext';
import Login from './components/Login';

type View = 'dashboard' | 'issues';

const App: React.FC = () => {
  const { currentUser } = useAuth();
  
  // 👇 Get updateIssue from the hook (it has the fix for database mapping)
  const { 
    issues, 
    setIssues, 
    updateIssue, // <--- Make sure this is destructured
    isLoading: isIssuesLoading 
  } = useIssues();
  
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleViewChange = (view: View) => {
    setCurrentView(view);
    setIsSidebarOpen(false);
  };

  const handleSelectIssue = useCallback((issue: Issue) => {
    setSelectedIssue(issue);
  }, []);

  const handleCloseModal = useCallback(() => {
    setSelectedIssue(null);
  }, []);

  // --- FIXED UPDATE LOGIC ---
  const handleUpdateIssue = useCallback(async (issue: Issue, updates: Partial<Issue>) => {
    try {
        // 1. Call the HOOK function (Handles 'In Progress' -> 'IN_PROGRESS' mapping)
        await updateIssue(issue.id, updates);

        // 2. Optimistically Update Local State (For instant UI feedback)
        setIssues(prevIssues => 
            prevIssues.map(i => (i.id === issue.id ? { ...i, ...updates } : i))
        );

        // 3. Update the selected issue in the modal if it's open
        if(selectedIssue && selectedIssue.id === issue.id) {
            setSelectedIssue(prev => prev ? { ...prev, ...updates } : null);
        }

    } catch (err) {
        console.error("Error updating issue in App.tsx:", err);
        alert("Failed to update database. Check console for details.");
    }
  }, [selectedIssue, setIssues, updateIssue]); // Added updateIssue to dependencies
  
  const stats = useMemo(() => {
    const total = issues.length;
    const resolved = issues.filter(i => i.status === 'Resolved').length;
    const inProgress = issues.filter(i => i.status === 'In Progress').length;
    const newIssues = issues.filter(i => i.status === 'New').length;
    return { total, resolved, inProgress, newIssues };
  }, [issues]);

  if (!currentUser) {
    return <Login />;
  }

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 overflow-hidden">
      
      <Sidebar 
        user={currentUser} 
        currentView={currentView} 
        setCurrentView={handleViewChange} 
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      <div className="flex-1 flex flex-col overflow-hidden w-full">
        <Header 
            user={currentUser} 
            onMenuClick={() => setIsSidebarOpen(true)}
        />

        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 dark:bg-gray-900 p-4 sm:p-6 lg:p-8 relative">
          {currentView === 'dashboard' && (
            <Dashboard 
                // issues={issues}  <-- Dashboard cleaned up to only take stats
                stats={stats} 
            />
          )}
          
          {currentView === 'issues' && (
            <IssueList 
              issues={issues} 
              onSelectIssue={handleSelectIssue} 
            />
          )}
        </main>
      </div>

      {selectedIssue && (
        <IssueDetailModal 
          user={currentUser}
          issue={selectedIssue} 
          onClose={handleCloseModal}
          onUpdate={handleUpdateIssue}
        />
      )}
    </div>
  );
};

export default App;