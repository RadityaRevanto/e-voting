import React from "react";
import { CheckCircle2 } from "lucide-react";

interface VoteHeaderProps {
  isQrScanned: boolean;
}

export function VoteHeader({ isQrScanned }: VoteHeaderProps) {
  return (
    <>
      {isQrScanned && (
        <div className="fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-1 bg-green-50 border border-green-200 rounded-lg shadow-sm">
          <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
          <span className="[font-family:'Poppins-Medium',Helvetica] font-medium text-green-700 text-sm whitespace-nowrap">
            QR Code Terverifikasi
          </span>
        </div>
      )}
      <header className="mb-8 w-full max-w-7xl mx-auto px-4">
        <div className="mb-4">
          <h1 className="[font-family:'Poppins-Bold',Helvetica] font-bold text-[#53589a] text-2xl sm:text-3xl md:text-[38px] tracking-[0] leading-tight mt-0">
            YOU MAY NOW CAST YOUR VOTES !
          </h1>
        </div>
        {!isQrScanned && (
          <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg shadow-sm">
            <p className="[font-family:'Poppins-Medium',Helvetica] font-medium text-yellow-800 text-sm">
              ⚠️ Anda harus scan QR code terlebih dahulu sebelum dapat melakukan vote
            </p>
          </div>
        )}
      </header>
    </>
  );
}
