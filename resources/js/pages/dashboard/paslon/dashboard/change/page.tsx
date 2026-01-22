import PaslonLayout from "../../../_components/paslonlayout";
import { useState, FormEvent, useEffect, useMemo } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import InputError from "@/pages/dashboard/_components/input-error";
import { Plus, Trash2 } from "lucide-react";
import { useVisiMisiPaslon } from "@/hooks/use-visi-misi-paslon";

export default function PaslonDashboardChangePage() {
    const {
        visi: visiFromHook,
        misi: misiFromHook,
        loading,
        submitting,
        error: hookError,
        fetchVisiMisi,
        updateVisiMisi,
    } = useVisiMisiPaslon(false);

    const parseMissions = (misiString: string | null): string[] => {
        if (!misiString || typeof misiString !== 'string') return [""];
        const parsed = misiString
            .split("\n")
            .map((m) => m.trim())
            .filter((m) => m.length > 0);
        return parsed.length > 0 ? parsed : [""];
    };

    const initialMissions = useMemo(
        () => parseMissions(misiFromHook),
        [misiFromHook]
    );

    const [vision, setVision] = useState("");
    const [missions, setMissions] = useState<string[]>([""]);

    // Update state when hook data changes
    useEffect(() => {
        if (visiFromHook !== null) {
            setVision(visiFromHook);
        } else {
            setVision("");
        }
        setMissions(parseMissions(misiFromHook));
    }, [visiFromHook, misiFromHook]);

    // Fetch data on mount
    useEffect(() => {
        fetchVisiMisi();
    }, [fetchVisiMisi]);

    const [errors, setErrors] = useState<{
        vision?: string;
        missions?: string;
        message?: string;
    }>({});
    const [success, setSuccess] = useState("");

    const handleAddMission = () => {
        setMissions([...missions, ""]);
    };

    const handleRemoveMission = (index: number) => {
        if (missions.length > 1) {
            const newMissions = missions.filter((_, i) => i !== index);
            setMissions(newMissions);
        }
    };

    const handleMissionChange = (index: number, value: string) => {
        const newMissions = [...missions];
        newMissions[index] = value;
        setMissions(newMissions);
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setErrors({});
        setSuccess("");

        // Validasi vision
        if (!vision.trim()) {
            setErrors({
                vision: "Vision harus diisi",
            });
            return;
        }

        // Validasi missions
        const validMissions = missions.filter((mission) => mission.trim() !== "");

        if (validMissions.length === 0) {
            setErrors({
                missions: "Minimal harus ada 1 mission",
            });
            return;
        }

        try {
            const misiString = validMissions.map((m) => m.trim()).join("\n");

            await updateVisiMisi({
                visi: vision.trim() || null,
                misi: misiString || null,
            });

            // Success - data akan diupdate otomatis oleh hook
            setSuccess("Vision dan Mission berhasil disimpan!");
            setErrors({});

            // Clear success message after 5 seconds
            setTimeout(() => {
                setSuccess("");
            }, 5000);
        } catch (error) {
            // Error handling - hook sudah set error, tapi kita juga set di local state
            const errorMessage =
                error instanceof Error
                    ? error.message
                    : "Terjadi kesalahan saat menyimpan vision dan mission. Silakan coba lagi.";
            setErrors({
                message: errorMessage,
            });
        }
    };

    if (loading) {
        return (
            <PaslonLayout>
                <div className="bg-white w-full min-h-screen p-6">
                    <div className="w-full">
                        <header className="flex flex-col gap-4 mb-8">
                            <h1 className="font-bold text-[#53589a] text-3xl sm:text-4xl lg:text-5xl leading-tight">
                                CHANGE
                            </h1>
                            <div className="h-[2px] w-32 sm:w-64 bg-[#53589a]" />
                        </header>
                        <div className="flex items-center justify-center py-12">
                            <p className="text-[#53599b] text-base md:text-lg">
                                Memuat data...
                            </p>
                        </div>
                    </div>
                </div>
            </PaslonLayout>
        );
    }

    return (
        <PaslonLayout>
            <div className="bg-white w-full min-h-screen p-6">
                <div className="w-full">
                    <header className="flex flex-col gap-4 mb-8">
                        <h1 className="font-bold text-[#53589a] text-3xl sm:text-4xl lg:text-5xl leading-tight">
                            CHANGE
                        </h1>
                        <div className="h-[2px] w-32 sm:w-64 bg-[#53589a]" />
                    </header>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {success && (
                            <div className="p-4 bg-green-50 border border-green-200 rounded-md">
                                <p className="text-sm text-green-800">{success}</p>
                            </div>
                        )}

                        {(errors.message || hookError) && (
                            <div className="p-4 bg-red-50 border border-red-200 rounded-md">
                                <p className="text-sm text-red-800">
                                    {errors.message || hookError || "Terjadi kesalahan"}
                                </p>
                            </div>
                        )}

                        {/* Vision */}
                        <div className="space-y-2">
                            <label
                                htmlFor="vision"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Vision <span className="text-red-500">*</span>
                            </label>
                            <Textarea
                                id="vision"
                                value={vision}
                                onChange={(e) => setVision(e.target.value)}
                                className="w-full min-h-[120px]"
                                disabled={submitting || loading}
                                placeholder="Masukkan vision Anda"
                                aria-invalid={errors.vision ? "true" : "false"}
                            />
                            <InputError message={errors.vision} />
                        </div>

                        {/* Missions */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <label className="block text-sm font-medium text-gray-700">
                                    Mission <span className="text-red-500">*</span>
                                </label>
                                <Button
                                    type="button"
                                    onClick={handleAddMission}
                                    variant="outline"
                                    className="text-[#53589a] hover:bg-[#53589a] hover:text-white border-[#53589a]"
                                    disabled={submitting || loading}
                                >
                                    <Plus className="w-4 h-4 mr-2" />
                                    Tambah Mission
                                </Button>
                            </div>

                            {missions.map((mission, index) => (
                                <div key={index} className="flex gap-2 items-start">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="text-sm font-medium text-gray-700">
                                                Mission {index + 1}
                                            </span>
                                        </div>
                                        <Textarea
                                            value={mission}
                                            onChange={(e) => handleMissionChange(index, e.target.value)}
                                            className="w-full min-h-[80px]"
                                            disabled={submitting || loading}
                                            placeholder={`Masukkan mission ${index + 1}`}
                                        />
                                    </div>
                                    {missions.length > 1 && (
                                        <Button
                                            type="button"
                                            onClick={() => handleRemoveMission(index)}
                                            variant="outline"
                                            className="mt-7 text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                                            disabled={submitting || loading}
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    )}
                                </div>
                            ))}
                            <InputError message={errors.missions} />
                            <p className="text-xs text-gray-500">
                                Minimal harus ada 1 mission. Kosongkan field untuk menghapus mission.
                            </p>
                        </div>

                        <div className="flex gap-4 pt-4">
                            <Button
                                type="submit"
                                disabled={submitting || loading}
                                className="px-6 py-2 bg-[#53589a] hover:bg-[#43477a] text-white rounded-full font-semibold"
                            >
                                {submitting || loading
                                    ? "Menyimpan..."
                                    : "Simpan Perubahan"}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </PaslonLayout>
    );
}
