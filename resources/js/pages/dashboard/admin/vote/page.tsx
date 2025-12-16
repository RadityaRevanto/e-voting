import { Link } from "@inertiajs/react";
import AdminDashboardlayout from "../../_components/adminlayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

interface Candidate {
    id: number;
    name: string;
    department: string;
    image: string;
}

const candidatesData: Candidate[] = [
    {
        id: 1,
        name: "Candidate 1",
        department: "System Information",
        image: "/images/candidate1.jpg",
    },
    {
        id: 2,
        name: "Candidate 2",
        department: "System Information",
        image: "/images/candidate2.jpg",
    },
    {
        id: 3,
        name: "Candidate 3",
        department: "System Information",
        image: "/images/candidate3.jpg",
    },
];

interface CandidateCardProps {
    candidate: Candidate;
}

function CandidateCard({ candidate }: CandidateCardProps) {
    return (
        <Card className="flex flex-col items-center w-full min-h-[400px] md:h-[500px] lg:h-[600px] bg-gradient-to-b from-[#ccd3e3] via-[#e5e8f0] to-white border-0 shadow-lg">
            <CardContent className="flex flex-col items-center justify-center w-full h-full p-4 sm:p-6 md:p-8">
                <Avatar className="w-32 h-32 sm:w-40 sm:h-40 md:w-52 md:h-52 mb-4 sm:mb-5 md:mb-6 border-4 border-white shadow-md">
                    <AvatarImage
                        src={candidate.image}
                        alt={candidate.name || "Candidate"}
                        className="object-cover"
                        onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = "https://via.placeholder.com/192";
                        }}
                    />
                    <AvatarFallback className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#53589a]">
                        {candidate.name?.charAt(0) || "C"}
                    </AvatarFallback>
                </Avatar>
                <h2 className="font-bold text-[#53589a] text-xl sm:text-2xl md:text-3xl mb-2 sm:mb-3 text-center px-2">
                    {candidate.name || "Nama Kandidat"}
                </h2>
                <Badge variant="secondary" className="text-base sm:text-lg md:text-xl px-3 py-1">
                    {candidate.department}
                </Badge>
            </CardContent>
        </Card>
    );
}

export default function AdminVotePage() {
    return (
        <AdminDashboardlayout>
            <div className="bg-white w-full min-h-screen p-4 sm:p-6 md:p-8">
                <div className="w-full">
                    <header className="mb-8 sm:mb-12 md:mb-16">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-6 mb-4 sm:mb-6">
                            <h1 className="font-bold text-[#53589a] text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-5xl">
                                VOTE MANAGEMENT
                            </h1>
                            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 md:gap-4 w-full sm:w-auto">
                                <Link href="/admin/vote/tambah" className="w-full sm:w-auto">
                                    <Button 
                                        size="default" 
                                        className="w-full sm:w-auto bg-[#53589a] hover:bg-[#53589a]/90 text-white text-sm sm:text-base md:size-lg"
                                    >
                                        Tambah Paslon
                                    </Button>
                                </Link>
                                <Link href="/admin/vote/hapus" className="w-full sm:w-auto">
                                    <Button 
                                        variant="destructive" 
                                        size="default"
                                        className="w-full sm:w-auto text-sm sm:text-base md:size-lg"
                                    >
                                        Hapus Paslon
                                    </Button>
                                </Link>
                            </div>
                        </div>
                        <Separator className="w-full sm:w-3/4 md:w-1/2 bg-[#030303]" />
                    </header>
                    <main>
                        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 sm:gap-8 md:gap-12 lg:gap-16 justify-items-center">
                            {candidatesData.map((candidate) => (
                                <CandidateCard key={candidate.id} candidate={candidate} />
                            ))}
                        </div>
                    </main>
                </div>
            </div>
        </AdminDashboardlayout>
    );
}