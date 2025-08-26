import { useState, useEffect } from 'react';
import { contractService, ContractStats } from '@/lib/contract';
import { getTimeUntil } from '@/lib/timeUtils';

export const useContractStats = (refreshInterval = 10000) => {
  const [stats, setStats] = useState<ContractStats>({
    holderCount: 0,
    totalSupply: '0',
    totalBurned: '0',
    totalMinted: '0',
    destabilizationCount: 0,
    eliminatedCount: 0,
    canDestabilizeNow: false,
    nextDestabilizationTime: 0,
    cooldownRemaining: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    try {
      setError(null);
      const contractStats = await contractService.getStats();
      setStats(contractStats);
      setLoading(false); // Only set loading to false on success
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch contract stats');
      console.error('Error in useContractStats:', err);
      // Don't set loading to false on error - keep it true so numbers keep rolling
    }
  };

  useEffect(() => {
    fetchStats();

    // Set up interval for real-time updates
    const interval = setInterval(() => {
      fetchStats();
    }, refreshInterval);

    // Update cooldown remaining every second using blockchain time
    const cooldownInterval = setInterval(() => {
      setStats(prev => ({
        ...prev,
        cooldownRemaining: getTimeUntil(prev.nextDestabilizationTime)
      }));
    }, 1000);

    return () => {
      clearInterval(interval);
      clearInterval(cooldownInterval);
    };
  }, [refreshInterval]);

  return {
    stats,
    loading,
    error,
    refetch: fetchStats
  };
}; 