import React from "react";
import UserDashboardlayout from "../../../_components/userlayout";
import { Link } from "@inertiajs/react";
import { ArrowLeft, User, Calendar, GraduationCap, Target, CheckCircle2 } from "lucide-react";

export default function UserVoteViewPage() {
  // Untuk sekarang masih statis / dummy.
  // Nanti bisa diganti dengan data asli dari backend (Inertia props / fetch API).
  const paslon = {
    foto: "/assets/images/user/imges.jpg",
    ketua: {
      nama: "Aditya Eka Narayan",
      umur: 22,
      jurusan: "Sistem Informasi",
    },
    wakil: {
      nama: "Raditya Gavra",
      umur: 22,
      jurusan: "Teknik Informatika",
    },
    visi:
      "Mewujudkan lingkungan kampus yang aktif, inklusif, dan berprestasi melalui kolaborasi seluruh civitas akademika.",
    misi: [
      "Meningkatkan kualitas kegiatan akademik dan non-akademik mahasiswa.",
      "Mendorong transparansi dan partisipasi aktif dalam setiap kegiatan organisasi.",
      "Menciptakan ruang diskusi yang sehat dan terbuka bagi seluruh mahasiswa.",
    ],
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
                    src={paslon.foto}
                    alt="Foto Paslon"
                    className="relative w-full h-full rounded-full object-cover border-4 border-white shadow-2xl"
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
                          {paslon.ketua.nama}
                        </dd>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="mt-1">
                        <Calendar className="w-5 h-5 text-[#9296d1]" />
                      </div>
                      <div className="flex-1">
                        <dt className="text-xs md:text-sm font-semibold text-[#7b80b8] uppercase tracking-wide mb-1">
                          Umur
                        </dt>
                        <dd className="text-base md:text-lg font-semibold text-[#53599b]">
                          {paslon.ketua.umur} tahun
                        </dd>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="mt-1">
                        <GraduationCap className="w-5 h-5 text-[#9296d1]" />
                      </div>
                      <div className="flex-1">
                        <dt className="text-xs md:text-sm font-semibold text-[#7b80b8] uppercase tracking-wide mb-1">
                          Jurusan
                        </dt>
                        <dd className="text-base md:text-lg font-semibold text-[#53599b]">
                          {paslon.ketua.jurusan}
                        </dd>
                      </div>
                    </div>
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
                          {paslon.wakil.nama}
                        </dd>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="mt-1">
                        <Calendar className="w-5 h-5 text-[#9296d1]" />
                      </div>
                      <div className="flex-1">
                        <dt className="text-xs md:text-sm font-semibold text-[#7b80b8] uppercase tracking-wide mb-1">
                          Umur
                        </dt>
                        <dd className="text-base md:text-lg font-semibold text-[#53599b]">
                          {paslon.wakil.umur} tahun
                        </dd>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="mt-1">
                        <GraduationCap className="w-5 h-5 text-[#9296d1]" />
                      </div>
                      <div className="flex-1">
                        <dt className="text-xs md:text-sm font-semibold text-[#7b80b8] uppercase tracking-wide mb-1">
                          Jurusan
                        </dt>
                        <dd className="text-base md:text-lg font-semibold text-[#53599b]">
                          {paslon.wakil.jurusan}
                        </dd>
                      </div>
                    </div>
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
                      {paslon.visi}
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
                    {paslon.misi.map((item, index) => (
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
                    ))}
                  </div>
                </div>
            </div>
          </div>
        </div>
      </div>
    </UserDashboardlayout>
  );
}