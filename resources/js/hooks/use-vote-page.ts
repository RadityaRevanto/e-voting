import { useState, useCallback, useRef, useEffect } from 'react';
import type React from 'react';
import { useQrValidation } from './use-qr-validation';
import { apiClient } from '@/lib/api-client';
import type { Candidate } from '@/pages/dashboard/user/vote/_components/candidate-card';

const QR_CODE_REGION_ID = 'qr-reader';

/**
 * Return type dari hook useVotePage
 */
export interface UseVotePageResult {
  // State untuk kandidat yang dipilih
  selectedCandidate: number | null;
  
  // State untuk QR Scanner
  isQrScanned: boolean;
  showQrScanner: boolean;
  scannedData: string | null;
  scannerError: string | null;
  isScanning: boolean;
  
  // Refs
  scannerRef: React.MutableRefObject<any>;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  
  // QR Validation
  qrValidationStatus: ReturnType<typeof useQrValidation>;
  
  // Handlers
  handleVote: (candidateId: number) => void;
  handleSubmit: (candidates: Candidate[]) => Promise<void>;
  handleOpenScanner: () => void;
  startCameraScanning: () => Promise<void>;
  stopScanning: () => Promise<void>;
  handleScanImageFile: (event: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  setShowQrScanner: (show: boolean) => void;
  
  // Constants
  QR_CODE_REGION_ID: string;
}

/**
 * Custom hook untuk menangani semua logic di halaman vote
 * 
 * Hook ini menangani:
 * - State management untuk voting dan QR scanner
 * - QR Code scanning dan validasi
 * - Submit vote ke backend
 * - Cleanup scanner saat component unmount
 * 
 * @returns Object berisi state dan handler untuk halaman vote
 * 
 * @example
 * ```tsx
 * const {
 *   selectedCandidate,
 *   isQrScanned,
 *   showQrScanner,
 *   handleVote,
 *   handleSubmit,
 *   // ... lainnya
 * } = useVotePage();
 * 
 * return (
 *   <div>
 *     <CandidatesList
 *       candidates={candidates}
 *       selectedCandidate={selectedCandidate}
 *       isQrScanned={isQrScanned}
 *       onVote={handleVote}
 *     />
 *     <SubmitVoteButton
 *       disabled={selectedCandidate === null || !isQrScanned}
 *       onSubmit={() => handleSubmit(candidates)}
 *     />
 *   </div>
 * );
 * ```
 */
export function useVotePage(): UseVotePageResult {
  // State untuk voting
  const [selectedCandidate, setSelectedCandidate] = useState<number | null>(null);
  
  // State untuk QR Scanner
  const [isQrScanned, setIsQrScanned] = useState<boolean>(false);
  const [showQrScanner, setShowQrScanner] = useState<boolean>(true);
  const [scannedData, setScannedData] = useState<string | null>(null);
  const [scannerError, setScannerError] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  
  // Refs
  const scannerRef = useRef<any>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  
  // QR Validation hook
  const qrValidationStatus = useQrValidation();

  /**
   * Stop scanning dan cleanup scanner
   */
  const stopScanning = useCallback(async () => {
    if (scannerRef.current) {
      try {
        await scannerRef.current.stop();
        await scannerRef.current.clear();
        setIsScanning(false);
        scannerRef.current = null;
        
        // Clear element content
        const element = document.getElementById(QR_CODE_REGION_ID);
        if (element) {
          element.innerHTML = '';
        }
      } catch (error) {
        console.error('Error stopping scanner:', error);
        setIsScanning(false);
        scannerRef.current = null;
        
        // Clear element content even on error
        const element = document.getElementById(QR_CODE_REGION_ID);
        if (element) {
          element.innerHTML = '';
        }
      }
    }
  }, []);

  /**
   * Handler ketika QR code berhasil di-scan
   */
  const onScanSuccess = useCallback(async (decodedText: string) => {
    if (decodedText && decodedText.length > 0) {
      try {
        // Validasi QR code menggunakan hook
        const validationResult = await qrValidationStatus.handleScan(decodedText);
        
        // Jika validasi berhasil, set state
        if (validationResult.valid) {
          setScannedData(decodedText);
          setIsQrScanned(true);
          setShowQrScanner(false);
          setIsScanning(false);
          
          // Stop scanner setelah berhasil scan
          if (scannerRef.current) {
            scannerRef.current.stop().then(() => {
              scannerRef.current?.clear();
              scannerRef.current = null;
              
              // Clear element content
              const element = document.getElementById(QR_CODE_REGION_ID);
              if (element) {
                element.innerHTML = '';
              }
            }).catch((error: any) => {
              console.error('Error stopping scanner:', error);
              scannerRef.current = null;
              
              // Clear element content even on error
              const element = document.getElementById(QR_CODE_REGION_ID);
              if (element) {
                element.innerHTML = '';
              }
            });
          }
        }
      } catch (error) {
        // Error sudah ditangani oleh useQrValidation hook
        console.error('QR validation error:', error);
        setScannerError(
          qrValidationStatus.errorMessage || 'Gagal memvalidasi QR code'
        );
      }
    }
  }, [qrValidationStatus]);

  /**
   * Handler ketika scan gagal
   */
  const onScanFailure = useCallback((error: string) => {
    console.log('Scan failed:', error);
  }, []);

  /**
   * Mulai scanning dengan kamera
   */
  const startCameraScanning = useCallback(async () => {
    try {
      setScannerError(null);
      const html5QrcodeModule = await import('html5-qrcode');
      const Html5Qrcode = html5QrcodeModule.Html5Qrcode;

      const element = document.getElementById(QR_CODE_REGION_ID);
      if (!element) {
        setScannerError('Element scanner tidak ditemukan.');
        return;
      }

      // Stop scanner yang sudah ada jika ada
      if (scannerRef.current) {
        await stopScanning();
      }

      // Set state scanning terlebih dahulu untuk menghilangkan placeholder
      setIsScanning(true);

      // Clear element content sebelum memulai scanner baru
      element.innerHTML = '';
      
      // Set styling untuk memastikan elemen terlihat dan tidak menyebabkan layout shift
      element.style.width = '100%';
      element.style.height = '500px';
      element.style.minHeight = '500px';
      element.style.position = 'relative';
      element.style.overflow = 'hidden';

      // Tunggu sedikit untuk memastikan DOM sudah update
      await new Promise(resolve => setTimeout(resolve, 200));

      // Inisialisasi QR Scanner baru
      scannerRef.current = new Html5Qrcode(QR_CODE_REGION_ID);

      // Dapatkan ukuran container untuk qrbox yang responsif
      const containerWidth = element.clientWidth || 300;
      const containerHeight = element.clientHeight || 300;
      const qrboxSize = Math.min(Math.min(containerWidth, containerHeight) - 40, 500);

      // Mulai scanning dengan kamera
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
      console.error('Error starting camera scanner:', error);
      setScannerError(
        error.message || 'Gagal memulai scanner. Pastikan kamera tersedia dan izin diberikan.'
      );
      setIsScanning(false);
      scannerRef.current = null;
      
      // Clear element content on error
      const element = document.getElementById(QR_CODE_REGION_ID);
      if (element) {
        element.innerHTML = '';
      }
    }
  }, [onScanSuccess, onScanFailure, stopScanning]);

  /**
   * Handler untuk scan QR code dari file gambar
   */
  const handleScanImageFile = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setScannerError(null);
      const html5QrcodeModule = await import('html5-qrcode');
      const Html5Qrcode = html5QrcodeModule.Html5Qrcode;

      const html5Qrcode = new Html5Qrcode(QR_CODE_REGION_ID);
      
      const decodedText = await html5Qrcode.scanFile(file, false);
      
      if (decodedText && decodedText.length > 0) {
        // Validasi QR code menggunakan hook
        try {
          const validationResult = await qrValidationStatus.handleScan(decodedText);
          
          if (validationResult.valid) {
            setScannedData(decodedText);
            setIsQrScanned(true);
            setShowQrScanner(false);
            setIsScanning(false);
          }
        } catch (error) {
          // Error sudah ditangani oleh useQrValidation hook
          console.error('QR validation error:', error);
          setScannerError(
            qrValidationStatus.errorMessage || 'Gagal memvalidasi QR code'
          );
        }
      }
    } catch (error: any) {
      console.error('Error scanning image file:', error);
      setScannerError(
        error.message || 'Gagal memindai QR code dari gambar. Pastikan file berisi QR code yang valid.'
      );
    } finally {
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  }, [qrValidationStatus]);

  /**
   * Handler untuk memilih kandidat
   */
  const handleVote = useCallback((candidateId: number) => {
    setSelectedCandidate(candidateId);
  }, []);

  /**
   * Handler untuk submit vote
   */
  const handleSubmit = useCallback(async (candidates: Candidate[]) => {
    if (!isQrScanned) {
      alert('Silakan scan QR code terlebih dahulu sebelum memilih kandidat.');
      return;
    }

    if (selectedCandidate === null) {
      return;
    }

    // Validasi QR validation result
    if (!qrValidationStatus.validationResult || !qrValidationStatus.validationResult.valid) {
      alert('QR code belum divalidasi. Silakan scan ulang QR code.');
      return;
    }

    const selectedCandidateData = candidates.find(c => c.id === selectedCandidate);
    if (!selectedCandidateData) {
      console.error('Candidate tidak ditemukan');
      return;
    }

    try {
      // Gunakan warga_nik dari QR validation result
      const wargaNik = qrValidationStatus.validationResult.wargaNik;
      
      if (!wargaNik) {
        alert('Data NIK tidak ditemukan dari QR code. Silakan scan ulang QR code.');
        return;
      }

      // Gunakan apiClient untuk konsistensi dengan hook lainnya
      const response = await apiClient.post('/api/voter/vote/create', {
        warga_nik: wargaNik,
        paslon_id: selectedCandidateData.id,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = 
          typeof errorData === 'object' && 
          errorData !== null && 
          'message' in errorData
            ? String(errorData.message)
            : 'Gagal mengirim vote. Silakan coba lagi.';
        alert(errorMessage);
        return;
      }

      const result = await response.json();
      console.log('Vote berhasil dikirim:', result);
      alert('Vote Anda berhasil dikirim!');
      
      // Reset form setelah berhasil
      setSelectedCandidate(null);
      setIsQrScanned(false);
      setScannedData(null);
      setShowQrScanner(false);
      qrValidationStatus.reset();
    } catch (error) {
      console.error('Error submitting vote:', error);
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Terjadi kesalahan saat mengirim vote. Silakan coba lagi.';
      alert(errorMessage);
    }
  }, [isQrScanned, selectedCandidate, qrValidationStatus]);

  /**
   * Handler untuk membuka scanner
   */
  const handleOpenScanner = useCallback(() => {
    setShowQrScanner(true);
  }, []);

  /**
   * Cleanup scanner saat component unmount atau modal ditutup
   */
  useEffect(() => {
    return () => {
      if (scannerRef.current && isScanning) {
        stopScanning();
      }
    };
  }, [showQrScanner, isScanning, stopScanning]);

  /**
   * Tambahkan CSS khusus untuk elemen video yang dibuat oleh html5-qrcode
   */
  useEffect(() => {
    if (isScanning) {
      const element = document.getElementById(QR_CODE_REGION_ID);
      if (element) {
        // Pastikan container memiliki height tetap
        element.style.height = '500px';
        element.style.minHeight = '500px';
        element.style.overflow = 'hidden';
        
        // Tunggu sedikit untuk memastikan elemen video sudah dibuat
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
    selectedCandidate,
    isQrScanned,
    showQrScanner,
    scannedData,
    scannerError,
    isScanning,
    scannerRef,
    fileInputRef,
    qrValidationStatus,
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

