import { useEffect, useState } from 'react';

interface useGetWorkspaceInfoProps {
  id: string;
}

export const useGetWorkspaceInfo = ({ id }: useGetWorkspaceInfoProps) => {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!id) {
      setIsLoading(false);
      return;
    }

    const fetch_data = async () => {
      try {
        const response = await fetch(`/api/workspaces/${id}/info`);
        if (response.ok) {
          const info = await response.json();
          setData(info);
        }
      } catch (error) {
        console.error('Error fetching workspace info:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetch_data();
  }, [id]);

  return { data, isLoading };
};
