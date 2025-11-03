'use client';

import { useEffect, useState } from 'react';

interface UseGetMemberProps {
  id: string;
}

export const useGetMember = ({ id }: UseGetMemberProps) => {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!id) {
      setIsLoading(false);
      return;
    }

    const fetch_data = async () => {
      try {
        const response = await fetch(`/api/members/${id}`);
        if (response.ok) {
          const member = await response.json();
          setData(member);
        }
      } catch (error) {
        console.error('Error fetching member:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetch_data();
  }, [id]);

  return { data, isLoading };
};
