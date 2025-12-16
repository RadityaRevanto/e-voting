import React from "react";
import { CheckCircle2 } from "lucide-react";

interface VoteHeaderProps {
  isQrScanned: boolean;
}

export function VoteHeader({ isQrScanned }: VoteHeaderProps) {
  return (
    <header className="mb-15 -mt-10 w-full">
      <div className="flex items-center justify-between mb-4">
        <h1 className="[font-family:'Poppins-Bold',Helvetica] font-bold text-[#53589a] text-[38px] tracking-[0] leading-[normal] text-left">
          YOU MAY NOW CAST YOUR VOTES !
        </h1>
        {isQrScanned && (
          <div className="flex items-center gap-2 px-4 py-2 bg-green-50 border border-green-200 rounded-lg">
            <CheckCircle2 className="w-5 h-5 text-green-600" />
            <span className="[font-family:'Poppins-Medium',Helvetica] font-medium text-green-700 text-sm">
              QR Code Terverifikasi
            </span>
          </div>
        )}
      </div>
      {!isQrScanned && (
        <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="[font-family:'Poppins-Medium',Helvetica] font-medium text-yellow-800 text-sm">
            ⚠️ Anda harus scan QR code terlebih dahulu sebelum dapat melakukan vote
          </p>
        </div>
      )}
    </header>
  );
}
