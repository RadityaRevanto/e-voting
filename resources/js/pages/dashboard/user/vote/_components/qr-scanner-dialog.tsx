import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScanLine, Image as ImageIcon, Square, Play } from "lucide-react";

interface QRScannerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  scannerError: string | null;
  isScanning: boolean;
  startCameraScanning: () => Promise<void>;
  stopScanning: () => Promise<void>;
  handleScanImageFile: (event: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  qrCodeRegionId: string;
  setShowQrScanner: (show: boolean) => void;
  isQrScanned: boolean;
}

export function QRScannerDialog({
  open,
  onOpenChange,
  scannerError,
  isScanning,
  startCameraScanning,
  stopScanning,
  handleScanImageFile,
  fileInputRef,
  qrCodeRegionId,
  setShowQrScanner,
  isQrScanned,
}: QRScannerDialogProps) {
  const handleClose = (open: boolean) => {
    if (!open && !isQrScanned) {
      return;
    }
    setShowQrScanner(open);
    onOpenChange(open);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-2xl w-full">
        <DialogHeader>
          <div className="flex justify-center mb-4">
            <div className="rounded-full border-2 border-[#232f9b] bg-[#232f9b]/10 p-4">
              <ScanLine className="w-8 h-8 text-[#232f9b]" />
            </div>
          </div>
          <DialogTitle className="text-center [font-family:'Poppins-Bold',Helvetica] font-bold text-[#53589a] text-2xl">
            Scan QR Code
          </DialogTitle>
          <DialogDescription className="text-center [font-family:'Poppins-Medium',Helvetica] text-[#53599b]">
            Silakan scan QR code terlebih dahulu sebelum melakukan vote
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col items-center space-y-4 w-full">
          {scannerError ? (
            <div className="w-full p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-800 text-center [font-family:'Poppins-Medium',Helvetica]">
                {scannerError}
              </p>
              <button
                onClick={() => {
                  setShowQrScanner(false);
                }}
                className="mt-2 w-full px-4 py-2 bg-[#232f9b] text-white rounded-lg [font-family:'Poppins-Medium',Helvetica] text-sm hover:bg-[#1a2470] transition-colors"
              >
                Tutup Pesan Error
              </button>
            </div>
          ) : (
            <>
              <div
                className="w-full relative"
                style={{ minHeight: "500px", height: "500px" }}
              >
                {!isScanning && (
                  <div className="absolute inset-0 bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300 z-10 pointer-events-none">
                    <div className="text-center p-8">
                      <ScanLine className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <p className="text-sm text-gray-500 [font-family:'Poppins-Medium',Helvetica]">
                        Pilih metode scanning untuk memulai
                      </p>
                    </div>
                  </div>
                )}
                <div
                  id={qrCodeRegionId}
                  className="w-full h-full rounded-lg overflow-hidden"
                  style={{
                    backgroundColor: "transparent",
                    position: "relative",
                    height: "100%",
                    minHeight: "500px",
                  }}
                />
              </div>

              {/* Control Buttons */}
              <div className="w-full space-y-3">
                {/* Start Scanning Button */}
                <button
                  onClick={startCameraScanning}
                  disabled={isScanning}
                  className={`flex items-center justify-center gap-2 w-full px-4 py-3 bg-[#232f9b] text-white rounded-lg [font-family:'Poppins-Medium',Helvetica] text-sm transition-all ${
                    isScanning
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:bg-[#1a2470] hover:shadow-md"
                  }`}
                >
                  <Play className="w-4 h-4" />
                  <span>Start Scanning</span>
                </button>

                {/* Stop Scan Button */}
                <button
                  onClick={stopScanning}
                  disabled={!isScanning}
                  className={`flex items-center justify-center gap-2 w-full px-4 py-3 bg-red-600 text-white rounded-lg [font-family:'Poppins-Medium',Helvetica] text-sm transition-all ${
                    !isScanning
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:bg-red-700 hover:shadow-md"
                  }`}
                >
                  <Square className="w-4 h-4" />
                  <span>Stop Scan</span>
                </button>

                {/* Scan Image File Button */}
                <div className="relative">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleScanImageFile}
                    className="hidden"
                    id="file-scan-input"
                  />
                  <label
                    htmlFor="file-scan-input"
                    className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-white border-2 border-[#232f9b] text-[#232f9b] rounded-lg [font-family:'Poppins-Medium',Helvetica] text-sm cursor-pointer hover:bg-[#232f9b]/5 transition-all hover:shadow-md"
                  >
                    <ImageIcon className="w-4 h-4" />
                    <span>Scan Image File</span>
                  </label>
                </div>
              </div>

              {isScanning && (
                <p className="text-sm text-gray-500 text-center [font-family:'Poppins-Regular',Helvetica]">
                  Arahkan kamera ke QR code untuk memindai
                </p>
              )}
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
