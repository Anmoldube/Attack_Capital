import { useEffect, useState } from 'react';

interface UseGetChannelsProps {
  workspaceId: string;
}

export const useGetChannels = ({ workspaceId }: UseGetChannelsProps) => {
  const [data, setData] = useState<any[] | undefined>();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!workspaceId) {
      setIsLoading(false);
      return;
    }

    const fetch_data = async () => {
      try {
        const response = await fetch(`/api/workspaces/${workspaceId}/channels`);
        if (response.ok) {
          const channels = await response.json();
          setData(channels);
        } else {
          setData([]);
        }
      } catch (error) {
        console.error('Error fetching channels:', error);
        setData([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetch_data();
  }, [workspaceId]);

  return { data, isLoading };
};
