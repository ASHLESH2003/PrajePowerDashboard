import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { Issue, Priority, Status } from '../types';

export const useIssues = () => {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchIssues = async () => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from('issues')
        .select(`
          *,
          profiles (
            first_name,
            last_name,
            email,
            phone
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (data) {
        const mappedIssues: Issue[] = data.map((item: any) => ({
          id: item.id,
          title: `${item.type} Issue`, 
          category: item.type, 
          description: item.description,
          priority: Priority.High, 
          status: mapStatus(item.status),
          reportedAt: new Date(item.created_at),
          location: item.location || null,
          imageUrl: item.photo_url,
          resolution: item.resolution || '', 
          
          // ✅ 1. READ: Map database 'resolution_photo' to frontend 'resolutionPhoto'
          resolutionPhoto: item.resolution_photo || undefined,
          
          reporter: {
            id: item.user_id,
            name: item.profiles 
              ? `${item.profiles.first_name || ''} ${item.profiles.last_name || ''}`.trim() || 'Unknown Citizen' 
              : 'Unknown',
            email: item.profiles?.email || 'No Email',
            contact: item.profiles?.phone || 'No Contact',
            role: 'Citizen' 
          }
        }));

        setIssues(mappedIssues);
      }
    } catch (err: any) {
      console.error('Error fetching issues:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const updateIssue = async (id: string, updates: Partial<Issue>) => {
      try {
          const dbUpdates: any = {};
          
          // 1. Map Status correctly
          if (updates.status) {
             dbUpdates.status = mapStatusToDb(updates.status);
          }
          
          // 2. Map Resolution Notes
          if (updates.resolution !== undefined) {
             dbUpdates.resolution = updates.resolution; 
          }

          // ✅ 2. WRITE: Map frontend 'resolutionPhoto' to database 'resolution_photo'
          if (updates.resolutionPhoto !== undefined) {
             dbUpdates.resolution_photo = updates.resolutionPhoto;
          }

          console.log("Sending update to DB:", dbUpdates);

          const { error } = await supabase
            .from('issues')
            .update(dbUpdates)
            .eq('id', id);

          if (error) {
            console.error("Supabase Update Error:", error);
            throw error;
          }
          
          await fetchIssues();

      } catch (err) {
          console.error("Error updating issue:", err);
          throw err;
      }
  };

  useEffect(() => {
    fetchIssues();
    const subscription = supabase
      .channel('public:issues')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'issues' }, () => {
        fetchIssues();
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return { 
    issues, 
    setIssues, 
    isLoading, 
    error, 
    updateIssue, 
    refreshIssues: fetchIssues 
  };
};

// --- Helpers ---

const mapStatus = (dbStatus: string): Status => {
  const s = dbStatus?.toLowerCase();
  if (s === 'resolved') return Status.Resolved;
  if (s === 'in progress' || s === 'in_progress') return Status.InProgress;
  if (s === 'closed') return Status.Closed;
  return Status.New; 
};

const mapStatusToDb = (status: Status): string => {
    switch (status) {
        case Status.Resolved: return 'Resolved';
        case Status.InProgress: return 'In Progress';
        case Status.Closed: return 'Closed';
        default: return 'New';
    }
}