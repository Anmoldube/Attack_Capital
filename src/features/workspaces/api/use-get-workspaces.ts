import { useEffect, useState } from 'react';

export interface Workspace {
  id: string;
  name: string;
  _id: string; // For backward compatibility
  createdAt: Date;
}

export const useGetWorkspaces = () => {
  const [data, setData] = useState<Workspace[] | undefined>();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchWorkspaces = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/workspaces');

        if (!response.ok) {
          throw new Error('Failed to fetch workspaces');
        }

        const workspaces = await response.json();
        // Map id to _id for backward compatibility with existing code
        const mapped = workspaces.map((w: any) => ({
          ...w,
          _id: w.id,
        }));
        setData(mapped);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error'));
        setData([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchWorkspaces();
  }, []);

  return { data, isLoading, error };
};
