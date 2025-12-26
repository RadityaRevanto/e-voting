import { useState, useEffect } from "react";
import AdminDashboardlayout from "../../_components/adminlayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { QRCodeSVG } from "qrcode.react";
import { Download, QrCode, Loader2 } from "lucide-react";
import InputError from "@/pages/dashboard/_components/input-error";
import { useQRCodeGenerate } from "@/hooks/use-qr-code-generate";

export default function AdminGeneratePage() {
    const [nik, setNik] = useState("");
    const [qrSize, setQrSize] = useState(256);
    const { qrCodeData, loading, error, generateQRCode, reset } = useQRCodeGenerate();

    useEffect(() => {
        const updateQrSize = () => {
            if (window.innerWidth < 640) {
                setQrSize(200);
            } else if (window.innerWidth < 1024) {
                setQrSize(256);
            } else {
                setQrSize(300);
            }
        };

        updateQrSize();
        window.addEventListener("resize", updateQrSize);
        return () => window.removeEventListener("resize", updateQrSize);
    }, []);

    const handleNikChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/\D/g, ""); // Hanya angka
        setNik(value);
        if (qrCodeData) {
            reset(); // Reset QR code saat NIK berubah
        }
    };

    const handleGenerate = async (e: React.FormEvent) => {
        e.preventDefault();
        await generateQRCode(nik, 10); // Default expiration 10 menit
    };

    const handleDownload = () => {
        if (!qrCodeData?.qr_code_content) return;

        const svg = document.getElementById("qr-code-svg");
        if (!svg) return;

        const svgData = new XMLSerializer().serializeToString(svg);
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        const img = new Image();

        img.onload = () => {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx?.drawImage(img, 0, 0);
            const pngFile = canvas.toDataURL("image/png");
            const downloadLink = document.createElement("a");
            downloadLink.download = `QRCode_NIK_${nik}.png`;
            downloadLink.href = pngFile;
            downloadLink.click();
        };

        img.src = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgData)));
    };

    return (
        <AdminDashboardlayout>
            <div className="bg-white w-full min-h-screen p-4 sm:p-6 md:p-8">
                <div className="w-full">
                    <header className="mb-6 sm:mb-8 md:mb-12">
                        <h1 className="font-bold text-[#53589a] text-3xl sm:text-4xl md:text-5xl lg:text-6xl mb-2 sm:mb-3 md:mb-4"> 
                            Generate QR Code
                        </h1>
                        <div className="w-full sm:w-3/4 md:w-1/2 h-0.5 bg-[#030303]" />
                    </header>       
                    <main className="space-y-4 sm:space-y-6 md:space-y-8">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-xl sm:text-2xl md:text-3xl lg:text-4xl text-[#53589a] flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3">
                                    <QrCode className="w-5 h-5 sm:w-6 h-6 md:w-8 h-8 flex-shrink-0" />
                                    <span className="break-words">Generate QR Code dari NIK KTP</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleGenerate} className="space-y-4 sm:space-y-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="nik" className="text-base sm:text-lg md:text-xl font-semibold text-[#53589a]">
                                            NIK KTP
                                        </Label>
                                        <Input
                                            id="nik"
                                            name="nik"
                                            type="text"
                                            value={nik}
                                            onChange={handleNikChange}
                                            placeholder="Masukkan NIK KTP (16 digit)"
                                            maxLength={16}
                                            required
                                            className="h-12 sm:h-14 text-base sm:text-lg"
                                        />
                                        <InputError message={error || undefined} />
                                        <p className="text-sm sm:text-base text-gray-500">
                                            Masukkan 16 digit NIK KTP untuk generate QR Code
                                        </p>
                                    </div>
                                    <Button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full sm:w-auto bg-[#53589a] hover:bg-[#53589a]/90 text-base sm:text-lg disabled:opacity-50"
                                        size="lg"
                                    >
                                        {loading ? (
                                            <>
                                                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                                Generating...
                                            </>
                                        ) : (
                                            "Generate QR Code"
                                        )}
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>

                        {qrCodeData && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-xl sm:text-2xl md:text-3xl lg:text-4xl text-[#53589a] break-words">
                                        QR Code
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4 sm:space-y-6">
                                    <div className="flex flex-col items-center justify-center">
                                        <div className="bg-white p-2 sm:p-3 md:p-4 rounded-lg shadow-md">
                                            <QRCodeSVG
                                                id="qr-code-svg"
                                                value={qrCodeData.qr_code_content}
                                                size={qrSize}
                                                level="H"
                                                includeMargin={true}
                                                className="max-w-full h-auto"
                                            />
                                        </div>
                                    </div>
                                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                                        <Button
                                            onClick={handleDownload}
                                            className="w-full sm:w-auto bg-[#53589a] hover:bg-[#53589a]/90 text-base sm:text-lg"
                                            size="lg"
                                        >
                                            <Download className="w-5 h-5 sm:w-6 h-6 mr-2" />
                                            Download QR Code
                                        </Button>
                                        <Button
                                            onClick={() => {
                                                setNik("");
                                                reset();
                                            }}
                                            variant="outline"
                                            size="lg"
                                            className="w-full sm:w-auto text-base sm:text-lg"
                                        >
                                            Reset
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </main>
                </div>
            </div>
        </AdminDashboardlayout>
    );
}