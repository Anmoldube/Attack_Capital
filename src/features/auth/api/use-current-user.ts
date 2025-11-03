import { useSession } from '@/lib/client-auth';

export const useCurrentUser = () => {
  const { data: session, isPending: isLoading } = useSession();

  return {
    data: session?.user,
    isLoading
  };
};
