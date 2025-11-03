import { useCallback, useMemo, useState } from 'react';

type RequestType = {
  id: string;
};
type ResponseType = string | null;

type Options = {
  onSuccess?: (data: ResponseType) => void;
  onError?: (error: Error) => void;
  onSettled?: () => void;
  throwError?: boolean;
};

export const useRemoveMessage = () => {
  const [data, setData] = useState<ResponseType>(null);
  const [error, setError] = useState<Error | null>(null);
  const [status, setStatus] = useState<'success' | 'error' | 'settled' | 'pending' | null>(null);

  const isPending = useMemo(() => status === 'pending', [status]);
  const isSuccess = useMemo(() => status === 'success', [status]);
  const isError = useMemo(() => status === 'error', [status]);
  const isSettled = useMemo(() => status === 'settled', [status]);

  const mutate = useCallback(
    async (values: RequestType, options?: Options) => {
      try {
        setData(null);
        setError(null);
        setStatus('pending');

        const response = await fetch(`/api/messages/${values.id}`, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
        });

        if (!response.ok) {
          throw new Error(`Failed to remove message: ${response.statusText}`);
        }

        const result = await response.json();
        setData(result.id);
        setStatus('success');
        options?.onSuccess?.(result.id);

        return result.id;
      } catch (error) {
        const err = error instanceof Error ? error : new Error(String(error));
        setError(err);
        setStatus('error');
        options?.onError?.(err);

        if (options?.throwError) throw err;
      } finally {
        setStatus('settled');
        options?.onSettled?.();
      }
    },
    [],
  );

  return {
    mutate,
    data,
    error,
    isPending,
    isError,
    isSuccess,
    isSettled,
  };
};
