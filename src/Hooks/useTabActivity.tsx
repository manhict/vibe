import { useEffect, useState, useRef } from "react";

const useTabActivity = (
  timeout: number = 300000,
  onReturnAfterInactivity?: () => void
) => {
  const [isActive, setIsActive] = useState(true);
  const [wasInactiveForLong, setWasInactiveForLong] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const inactivityStartRef = useRef<number | null>(null);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Start the timer when the tab is hidden
        inactivityStartRef.current = Date.now(); // Track the time when the tab becomes hidden
        timeoutRef.current = setTimeout(() => {
          setIsActive(false); // Mark as inactive after timeout
          setWasInactiveForLong(true); // Set inactivity flag when the user was inactive for too long
        }, timeout);
      } else {
        // Clear timer and mark as active when the tab is visible again
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
          timeoutRef.current = null;
        }
        setIsActive(true); // Set active immediately when user returns

        // If the user comes back after being inactive for too long, trigger the callback
        if (wasInactiveForLong && onReturnAfterInactivity) {
          onReturnAfterInactivity();
        }

        // Reset inactivity flag
        setWasInactiveForLong(false);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    // Cleanup on unmount
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [timeout, wasInactiveForLong, onReturnAfterInactivity]);

  return isActive;
};

export default useTabActivity;
