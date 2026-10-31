"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { LuWifiOff, LuCircleCheck, LuRotateCcw } from "react-icons/lu";
import styles from "@/components/ui/OfflineBanner.module.css";

interface NetworkStatusContextType {
  isOnline: boolean;
  isServerReachable: boolean;
  isChecking: boolean;
  checkConnectivity: () => Promise<boolean>;
}

const NetworkStatusContext = createContext<NetworkStatusContextType>({
  isOnline: true,
  isServerReachable: true,
  isChecking: false,
  checkConnectivity: async () => true,
});

export function useNetworkStatus() {
  return useContext(NetworkStatusContext);
}

export function NetworkStatusProvider({ children }: { children: React.ReactNode }) {
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [isServerReachable, setIsServerReachable] = useState<boolean>(true);
  const [isChecking, setIsChecking] = useState<boolean>(false);
  const [showRestoredNotice, setShowRestoredNotice] = useState<boolean>(false);

  // Active server ping to verify actual reachability beyond browser event
  const checkConnectivity = useCallback(async (): Promise<boolean> => {
    if (typeof window === "undefined") return true;

    if (!navigator.onLine) {
      setIsOnline(false);
      setIsServerReachable(false);
      return false;
    }

    setIsChecking(true);
    try {
      // Lightweight reachability probe with no-cache to test server health
      const res = await fetch("/api/reports?probe=ping", {
        method: "HEAD",
        cache: "no-store",
      }).catch(() => null);

      // Any HTTP response (including 401/403/404) proves server connectivity
      const reachable = !!res;
      setIsServerReachable(reachable);
      setIsOnline(reachable);
      return reachable;
    } catch {
      setIsServerReachable(false);
      return false;
    } finally {
      setIsChecking(false);
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    setIsOnline(navigator.onLine);

    const handleOnline = () => {
      setIsOnline(true);
      checkConnectivity().then((reachable) => {
        if (reachable) {
          setShowRestoredNotice(true);
          const timer = setTimeout(() => setShowRestoredNotice(false), 3500);
          return () => clearTimeout(timer);
        }
      });
    };

    const handleOffline = () => {
      setIsOnline(false);
      setIsServerReachable(false);
      setShowRestoredNotice(false);
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [checkConnectivity]);

  const isDisconnected = !isOnline || !isServerReachable;

  return (
    <NetworkStatusContext.Provider
      value={{
        isOnline,
        isServerReachable,
        isChecking,
        checkConnectivity,
      }}
    >
      {/* Accessible Unobtrusive Connectivity Banner */}
      {isDisconnected && (
        <div
          className={`${styles.banner} ${styles.offline}`}
          role="status"
          aria-live="assertive"
        >
          <span className={styles.icon} aria-hidden="true">
            <LuWifiOff size={16} />
          </span>
          <span className={styles.message}>
            You appear to be offline. Network requests and artwork uploads are paused until connection returns.
          </span>
          <button
            type="button"
            className={styles.retryBtn}
            onClick={() => checkConnectivity()}
            disabled={isChecking}
          >
            {isChecking ? "Checking..." : "Check Connection"}
          </button>
        </div>
      )}

      {/* Connection Restored Notice */}
      {!isDisconnected && showRestoredNotice && (
        <div
          className={`${styles.banner} ${styles.restored}`}
          role="status"
          aria-live="polite"
        >
          <span className={styles.icon} aria-hidden="true">
            <LuCircleCheck size={16} />
          </span>
          <span className={styles.message}>Connection restored. You are back online.</span>
        </div>
      )}

      {children}
    </NetworkStatusContext.Provider>
  );
}
