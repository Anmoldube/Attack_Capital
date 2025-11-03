'use client';

import { useEffect, useState } from 'react';

interface UseGetMembersProps {
  workspaceId: string;
}

export const useGetMembers = ({ workspaceId }: UseGetMembersProps) => {
  const [data, setData] = useState<any[] | undefined>();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!workspaceId) {
      setIsLoading(false);
      return;
    }

    const fetch_data = async () => {
      try {
        const response = await fetch(`/api/workspaces/${workspaceId}/members`);
        if (response.ok) {
          const members = await response.json();
          setData(members);
        } else {
          setData([]);
        }
      } catch (error) {
        console.error('Error fetching members:', error);
        setData([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetch_data();
  }, [workspaceId]);

  return { data, isLoading };
};
