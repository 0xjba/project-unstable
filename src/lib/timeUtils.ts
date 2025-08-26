/**
 * Time utilities for handling blockchain timestamps
 */

// Convert blockchain timestamp (seconds) to JavaScript Date
export const blockTimestampToDate = (blockTimestamp: number): Date => {
  return new Date(blockTimestamp * 1000);
};

// Convert JavaScript Date to blockchain timestamp (seconds)
export const dateToBlockTimestamp = (date: Date): number => {
  return Math.floor(date.getTime() / 1000);
};

// Get current time as blockchain timestamp
export const getCurrentBlockTimestamp = (): number => {
  return Math.floor(Date.now() / 1000);
};

// Format time difference for display
export const formatTimeDifference = (seconds: number): string => {
  if (seconds < 0) return '0s';
  
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  
  if (hrs > 0) {
    return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  } else if (mins > 0) {
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  } else {
    return `${secs}s`;
  }
};

// Format time ago for display
export const formatTimeAgo = (blockTimestamp: number): string => {
  const now = getCurrentBlockTimestamp();
  const diffInSeconds = now - blockTimestamp;
  
  if (diffInSeconds < 60) return `${diffInSeconds}s ago`;
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  return `${Math.floor(diffInSeconds / 86400)}d ago`;
};

// Check if a timestamp is in the future
export const isFutureTimestamp = (blockTimestamp: number): boolean => {
  return blockTimestamp > getCurrentBlockTimestamp();
};

// Get time until a future timestamp
export const getTimeUntil = (futureTimestamp: number): number => {
  return Math.max(0, futureTimestamp - getCurrentBlockTimestamp());
}; 