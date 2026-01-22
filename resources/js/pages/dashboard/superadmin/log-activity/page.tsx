import { useState, useEffect, useMemo, useRef } from "react";
import SuperadminLayout from "../../_components/superadminlayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Head } from "@inertiajs/react";
import { Search, Calendar, User, Vote, Users, Loader2, TrendingUp, Activity } from "lucide-react";
import { useActivityLogs } from "@/hooks/use-activity-logs";

// Komponen untuk animasi counter
function AnimatedCounter({ value, duration = 1000 }: { value: number; duration?: number }) {
    const [count, setCount] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);
    const prevValueRef = useRef(0);

    useEffect(() => {
        setIsAnimating(true);
        const startTime = Date.now();
        const startValue = prevValueRef.current;
        const endValue = value;
        const difference = endValue - startValue;

        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function (ease-out)
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const currentValue = Math.round(startValue + difference * easeOut);
            
            setCount(currentValue);

            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                setIsAnimating(false);
                prevValueRef.current = value;
            }
        };

        requestAnimationFrame(animate);
    }, [value, duration]);

    return <span className={isAnimating ? "transition-all duration-300" : ""}>{count}</span>;
}

// Komponen Skeleton Loading
function SkeletonRow() {
    return (
        <tr className="animate-pulse">
            <td className="p-3">
                <div className="h-4 bg-gray-200 rounded w-8"></div>
            </td>
            <td className="p-3">
                <div className="h-4 bg-gray-200 rounded w-32"></div>
            </td>
            <td className="p-3">
                <div className="h-4 bg-gray-200 rounded w-48"></div>
            </td>
            <td className="p-3">
                <div className="h-6 bg-gray-200 rounded w-20"></div>
            </td>
            <td className="p-3">
                <div className="h-6 bg-gray-200 rounded w-16"></div>
            </td>
            <td className="p-3">
                <div className="h-4 bg-gray-200 rounded w-32"></div>
            </td>
        </tr>
    );
}

export default function LogActivityPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [dateFilter, setDateFilter] = useState("");
    const [roleFilter, setRoleFilter] = useState<"superadmin" | "admin" | "paslon" | "voter" | "all">("all");
    const tableRef = useRef<HTMLDivElement>(null);

    const { logs, loading, error, fetchLogs } = useActivityLogs({
        role: "all",
        autoFetch: false,
    });

    useEffect(() => {
        fetchLogs(roleFilter);
    }, [roleFilter, fetchLogs]);

    const filteredLogs = useMemo(() => {
        return logs.filter((log) => {
            const searchLower = searchTerm.toLowerCase();
            const logDate = new Date(log.created_at).toISOString().split("T")[0];
            
            const matchesSearch =
                log.session.toLowerCase().includes(searchLower) ||
                log.info.toLowerCase().includes(searchLower) ||
                log.context.toLowerCase().includes(searchLower) ||
                log.subject.toLowerCase().includes(searchLower);

            const matchesDate = !dateFilter || logDate === dateFilter;

            return matchesSearch && matchesDate;
        });
    }, [logs, searchTerm, dateFilter]);

    const formatDateTime = (dateString: string) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat("id-ID", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
        }).format(date);
    };

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setDateFilter(e.target.value);
    };

    const handleRoleChange = (value: string) => {
        setRoleFilter(value as "admin" | "paslon" | "voter" | "all");
    };

    const getRoleBadgeColor = (role: string) => {
        switch (role) {
            case "admin":
                return "bg-red-500 text-white";
            case "superadmin":
                return "bg-purple-500 text-white";
            case "paslon":
                return "bg-blue-500 text-white";
            case "voter":
                return "bg-green-500 text-white";
            default:
                return "bg-gray-500 text-white";
        }
    };

    const getRoleLabel = (role: string) => {
        switch (role) {
            case "admin":
                return "Admin";
            case "paslon":
                return "Paslon";
            case "voter":
                return "Voter";
            default:
                return role;
        }
    };

    return (
        <SuperadminLayout>
            <Head title="Log Activity Voting" />
            <div className="bg-white w-full min-h-screen p-4 md:p-6 xl:p-8">
                <div className="w-full">
                    {/* Header */}
                    <div className="mb-6 md:mb-8">
                        <h1 className="text-2xl md:text-3xl xl:text-4xl font-bold text-[#53589a] mb-4 flex items-center gap-3">
                            <Activity className="h-8 w-8 md:h-10 md:w-10" />
                            <span>Log Activity Voting</span>
                        </h1>
                        <Separator className="bg-[#030303]" />
                    </div>

                    {/* Filters */}
                    <Card className="mb-6 shadow-md">
                        <CardContent className="pt-6">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                    <Input
                                        type="text"
                                        placeholder="Cari berdasarkan session, info, context, atau subject..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="pl-10 focus:ring-2 focus:ring-[#53589a] focus:border-[#53589a]"
                                    />
                                </div>
                                <div className="relative">
                                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                    <Input
                                        type="date"
                                        value={dateFilter}
                                        onChange={handleDateChange}
                                        className="pl-10 focus:ring-2 focus:ring-[#53589a] focus:border-[#53589a]"
                                    />
                                </div>
                                <div className="relative">
                                    <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 z-10" />
                                    <Select value={roleFilter} onValueChange={handleRoleChange}>
                                        <SelectTrigger className="pl-10 focus:ring-2 focus:ring-[#53589a]">
                                            <SelectValue placeholder="Pilih Kategori" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">Semua Kategori</SelectItem>
                                            <SelectItem value="admin">Admin</SelectItem>
                                            <SelectItem value="paslon">Paslon</SelectItem>
                                            <SelectItem value="voter">Voter</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Statistics */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <Card className="shadow-md border-l-4 border-l-[#53589a]">
                            <CardContent className="pt-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-600 mb-1">Total Activity Logs</p>
                                        <p className="text-2xl font-bold text-[#53589a]">
                                            <AnimatedCounter value={logs.length} />
                                        </p>
                                    </div>
                                    <div className="p-3 bg-[#53589a]/10 rounded-full">
                                        <Vote className="h-8 w-8 text-[#53589a]" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="shadow-md border-l-4 border-l-[#53589a]">
                            <CardContent className="pt-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-600 mb-1">Setelah Filter</p>
                                        <p className="text-2xl font-bold text-[#53589a]">
                                            <AnimatedCounter value={filteredLogs.length} />
                                        </p>
                                    </div>
                                    <div className="p-3 bg-[#53589a]/10 rounded-full">
                                        <TrendingUp className="h-8 w-8 text-[#53589a]" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="shadow-md border-l-4 border-l-[#53589a]">
                            <CardContent className="pt-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-600 mb-1">Kategori Aktif</p>
                                        <p className="text-2xl font-bold text-[#53589a]">
                                            {roleFilter === "all" ? "Semua" : getRoleLabel(roleFilter)}
                                        </p>
                                    </div>
                                    <div className="p-3 bg-[#53589a]/10 rounded-full">
                                        <User className="h-8 w-8 text-[#53589a]" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <Card className="mb-6 shadow-md border-red-200 bg-red-50 border-l-4 border-l-red-500">
                            <CardContent className="pt-6">
                                <p className="text-red-600 font-medium">
                                    {error}
                                </p>
                            </CardContent>
                        </Card>
                    )}

                    {/* Activity Logs Table */}
                    <Card className="shadow-md">
                        <CardHeader>
                            <CardTitle className="text-xl md:text-2xl text-[#53589a] flex items-center gap-2">
                                <Activity className="h-5 w-5" />
                                Daftar Aktivitas
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {loading ? (
                                <div className="text-center py-12">
                                    <Loader2 className="h-8 w-8 animate-spin text-[#53589a] mx-auto mb-4" />
                                    <p className="text-gray-600">Memuat data...</p>
                                    <div className="mt-6 space-y-2">
                                        {[...Array(5)].map((_, i) => (
                                            <SkeletonRow key={i} />
                                        ))}
                                    </div>
                                </div>
                            ) : filteredLogs.length === 0 ? (
                                <div className="text-center py-12">
                                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                                        <Search className="h-8 w-8 text-gray-400" />
                                    </div>
                                    <p className="text-gray-600 text-lg font-medium">Tidak ada data log activity</p>
                                    <p className="text-gray-400 text-sm mt-2">Coba ubah filter untuk melihat hasil lainnya</p>
                                </div>
                            ) : (
                                <div className="overflow-x-auto" ref={tableRef}>
                                    <table className="w-full border-collapse">
                                        <thead>
                                            <tr className="border-b-2 border-gray-200 bg-gray-50">
                                                <th className="text-left p-3 text-sm font-semibold text-[#53589a]">
                                                    No
                                                </th>
                                                <th className="text-left p-3 text-sm font-semibold text-[#53589a]">
                                                    Session
                                                </th>
                                                <th className="text-left p-3 text-sm font-semibold text-[#53589a]">
                                                    Info
                                                </th>
                                                <th className="text-left p-3 text-sm font-semibold text-[#53589a]">
                                                    Context
                                                </th>
                                                <th className="text-left p-3 text-sm font-semibold text-[#53589a]">
                                                    Kategori
                                                </th>
                                                <th className="text-left p-3 text-sm font-semibold text-[#53589a]">
                                                    Waktu
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredLogs.map((log, index) => (
                                                <tr
                                                    key={log.id}
                                                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors animate-in fade-in slide-in-from-left-4 duration-500"
                                                    style={{ animationDelay: `${index * 50}ms` }}
                                                >
                                                    <td className="p-3 text-sm">
                                                        {index + 1}
                                                    </td>
                                                    <td className="p-3">
                                                        <p className="text-sm font-medium text-gray-900">
                                                            {log.session}
                                                        </p>
                                                    </td>
                                                    <td className="p-3">
                                                        <p 
                                                            className="text-sm text-gray-700 max-w-md truncate" 
                                                            title={log.info}
                                                        >
                                                            {log.info}
                                                        </p>
                                                    </td>
                                                    <td className="p-3">
                                                        <Badge className="bg-gray-500 text-white">
                                                            {log.context}
                                                        </Badge>
                                                    </td>
                                                    <td className="p-3">
                                                        <Badge className={getRoleBadgeColor(log.subject)}>
                                                            {getRoleLabel(log.subject)}
                                                        </Badge>
                                                    </td>
                                                    <td className="p-3 text-sm text-gray-700">
                                                        {formatDateTime(log.created_at)}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </SuperadminLayout>
    );
}
