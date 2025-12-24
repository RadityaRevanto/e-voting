import InputError from '@/pages/dashboard/_components/input-error';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { Head, router } from '@inertiajs/react';
import { useState, FormEvent } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { login as authLogin } from '@/lib/auth-service';

interface LoginProps {
    status?: string;
    canResetPassword: boolean;
    canRegister: boolean;
}

export default function Login({
    status,
    canResetPassword,
    canRegister,
}: LoginProps) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [remember, setRemember] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            const user = await authLogin({ email, password });

            const role = user?.role as string | undefined;
            let redirectPath = '/';

            if (role === 'admin' || role === 'super_admin') {
                redirectPath = '/admin/dashboard';
            } else if (role === 'paslon') {
                redirectPath = '/paslon/dashboard';
            } else if (role === 'user') {
                redirectPath = '/user/vote';
            }

            router.visit(redirectPath);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Login gagal. Silakan coba lagi.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative flex min-h-screen w-full items-center justify-center bg-white">
            <Head title="Log in" />

            {/* Background Wave Images */}
            <div className="fixed left-0 top-0 h-full w-1/4">
                <img
                    src="/assets/images/login/bg-kiri.png"
                    alt="Background Left"
                    className="h-full w-full object-cover"
                />
            </div>
            <div className="fixed right-0 top-0 h-full w-1/4">
                <img
                    src="/assets/images/login/bg-kanan.png"
                    alt="Background Right"
                    className="h-full w-full object-cover"
                />
            </div>

            {/* Main Content */}
            <div className="relative z-10 w-full max-w-md px-8 py-12">
                {/* Logo */}
                <div className="mb-8 flex flex-col items-center">
                    <div className="mb-4 flex items-center gap-2">
                        <img
                            src="/assets/images/login/icon-login.png"
                            alt="iVOTE"
                            className="h-20 object-contain"
                        />
                    </div>
                </div>

                {/* Welcome Message */}
                <div className="mb-8 text-center">
                    <h1 className="mb-2 text-3xl font-bold text-[#1e3a8a]">
                        Welcome Back!
                    </h1>
                    <p className="text-sm text-gray-600">
                        Welcome Back to iVOTE&apos;s Online Voting System.
                    </p>
                </div>

                {/* Form */}
                <form
                    onSubmit={handleSubmit}
                    className="flex flex-col gap-6"
                >
                    <div className="grid gap-6">
                        {/* Akun Field */}
                        <div className="grid gap-2">
                            <Label htmlFor="email" className="text-[#1e3a8a] font-semibold">
                                Akun
                            </Label>
                            <Input
                                id="email"
                                type="text"
                                name="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                autoFocus
                                tabIndex={1}
                                autoComplete="email"
                                placeholder="Akun"
                                className="h-12 rounded-lg border-gray-300 bg-white text-gray-900 placeholder:text-gray-400 focus:border-[#1e3a8a] focus:ring-[#1e3a8a]"
                                disabled={loading}
                            />
                            <InputError message={undefined} />
                        </div>

                        {/* Password Field */}
                        <div className="grid gap-2">
                            <Label htmlFor="password" className="text-[#1e3a8a] font-semibold">
                                Password
                            </Label>
                            <div className="relative">
                                <Input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    tabIndex={2}
                                    autoComplete="current-password"
                                    placeholder="Password"
                                    className="h-12 rounded-lg border-gray-300 bg-white pr-12 text-gray-900 placeholder:text-gray-400 focus:border-[#1e3a8a] focus:ring-[#1e3a8a]"
                                    disabled={loading}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                    tabIndex={-1}
                                    disabled={loading}
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-5 w-5" />
                                    ) : (
                                        <Eye className="h-5 w-5" />
                                    )}
                                </button>
                            </div>
                            <InputError message={undefined} />
                        </div>

                        {/* Remember Password */}
                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="remember"
                                name="remember"
                                checked={remember}
                                onCheckedChange={(checked) => setRemember(checked === true)}
                                tabIndex={3}
                                className="border-gray-300"
                                disabled={loading}
                            />
                            <Label htmlFor="remember" className="text-gray-700 cursor-pointer">
                                Remember Password
                            </Label>
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
                                {error}
                            </div>
                        )}

                        {/* Login Button */}
                        <Button
                            type="submit"
                            className="mt-4 h-12 w-full rounded-lg bg-gradient-to-r from-[#1e3a8a] to-[#3b82f6] text-base font-bold text-white shadow-lg transition-all hover:from-[#1e40af] hover:to-[#2563eb] hover:shadow-xl"
                            tabIndex={4}
                            disabled={loading}
                            data-test="login-button"
                        >
                            {loading ? (
                                <div className="flex items-center justify-center gap-2">
                                    <Spinner />
                                    <span>Logging in...</span>
                                </div>
                            ) : (
                                'LOGIN'
                            )}
                        </Button>
                    </div>
                </form>

                {status && (
                    <div className="mt-4 text-center text-sm font-medium text-green-600">
                        {status}
                    </div>
                )}
            </div>
        </div>
    );
}