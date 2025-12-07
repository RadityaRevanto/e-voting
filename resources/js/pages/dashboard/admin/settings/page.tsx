import AdminDashboardlayout from "../../_components/adminlayout";

export default function AdminSettingsPage() {
    return (
        <AdminDashboardlayout>
            <div className="bg-white w-full min-h-screen p-8">
                <div className="max-w-5xl">
                    <header className="mb-12">
                        <h1 className="font-bold text-[#53589a] text-5xl mb-4">
                            ADMIN SETTINGS
                        </h1>
                        <div className="w-1/2 h-0.5 bg-[#030303]" />
                    </header>
                    <main>
                        <p className="text-lg text-gray-700">
                            This is the Admin Settings Page. Here you can manage all administrative settings and configurations.
                        </p>
                    </main>
                </div>
            </div>
        </AdminDashboardlayout>
    );
}