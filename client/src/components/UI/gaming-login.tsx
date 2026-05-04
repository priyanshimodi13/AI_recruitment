'use client';
import React, { useState, useRef, useEffect } from 'react';
import { Eye, EyeOff, Mail, Lock, Chrome, Twitter, Gamepad2 } from 'lucide-react';

interface LoginFormProps {
    onSubmit: (email: string, password: string, remember: boolean) => void;
    title?: string;
    subtitle?: string;
    buttonText?: string;
}

interface VideoBackgroundProps {
    videoUrl: string;
}

interface FormInputProps {
    icon: React.ReactNode;
    type: string;
    placeholder: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    required?: boolean;
}

interface SocialButtonProps {
    icon: React.ReactNode;
    name: string;
}

interface ToggleSwitchProps {
    checked: boolean;
    onChange: () => void;
    id: string;
}

// FormInput Component
const FormInput: React.FC<FormInputProps> = ({ icon, type, placeholder, value, onChange, required }) => {
    return (
        <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2">
                {icon}
            </div>
            <input
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                required={required}
                className="w-full pl-10 pr-3 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-lime-400/50 transition-all duration-300"
            />
        </div>
    );
};

// SocialButton Component
const SocialButton: React.FC<SocialButtonProps> = ({ icon }) => {
    return (
        <button className="flex items-center justify-center p-3 bg-white/5 border border-white/10 rounded-xl text-white/80 hover:bg-white/10 hover:text-white hover:border-lime-400/30 transition-all duration-300">
            {icon}
        </button>
    );
};

// ToggleSwitch Component
const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ checked, onChange, id }) => {
    return (
        <div className="relative inline-block w-10 h-5 cursor-pointer">
            <input
                type="checkbox"
                id={id}
                className="sr-only"
                checked={checked}
                onChange={onChange}
            />
            <div className={`absolute inset-0 rounded-full transition-colors duration-200 ease-in-out ${checked ? 'bg-lime-500' : 'bg-white/20'}`}>
                <div className={`absolute left-0.5 top-0.5 w-4 h-4 rounded-full bg-white transition-transform duration-200 ease-in-out ${checked ? 'transform translate-x-5' : ''}`} />
            </div>
        </div>
    );
};

// VideoBackground Component
const VideoBackground: React.FC<VideoBackgroundProps> = ({ videoUrl }) => {
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.play().catch(error => {
                console.error("Video autoplay failed:", error);
            });
        }
    }, []);

    return (
        <div className="absolute inset-0 w-full h-full overflow-hidden">
            <div className="absolute inset-0 bg-black/40 z-10" />
            <video
                ref={videoRef}
                className="absolute inset-0 min-w-full min-h-full object-cover w-auto h-auto"
                autoPlay
                loop
                muted
                playsInline
            >
                <source src={videoUrl} type="video/mp4" />
                Your browser does not support the video tag.
            </video>
        </div>
    );
};

// Main LoginForm Component
const LoginForm: React.FC<LoginFormProps> = ({ onSubmit, title = "Hire Vision", subtitle = "Your professional future awaits", buttonText = "Enter Vision" }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [remember, setRemember] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Simulate success for animation
        await new Promise(resolve => setTimeout(resolve, 800));
        setIsSuccess(true);
        await new Promise(resolve => setTimeout(resolve, 400));

        onSubmit(email, password, remember);
        setIsSubmitting(false);
        setIsSuccess(false);
    };

    return (
        <div className="p-10 rounded-[2.5rem] backdrop-blur-xl bg-black/60 border border-white/10 shadow-2xl">
            <div className="mb-10 text-center">
                <h2 className="text-4xl font-display font-black mb-3 relative group">
                    <span className="absolute -inset-2 bg-gradient-to-r from-lime-400/20 via-lime-500/10 to-transparent blur-2xl opacity-50 group-hover:opacity-100 transition-all duration-700"></span>
                    <span className="relative inline-block text-white tracking-tighter italic uppercase">
                        {title.split(' ')[0]} <span className="text-lime-400">{title.split(' ')[1] || ''}</span>
                    </span>
                </h2>
                <p className="text-white/60 flex flex-col items-center space-y-2 font-medium">
                    <span className="relative group cursor-default tracking-wide text-sm">
                        <span className="relative inline-block">{subtitle}</span>
                    </span>
                    <span className="text-[10px] text-white/30 uppercase tracking-[0.2em] font-black">
                        [Press Enter to Proceed]
                    </span>
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <FormInput
                    icon={<Mail className="text-white/40" size={18} />}
                    type="email"
                    placeholder="Email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />

                <div className="relative">
                    <FormInput
                        icon={<Lock className="text-white/40" size={18} />}
                        type={showPassword ? "text" : "password"}
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <button
                        type="button"
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white focus:outline-none transition-colors"
                        onClick={() => setShowPassword(!showPassword)}
                        aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                </div>

                <div className="flex items-center justify-between px-1">
                    <div className="flex items-center space-x-3">
                        <ToggleSwitch
                            checked={remember}
                            onChange={() => setRemember(!remember)}
                            id="remember-me"
                        />
                        <label
                            htmlFor="remember-me"
                            className="text-xs font-bold uppercase tracking-wider text-white/60 cursor-pointer hover:text-white transition-colors"
                        >
                            Remember me
                        </label>
                    </div>
                    <a href="#" className="text-xs font-bold uppercase tracking-wider text-white/60 hover:text-lime-400 transition-colors">
                        Forgot password?
                    </a>
                </div>

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full py-4 rounded-xl text-xs font-black uppercase tracking-[0.2em] transition-all duration-300 transform hover:-translate-y-1 active:scale-95 disabled:opacity-50 disabled:transform-none shadow-xl shadow-lime-400/10 ${
                        isSuccess
                            ? 'bg-white text-black'
                            : 'bg-lime-400 text-black hover:bg-white hover:shadow-lime-400/20'
                    }`}
                >
                    {isSubmitting ? 'Authenticating...' : isSuccess ? 'Identity Verified' : buttonText}
                </button>
            </form>

            <div className="mt-10">
                <div className="relative flex items-center justify-center">
                    <div className="border-t border-white/10 absolute w-full"></div>
                    <div className="bg-[#0c0c0c] px-4 relative text-white/30 text-[10px] font-black uppercase tracking-[0.3em]">
                        Social Access
                    </div>
                </div>

                <div className="mt-6 grid grid-cols-3 gap-4">
                    <SocialButton icon={<Chrome size={20} />} name="Google" />
                    <SocialButton icon={<Twitter size={20} />} name="X" />
                    <SocialButton icon={<Gamepad2 size={20} />} name="Steam" />
                </div>
            </div>

            <p className="mt-10 text-center text-xs font-medium text-white/40">
                New to the vision?{' '}
                <a href="/role-selection?action=signup" className="font-black text-white hover:text-lime-400 transition-colors uppercase tracking-widest ml-1">
                    Join Now
                </a>
            </p>
        </div>
    );
};

// Export as default components
const LoginPage = {
    LoginForm,
    VideoBackground
};

export default LoginPage;
