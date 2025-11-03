import { useEffect, useState } from 'react';

interface useGetWorkspaceProps {
  id: string;
}

export interface Workspace {
  id: string;
  name: string;
  _id: string;
}

export const useGetWorkspace = ({ id }: useGetWorkspaceProps) => {
  const [data, setData] = useState<Workspace | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!id) {
      setIsLoading(false);
      return;
    }

    const fetch_data = async () => {
      try {
        const response = await fetch(`/api/workspaces/${id}`);
        if (response.ok) {
          const workspace = await response.json();
          setData({ ...workspace, _id: workspace.id });
        }
      } catch (error) {
        console.error('Error fetching workspace:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetch_data();
  }, [id]);

  return { data, isLoading };
};
