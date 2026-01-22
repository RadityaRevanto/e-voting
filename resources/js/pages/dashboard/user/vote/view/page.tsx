import React from "react";
import UserDashboardlayout from "../../../_components/userlayout";
import { Link, usePage } from "@inertiajs/react";
import { ArrowLeft, User, Calendar, GraduationCap, Target, CheckCircle2, Loader2, AlertCircle } from "lucide-react";
import { usePaslonDetail, getPaslonMisi } from "@/hooks/use-paslon-detail";

interface PageProps extends Record<string, unknown> {
  candidateId?: string | number;
}

export default function UserVoteViewPage() {
  const { props } = usePage<PageProps>();
  const candidateId = props.candidateId 
    ? (typeof props.candidateId === 'string' ? parseInt(props.candidateId, 10) : props.candidateId)
    : null;

  const { paslon, loading, error, fetchPaslonDetail } = usePaslonDetail(candidateId, true);

  // Parse misi dari paslon
  const misiList = paslon ? getPaslonMisi(paslon) : [];

  // Helper untuk mendapatkan foto paslon
  const getFotoPaslon = (): string => {
    if (paslon?.foto_paslon) {
      return `/storage/${paslon.foto_paslon}`;
    }
    return "/assets/images/user/imges.jpg";
  };

  return (
    <UserDashboardlayout>
      <div className="bg-gradient-to-br from-[#f7f8ff] to-white w-full min-h-screen p-4 md:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-6 md:mb-8">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
              <div className="flex-1">
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#53589a] mb-2">
                  Profil Paslon
                </h1>
                <p className="text-sm md:text-base text-[#7b80b8]">
                  Detail informasi ketua dan wakil paslon yang Anda pilih
                </p>
              </div>
              <Link
                href="/user/vote"
                className="inline-flex items-center gap-2 text-[#53589a] hover:text-[#3a3f6b] transition-colors group"
              >
                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                <span className="font-semibold text-sm md:text-base">Kembali ke Halaman Vote</span>
              </Link>
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-12 md:py-16">
              <Loader2 className="w-12 h-12 md:w-16 md:h-16 text-[#53589a] animate-spin mb-4" />
              <p className="text-[#7b80b8] text-base md:text-lg font-medium">
                Memuat data paslon...
              </p>
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <div className="bg-red-50 border-2 border-red-200 rounded-[25px] p-6 md:p-8 mb-6">
              <div className="flex items-start gap-4">
                <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h3 className="text-lg md:text-xl font-bold text-red-800 mb-2">
                    Gagal Memuat Data
                  </h3>
                  <p className="text-red-700 mb-4">{error}</p>
                  {candidateId && (
                    <button
                      onClick={() => fetchPaslonDetail(candidateId)}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                    >
                      Coba Lagi
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Content - hanya tampilkan jika tidak loading dan tidak ada error */}
          {!loading && !error && paslon && (
            <>
              {/* Main Content */}
              <div className="space-y-6 md:space-y-8">
                {/* Foto Paslon - Tengah Atas */}
                <div className="flex justify-center">
                  {/* Foto dengan efek gradient */}
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#53599b] to-[#3a3f6b] rounded-full blur-xl opacity-30 scale-110" />
                    <div className="relative w-48 h-48 md:w-56 md:h-56 lg:w-64 lg:h-64">
                      <div className="absolute inset-0 bg-gradient-to-br from-[#cdd4ff] via-[#e8ebff] to-[#f7f8ff] rounded-full" />
                      <img
                        src={getFotoPaslon()}
                        alt="Foto Paslon"
                        className="relative w-full h-full rounded-full object-cover border-4 border-white shadow-2xl"
                        onError={(e) => {
                          // Fallback ke default image jika error
                          e.currentTarget.src = "/assets/images/user/imges.jpg";
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Ketua & Wakil Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                  {/* Ketua Card */}
                  <div className="bg-white rounded-[25px] border-2 border-[#80808080] shadow-[0px_4px_4px_#00000040] p-5 md:p-6 hover:shadow-[0px_8px_12px_#00000020] transition-shadow">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#53599b] to-[#3a3f6b] flex items-center justify-center shadow-md">
                      <User className="w-6 h-6 text-white" />
                    </div>
                    <h2 className="text-xl md:text-2xl font-bold text-[#53589a]">
                      Ketua Paslon
                    </h2>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="mt-1">
                        <User className="w-5 h-5 text-[#9296d1]" />
                      </div>
                      <div className="flex-1">
                        <dt className="text-xs md:text-sm font-semibold text-[#7b80b8] uppercase tracking-wide mb-1">
                          Nama
                        </dt>
                        <dd className="text-base md:text-lg font-semibold text-[#53599b]">
                          {paslon.nama_ketua}
                        </dd>
                      </div>
                    </div>

                    {paslon.umur_ketua && (
                      <div className="flex items-start gap-3">
                        <div className="mt-1">
                          <Calendar className="w-5 h-5 text-[#9296d1]" />
                        </div>
                        <div className="flex-1">
                          <dt className="text-xs md:text-sm font-semibold text-[#7b80b8] uppercase tracking-wide mb-1">
                            Umur
                          </dt>
                          <dd className="text-base md:text-lg font-semibold text-[#53599b]">
                            {paslon.umur_ketua} tahun
                          </dd>
                        </div>
                      </div>
                    )}

                    {paslon.jurusan_ketua && (
                      <div className="flex items-start gap-3">
                        <div className="mt-1">
                          <GraduationCap className="w-5 h-5 text-[#9296d1]" />
                        </div>
                        <div className="flex-1">
                          <dt className="text-xs md:text-sm font-semibold text-[#7b80b8] uppercase tracking-wide mb-1">
                            Jurusan
                          </dt>
                          <dd className="text-base md:text-lg font-semibold text-[#53599b]">
                            {paslon.jurusan_ketua}
                          </dd>
                        </div>
                      </div>
                    )}
                  </div>
                  </div>

                  {/* Wakil Card */}
                  <div className="bg-white rounded-[25px] border-2 border-[#80808080] shadow-[0px_4px_4px_#00000040] p-5 md:p-6 hover:shadow-[0px_8px_12px_#00000020] transition-shadow">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#5760c0] to-[#3a3f6b] flex items-center justify-center shadow-md">
                      <User className="w-6 h-6 text-white" />
                    </div>
                    <h2 className="text-xl md:text-2xl font-bold text-[#53589a]">
                      Wakil Ketua Paslon
                    </h2>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="mt-1">
                        <User className="w-5 h-5 text-[#9296d1]" />
                      </div>
                      <div className="flex-1">
                        <dt className="text-xs md:text-sm font-semibold text-[#7b80b8] uppercase tracking-wide mb-1">
                          Nama
                        </dt>
                        <dd className="text-base md:text-lg font-semibold text-[#53599b]">
                          {paslon.nama_wakil_ketua}
                        </dd>
                      </div>
                    </div>

                    {paslon.umur_wakil_ketua && (
                      <div className="flex items-start gap-3">
                        <div className="mt-1">
                          <Calendar className="w-5 h-5 text-[#9296d1]" />
                        </div>
                        <div className="flex-1">
                          <dt className="text-xs md:text-sm font-semibold text-[#7b80b8] uppercase tracking-wide mb-1">
                            Umur
                          </dt>
                          <dd className="text-base md:text-lg font-semibold text-[#53599b]">
                            {paslon.umur_wakil_ketua} tahun
                          </dd>
                        </div>
                      </div>
                    )}

                    {paslon.jurusan_wakil_ketua && (
                      <div className="flex items-start gap-3">
                        <div className="mt-1">
                          <GraduationCap className="w-5 h-5 text-[#9296d1]" />
                        </div>
                        <div className="flex-1">
                          <dt className="text-xs md:text-sm font-semibold text-[#7b80b8] uppercase tracking-wide mb-1">
                            Jurusan
                          </dt>
                          <dd className="text-base md:text-lg font-semibold text-[#53599b]">
                            {paslon.jurusan_wakil_ketua}
                          </dd>
                        </div>
                      </div>
                    )}
                  </div>
                  </div>
                </div>

                {/* Visi Misi Card */}
                <div className="bg-white rounded-[25px] border-2 border-[#80808080] shadow-[0px_4px_4px_#00000040] p-5 md:p-6 lg:p-8">
                  {/* Visi Section */}
                  <div className="mb-6 md:mb-8">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#53599b] to-[#3a3f6b] flex items-center justify-center shadow-md">
                      <Target className="w-5 h-5 text-white" />
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold text-[#53589a]">
                      Visi
                    </h2>
                  </div>
                  <div className="pl-0 md:pl-14">
                    <p className="text-base md:text-lg text-[#53599b] leading-relaxed font-medium">
                      {paslon.visi || "Visi belum ditentukan"}
                    </p>
                  </div>
                  </div>

                  {/* Separator */}
                  <div className="border-t-2 border-[#e8ebff] my-6 md:my-8" />

                  {/* Misi Section */}
                  <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#5760c0] to-[#3a3f6b] flex items-center justify-center shadow-md">
                      <CheckCircle2 className="w-5 h-5 text-white" />
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold text-[#53589a]">
                      Misi
                    </h2>
                  </div>
                  <div className="pl-0 md:pl-14 space-y-3 md:space-y-4">
                    {misiList.length > 0 ? (
                      misiList.map((item, index) => (
                        <div key={index} className="flex items-start gap-3 md:gap-4">
                          <div className="flex-shrink-0 mt-1">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#dbdefc] to-[#c9cdfc] flex items-center justify-center shadow-sm">
                              <span className="text-[#53599b] font-bold text-sm md:text-base">
                                {index + 1}
                              </span>
                            </div>
                          </div>
                          <p className="text-base md:text-lg text-[#53599b] leading-relaxed font-medium flex-1">
                            {item}
                          </p>
                        </div>
                      ))
                    ) : (
                      <p className="text-base md:text-lg text-[#7b80b8] italic">
                        Misi belum ditentukan
                      </p>
                    )}
                  </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Empty State - jika tidak ada data dan tidak loading */}
          {!loading && !error && !paslon && (
            <div className="flex flex-col items-center justify-center py-12 md:py-16">
              <AlertCircle className="w-12 h-12 md:w-16 md:h-16 text-[#7b80b8] mb-4" />
              <p className="text-[#7b80b8] text-base md:text-lg font-medium">
                Data paslon tidak ditemukan
              </p>
            </div>
          )}
        </div>
      </div>
    </UserDashboardlayout>
  );
}