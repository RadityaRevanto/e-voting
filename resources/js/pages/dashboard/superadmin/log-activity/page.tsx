import { useState, useEffect, useMemo } from "react";
import SuperadminLayout from "../../_components/superadminlayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Head } from "@inertiajs/react";
import { Search, Calendar, User, Vote, Users } from "lucide-react";
import { useActivityLogs } from "@/hooks/use-activity-logs";

export default function LogActivityPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [dateFilter, setDateFilter] = useState("");
    const [roleFilter, setRoleFilter] = useState<"superadmin" | "admin" | "paslon" | "voter" | "all">("all");

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
                                        placeholder="Cari berdasarkan session, info, context, atau subject..."
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
                                    <Select value={roleFilter} onValueChange={handleRoleChange}>
                                        <SelectTrigger className="pl-10">
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
                        <Card className="shadow-md">
                            <CardContent className="pt-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-600">Total Activity Logs</p>
                                        <p className="text-2xl font-bold text-[#53589a]">
                                            {logs.length}
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
                                        <p className="text-sm text-gray-600">Setelah Filter</p>
                                        <p className="text-2xl font-bold text-[#53589a]">
                                            {filteredLogs.length}
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
                                        <p className="text-sm text-gray-600">Kategori Aktif</p>
                                        <p className="text-2xl font-bold text-[#53589a]">
                                            {roleFilter === "all" ? "Semua" : getRoleLabel(roleFilter)}
                                        </p>
                                    </div>
                                    <User className="h-8 w-8 text-[#53589a]" />
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <Card className="mb-6 shadow-md border-red-200 bg-red-50">
                            <CardContent className="pt-6">
                                <p className="text-red-600">{error}</p>
                            </CardContent>
                        </Card>
                    )}

                    {/* Activity Logs Table */}
                    <Card className="shadow-md">
                        <CardHeader>
                            <CardTitle className="text-xl md:text-2xl text-[#53589a]">
                                Daftar Aktivitas
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
                                                    className="border-b border-gray-100 hover:bg-gray-50"
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
                                                        <p className="text-sm text-gray-700 max-w-md truncate" title={log.info}>
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
