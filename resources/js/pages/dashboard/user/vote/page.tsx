import React, { useState } from "react";
// QR Scanner imports - COMMENTED OUT
// import { useEffect, useRef, useCallback } from "react";
import UserDashboardlayout from "../../_components/userlayout";
// import { QRScannerDialog } from "./_components/qr-scanner-dialog";
import { VoteHeader } from "./_components/vote-header";
import { ElectionTitle } from "./_components/election-title";
import { CandidatesList } from "./_components/candidates-list";
import { Candidate } from "./_components/candidate-card";
import { SubmitVoteButton } from "./_components/submit-vote-button";

// QR Scanner constant - COMMENTED OUT
// const QR_CODE_REGION_ID = "qr-reader";

const candidates: Candidate[] = [
  {
    id: 1,
    name: "Raditya Gavra",
    department: "System Information",
    image: "/assets/images/user/imges.jpg",
  },
  {
    id: 2,
    name: "Raditya Gavra",
    department: "System Information",
    image: "/assets/images/user/imges.jpg",
  },
  {
    id: 3,
    name: "Raditya Gavra",
    department: "System Information",
    image: "/assets/images/user/imges.jpg",
  },
];

export default function UserVotePage() {
  const [selectedCandidate, setSelectedCandidate] = useState<number | null>(
    null
  );
  // QR Scanner feature - COMMENTED OUT
  // const [isQrScanned, setIsQrScanned] = useState<boolean>(false);
  // const [showQrScanner, setShowQrScanner] = useState<boolean>(true);
  // const [scannedData, setScannedData] = useState<string | null>(null);
  // const [scannerError, setScannerError] = useState<string | null>(null);
  // const [isScanning, setIsScanning] = useState<boolean>(false);
  // const scannerRef = useRef<any>(null);
  // const fileInputRef = useRef<HTMLInputElement | null>(null);
  
  // Set default values untuk bypass QR scanner
  const [isQrScanned] = useState<boolean>(true);
  const [showQrScanner] = useState<boolean>(false);
  const [scannedData] = useState<string | null>(null);

  // QR Scanner feature - COMMENTED OUT
  // const stopScanning = useCallback(async () => {
  //   if (scannerRef.current) {
  //     try {
  //       await scannerRef.current.stop();
  //       await scannerRef.current.clear();
  //       setIsScanning(false);
  //       scannerRef.current = null;
  //       
  //       // Clear element content
  //       const element = document.getElementById(QR_CODE_REGION_ID);
  //       if (element) {
  //         element.innerHTML = "";
  //       }
  //     } catch (error) {
  //       console.error("Error stopping scanner:", error);
  //       setIsScanning(false);
  //       scannerRef.current = null;
  //       
  //       // Clear element content even on error
  //       const element = document.getElementById(QR_CODE_REGION_ID);
  //       if (element) {
  //         element.innerHTML = "";
  //       }
  //     }
  //   }
  // }, []);

  // QR Scanner feature - COMMENTED OUT
  // const onScanSuccess = useCallback((decodedText: string) => {
  //   if (decodedText && decodedText.length > 0) {
  //     setScannedData(decodedText);
  //     setIsQrScanned(true);
  //     setShowQrScanner(false);
  //     setIsScanning(false);
  //     
  //     // Stop scanner setelah berhasil scan
  //     if (scannerRef.current) {
  //       scannerRef.current.stop().then(() => {
  //         scannerRef.current?.clear();
  //         scannerRef.current = null;
  //         
  //         // Clear element content
  //         const element = document.getElementById(QR_CODE_REGION_ID);
  //         if (element) {
  //           element.innerHTML = "";
  //         }
  //       }).catch((error: any) => {
  //         console.error("Error stopping scanner:", error);
  //         scannerRef.current = null;
  //         
  //         // Clear element content even on error
  //         const element = document.getElementById(QR_CODE_REGION_ID);
  //         if (element) {
  //           element.innerHTML = "";
  //         }
  //       });
  //     }
  //   }
  // }, []);

  // const onScanFailure = useCallback((error: string) => {
  //   console.log("Scan failed:", error);
  // }, []);

  // QR Scanner feature - COMMENTED OUT
  // const startCameraScanning = useCallback(async () => {
  //   try {
  //     setScannerError(null);
  //     const html5QrcodeModule = await import("html5-qrcode");
  //     const Html5Qrcode = html5QrcodeModule.Html5Qrcode;

  //     const element = document.getElementById(QR_CODE_REGION_ID);
  //     if (!element) {
  //       setScannerError("Element scanner tidak ditemukan.");
  //       return;
  //     }

  //     // Stop scanner yang sudah ada jika ada
  //     if (scannerRef.current) {
  //       await stopScanning();
  //     }

  //     // Set state scanning terlebih dahulu untuk menghilangkan placeholder
  //     setIsScanning(true);

  //     // Clear element content sebelum memulai scanner baru
  //     element.innerHTML = "";
  //     
  //     // Set styling untuk memastikan elemen terlihat dan tidak menyebabkan layout shift
  //     element.style.width = "100%";
  //     element.style.height = "500px";
  //     element.style.minHeight = "500px";
  //     element.style.position = "relative";
  //     element.style.overflow = "hidden";

  //     // Tunggu sedikit untuk memastikan DOM sudah update
  //     await new Promise(resolve => setTimeout(resolve, 200));

  //     // Inisialisasi QR Scanner baru
  //     scannerRef.current = new Html5Qrcode(QR_CODE_REGION_ID);

  //     // Dapatkan ukuran container untuk qrbox yang responsif
  //     const containerWidth = element.clientWidth || 300;
  //     const containerHeight = element.clientHeight || 300;
  //     const qrboxSize = Math.min(Math.min(containerWidth, containerHeight) - 40, 500);

  //     // Mulai scanning dengan kamera
  //     await scannerRef.current.start(
  //       { facingMode: "environment" },
  //       {
  //         fps: 10,
  //         qrbox: { width: qrboxSize, height: qrboxSize },
  //         aspectRatio: 1.0,
  //         rememberLastUsedCamera: true,
  //       },
  //       onScanSuccess,
  //       onScanFailure
  //     );
  //   } catch (error: any) {
  //     console.error("Error starting camera scanner:", error);
  //     setScannerError(
  //       error.message || "Gagal memulai scanner. Pastikan kamera tersedia dan izin diberikan."
  //     );
  //     setIsScanning(false);
  //     scannerRef.current = null;
  //     
  //     // Clear element content on error
  //     const element = document.getElementById(QR_CODE_REGION_ID);
  //     if (element) {
  //       element.innerHTML = "";
  //     }
  //   }
  // }, [onScanSuccess, onScanFailure, stopScanning]);

  // QR Scanner feature - COMMENTED OUT
  // const handleScanImageFile = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
  //   const file = event.target.files?.[0];
  //   if (!file) return;

  //   try {
  //     setScannerError(null);
  //     const html5QrcodeModule = await import("html5-qrcode");
  //     const Html5Qrcode = html5QrcodeModule.Html5Qrcode;

  //     const html5Qrcode = new Html5Qrcode(QR_CODE_REGION_ID);
  //     
  //     const decodedText = await html5Qrcode.scanFile(file, false);
  //     
  //     if (decodedText && decodedText.length > 0) {
  //       setScannedData(decodedText);
  //       setIsQrScanned(true);
  //       setShowQrScanner(false);
  //       setIsScanning(false);
  //     }
  //   } catch (error: any) {
  //     console.error("Error scanning image file:", error);
  //     setScannerError(
  //       error.message || "Gagal memindai QR code dari gambar. Pastikan file berisi QR code yang valid."
  //     );
  //   } finally {
  //     // Reset file input
  //     if (fileInputRef.current) {
  //       fileInputRef.current.value = "";
  //     }
  //   }
  // }, []);

  // QR Scanner feature - COMMENTED OUT
  // useEffect(() => {
  //   // Cleanup scanner saat component unmount atau modal ditutup
  //   return () => {
  //     if (scannerRef.current && isScanning) {
  //       stopScanning();
  //     }
  //   };
  // }, [showQrScanner, isScanning, stopScanning]);

  // useEffect(() => {
  //   // Tambahkan CSS khusus untuk elemen video yang dibuat oleh html5-qrcode
  //   if (isScanning) {
  //     const element = document.getElementById(QR_CODE_REGION_ID);
  //     if (element) {
  //       // Pastikan container memiliki height tetap
  //       element.style.height = '500px';
  //       element.style.minHeight = '500px';
  //       element.style.overflow = 'hidden';
  //       
  //       // Tunggu sedikit untuk memastikan elemen video sudah dibuat
  //       const timer = setTimeout(() => {
  //         const video = element.querySelector('video');
  //         const canvas = element.querySelector('canvas');
  //         const html5QrcodeContainer = element.querySelector('#html5-qrcode-container');
  //         
  //         if (html5QrcodeContainer) {
  //           (html5QrcodeContainer as HTMLElement).style.height = '100%';
  //           (html5QrcodeContainer as HTMLElement).style.overflow = 'hidden';
  //         }
  //         
  //         if (video) {
  //           video.style.width = '100%';
  //           video.style.height = '100%';
  //           video.style.display = 'block';
  //           video.style.objectFit = 'cover';
  //           video.style.maxHeight = '500px';
  //         }
  //         
  //         if (canvas) {
  //           canvas.style.display = 'block';
  //           canvas.style.maxHeight = '500px';
  //         }
  //       }, 300);

  //       return () => clearTimeout(timer);
  //     }
  //   }
  // }, [isScanning]);

  const handleVote = (candidateId: number) => {
    setSelectedCandidate(candidateId);
  };

  const handleSubmit = async () => {
    // QR Scanner check removed - no longer required
    if (selectedCandidate === null) {
      return;
    }

    const selectedCandidateData = candidates.find(c => c.id === selectedCandidate);
    if (!selectedCandidateData) {
      console.error('Candidate tidak ditemukan');
      return;
    }

    try {
      const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute("content") || "";
      
      const response = await fetch("/api/votes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-TOKEN": csrfToken,
          "Accept": "application/json",
        },
        body: JSON.stringify({
          candidate_id: selectedCandidateData.id,
          candidate_name: selectedCandidateData.name,
          candidate_department: selectedCandidateData.department,
          qr_code_data: scannedData, // null karena QR scanner di-comment
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error submitting vote:", errorData);
        alert("Gagal mengirim vote. Silakan coba lagi.");
        return;
      }

      const result = await response.json();
      console.log("Vote berhasil dikirim:", result);
      alert("Vote Anda berhasil dikirim!");
      
      // Reset form setelah berhasil
      setSelectedCandidate(null);
      // QR Scanner reset removed - no longer needed
      // setIsQrScanned(false);
      // setScannedData(null);
      // setShowQrScanner(false);
    } catch (error) {
      console.error("Error submitting vote:", error);
      alert("Terjadi kesalahan saat mengirim vote. Silakan coba lagi.");
    }
  };

  // QR Scanner feature - COMMENTED OUT
  // const handleOpenScanner = () => {
  //   setShowQrScanner(true);
  // };

  return (
    <UserDashboardlayout>
      <div className="bg-white w-full min-h-screen flex flex-col items-center py-16 px-4">
        {/* QR Scanner Dialog - COMMENTED OUT */}
        {/* <QRScannerDialog
          open={showQrScanner && !isQrScanned}
          onOpenChange={(open) => {
            if (!open && !isQrScanned) {
              return;
            }
            setShowQrScanner(open);
          }}
          scannerError={scannerError}
          isScanning={isScanning}
          startCameraScanning={startCameraScanning}
          stopScanning={stopScanning}
          handleScanImageFile={handleScanImageFile}
          fileInputRef={fileInputRef}
          qrCodeRegionId={QR_CODE_REGION_ID}
          setShowQrScanner={setShowQrScanner}
          isQrScanned={isQrScanned}
        /> */}

        <VoteHeader isQrScanned={isQrScanned} />

        <main className="flex flex-col items-center w-full">
          <ElectionTitle />

          <CandidatesList
            candidates={candidates}
            selectedCandidate={selectedCandidate}
            isQrScanned={isQrScanned}
            onVote={handleVote}
            onOpenScanner={() => {}} // QR Scanner disabled - empty function
          />

          <SubmitVoteButton
            disabled={selectedCandidate === null} // QR Scanner check removed
            onSubmit={handleSubmit}
          />
        </main>
      </div>
    </UserDashboardlayout>
  );
}
