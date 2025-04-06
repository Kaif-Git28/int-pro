import { useState, useEffect, useCallback, useRef } from 'react';
import { ApiSpindleData, MachineData } from '../types';

const useApiData = (apiUrl: string, pollingInterval: number = 1000) => {
  const [data, setData] = useState<ApiSpindleData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const abortControllerRef = useRef<AbortController | null>(null);
  const lastDataRef = useRef<ApiSpindleData | null>(null);
  const isMountedRef = useRef(true);

  const fetchData = useCallback(async () => {
    if (!isMountedRef.current) return;

    // Cancel previous request if it exists
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Create new abort controller for this request
    abortControllerRef.current = new AbortController();

    try {
      setIsLoading(true);
      const response = await fetch(apiUrl, {
        signal: abortControllerRef.current.signal,
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const newData = await response.json();
      
      // Only update if data has actually changed
      if (JSON.stringify(newData) !== JSON.stringify(lastDataRef.current)) {
        lastDataRef.current = newData;
        setData(newData);
      }
      
      setError(null);
    } catch (err) {
      if (err instanceof Error) {
        // Don't set error for aborted requests
        if (err.name !== 'AbortError') {
          setError(err.message);
        }
      } else {
        setError('An unknown error occurred');
      }
    } finally {
      if (isMountedRef.current) {
        setIsLoading(false);
      }
    }
  }, [apiUrl]);

  useEffect(() => {
    isMountedRef.current = true;
    
    // Initial fetch
    fetchData();

    // Set up polling interval
    const intervalId = setInterval(fetchData, pollingInterval);

    // Cleanup
    return () => {
      isMountedRef.current = false;
      clearInterval(intervalId);
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [fetchData, pollingInterval]);

  return { data, error, isLoading, refreshData: fetchData };
};

export default useApiData; 