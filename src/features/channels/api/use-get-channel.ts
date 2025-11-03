import { useEffect, useState } from 'react';

interface UseGetChannelProps {
  id: string;
}

export const useGetChannel = ({ id }: UseGetChannelProps) => {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!id) {
      setIsLoading(false);
      return;
    }

    const fetch_data = async () => {
      try {
        const response = await fetch(`/api/channels/${id}`);
        if (response.ok) {
          const channel = await response.json();
          setData(channel);
        }
      } catch (error) {
        console.error('Error fetching channel:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetch_data();
  }, [id]);

  return { data, isLoading };
};
