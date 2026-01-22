import AdminDashboardlayout from "../../_components/adminlayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Loader2, UserPlus } from "lucide-react";
import { useRegisterNIK } from "@/hooks/use-register-nik";

export default function RegisterNIKPage() {
    const {
        nik,
        error,
        success,
        loading,
        handleNIKChange,
        handleSubmit,
    } = useRegisterNIK();

    return (
        <AdminDashboardlayout>
            <div className="bg-white w-full min-h-screen p-4 sm:p-6 md:p-8">
                <div className="w-full">
                    <header className="mb-6 sm:mb-8 md:mb-12">
                        <h1 className="font-bold text-[#53589a] text-3xl sm:text-4xl md:text-5xl lg:text-6xl mb-2 sm:mb-3 md:mb-4">
                            Register NIK
                        </h1>
                        <div className="w-full sm:w-3/4 md:w-1/2 h-0.5 bg-[#030303]" />
                    </header>

                    <main>
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-xl sm:text-2xl md:text-3xl lg:text-4xl text-[#53589a] flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3">
                                    <UserPlus className="w-5 h-5 sm:w-6 h-6 md:w-8 h-8 flex-shrink-0" />
                                    <span className="break-words">
                                        Daftarkan NIK Warga
                                    </span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <form
                                    onSubmit={handleSubmit}
                                    className="space-y-4 sm:space-y-6"
                                >
                                    {/* Success Message */}
                                    {success && (
                                        <Alert className="bg-green-50 border-green-200">
                                            <AlertCircle className="h-4 w-4 text-green-600" />
                                            <AlertDescription className="text-green-800">
                                                Berhasil Register NIK
                                            </AlertDescription>
                                        </Alert>
                                    )}

                                    {/* Error Message */}
                                    {error && (
                                        <Alert variant="destructive">
                                            <AlertCircle className="h-4 w-4" />
                                            <AlertDescription>{error}</AlertDescription>
                                        </Alert>
                                    )}

                                    {/* NIK Input */}
                                    <div className="space-y-2">
                                        <Label
                                            htmlFor="nik"
                                            className="text-base sm:text-lg md:text-xl font-semibold text-[#53589a]"
                                        >
                                            NIK (Nomor Induk Kependudukan)
                                        </Label>
                                        <Input
                                            id="nik"
                                            name="nik"
                                            type="text"
                                            value={nik}
                                            onChange={handleNIKChange}
                                            placeholder="Masukkan NIK 16 digit"
                                            maxLength={16}
                                            required
                                            disabled={loading}
                                            className="h-12 sm:h-14 text-base sm:text-lg"
                                            aria-invalid={error ? "true" : "false"}
                                        />
                                        <p className="text-sm sm:text-base text-gray-500">
                                            NIK harus terdiri dari 16 digit angka
                                        </p>
                                    </div>

                                    {/* Submit Button */}
                                    <Button
                                        type="submit"
                                        disabled={loading || nik.length !== 16}
                                        className="w-full sm:w-auto bg-[#53589a] hover:bg-[#53589a]/90 text-base sm:text-lg disabled:opacity-50"
                                        size="lg"
                                    >
                                        {loading ? (
                                            <>
                                                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                                Mendaftar...
                                            </>
                                        ) : (
                                            "Daftarkan NIK"
                                        )}
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>
                    </main>
                </div>
            </div>
        </AdminDashboardlayout>
    );
}