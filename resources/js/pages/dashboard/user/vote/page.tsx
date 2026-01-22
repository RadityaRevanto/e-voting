import React from "react";
import UserDashboardlayout from "../../_components/userlayout";
import { QRScannerDialog } from "./_components/qr-scanner-dialog";
import { VoteHeader } from "./_components/vote-header";
import { ElectionTitle } from "./_components/election-title";
import { CandidatesList } from "./_components/candidates-list";
import { SubmitVoteButton } from "./_components/submit-vote-button";
import { useVotePage } from "@/hooks/use-vote-page";
import { useVoterPaslon } from "@/hooks/use-voter-paslon";
import { Spinner } from "@/components/ui/spinner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

export default function UserVotePage() {
  const {
    selectedCandidateId,
    isQrScanned,
    showQrScanner,
    scannerError,
    isScanning,
    isSubmittingVote,
    error,
    fileInputRef,
    handleVote,
    handleSubmit,
    handleOpenScanner,
    startCameraScanning,
    stopScanning,
    handleScanImageFile,
    setShowQrScanner,
    QR_CODE_REGION_ID,
  } = useVotePage();

  const { candidates, loading, error: paslonError } = useVoterPaslon();

  return (
    <UserDashboardlayout>
      <div className="bg-white w-full min-h-screen flex flex-col items-center pt-4 sm:pt-6 md:pt-8 pb-8 sm:pb-12 md:pb-16 px-4">
        <QRScannerDialog
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
        />

        <VoteHeader isQrScanned={isQrScanned} />

        <main className="flex flex-col items-center w-full max-w ">
          <ElectionTitle />

          {loading && (
            <div className="flex items-center justify-center py-8">
              <Spinner className="w-8 h-8" />
              <span className="ml-2 [font-family:'Poppins-Medium',Helvetica] text-[#53599b]">
                Memuat data kandidat...
              </span>
            </div>
          )}

          {(paslonError || error) && (
            <Alert variant="destructive" className="max-w-2xl mb-4 w-full">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {error || paslonError}
              </AlertDescription>
            </Alert>
          )}

          {scannerError && (
            <Alert variant="destructive" className="max-w-2xl mb-4 w-full">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {scannerError}
              </AlertDescription>
            </Alert>
          )}

          {!loading && !paslonError && candidates.length === 0 && (
            <Alert className="max-w-2xl mb-4 w-full">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Belum ada kandidat yang terdaftar.
              </AlertDescription>
            </Alert>
          )}

          {!loading && candidates.length > 0 && (
            <>
              <CandidatesList
                candidates={candidates}
                selectedCandidate={selectedCandidateId}
                isQrScanned={isQrScanned}
                onVote={handleVote}
                onOpenScanner={handleOpenScanner}
              />

              <SubmitVoteButton
                disabled={selectedCandidateId === null || !isQrScanned || isSubmittingVote}
                onSubmit={() => handleSubmit(candidates)}
              />
            </>
          )}
        </main>
      </div>
    </UserDashboardlayout>
  );
}
