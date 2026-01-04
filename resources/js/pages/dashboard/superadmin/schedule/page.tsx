import { useState, useEffect } from "react";
import SuperadminLayout from "../../_components/superadminlayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Head } from "@inertiajs/react";
import {
    Calendar,
    Clock,
    Save,
    AlertCircle,
    CheckCircle2,
    PlayCircle,
    Timer,
    Sparkles,
} from "lucide-react";
import { useSchedule, Schedule } from "@/hooks/use-schedule";
import { Alert, AlertDescription } from "@/components/ui/alert";

type ScheduleStatus = "upcoming" | "active" | "completed";

export default function SchedulePage() {
    const { schedules, loading, error, fetchSchedules, setSchedule } = useSchedule(true);

    const [formData, setFormData] = useState<{
        registration: { start_time: string; end_time: string };
        voting: { start_time: string; end_time: string };
        announcement: { start_time: string; end_time: string };
    }>({
        registration: { start_time: "", end_time: "" },
        voting: { start_time: "", end_time: "" },
        announcement: { start_time: "", end_time: "" },
    });

    const [saving, setSaving] = useState<{
        registration: boolean;
        voting: boolean;
        announcement: boolean;
    }>({
        registration: false,
        voting: false,
        announcement: false,
    });

    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [currentTime, setCurrentTime] = useState(new Date());

    // Update current time setiap detik untuk countdown
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    // Update form data ketika schedules berubah
    useEffect(() => {
        if (schedules.length > 0) {
            const registration = schedules.find((s) => s.tag === "registration");
            const voting = schedules.find((s) => s.tag === "voting");
            const announcement = schedules.find((s) => s.tag === "announcement");

            setFormData({
                registration: {
                    start_time: registration
                        ? new Date(registration.start_time).toISOString().slice(0, 16)
                        : "",
                    end_time: registration
                        ? new Date(registration.end_time).toISOString().slice(0, 16)
                        : "",
                },
                voting: {
                    start_time: voting
                        ? new Date(voting.start_time).toISOString().slice(0, 16)
                        : "",
                    end_time: voting
                        ? new Date(voting.end_time).toISOString().slice(0, 16)
                        : "",
                },
                announcement: {
                    start_time: announcement
                        ? new Date(announcement.start_time).toISOString().slice(0, 16)
                        : "",
                    end_time: announcement
                        ? new Date(announcement.end_time).toISOString().slice(0, 16)
                        : "",
                },
            });
        }
    }, [schedules]);

    const handleInputChange = (
        tag: "registration" | "voting" | "announcement",
        field: "start_time" | "end_time",
        value: string
    ) => {
        setFormData((prev) => ({
            ...prev,
            [tag]: {
                ...prev[tag],
                [field]: value,
            },
        }));
    };

    const handleSubmit = async (tag: "registration" | "voting" | "announcement") => {
        const scheduleData = formData[tag];

        // Validasi
        if (!scheduleData.start_time || !scheduleData.end_time) {
            setSuccessMessage(null);
            return;
        }

        const startTime = new Date(scheduleData.start_time);
        const endTime = new Date(scheduleData.end_time);

        if (endTime <= startTime) {
            setSuccessMessage(null);
            return;
        }

        try {
            setSaving((prev) => ({ ...prev, [tag]: true }));
            setSuccessMessage(null);

            await setSchedule({
                tag,
                start_time: startTime.toISOString(),
                end_time: endTime.toISOString(),
            });

            setSuccessMessage(`Jadwal ${getTagLabel(tag)} berhasil diatur`);
            setTimeout(() => setSuccessMessage(null), 5000);
        } catch (err) {
            console.error("Error setting schedule:", err);
        } finally {
            setSaving((prev) => ({ ...prev, [tag]: false }));
        }
    };

    const getTagLabel = (tag: "registration" | "voting" | "announcement") => {
        switch (tag) {
            case "registration":
                return "Pendaftaran";
            case "voting":
                return "Voting";
            case "announcement":
                return "Pengumuman";
            default:
                return tag;
        }
    };

    const getTagColor = (tag: "registration" | "voting" | "announcement") => {
        switch (tag) {
            case "registration":
                return "bg-blue-500";
            case "voting":
                return "bg-green-500";
            case "announcement":
                return "bg-purple-500";
            default:
                return "bg-gray-500";
        }
    };

    const formatDateTime = (dateString: string) => {
        if (!dateString) return "-";
        const date = new Date(dateString);
        return new Intl.DateTimeFormat("id-ID", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        }).format(date);
    };

    const getCurrentSchedule = (tag: "registration" | "voting" | "announcement") => {
        return schedules.find((s) => s.tag === tag);
    };

    const getScheduleStatus = (
        tag: "registration" | "voting" | "announcement"
    ): ScheduleStatus => {
        const schedule = getCurrentSchedule(tag);
        if (!schedule) return "upcoming";

        const now = currentTime.getTime();
        const start = new Date(schedule.start_time).getTime();
        const end = new Date(schedule.end_time).getTime();

        if (now < start) return "upcoming";
        if (now >= start && now <= end) return "active";
        return "completed";
    };

    const getCountdown = (tag: "registration" | "voting" | "announcement") => {
        const schedule = getCurrentSchedule(tag);
        if (!schedule) return null;

        const now = currentTime.getTime();
        const start = new Date(schedule.start_time).getTime();
        const end = new Date(schedule.end_time).getTime();

        if (now < start) {
            // Countdown to start
            const diff = start - now;
            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);
            return { type: "start", days, hours, minutes, seconds };
        } else if (now >= start && now <= end) {
            // Countdown to end
            const diff = end - now;
            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);
            return { type: "end", days, hours, minutes, seconds };
        }
        return null;
    };

    const getProgress = (tag: "registration" | "voting" | "announcement") => {
        const schedule = getCurrentSchedule(tag);
        if (!schedule) return 0;

        const now = currentTime.getTime();
        const start = new Date(schedule.start_time).getTime();
        const end = new Date(schedule.end_time).getTime();

        if (now < start) return 0;
        if (now > end) return 100;
        return ((now - start) / (end - start)) * 100;
    };

    const getStatusBadge = (status: ScheduleStatus) => {
        switch (status) {
            case "upcoming":
                return {
                    label: "Akan Datang",
                    icon: Clock,
                    className: "bg-blue-100 text-blue-700 border-blue-200",
                };
            case "active":
                return {
                    label: "Sedang Berlangsung",
                    icon: PlayCircle,
                    className: "bg-green-100 text-green-700 border-green-200 animate-pulse",
                };
            case "completed":
                return {
                    label: "Selesai",
                    icon: CheckCircle2,
                    className: "bg-gray-100 text-gray-700 border-gray-200",
                };
        }
    };

    const renderScheduleCard = (tag: "registration" | "voting" | "announcement") => {
        const schedule = getCurrentSchedule(tag);
        const status = getScheduleStatus(tag);
        const countdown = getCountdown(tag);
        const progress = getProgress(tag);
        const statusBadge = getStatusBadge(status);
        const StatusIcon = statusBadge.icon;

        return (
            <Card
                className={`shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border-2 ${
                    status === "active"
                        ? "border-green-300 bg-gradient-to-br from-green-50 to-white"
                        : status === "completed"
                          ? "border-gray-200 bg-gradient-to-br from-gray-50 to-white"
                          : "border-blue-200 bg-gradient-to-br from-blue-50 to-white"
                }`}
            >
                <CardHeader className="pb-4">
                    <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-3">
                            <CardTitle className="text-xl text-[#53589a] font-bold">
                                {getTagLabel(tag)}
                            </CardTitle>
                        </div>
                        <div
                            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${statusBadge.className} transition-all duration-300`}
                        >
                            <StatusIcon className="h-3.5 w-3.5" />
                            <span>{statusBadge.label}</span>
                        </div>
                    </div>

                    {/* Progress Bar untuk jadwal aktif */}
                    {status === "active" && (
                        <div className="mt-3 space-y-1">
                            <div className="flex justify-between text-xs text-gray-600">
                                <span>Progress</span>
                                <span>{Math.round(progress)}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                                <div
                                    className="bg-gradient-to-r from-green-400 to-green-600 h-2 rounded-full transition-all duration-1000 ease-out"
                                    style={{ width: `${progress}%` }}
                                />
                            </div>
                        </div>
                    )}

                    {/* Countdown Timer */}
                    {countdown && (
                        <div className="mt-3 p-3 bg-white/60 rounded-lg border border-gray-200">
                            <div className="flex items-center gap-2 mb-2">
                                <Timer className="h-4 w-4 text-gray-600" />
                                <span className="text-xs font-semibold text-gray-700">
                                    {countdown.type === "start" ? "Dimulai dalam" : "Berakhir dalam"}
                                </span>
                            </div>
                            <div className="flex gap-2">
                                {countdown.days > 0 && (
                                    <div className="flex-1 text-center">
                                        <div className="text-lg font-bold text-[#53589a]">
                                            {countdown.days}
                                        </div>
                                        <div className="text-xs text-gray-500">Hari</div>
                                    </div>
                                )}
                                <div className="flex-1 text-center">
                                    <div className="text-lg font-bold text-[#53589a]">
                                        {String(countdown.hours).padStart(2, "0")}
                                    </div>
                                    <div className="text-xs text-gray-500">Jam</div>
                                </div>
                                <div className="flex-1 text-center">
                                    <div className="text-lg font-bold text-[#53589a]">
                                        {String(countdown.minutes).padStart(2, "0")}
                                    </div>
                                    <div className="text-xs text-gray-500">Menit</div>
                                </div>
                                <div className="flex-1 text-center">
                                    <div className="text-lg font-bold text-[#53589a]">
                                        {String(countdown.seconds).padStart(2, "0")}
                                    </div>
                                    <div className="text-xs text-gray-500">Detik</div>
                                </div>
                            </div>
                        </div>
                    )}
                </CardHeader>
                <CardContent className="space-y-4">
                    {schedule && (
                        <div className="text-sm text-gray-700 space-y-2 p-3 bg-white/80 rounded-lg border border-gray-100">
                            <div className="flex items-start gap-2">
                                <Calendar className="h-4 w-4 text-gray-500 mt-0.5 flex-shrink-0" />
                                <div className="flex-1">
                                    <p className="font-semibold text-gray-800 mb-1">Waktu Mulai</p>
                                    <p className="text-gray-600">
                                        {formatDateTime(schedule.start_time)}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start gap-2">
                                <Calendar className="h-4 w-4 text-gray-500 mt-0.5 flex-shrink-0" />
                                <div className="flex-1">
                                    <p className="font-semibold text-gray-800 mb-1">Waktu Selesai</p>
                                    <p className="text-gray-600">{formatDateTime(schedule.end_time)}</p>
                                </div>
                            </div>
                        </div>
                    )}
                    <Separator className="bg-gray-200" />
                    <div className="space-y-4">
                        <div>
                            <Label
                                htmlFor={`${tag}-start`}
                                className="flex items-center gap-2 mb-2 text-sm font-semibold text-gray-700"
                            >
                                <Clock className="h-4 w-4 text-[#53589a]" />
                                Waktu Mulai
                            </Label>
                            <Input
                                id={`${tag}-start`}
                                type="datetime-local"
                                value={formData[tag].start_time}
                                onChange={(e) => handleInputChange(tag, "start_time", e.target.value)}
                                className="transition-all duration-200 focus:ring-2 focus:ring-[#53589a] focus:border-[#53589a]"
                            />
                        </div>
                        <div>
                            <Label
                                htmlFor={`${tag}-end`}
                                className="flex items-center gap-2 mb-2 text-sm font-semibold text-gray-700"
                            >
                                <Clock className="h-4 w-4 text-[#53589a]" />
                                Waktu Selesai
                            </Label>
                            <Input
                                id={`${tag}-end`}
                                type="datetime-local"
                                value={formData[tag].end_time}
                                onChange={(e) => handleInputChange(tag, "end_time", e.target.value)}
                                className="transition-all duration-200 focus:ring-2 focus:ring-[#53589a] focus:border-[#53589a]"
                            />
                        </div>
                        <Button
                            onClick={() => handleSubmit(tag)}
                            disabled={saving[tag] || loading}
                            className={`w-full bg-gradient-to-r from-[#53589a] to-[#434a7a] hover:from-[#434a7a] hover:to-[#53589a] text-white font-semibold transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-md hover:shadow-lg ${
                                saving[tag] ? "opacity-70 cursor-not-allowed" : ""
                            }`}
                        >
                            {saving[tag] ? (
                                <span className="flex items-center gap-2">
                                    <Sparkles className="h-4 w-4 animate-spin" />
                                    Menyimpan...
                                </span>
                            ) : (
                                <span className="flex items-center gap-2">
                                    <Save className="h-4 w-4" />
                                    Simpan Jadwal
                                </span>
                            )}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        );
    };

    return (
        <SuperadminLayout>
            <Head title="Jadwal Voting" />
                <div className="w-full">
                    {/* Header */}
                    <div className="mb-6 md:mb-8">
                        <div className="flex items-center gap-3 mb-4">
                            <h1 className="text-2xl md:text-3xl xl:text-4xl font-bold text-[#53589a]">
                                Jadwal Voting
                            </h1>
                        </div>
                        <Separator className="bg-[#030303]" />
                    </div>

                    {successMessage && (
                        <Alert className="mb-6 border-green-300 bg-gradient-to-r from-green-50 to-green-100 shadow-md animate-in slide-in-from-top-2 duration-300">
                            <CheckCircle2 className="h-4 w-4 text-green-600" />
                            <AlertDescription className="text-green-800 font-medium">
                                {successMessage}
                            </AlertDescription>
                        </Alert>
                    )}

                    {error && (
                        <Alert className="mb-6 border-red-300 bg-gradient-to-r from-red-50 to-red-100 shadow-md animate-in slide-in-from-top-2 duration-300">
                            <AlertCircle className="h-4 w-4 text-red-600" />
                            <AlertDescription className="text-red-800 font-medium">
                                {error}
                            </AlertDescription>
                        </Alert>
                    )}

                    {loading && schedules.length === 0 ? (
                        <Card className="shadow-lg">
                            <CardContent className="pt-6">
                                <div className="text-center py-12">
                                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-[#53589a] border-t-transparent mb-4"></div>
                                    <p className="text-gray-600 font-medium">Memuat data jadwal...</p>
                                </div>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in duration-500">
                            {renderScheduleCard("registration")}
                            {renderScheduleCard("voting")}
                            {renderScheduleCard("announcement")}
                        </div>
                    )}
                </div>
        </SuperadminLayout>
    );
}

