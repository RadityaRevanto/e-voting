import PaslonLayout from "../../../_components/paslonlayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import InputError from "@/pages/dashboard/_components/input-error";
import { useEditProfilPaslon } from "@/hooks/use-edit-profil-paslon";

export default function PaslonEditProfilPage() {
    const {
        username,
        namaKetua,
        umurKetua,
        jurusanKetua,
        namaWakil,
        umurWakil,
        jurusanWakil,
        previewFoto,
        existingFotoUrl,
        errors,
        success,
        processing,
        loading,
        fileInputRef,
        setUsername,
        setNamaKetua,
        setUmurKetua,
        setJurusanKetua,
        setNamaWakil,
        setUmurWakil,
        setJurusanWakil,
        handleFotoChange,
        handleHapusFoto,
        handleSubmit,
    } = useEditProfilPaslon();

    return (
        <PaslonLayout>
            <div className="bg-white w-full min-h-screen p-6">
                <div className="w-full">
                    <header className="flex flex-col gap-4 mb-8">
                        <h1 className="font-bold text-[#53589a] text-3xl sm:text-4xl lg:text-5xl leading-tight">
                            EDIT PROFIL
                        </h1>
                        <div className="h-[2px] w-32 sm:w-64 bg-[#53589a]" />
                    </header>

                    {loading ? (
                        <div className="flex items-center justify-center py-12">
                            <p className="text-gray-500">Memuat data profil...</p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {success && (
                                <div className="p-4 bg-green-50 border border-green-200 rounded-md">
                                    <p className="text-sm text-green-800">{success}</p>
                                </div>
                            )}

                            {errors.message && (
                                <div className="p-4 bg-red-50 border border-red-200 rounded-md">
                                    <p className="text-sm text-red-800">{errors.message}</p>
                                </div>
                            )}

                            {/* Foto Profil */}
                            <div className="space-y-2">
                                <label
                                    htmlFor="foto_paslon"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Foto Paslon
                                </label>
                                {previewFoto ? (
                                    <div className="space-y-3">
                                        <div className="relative inline-block">
                                            <img
                                                src={previewFoto}
                                                alt="Preview foto paslon"
                                                className="w-32 h-32 object-cover rounded-full border-4 border-gray-200"
                                            />
                                        </div>
                                        <div>
                                            <Button
                                                type="button"
                                                onClick={handleHapusFoto}
                                                variant="outline"
                                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                            >
                                                Hapus Foto
                                            </Button>
                                        </div>
                                    </div>
                                ) : existingFotoUrl ? (
                                    <div className="space-y-3">
                                        <div className="relative inline-block">
                                            <img
                                                src={`/storage/${existingFotoUrl}`}
                                                alt="Foto paslon saat ini"
                                                className="w-32 h-32 object-cover rounded-full border-4 border-gray-200"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Input
                                                ref={fileInputRef}
                                                id="foto_paslon"
                                                name="foto_paslon"
                                                type="file"
                                                accept="image/*"
                                                onChange={handleFotoChange}
                                                className="w-full cursor-pointer"
                                                disabled={processing}
                                                aria-invalid={errors.foto_paslon ? "true" : "false"}
                                            />
                                            <p className="text-xs text-gray-500">
                                                Pilih file gambar baru untuk mengganti foto (JPG, PNG, maksimal 2MB)
                                            </p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-2">
                                        <Input
                                            ref={fileInputRef}
                                            id="foto_paslon"
                                            name="foto_paslon"
                                            type="file"
                                            accept="image/*"
                                            onChange={handleFotoChange}
                                            className="w-full cursor-pointer"
                                            disabled={processing}
                                            aria-invalid={errors.foto_paslon ? "true" : "false"}
                                        />
                                        <p className="text-xs text-gray-500">
                                            Pilih file gambar (JPG, PNG, maksimal 2MB)
                                        </p>
                                    </div>
                                )}
                                <InputError message={errors.foto_paslon} />
                            </div>

                            {/* Username */}
                            <div className="space-y-2">
                                <label
                                    htmlFor="username"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Username
                                </label>
                                <Input
                                    id="username"
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="w-full"
                                    disabled={processing}
                                    placeholder="Masukkan username"
                                    aria-invalid={errors.username ? "true" : "false"}
                                />
                                <InputError message={errors.username} />
                            </div>

                            {/* Section Ketua */}
                            <div className="space-y-4 border-t pt-6">
                                <h3 className="text-lg font-semibold text-[#53589a]">Data Ketua</h3>
                                
                                {/* Nama Ketua */}
                                <div className="space-y-2">
                                    <label
                                        htmlFor="nama_ketua"
                                        className="block text-sm font-medium text-gray-700"
                                    >
                                        Nama Ketua <span className="text-red-500">*</span>
                                    </label>
                                    <Input
                                        id="nama_ketua"
                                        type="text"
                                        value={namaKetua}
                                        onChange={(e) => setNamaKetua(e.target.value)}
                                        className="w-full"
                                        disabled={processing}
                                        placeholder="Masukkan nama ketua"
                                        aria-invalid={errors.nama_ketua ? "true" : "false"}
                                        required
                                    />
                                    <InputError message={errors.nama_ketua} />
                                </div>

                                {/* Umur Ketua */}
                                <div className="space-y-2">
                                    <label
                                        htmlFor="umur_ketua"
                                        className="block text-sm font-medium text-gray-700"
                                    >
                                        Umur Ketua
                                    </label>
                                    <Input
                                        id="umur_ketua"
                                        type="number"
                                        value={umurKetua}
                                        onChange={(e) => setUmurKetua(e.target.value)}
                                        className="w-full"
                                        disabled={processing}
                                        placeholder="Masukkan umur ketua"
                                        min="1"
                                        max="100"
                                        aria-invalid={errors.umur_ketua ? "true" : "false"}
                                    />
                                    <InputError message={errors.umur_ketua} />
                                    <p className="text-xs text-gray-500">
                                        Umur harus antara 1-100 tahun
                                    </p>
                                </div>

                                {/* Jurusan Ketua */}
                                <div className="space-y-2">
                                    <label
                                        htmlFor="jurusan_ketua"
                                        className="block text-sm font-medium text-gray-700"
                                    >
                                        Jurusan Ketua
                                    </label>
                                    <Input
                                        id="jurusan_ketua"
                                        type="text"
                                        value={jurusanKetua}
                                        onChange={(e) => setJurusanKetua(e.target.value)}
                                        className="w-full"
                                        disabled={processing}
                                        placeholder="Masukkan jurusan ketua"
                                        aria-invalid={errors.jurusan_ketua ? "true" : "false"}
                                    />
                                    <InputError message={errors.jurusan_ketua} />
                                </div>
                            </div>

                            {/* Section Wakil */}
                            <div className="space-y-4 border-t pt-6">
                                <h3 className="text-lg font-semibold text-[#53589a]">Data Wakil Ketua</h3>
                                
                                {/* Nama Wakil */}
                                <div className="space-y-2">
                                    <label
                                        htmlFor="nama_wakil"
                                        className="block text-sm font-medium text-gray-700"
                                    >
                                        Nama Wakil Ketua <span className="text-red-500">*</span>
                                    </label>
                                    <Input
                                        id="nama_wakil"
                                        type="text"
                                        value={namaWakil}
                                        onChange={(e) => setNamaWakil(e.target.value)}
                                        className="w-full"
                                        disabled={processing}
                                        placeholder="Masukkan nama wakil ketua"
                                        aria-invalid={errors.nama_wakil_ketua ? "true" : "false"}
                                        required
                                    />
                                    <InputError message={errors.nama_wakil_ketua} />
                                </div>

                                {/* Umur Wakil */}
                                <div className="space-y-2">
                                    <label
                                        htmlFor="umur_wakil"
                                        className="block text-sm font-medium text-gray-700"
                                    >
                                        Umur Wakil Ketua
                                    </label>
                                    <Input
                                        id="umur_wakil"
                                        type="number"
                                        value={umurWakil}
                                        onChange={(e) => setUmurWakil(e.target.value)}
                                        className="w-full"
                                        disabled={processing}
                                        placeholder="Masukkan umur wakil ketua"
                                        min="1"
                                        max="100"
                                        aria-invalid={errors.umur_wakil_ketua ? "true" : "false"}
                                    />
                                    <InputError message={errors.umur_wakil_ketua} />
                                    <p className="text-xs text-gray-500">
                                        Umur harus antara 1-100 tahun
                                    </p>
                                </div>

                                {/* Jurusan Wakil */}
                                <div className="space-y-2">
                                    <label
                                        htmlFor="jurusan_wakil"
                                        className="block text-sm font-medium text-gray-700"
                                    >
                                        Jurusan Wakil Ketua
                                    </label>
                                    <Input
                                        id="jurusan_wakil"
                                        type="text"
                                        value={jurusanWakil}
                                        onChange={(e) => setJurusanWakil(e.target.value)}
                                        className="w-full"
                                        disabled={processing}
                                        placeholder="Masukkan jurusan wakil ketua"
                                        aria-invalid={errors.jurusan_wakil_ketua ? "true" : "false"}
                                    />
                                    <InputError message={errors.jurusan_wakil_ketua} />
                                </div>
                            </div>

                            <div className="flex gap-4 pt-4">
                                <Button
                                    type="submit"
                                    disabled={processing}
                                    className="px-6 py-2 bg-[#53589a] hover:bg-[#43477a] text-white rounded-full font-semibold"
                                >
                                    {processing ? "Menyimpan..." : "Simpan Perubahan"}
                                </Button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </PaslonLayout>
    );
}