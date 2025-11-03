import { useCallback, useMemo, useState } from 'react';

type ResponseType = string | null;

type Options = {
  onSuccess?: (data: ResponseType) => void;
  onError?: (error: Error) => void;
  onSettled?: () => void;
  throwError?: boolean;
};

export const useGenerateUploadUrl = () => {
  const [data, setData] = useState<ResponseType>(null);
  const [error, setError] = useState<Error | null>(null);
  const [status, setStatus] = useState<'success' | 'error' | 'settled' | 'pending' | null>(null);

  const isPending = useMemo(() => status === 'pending', [status]);
  const isSuccess = useMemo(() => status === 'success', [status]);
  const isError = useMemo(() => status === 'error', [status]);
  const isSettled = useMemo(() => status === 'settled', [status]);

  const mutate = useCallback(
    async (_values: {}, options?: Options) => {
      try {
        setData(null);
        setError(null);
        setStatus('pending');

        const response = await fetch('/api/upload/url', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        });

        if (!response.ok) {
          throw new Error(`Failed to generate upload URL: ${response.statusText}`);
        }

        const result = await response.json();
        setData(result.url);
        setStatus('success');
        options?.onSuccess?.(result.url);

        return result.url;
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
