import { useState, useCallback, useRef, useEffect } from 'react';
import type React from 'react';
import { useQrValidation } from './use-qr-validation';
import { useVoteSession } from './use-vote-session';
import { apiClient } from '@/lib/api-client';
import type { Candidate } from '@/pages/dashboard/user/vote/_components/candidate-card';

const QR_CODE_REGION_ID = 'qr-reader';

export interface UseVotePageResult {
  selectedCandidateId: number | null;
  isQrScanned: boolean;
  showQrScanner: boolean;
  scannedData: string | null;
  scannerError: string | null;
  isScanning: boolean;
  isSubmittingVote: boolean;
  error: string | null;
  scannerRef: React.MutableRefObject<any>;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  qrValidationStatus: ReturnType<typeof useQrValidation>;
  voteSession: ReturnType<typeof useVoteSession>;
  handleVote: (candidateId: number) => void;
  handleSubmit: (candidates: Candidate[]) => Promise<void>;
  handleOpenScanner: () => void;
  startCameraScanning: () => Promise<void>;
  stopScanning: () => Promise<void>;
  handleScanImageFile: (event: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  setShowQrScanner: (show: boolean) => void;
  QR_CODE_REGION_ID: string;
}

export function useVotePage(): UseVotePageResult {
  const qrValidationStatus = useQrValidation();
  const voteSession = useVoteSession();
  
  const [selectedCandidateId, setSelectedCandidateId] = useState<number | null>(null);
  const [showQrScanner, setShowQrScanner] = useState<boolean>(() => !voteSession.isSessionActive);
  const [scannedData, setScannedData] = useState<string | null>(null);
  const [scannerError, setScannerError] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [isSubmittingVote, setIsSubmittingVote] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  const scannerRef = useRef<any>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const isMountedRef = useRef<boolean>(true);
  const isSubmittingRef = useRef<boolean>(false);
  const hasPreparedRefreshRef = useRef<boolean>(false);
  
  const isQrScanned = voteSession.isSessionActive;

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);
  
  const stopScanning = useCallback(async () => {
    if (scannerRef.current) {
      try {
        await scannerRef.current.stop();
        await scannerRef.current.clear();
        if (isMountedRef.current) {
          setIsScanning(false);
        }
        scannerRef.current = null;
        
        const element = document.getElementById(QR_CODE_REGION_ID);
        if (element) {
          element.innerHTML = '';
        }
      } catch (error) {
        console.error('Error stopping scanner:', error);
        if (isMountedRef.current) {
          setIsScanning(false);
        }
        scannerRef.current = null;
        
        const element = document.getElementById(QR_CODE_REGION_ID);
        if (element) {
          element.innerHTML = '';
        }
      }
    }
  }, []);

  useEffect(() => {
    if (voteSession.sessionStatus === 'expired' && isMountedRef.current && !hasPreparedRefreshRef.current) {
      hasPreparedRefreshRef.current = true;
      
      const cleanupBeforeRefresh = async () => {
        if (scannerRef.current) {
          try {
            await stopScanning();
          } catch (error) {
            console.error('Error stopping scanner before refresh:', error);
          }
        }
        
        qrValidationStatus.reset();
        setSelectedCandidateId(null);
        setScannedData(null);
        setError(null);
        setScannerError(null);
      };
      
      cleanupBeforeRefresh();
    }
  }, [voteSession.sessionStatus, qrValidationStatus, stopScanning]);

  const onScanSuccess = useCallback(async (decodedText: string) => {
    if (!decodedText || decodedText.length === 0) return;
    if (!isMountedRef.current) return;
    if (voteSession.sessionStatus !== 'idle' && voteSession.sessionStatus !== 'expired') return;
    
    try {
      const validationResult = await qrValidationStatus.handleScan(decodedText, voteSession.sessionStatus);
      
      if (validationResult.valid && isMountedRef.current) {
        voteSession.activateSession(validationResult.token, validationResult.wargaNik);
        
        setScannedData(decodedText);
        setShowQrScanner(false);
        setIsScanning(false);
        setScannerError(null);
        setError(null);
        
        if (scannerRef.current) {
          scannerRef.current.stop().then(() => {
            scannerRef.current?.clear();
            scannerRef.current = null;
            
            const element = document.getElementById(QR_CODE_REGION_ID);
            if (element) {
              element.innerHTML = '';
            }
          }).catch((error: any) => {
            console.error('Error stopping scanner:', error);
            scannerRef.current = null;
            
            const element = document.getElementById(QR_CODE_REGION_ID);
            if (element) {
              element.innerHTML = '';
            }
          });
        }
      }
    } catch (error) {
      if (!isMountedRef.current) return;
      
      console.error('QR validation error:', error);
      const errorMsg = qrValidationStatus.errorMessage || 'Gagal memvalidasi QR code';
      setScannerError(errorMsg);
      setError(errorMsg);
    }
  }, [qrValidationStatus, voteSession]);

  const onScanFailure = useCallback((error: string) => {
    console.log('Scan failed:', error);
  }, []);

  const startCameraScanning = useCallback(async () => {
    if (!isMountedRef.current) return;
    if (voteSession.sessionStatus === 'active' || voteSession.sessionStatus === 'completed') return;
    
    try {
      if (isMountedRef.current) {
        setScannerError(null);
        setError(null);
      }
      
      const html5QrcodeModule = await import('html5-qrcode');
      const Html5Qrcode = html5QrcodeModule.Html5Qrcode;

      const element = document.getElementById(QR_CODE_REGION_ID);
      if (!element) {
        if (isMountedRef.current) {
          setScannerError('Element scanner tidak ditemukan.');
        }
        return;
      }

      if (scannerRef.current) {
        await stopScanning();
      }

      if (!isMountedRef.current) return;

      setIsScanning(true);

      element.innerHTML = '';
      
      element.style.width = '100%';
      element.style.height = '500px';
      element.style.minHeight = '500px';
      element.style.position = 'relative';
      element.style.overflow = 'hidden';

      await new Promise(resolve => setTimeout(resolve, 200));

      if (!isMountedRef.current) return;

      scannerRef.current = new Html5Qrcode(QR_CODE_REGION_ID);

      const containerWidth = element.clientWidth || 300;
      const containerHeight = element.clientHeight || 300;
      const qrboxSize = Math.min(Math.min(containerWidth, containerHeight) - 40, 500);

      await scannerRef.current.start(
        { facingMode: 'environment' },
        {
          fps: 10,
          qrbox: { width: qrboxSize, height: qrboxSize },
          aspectRatio: 1.0,
          rememberLastUsedCamera: true,
        },
        onScanSuccess,
        onScanFailure
      );
    } catch (error: any) {
      if (!isMountedRef.current) return;
      
      console.error('Error starting camera scanner:', error);
      const errorMsg = error.message || 'Gagal memulai scanner. Pastikan kamera tersedia dan izin diberikan.';
      setScannerError(errorMsg);
      setError(errorMsg);
      setIsScanning(false);
      scannerRef.current = null;
      
      const element = document.getElementById(QR_CODE_REGION_ID);
      if (element) {
        element.innerHTML = '';
      }
    }
  }, [onScanSuccess, onScanFailure, stopScanning, voteSession.sessionStatus]);

  const handleScanImageFile = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!isMountedRef.current) return;
    if (voteSession.sessionStatus !== 'idle' && voteSession.sessionStatus !== 'expired') return;

    try {
      if (isMountedRef.current) {
        setScannerError(null);
        setError(null);
      }
      
      const html5QrcodeModule = await import('html5-qrcode');
      const Html5Qrcode = html5QrcodeModule.Html5Qrcode;

      const html5Qrcode = new Html5Qrcode(QR_CODE_REGION_ID);
      
      const decodedText = await html5Qrcode.scanFile(file, false);
      
      if (decodedText && decodedText.length > 0 && isMountedRef.current) {
        try {
          const validationResult = await qrValidationStatus.handleScan(decodedText, voteSession.sessionStatus);
          
          if (validationResult.valid && isMountedRef.current) {
            voteSession.activateSession(validationResult.token, validationResult.wargaNik);
            
            setScannedData(decodedText);
            setShowQrScanner(false);
            setIsScanning(false);
            setScannerError(null);
            setError(null);
          }
        } catch (error) {
          if (!isMountedRef.current) return;
          
          console.error('QR validation error:', error);
          const errorMsg = qrValidationStatus.errorMessage || 'Gagal memvalidasi QR code';
          setScannerError(errorMsg);
          setError(errorMsg);
        }
      }
    } catch (error: any) {
      if (!isMountedRef.current) return;
      
      console.error('Error scanning image file:', error);
      const errorMsg = error.message || 'Gagal memindai QR code dari gambar. Pastikan file berisi QR code yang valid.';
      setScannerError(errorMsg);
      setError(errorMsg);
    } finally {
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  }, [qrValidationStatus, voteSession]);

  const handleVote = useCallback((candidateId: number) => {
    if (!isMountedRef.current) return;
    if (!voteSession.isSessionActive) return;
    if (voteSession.sessionStatus === 'completed') return;
    
    setSelectedCandidateId(candidateId);
    setError(null);
  }, [voteSession.isSessionActive, voteSession.sessionStatus]);

  const handleSubmit = useCallback(async (candidates: Candidate[]) => {
    if (!isMountedRef.current) return;
    
    if (isSubmittingRef.current) {
      return;
    }
    
    if (!voteSession.isSessionActive) {
      setError('Session voting tidak aktif. Silakan scan QR code terlebih dahulu.');
      return;
    }
    
    if (voteSession.checkExpiry()) {
      setError('Session voting telah kedaluwarsa. Silakan scan QR code ulang.');
      return;
    }
    
    if (voteSession.sessionStatus === 'completed') {
      setError('Vote sudah dikirim. Tidak dapat mengirim vote lagi.');
      return;
    }
    
    if (selectedCandidateId === null) {
      setError('Silakan pilih kandidat terlebih dahulu.');
      return;
    }
    
    if (!voteSession.wargaNik) {
      setError('Data NIK tidak ditemukan. Silakan scan QR code ulang.');
      return;
    }

    const selectedCandidateData = candidates.find(c => c.id === selectedCandidateId);
    if (!selectedCandidateData) {
      setError('Kandidat tidak ditemukan.');
      return;
    }

    isSubmittingRef.current = true;
    
    if (isMountedRef.current) {
      setIsSubmittingVote(true);
      setError(null);
    }

    try {
      const response = await apiClient.post('/api/voter/vote/create', {
        warga_nik: voteSession.wargaNik,
        paslon_id: selectedCandidateData.id,
      });

      if (!isMountedRef.current) return;

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = 
          typeof errorData === 'object' && 
          errorData !== null && 
          'message' in errorData
            ? String(errorData.message)
            : 'Gagal mengirim vote. Silakan coba lagi.';
        
        if (isMountedRef.current) {
          setError(errorMessage);
        }
        return;
      }

      await response.json();
      
      if (!isMountedRef.current) return;
      
      if (hasPreparedRefreshRef.current) return;
      
      hasPreparedRefreshRef.current = true;
      
      const cleanupBeforeRefresh = async () => {
        if (scannerRef.current) {
          try {
            await stopScanning();
          } catch (error) {
            console.error('Error stopping scanner before refresh:', error);
          }
        }
        
        setSelectedCandidateId(null);
        setScannedData(null);
        setShowQrScanner(false);
        setError(null);
        setScannerError(null);
        qrValidationStatus.reset();
        
        voteSession.completeSession();
      };
      
      await cleanupBeforeRefresh();
    } catch (error) {
      if (!isMountedRef.current) return;
      
      console.error('Error submitting vote:', error);
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Terjadi kesalahan saat mengirim vote. Silakan coba lagi.';
      
      if (isMountedRef.current) {
        setError(errorMessage);
      }
    } finally {
      if (isMountedRef.current) {
        isSubmittingRef.current = false;
        setIsSubmittingVote(false);
      }
    }
  }, [selectedCandidateId, voteSession, qrValidationStatus]);

  const handleOpenScanner = useCallback(() => {
    if (!isMountedRef.current) return;
    if (voteSession.sessionStatus === 'active' || voteSession.sessionStatus === 'completed') return;
    
    setShowQrScanner(true);
    setError(null);
  }, [voteSession.sessionStatus]);

  useEffect(() => {
    return () => {
      if (scannerRef.current && isScanning) {
        stopScanning();
      }
    };
  }, [showQrScanner, isScanning, stopScanning]);

  useEffect(() => {
    if (isScanning) {
      const element = document.getElementById(QR_CODE_REGION_ID);
      if (element) {
        element.style.height = '500px';
        element.style.minHeight = '500px';
        element.style.overflow = 'hidden';
        
        const timer = setTimeout(() => {
          const video = element.querySelector('video');
          const canvas = element.querySelector('canvas');
          const html5QrcodeContainer = element.querySelector('#html5-qrcode-container');
          
          if (html5QrcodeContainer) {
            (html5QrcodeContainer as HTMLElement).style.height = '100%';
            (html5QrcodeContainer as HTMLElement).style.overflow = 'hidden';
          }
          
          if (video) {
            video.style.width = '100%';
            video.style.height = '100%';
            video.style.display = 'block';
            video.style.objectFit = 'cover';
            video.style.maxHeight = '500px';
          }
          
          if (canvas) {
            canvas.style.display = 'block';
            canvas.style.maxHeight = '500px';
          }
        }, 300);

        return () => clearTimeout(timer);
      }
    }
  }, [isScanning]);

  return {
    selectedCandidateId,
    isQrScanned,
    showQrScanner,
    scannedData,
    scannerError,
    isScanning,
    isSubmittingVote,
    error,
    scannerRef,
    fileInputRef,
    qrValidationStatus,
    voteSession,
    handleVote,
    handleSubmit,
    handleOpenScanner,
    startCameraScanning,
    stopScanning,
    handleScanImageFile,
    setShowQrScanner,
    QR_CODE_REGION_ID,
  };
}

