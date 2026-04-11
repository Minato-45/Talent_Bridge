import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { useState } from 'react';
import { HiViewGrid, HiMail, HiLockClosed, HiEye, HiEyeOff, HiCheckCircle } from 'react-icons/hi';

const loginStyles = `
  input[type="password"] {
    font-size: 16px !important;
  }
  
  input[type="password"]::-webkit-credentials-auto-fill-button,
  input[type="password"]::-webkit-qr-code-prompt-icon,
  input[type="password"]::-ms-reveal {
    display: none !important;
    width: 0 !important;
    height: 0 !important;
    padding: 0 !important;
    margin: 0 !important;
    pointer-events: none !important;
    visibility: hidden !important;
  }
  
  input[type="password"]:-webkit-autofill,
  input[type="password"]:-webkit-autofill:hover,
  input[type="password"]:-webkit-autofill:focus {
    -webkit-box-shadow: 0 0 0 30px white inset !important;
    box-shadow: 0 0 0 30px white inset !important;
  }
  
  input[type="password"]:-webkit-autofill {
    -webkit-text-fill-color: #1f2937 !important;
  }
  
  input[type="password"]::-ms-clear,
  input[type="password"]::-ms-reveal {
    display: none !important;
  }
`;

const styleSheet = document.createElement('style');
styleSheet.textContent = loginStyles;
if (!document.querySelector('style[data-login-password]')) {
  document.head.appendChild(styleSheet);
  styleSheet.setAttribute('data-login-password', 'true');
}

const schema = z.object({
  email: z.string()
    .email('Valid email is required')
    .min(5, 'Email is required'),
  password: z.string()
    .min(1, 'Password is required'),
  role: z.enum(['jobseeker', 'recruiter'], { errorMap: () => ({ message: 'Please select a role' }) }),
});

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      role: 'jobseeker',
    },
  });

  const selectedRole = watch('role');

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      await login(data);
      
      // Store remember me preference securely
      if (rememberMe) {
        sessionStorage.setItem('tb_remember_email', data.email);
      } else {
        sessionStorage.removeItem('tb_remember_email');
      }
      
      toast.success('Welcome back!');
      navigate('/', { replace: true });
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Login failed. Please try again.';
      toast.error(errorMessage);
      // Don't reveal if email exists or not (security best practice)
      console.error('Login error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-linear-to-br from-gray-50 via-white to-emerald-50/30 px-4 py-12 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl -z-10"></div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="bg-linear-to-br from-emerald-500 to-teal-600 w-10 h-10 rounded-lg flex items-center justify-center shadow-lg hover:shadow-emerald-500/50">
              <HiViewGrid className="text-white text-xl font-black" />
            </div>
            <span className="text-3xl font-black text-gray-900">TalentBridge</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back</h1>
          <p className="text-gray-700 text-base font-semibold">Sign in to discover your next opportunity</p>
        </div>

        {/* Form Card */}
        <form onSubmit={handleSubmit(onSubmit)} className="bg-white/85 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/40 p-8 space-y-5">
          {/* Role Selection */}
          <div>
            <label className="block text-sm font-bold text-gray-900 mb-3">I am a</label>
            <div className="grid grid-cols-2 gap-3">
              <label className={`flex items-center justify-center gap-2 p-3 rounded-lg border-2 cursor-pointer transition-all font-semibold text-sm ${selectedRole === 'jobseeker' ? 'border-emerald-400 bg-emerald-50/80 shadow-lg shadow-emerald-500/30' : 'border-gray-300 hover:border-emerald-300 bg-white/50'}`}>
                <input 
                  type="radio" 
                  value="jobseeker" 
                  {...register('role')} 
                  className="sr-only" 
                />
                <span>👔 Job Seeker</span>
              </label>
              <label className={`flex items-center justify-center gap-2 p-3 rounded-lg border-2 cursor-pointer transition-all font-semibold text-sm ${selectedRole === 'recruiter' ? 'border-emerald-400 bg-emerald-50/80 shadow-lg shadow-emerald-500/30' : 'border-gray-300 hover:border-emerald-300 bg-white/50'}`}>
                <input 
                  type="radio" 
                  value="recruiter" 
                  {...register('role')} 
                  className="sr-only" 
                />
                <span>💼 Recruiter</span>
              </label>
            </div>
          </div>

          {/* Email Field */}
          <div>
            <label className="block text-sm font-bold text-gray-900 mb-2">Email address</label>
            <div className="relative">
              <HiMail className="absolute left-3 top-3 text-gray-500 text-lg pointer-events-none" />
              <input
                type="email"
                {...register('email')}
                autoComplete="email"
                className="w-full border border-gray-300/50 rounded-lg pl-10 pr-4 py-2.5 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all placeholder-gray-500 text-gray-900 bg-white/80 backdrop-blur-sm text-sm font-semibold"
                placeholder="your@email.com"
              />
            </div>
            {errors.email && (
              <div className="mt-2 flex items-center gap-2 text-red-600 text-sm font-semibold">
                <span className="w-1 h-1 bg-red-600 rounded-full"></span>
                {errors.email.message}
              </div>
            )}
          </div>

          {/* Password Field */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-bold text-gray-900">Password</label>
              <Link to="/forgot-password" className="text-sm text-emerald-600 hover:text-emerald-700 font-bold">
                Forgot?
              </Link>
            </div>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                {...register('password')}
                autoComplete="current-password"
                className="w-full border border-gray-300/50 rounded-lg px-4 pr-11 py-2.5 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all placeholder-gray-500 text-gray-900 bg-white/80 backdrop-blur-sm text-sm font-semibold"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-gray-500 hover:text-gray-700 transition-colors text-lg"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <HiEyeOff /> : <HiEye />}
              </button>
            </div>
            {errors.password && (
              <div className="mt-2 flex items-center gap-2 text-red-600 text-sm font-semibold">
                <span className="w-1 h-1 bg-red-600 rounded-full"></span>
                {errors.password.message}
              </div>
            )}
          </div>

          {/* Remember Me */}
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="w-4 h-4 rounded border-gray-300 text-emerald-500 focus:ring-2 focus:ring-emerald-500 cursor-pointer"
            />
            <span className="text-sm text-gray-700 font-semibold">Keep me signed in</span>
          </label>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-linear-to-r from-emerald-500 to-teal-600 text-white py-3 rounded-lg font-bold text-base hover:from-emerald-600 hover:to-teal-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-xl hover:shadow-2xl hover:shadow-emerald-500/50 active:scale-95"
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Signing in...
              </span>
            ) : (
              'Sign in'
            )}
          </button>

          {/* Sign Up Link */}
          <div className="text-center pt-4 border-t border-gray-300/50">
            <p className="text-sm text-gray-700 font-semibold">
              New to TalentBridge?{' '}
              <Link to="/register" className="text-emerald-600 hover:text-emerald-700 font-bold">
                Sign up here
              </Link>
            </p>
          </div>
        </form>

        {/* Footer */}
        <p className="text-center text-xs text-gray-600 mt-6 font-medium">
          By signing in, you agree to our{' '}
          <a href="#" className="text-emerald-600 hover:underline font-semibold">
            Terms of Service
          </a>
          {' '}and{' '}
          <a href="#" className="text-emerald-600 hover:underline font-semibold">
            Privacy Policy
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
