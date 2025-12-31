import { useState, useEffect } from "react";
import SuperadminLayout from "../../_components/superadminlayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Head } from "@inertiajs/react";
import { Search, Calendar, User, Vote, Users } from "lucide-react";

interface VoteLog {
    id: number;
    user_id: number;
    user_name: string;
    user_email: string;
    user_role: string;
    candidate_id: number;
    candidate_name: string;
    candidate_department: string | null;
    ip_address: string | null;
    user_agent: string | null;
    qr_code_data: string | null;
    created_at: string;
}

interface VoteLogsResponse {
    success: boolean;
    data: {
        data: VoteLog[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
}

export default function LogActivityPage() {
    const [voteLogs, setVoteLogs] = useState<VoteLog[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [dateFilter, setDateFilter] = useState("");
    const [roleFilter, setRoleFilter] = useState<string>("all");
    const [pagination, setPagination] = useState({
        current_page: 1,
        last_page: 1,
        per_page: 50,
        total: 0,
    });

    const fetchVoteLogs = async (page = 1, date?: string, role?: string) => {
        setLoading(true);
        try {
            const params = new URLSearchParams({
                page: page.toString(),
                per_page: "50",
            });
            
            if (date) {
                params.append("date", date);
            }

            if (role && role !== "all") {
                params.append("user_role", role);
            }

            const response = await fetch(`/api/vote-logs?${params.toString()}`, {
                headers: {
                    "Accept": "application/json",
                },
            });

            if (!response.ok) {
                throw new Error("Failed to fetch vote logs");
            }

            const data: VoteLogsResponse = await response.json();
            setVoteLogs(data.data.data);
            setPagination({
                current_page: data.data.current_page,
                last_page: data.data.last_page,
                per_page: data.data.per_page,
                total: data.data.total,
            });
        } catch (error) {
            console.error("Error fetching vote logs:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchVoteLogs(1, dateFilter || undefined, roleFilter || undefined);
    }, [dateFilter, roleFilter]);

    const filteredLogs = voteLogs.filter((log) => {
        const searchLower = searchTerm.toLowerCase();
        return (
            log.user_name.toLowerCase().includes(searchLower) ||
            log.user_email.toLowerCase().includes(searchLower) ||
            log.candidate_name.toLowerCase().includes(searchLower) ||
            log.candidate_department?.toLowerCase().includes(searchLower)
        );
    });

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

    const handlePageChange = (page: number) => {
        fetchVoteLogs(page, dateFilter || undefined, roleFilter || undefined);
    };

    const getRoleBadgeColor = (role: string) => {
        // Exact match - tidak ada fallback otomatis
        switch (role) {
            case "admin":
                return "bg-red-500 text-white";
            case "super_admin":
                return "bg-purple-500 text-white";
            case "paslon":
                return "bg-blue-500 text-white";
            case "user":
                return "bg-green-500 text-white";
            default:
                return "bg-gray-500 text-white";
        }
    };

    return (
        <SuperadminLayout>
            <Head title="Log Activity Voting" />
            <div className="bg-white w-full min-h-screen p-4 md:p-6 xl:p-8">
                <div className="w-full">
                    {/* Header */}
                    <div className="mb-6 md:mb-8">
                        <h1 className="text-2xl md:text-3xl xl:text-4xl font-bold text-[#53589a] mb-4">
                            Log Activity Voting
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
                                        placeholder="Cari berdasarkan nama user, email, atau paslon..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="pl-10"
                                    />
                                </div>
                                <div className="relative">
                                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                    <Input
                                        type="date"
                                        value={dateFilter}
                                        onChange={handleDateChange}
                                        className="pl-10"
                                    />
                                </div>
                                <div className="relative">
                                    <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 z-10" />
                                    <Select value={roleFilter} onValueChange={setRoleFilter}>
                                        <SelectTrigger className="pl-10">
                                            <SelectValue placeholder="Pilih Kategori" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">Semua Kategori</SelectItem>
                                            <SelectItem value="admin">Admin</SelectItem>
                                            <SelectItem value="paslon">Paslon</SelectItem>
                                            <SelectItem value="user">User</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Statistics */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <Card className="shadow-md">
                            <CardContent className="pt-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-600">Total Votes</p>
                                        <p className="text-2xl font-bold text-[#53589a]">
                                            {pagination.total}
                                        </p>
                                    </div>
                                    <Vote className="h-8 w-8 text-[#53589a]" />
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="shadow-md">
                            <CardContent className="pt-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-600">Halaman</p>
                                        <p className="text-2xl font-bold text-[#53589a]">
                                            {pagination.current_page} / {pagination.last_page}
                                        </p>
                                    </div>
                                    <Calendar className="h-8 w-8 text-[#53589a]" />
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="shadow-md">
                            <CardContent className="pt-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-600">Menampilkan</p>
                                        <p className="text-2xl font-bold text-[#53589a]">
                                            {filteredLogs.length} dari {pagination.total}
                                        </p>
                                    </div>
                                    <User className="h-8 w-8 text-[#53589a]" />
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Vote Logs Table */}
                    <Card className="shadow-md">
                        <CardHeader>
                            <CardTitle className="text-xl md:text-2xl text-[#53589a]">
                                Daftar Aktivitas Voting
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {loading ? (
                                <div className="text-center py-8">
                                    <p className="text-gray-600">Memuat data...</p>
                                </div>
                            ) : filteredLogs.length === 0 ? (
                                <div className="text-center py-8">
                                    <p className="text-gray-600">Tidak ada data log activity</p>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full border-collapse">
                                        <thead>
                                            <tr className="border-b-2 border-gray-200">
                                                <th className="text-left p-3 text-sm font-semibold text-[#53589a]">
                                                    No
                                                </th>
                                                <th className="text-left p-3 text-sm font-semibold text-[#53589a]">
                                                    User
                                                </th>
                                                <th className="text-left p-3 text-sm font-semibold text-[#53589a]">
                                                    Kategori
                                                </th>
                                                <th className="text-left p-3 text-sm font-semibold text-[#53589a]">
                                                    Paslon Dipilih
                                                </th>
                                                <th className="text-left p-3 text-sm font-semibold text-[#53589a]">
                                                    Waktu Vote
                                                </th>
                                                <th className="text-left p-3 text-sm font-semibold text-[#53589a]">
                                                    IP Address
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredLogs.map((log, index) => (
                                                <tr
                                                    key={log.id}
                                                    className="border-b border-gray-100 hover:bg-gray-50"
                                                >
                                                    <td className="p-3 text-sm">
                                                        {(pagination.current_page - 1) *
                                                            pagination.per_page +
                                                            index +
                                                            1}
                                                    </td>
                                                    <td className="p-3">
                                                        <div>
                                                            <p className="text-sm font-medium text-gray-900">
                                                                {log.user_name}
                                                            </p>
                                                            <p className="text-xs text-gray-500">
                                                                {log.user_email}
                                                            </p>
                                                        </div>
                                                    </td>
                                                    <td className="p-3">
                                                        <Badge className={getRoleBadgeColor(log.user_role || "user")}>
                                                            {log.user_role === "admin" ? "Admin" : 
                                                             log.user_role === "super_admin" ? "Super Admin" :
                                                             log.user_role === "paslon" ? "Paslon" : 
                                                             "User"}
                                                        </Badge>
                                                    </td>
                                                    <td className="p-3">
                                                        <div>
                                                            <Badge className="bg-[#53589a] text-white mb-1">
                                                                {log.candidate_name}
                                                            </Badge>
                                                            {log.candidate_department && (
                                                                <p className="text-xs text-gray-500">
                                                                    {log.candidate_department}
                                                                </p>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="p-3 text-sm text-gray-700">
                                                        {formatDateTime(log.created_at)}
                                                    </td>
                                                    <td className="p-3 text-sm text-gray-600">
                                                        {log.ip_address || "-"}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}

                            {/* Pagination */}
                            {!loading && pagination.last_page > 1 && (
                                <div className="flex items-center justify-between mt-6 pt-4 border-t">
                                    <button
                                        onClick={() => handlePageChange(pagination.current_page - 1)}
                                        disabled={pagination.current_page === 1}
                                        className="px-4 py-2 text-sm border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                                    >
                                        Sebelumnya
                                    </button>
                                    <span className="text-sm text-gray-600">
                                        Halaman {pagination.current_page} dari{" "}
                                        {pagination.last_page}
                                    </span>
                                    <button
                                        onClick={() => handlePageChange(pagination.current_page + 1)}
                                        disabled={pagination.current_page === pagination.last_page}
                                        className="px-4 py-2 text-sm border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                                    >
                                        Selanjutnya
                                    </button>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </SuperadminLayout>
    );
}
