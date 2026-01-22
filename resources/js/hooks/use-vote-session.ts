import { useState, useCallback, useRef, useEffect } from 'react';

const SESSION_STORAGE_KEY = 'vote_session';
const SESSION_DURATION_MS = 5 * 60 * 1000;

export type SessionStatus = 'idle' | 'validating' | 'active' | 'expired' | 'completed';

export interface VoteSessionData {
  status: SessionStatus;
  token: string | null;
  wargaNik: string | null;
  expiryTimestamp: number | null;
}

export interface UseVoteSessionResult {
  sessionStatus: SessionStatus;
  sessionToken: string | null;
  sessionExpiryTimestamp: number | null;
  wargaNik: string | null;
  timeRemaining: number | null;
  isSessionActive: boolean;
  isSessionExpired: boolean;
  activateSession: (token: string, wargaNik: string) => void;
  completeSession: () => void;
  resetSession: () => void;
  checkExpiry: () => boolean;
}

function loadSessionFromStorage(): VoteSessionData | null {
  if (typeof window === 'undefined') return null;
  
  try {
    const stored = localStorage.getItem(SESSION_STORAGE_KEY);
    if (!stored) return null;
    
    const parsed = JSON.parse(stored) as VoteSessionData;
    
    if (parsed.expiryTimestamp && Date.now() >= parsed.expiryTimestamp) {
      localStorage.removeItem(SESSION_STORAGE_KEY);
      return null;
    }
    
    return parsed;
  } catch {
    localStorage.removeItem(SESSION_STORAGE_KEY);
    return null;
  }
}

function saveSessionToStorage(session: VoteSessionData): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
  } catch {
    localStorage.removeItem(SESSION_STORAGE_KEY);
  }
}

function clearSessionFromStorage(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(SESSION_STORAGE_KEY);
}

export function useVoteSession(): UseVoteSessionResult {
  const [sessionStatus, setSessionStatus] = useState<SessionStatus>(() => {
    const stored = loadSessionFromStorage();
    if (!stored) return 'idle';
    
    if (Date.now() >= (stored.expiryTimestamp || 0)) {
      clearSessionFromStorage();
      return 'idle';
    }
    
    return stored.status === 'completed' ? 'completed' : 'active';
  });
  
  const [sessionToken, setSessionToken] = useState<string | null>(() => {
    const stored = loadSessionFromStorage();
    return stored?.token || null;
  });
  
  const [sessionExpiryTimestamp, setSessionExpiryTimestamp] = useState<number | null>(() => {
    const stored = loadSessionFromStorage();
    return stored?.expiryTimestamp || null;
  });
  
  const [wargaNik, setWargaNik] = useState<string | null>(() => {
    const stored = loadSessionFromStorage();
    return stored?.wargaNik || null;
  });
  
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  
  const isMountedRef = useRef<boolean>(true);
  const expiryCheckIntervalRef = useRef<number | null>(null);
  const hasAutoRefreshedRef = useRef<boolean>(false);
  
  useEffect(() => {
    isMountedRef.current = true;
    hasAutoRefreshedRef.current = false;
    
    const stored = loadSessionFromStorage();
    if (stored && stored.status === 'active' && stored.expiryTimestamp) {
      const now = Date.now();
      const expiry = stored.expiryTimestamp;
      
      if (now < expiry) {
        setSessionStatus('active');
        setSessionToken(stored.token);
        setSessionExpiryTimestamp(expiry);
        setWargaNik(stored.wargaNik);
      } else {
        clearSessionFromStorage();
        setSessionStatus('idle');
        setSessionToken(null);
        setSessionExpiryTimestamp(null);
        setWargaNik(null);
      }
    }
    
    return () => {
      isMountedRef.current = false;
      if (expiryCheckIntervalRef.current !== null) {
        clearInterval(expiryCheckIntervalRef.current);
        expiryCheckIntervalRef.current = null;
      }
    };
  }, []);
  
  useEffect(() => {
    if (sessionStatus !== 'active' || !sessionExpiryTimestamp) {
      if (expiryCheckIntervalRef.current !== null) {
        clearInterval(expiryCheckIntervalRef.current);
        expiryCheckIntervalRef.current = null;
      }
      setTimeRemaining(null);
      return;
    }
    
    const updateTimeRemaining = () => {
      if (!isMountedRef.current) return;
      
      const now = Date.now();
      const remaining = sessionExpiryTimestamp - now;
      
      if (remaining <= 0) {
        if (isMountedRef.current) {
          setSessionStatus('expired');
          setTimeRemaining(0);
          clearSessionFromStorage();
        }
        
        if (expiryCheckIntervalRef.current !== null) {
          clearInterval(expiryCheckIntervalRef.current);
          expiryCheckIntervalRef.current = null;
        }
      } else {
        if (isMountedRef.current) {
          setTimeRemaining(remaining);
        }
      }
    };
    
    updateTimeRemaining();
    
    expiryCheckIntervalRef.current = window.setInterval(updateTimeRemaining, 1000);
    
    return () => {
      if (expiryCheckIntervalRef.current !== null) {
        clearInterval(expiryCheckIntervalRef.current);
        expiryCheckIntervalRef.current = null;
      }
    };
  }, [sessionStatus, sessionExpiryTimestamp]);
  
  const activateSession = useCallback((token: string, wargaNikValue: string) => {
    if (!isMountedRef.current) return;
    
    const expiryTimestamp = Date.now() + SESSION_DURATION_MS;
    
    const session: VoteSessionData = {
      status: 'active',
      token,
      wargaNik: wargaNikValue,
      expiryTimestamp,
    };
    
    saveSessionToStorage(session);
    
    setSessionStatus('active');
    setSessionToken(token);
    setSessionExpiryTimestamp(expiryTimestamp);
    setWargaNik(wargaNikValue);
  }, []);
  
  const completeSession = useCallback(() => {
    if (!isMountedRef.current) return;
    if (hasAutoRefreshedRef.current) return;
    
    clearSessionFromStorage();
    
    setSessionStatus('completed');
    setSessionToken(null);
    setSessionExpiryTimestamp(null);
    setWargaNik(null);
    setTimeRemaining(null);
    
    hasAutoRefreshedRef.current = true;
    
    setTimeout(() => {
      if (typeof window !== 'undefined') {
        window.location.reload();
      }
    }, 500);
  }, []);
  
  const resetSession = useCallback(() => {
    if (!isMountedRef.current) return;
    
    clearSessionFromStorage();
    
    setSessionStatus('idle');
    setSessionToken(null);
    setSessionExpiryTimestamp(null);
    setWargaNik(null);
    setTimeRemaining(null);
  }, []);
  
  const checkExpiry = useCallback((): boolean => {
    if (!sessionExpiryTimestamp) return true;
    
    const isExpired = Date.now() >= sessionExpiryTimestamp;
    
    if (isExpired && isMountedRef.current) {
      setSessionStatus('expired');
      clearSessionFromStorage();
      setSessionToken(null);
      setSessionExpiryTimestamp(null);
      setWargaNik(null);
      setTimeRemaining(null);
    }
    
    return isExpired;
  }, [sessionExpiryTimestamp]);
  
  useEffect(() => {
    if (
      sessionStatus === 'expired' &&
      !hasAutoRefreshedRef.current &&
      isMountedRef.current
    ) {
      hasAutoRefreshedRef.current = true;
      
      clearSessionFromStorage();
      
      setTimeout(() => {
        if (typeof window !== 'undefined') {
          window.location.reload();
        }
      }, 500);
    }
  }, [sessionStatus]);
  
  const isExpiredNow = sessionExpiryTimestamp ? Date.now() >= sessionExpiryTimestamp : false;
  const isSessionActive = sessionStatus === 'active' && !isExpiredNow;
  const isSessionExpired = sessionStatus === 'expired' || (sessionStatus === 'active' && isExpiredNow);
  
  return {
    sessionStatus,
    sessionToken,
    sessionExpiryTimestamp,
    wargaNik,
    timeRemaining,
    isSessionActive,
    isSessionExpired,
    activateSession,
    completeSession,
    resetSession,
    checkExpiry,
  };
}

