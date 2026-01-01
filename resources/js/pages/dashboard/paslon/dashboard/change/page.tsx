import PaslonLayout from "../../../_components/paslonlayout";
import { useState, FormEvent } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import InputError from "@/pages/dashboard/_components/input-error";
import { Plus, Trash2 } from "lucide-react";
import { useVisionMission } from "@/hooks/use-vision-mission"

export default function PaslonDashboardChangePage() {
  const {
    vision,
    missions,
    loading,
    error,
    success,
    saveVisionMission,
    setVision,
    setMissions,
    fetchVisionMission,
  } = useVisionMission(true);

  const [formErrors, setFormErrors] = useState<{
    vision?: string;
    missions?: string;
  }>({});

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

  // Handler untuk auto-select text saat focus
  const handleVisionFocus = (e: React.FocusEvent<HTMLTextAreaElement>) => {
    e.target.select();
  };

  const handleMissionFocus = (index: number) => (e: React.FocusEvent<HTMLTextAreaElement>) => {
    e.target.select();
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormErrors({});

    // Validasi client-side
    let hasError = false;
    const newErrors: typeof formErrors = {};

    if (!vision.trim()) {
      newErrors.vision = "Vision harus diisi";
      hasError = true;
    }

    const validMissions = missions.filter((mission) => mission.trim() !== "");
    if (validMissions.length === 0) {
      newErrors.missions = "Minimal harus ada 1 mission";
      hasError = true;
    }

    if (hasError) {
      setFormErrors(newErrors);
      return;
    }

    const success = await saveVisionMission(vision, missions);
    if (success) {
      // Refresh data setelah berhasil disimpan
      setTimeout(() => {
        fetchVisionMission();
      }, 1000);
    }
  };

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
            {/* Success Message */}
            {success && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-md">
                <p className="text-sm text-green-800">{success}</p>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm text-red-800">{error}</p>
                <Button
                  type="button"
                  onClick={fetchVisionMission}
                  variant="outline"
                  className="mt-2 text-sm"
                  size="sm"
                >
                  Coba Lagi
                </Button>
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
                onFocus={handleVisionFocus}
                className="w-full min-h-[120px]"
                disabled={loading}
                placeholder="Masukkan vision Anda"
                aria-invalid={formErrors.vision ? "true" : "false"}
              />
              <InputError message={formErrors.vision} />
            </div>

            {/* Missions */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="block text-sm font-medium text-gray-700">
                  Mission <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    onClick={fetchVisionMission}
                    variant="outline"
                    className="text-gray-600 hover:text-gray-800 border-gray-300"
                    disabled={loading}
                    size="sm"
                  >
                    Refresh
                  </Button>
                  <Button
                    type="button"
                    onClick={handleAddMission}
                    variant="outline"
                    className="text-[#53589a] hover:bg-[#53589a] hover:text-white border-[#53589a]"
                    disabled={loading}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Tambah Mission
                  </Button>
                </div>
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
                      onFocus={handleMissionFocus(index)}
                      className="w-full min-h-[80px]"
                      disabled={loading}
                      placeholder={`Masukkan mission ${index + 1}`}
                      aria-invalid={formErrors.missions ? "true" : "false"}
                    />
                  </div>
                  {missions.length > 1 && (
                    <Button
                      type="button"
                      onClick={() => handleRemoveMission(index)}
                      variant="outline"
                      className="mt-7 text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                      disabled={loading}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
              <InputError message={formErrors.missions} />
              <p className="text-xs text-gray-500">
                Minimal harus ada 1 mission. Kosongkan field untuk menghapus mission.
              </p>
            </div>

            <div className="flex gap-4 pt-4">
              <Button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-[#53589a] hover:bg-[#43477a] text-white rounded-full font-semibold"
              >
                {loading ? "Menyimpan..." : "Simpan Perubahan"}
              </Button>
              <Button
                type="button"
                onClick={fetchVisionMission}
                variant="outline"
                className="px-6 py-2 border-gray-300"
                disabled={loading}
              >
                Muat Ulang Data
              </Button>
            </div>
          </form>
        </div>
      </div>
    </PaslonLayout>
  );
}