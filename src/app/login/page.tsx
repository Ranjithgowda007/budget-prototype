'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff, RefreshCw, Lock, User, ChevronLeft, ChevronRight, Info } from 'lucide-react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { useAuth, getRoleRoute } from '@/context/AuthContext';
import { DUMMY_USERS } from '@/data/users';

// Slider images
const SLIDER_IMAGES = [
    '/login-screen/1.png',
    '/login-screen/3.png',
];

// Generate random captcha
const generateCaptcha = (): string => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let captcha = '';
    for (let i = 0; i < 6; i++) {
        captcha += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return captcha.split('').join(' ');
};

export default function LoginPage() {
    const router = useRouter();
    const { login, isAuthenticated, activeRole } = useAuth();
    const [userId, setUserId] = useState('');
    const [password, setPassword] = useState('');
    const [captchaInput, setCaptchaInput] = useState('');
    const [captcha, setCaptcha] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [activeSlide, setActiveSlide] = useState(0);
    const [showHints, setShowHints] = useState(false);

    // Redirect if already authenticated
    useEffect(() => {
        if (isAuthenticated && activeRole) {
            router.push(getRoleRoute(activeRole));
        }
    }, [isAuthenticated, activeRole, router]);

    // Generate captcha on mount
    useEffect(() => {
        setCaptcha(generateCaptcha());
    }, []);

    // Auto-slide every 5 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            setActiveSlide((prev) => (prev + 1) % SLIDER_IMAGES.length);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    const refreshCaptcha = useCallback(() => {
        setCaptcha(generateCaptcha());
        setCaptchaInput('');
    }, []);

    const nextSlide = () => {
        setActiveSlide((prev) => (prev + 1) % SLIDER_IMAGES.length);
    };

    const prevSlide = () => {
        setActiveSlide((prev) => (prev - 1 + SLIDER_IMAGES.length) % SLIDER_IMAGES.length);
    };

    const handleQuickLogin = (userIdVal: string, passwordVal: string) => {
        setUserId(userIdVal);
        setPassword(passwordVal);
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!userId.trim()) {
            toast.error('Please enter your User ID');
            return;
        }

        if (!password.trim()) {
            toast.error('Please enter your Password');
            return;
        }

        const captchaClean = captcha.replace(/\s/g, '').toLowerCase();
        if (captchaInput.toLowerCase() !== captchaClean) {
            toast.error('Incorrect captcha. Please try again.');
            refreshCaptcha();
            return;
        }

        setIsLoading(true);

        // Authenticate user
        setTimeout(() => {
            const result = login(userId, password);
            setIsLoading(false);

            if (result.success) {
                toast.success('Login successful!');
                // Router will redirect via useEffect
            } else {
                toast.error(result.error || 'Invalid credentials');
                refreshCaptcha();
            }
        }, 1000);
    };

    return (
        <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
            {/* Main Container - Wider and more compact */}
            <div className="w-full max-w-6xl bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col lg:flex-row min-h-[520px]">

                {/* Left Side - Login Form - More compact */}
                <div className="w-full lg:w-[420px] p-6 lg:p-8 flex flex-col">
                    {/* Header with Logo - Reduced margins */}
                    <div className="text-center mb-3">
                        {/* Logo */}
                        <div className="flex justify-center mb-2">
                            <Image
                                src="/logo.png"
                                alt="Logo"
                                width={100}
                                height={100}
                                className="object-contain"
                            />
                        </div>
                        <h1 className="text-red-700 font-bold text-base">
                            एकीकृत वित्तीय प्रबंधन सूचना प्रणाली
                        </h1>
                    </div>

                    {/* Form - Reduced spacing */}
                    <form onSubmit={handleLogin} className="space-y-3 flex-1">
                        {/* User ID */}
                        <div className="space-y-1">
                            <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                                <User size={14} className="text-slate-500" />
                                User ID
                            </label>
                            <Input
                                type="text"
                                value={userId}
                                onChange={(e) => setUserId(e.target.value)}
                                placeholder="Enter your user id"
                                className="h-10 bg-white border-slate-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg text-sm"
                            />
                        </div>

                        {/* Password */}
                        <div className="space-y-1">
                            <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                                <Lock size={14} className="text-slate-500" />
                                Password
                            </label>
                            <div className="relative">
                                <Input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Enter your Password"
                                    className="h-10 pr-10 bg-white border-slate-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg text-sm"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                                >
                                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                        </div>

                        {/* Captcha - Inline layout */}
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-slate-700">
                                Captcha
                            </label>
                            <div className="flex items-center gap-2">
                                {/* Captcha Display */}
                                <div className="h-10 px-3 bg-slate-50 border border-slate-300 rounded-lg flex items-center justify-center min-w-[100px]">
                                    <span
                                        className="text-base font-bold tracking-[0.15em] text-slate-800 select-none"
                                        style={{ fontFamily: 'monospace' }}
                                    >
                                        {captcha}
                                    </span>
                                </div>
                                {/* Refresh Button */}
                                <button
                                    type="button"
                                    onClick={refreshCaptcha}
                                    className="h-10 w-10 flex-shrink-0 bg-slate-100 hover:bg-slate-200 rounded-lg flex items-center justify-center transition-colors border border-slate-300"
                                >
                                    <RefreshCw size={16} className="text-blue-600" />
                                </button>
                                {/* Captcha Input */}
                                <Input
                                    type="text"
                                    value={captchaInput}
                                    onChange={(e) => setCaptchaInput(e.target.value)}
                                    placeholder="Enter Captcha"
                                    className="h-10 bg-white border-slate-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg text-sm flex-1"
                                    autoComplete="off"
                                />
                            </div>
                        </div>

                        {/* Submit Button */}
                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="w-full h-10 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-md transition-all duration-300 mt-2"
                        >
                            {isLoading ? (
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    Signing in...
                                </div>
                            ) : (
                                <div className="flex items-center gap-2">
                                    <Lock size={14} />
                                    Login to Finance Portal
                                </div>
                            )}
                        </Button>
                    </form>

                    {/* Demo Credentials Hint */}
                    <div className="mt-3">
                        <button
                            type="button"
                            onClick={() => setShowHints(!showHints)}
                            className="w-full flex items-center justify-center gap-2 text-xs text-blue-600 hover:text-blue-700"
                        >
                            <Info size={14} />
                            {showHints ? 'Hide' : 'Show'} Demo Credentials
                        </button>

                        {showHints && (
                            <div className="mt-2 p-3 bg-blue-50 rounded-lg border border-blue-100">
                                <p className="text-xs text-blue-800 font-medium mb-2">Click to auto-fill:</p>
                                <div className="space-y-1">
                                    {DUMMY_USERS.map((user) => (
                                        <button
                                            key={user.userId}
                                            type="button"
                                            onClick={() => handleQuickLogin(user.userId, user.password)}
                                            className="w-full text-left px-2 py-1 text-xs hover:bg-blue-100 rounded transition-colors flex justify-between items-center"
                                        >
                                            <span className="font-medium text-blue-700">{user.userId}</span>
                                            <span className="text-blue-500">{user.roles.join(', ')}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Footer Links - Compact */}
                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100">
                        <a href="#" className="text-xs text-blue-600 hover:underline">
                            Forgot Password?/पासवर्ड भूल गए?
                        </a>
                        <a href="#" className="text-xs text-slate-600 hover:text-slate-800 flex items-center gap-1">
                            <span className="text-blue-600">ⓘ</span> Help Desk?
                        </a>
                    </div>
                </div>

                {/* Right Side - Image Slider */}
                <div className="hidden lg:flex flex-1 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 relative overflow-hidden">
                    {/* Image Slider */}
                    <div className="absolute inset-0">
                        {SLIDER_IMAGES.map((src, index) => (
                            <div
                                key={index}
                                className={`absolute inset-0 transition-opacity duration-700 ${activeSlide === index ? 'opacity-100' : 'opacity-0'
                                    }`}
                            >
                                <Image
                                    src={src}
                                    alt={`Slide ${index + 1}`}
                                    fill
                                    className="object-cover"
                                    priority={index === 0}
                                />
                            </div>
                        ))}
                    </div>

                    {/* Navigation Arrows */}
                    <button
                        onClick={prevSlide}
                        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center backdrop-blur-sm transition-colors z-10"
                    >
                        <ChevronLeft size={24} className="text-white" />
                    </button>
                    <button
                        onClick={nextSlide}
                        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center backdrop-blur-sm transition-colors z-10"
                    >
                        <ChevronRight size={24} className="text-white" />
                    </button>

                    {/* Pagination Dots */}
                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 z-10">
                        {SLIDER_IMAGES.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setActiveSlide(index)}
                                className={`w-3 h-3 rounded-full transition-all ${activeSlide === index
                                    ? 'bg-white scale-110'
                                    : 'bg-white/40 hover:bg-white/60'
                                    }`}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
