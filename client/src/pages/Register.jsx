import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { useState } from 'react';
import { HiViewGrid, HiMail, HiLockClosed, HiEye, HiEyeOff, HiCheckCircle, HiExclamationCircle } from 'react-icons/hi';

const registerStyles = `
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
styleSheet.textContent = registerStyles;
if (!document.querySelector('style[data-register-password]')) {
  document.head.appendChild(styleSheet);
  styleSheet.setAttribute('data-register-password', 'true');
}

const schema = z.object({
  name: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name cannot exceed 100 characters')
    .regex(/^[a-zA-Z\s]+$/, 'Name can only contain letters and spaces'),
  email: z.string()
    .email('Valid email is required')
    .min(5, 'Email is required'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain an uppercase letter')
    .regex(/[a-z]/, 'Password must contain a lowercase letter')
    .regex(/[0-9]/, 'Password must contain a number')
    .regex(/[!@#$%^&*]/, 'Password must contain a special character (!@#$%^&*)'),
  confirmPassword: z.string(),
  role: z.enum(['jobseeker', 'recruiter']),
  companyName: z.string()
    .min(2, 'Company name must be at least 2 characters')
    .optional(),
  agreeToTerms: z.boolean().refine(val => val === true, 'You must agree to the terms and conditions'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
}).refine((data) => data.role !== 'recruiter' || (data.companyName && data.companyName.length > 0), {
  message: 'Company name is required for recruiters',
  path: ['companyName'],
});

// Password strength checker
const getPasswordStrength = (password) => {
  let strength = 0;
  if (password.length >= 8) strength++;
  if (password.length >= 12) strength++;
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) strength++;
  if (/[0-9]/.test(password)) strength++;
  if (/[!@#$%^&*]/.test(password)) strength++;
  return ['Weak', 'Fair', 'Good', 'Strong', 'Very Strong'][Math.min(strength - 1, 4)];
};

const Register = () => {
  const { register: authRegister } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState('');

  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    mode: 'onChange',
    defaultValues: {
      role: searchParams.get('role') || 'jobseeker',
      agreeToTerms: false,
    },
  });

  const selectedRole = watch('role');
  const passwordValue = watch('password');
  const confirmPasswordValue = watch('confirmPassword');
  
  // Check if passwords match
  const passwordsMatch = passwordValue && confirmPasswordValue && passwordValue === confirmPasswordValue;
  const passwordMismatch = passwordValue && confirmPasswordValue && passwordValue !== confirmPasswordValue;

  const handlePasswordChange = (e) => {
    if (e.target.value) {
      setPasswordStrength(getPasswordStrength(e.target.value));
    } else {
      setPasswordStrength('');
    }
  };

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const { confirmPassword: _confirmPassword, agreeToTerms: _agreeToTerms, ...payload } = data;
      const result = await authRegister(payload);
      toast.success('Account created successfully! Redirecting to your dashboard...');
      // Redirect directly to dashboard based on role
      if (result.user.role === 'recruiter') {
        navigate('/employer/dashboard');
      } else {
        navigate('/seeker/dashboard');
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Registration failed. Please try again.';
      toast.error(errorMessage);
      console.error('Registration error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStrengthColor = () => {
    switch (passwordStrength) {
      case 'Weak': return 'text-red-600';
      case 'Fair': return 'text-orange-600';
      case 'Good': return 'text-yellow-600';
      case 'Strong': return 'text-blue-600';
      case 'Very Strong': return 'text-green-600';
      default: return 'text-gray-500';
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-linear-to-br from-gray-50 to-gray-100 px-4 py-12">
      <div className="w-full max-w-lg">
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="bg-emerald-500 w-10 h-10 rounded-lg flex items-center justify-center shadow-lg">
              <HiViewGrid className="text-white text-2xl" />
            </div>
            <span className="text-3xl font-bold text-gray-900">TalentBridge</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Create your account</h1>
          <p className="text-gray-600">Join thousands of professionals on TalentBridge</p>
        </div>

        {/* Form Card */}
        <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-2xl shadow-xl border border-gray-200 p-10 space-y-6">
          {/* Role Selection */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-4">I am a</label>
            <div className="grid grid-cols-2 gap-4">
              <label className={`flex items-center justify-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${selectedRole === 'jobseeker' ? 'border-emerald-500 bg-emerald-50 shadow-md' : 'border-gray-200 hover:border-gray-300'}`}>
                <input type="radio" value="jobseeker" {...register('role')} className="sr-only" />
                <span className="font-semibold text-sm text-gray-900">👔 Job Seeker</span>
              </label>
              <label className={`flex items-center justify-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${selectedRole === 'recruiter' ? 'border-emerald-500 bg-emerald-50 shadow-md' : 'border-gray-200 hover:border-gray-300'}`}>
                <input type="radio" value="recruiter" {...register('role')} className="sr-only" />
                <span className="font-semibold text-sm text-gray-900">💼 Recruiter</span>
              </label>
            </div>
          </div>

          {/* Full Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-3">Full Name</label>
            <input
              type="text"
              {...register('name')}
              onChange={(e) => {
                register('name').onChange(e);
              }}
              autoComplete="name"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all placeholder-gray-500 text-gray-900"
              placeholder="John Doe"
            />
            {errors.name && (
              <div className="mt-2 flex items-center gap-2 text-red-600 text-sm">
                <HiExclamationCircle className="text-lg" />
                {errors.name.message}
              </div>
            )}
          </div>

          {/* Company Name (for Recruiters) */}
          {selectedRole === 'recruiter' && (
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-3">Company Name</label>
              <input
                type="text"
                {...register('companyName')}
                autoComplete="organization"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all placeholder-gray-500 text-gray-900"
                placeholder="Acme Inc."
              />
              {errors.companyName && (
                <div className="mt-2 flex items-center gap-2 text-red-600 text-sm">
                  <HiExclamationCircle className="text-lg" />
                  {errors.companyName.message}
                </div>
              )}
            </div>
          )}

          {/* Email */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-3">Email address</label>
            <div className="relative">
              <HiMail className="absolute left-4 top-3.5 text-gray-400 text-xl" />
              <input
                type="email"
                {...register('email')}
                autoComplete="email"
                className="w-full border border-gray-300 rounded-lg pl-11 pr-4 py-3 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all placeholder-gray-500 text-gray-900"
                placeholder="your@email.com"
              />
            </div>
            {errors.email && (
              <div className="mt-2 flex items-center gap-2 text-red-600 text-sm">
                <HiExclamationCircle className="text-lg" />
                {errors.email.message}
              </div>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-3">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                {...register('password')}
                onChange={(e) => {
                  register('password').onChange(e);
                  handlePasswordChange(e);
                }}
                autoComplete="new-password"
                className="w-full border border-gray-300 rounded-lg px-4 pr-12 py-3 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all placeholder-gray-500 text-gray-900"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-3.5 text-gray-400 hover:text-gray-600 transition-colors"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <HiEyeOff className="text-xl" /> : <HiEye className="text-xl" />}
              </button>
            </div>
            {passwordValue && (
              <div className="mt-2 flex items-center justify-between">
                <span className={`text-sm font-medium ${getStrengthColor()}`}>
                  Password Strength: {passwordStrength}
                </span>
              </div>
            )}
            {errors.password && (
              <div className="mt-2 flex items-start gap-2 text-red-600 text-sm">
                <HiExclamationCircle className="text-lg shrink-0 mt-0.5" />
                <span>{errors.password.message}</span>
              </div>
            )}
            <p className="mt-2 text-xs text-gray-600">
              Password must include: 8+ chars, uppercase, lowercase, number, and special character (!@#$%^&*)
            </p>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-3">Confirm Password</label>
            <div className={`relative border rounded-lg transition-all ${
              passwordMismatch ? 'border-red-500 focus-within:ring-2 focus-within:ring-red-500' : 
              passwordsMatch ? 'border-green-500 focus-within:ring-2 focus-within:ring-green-500' : 
              'border-gray-300 focus-within:ring-2 focus-within:ring-emerald-500 focus-within:border-emerald-500'
            }`}>
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                {...register('confirmPassword')}
                autoComplete="new-password"
                className="w-full rounded-lg px-4 pr-12 py-3 outline-none transition-all placeholder-gray-500 text-gray-900 bg-transparent"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-3.5 text-gray-400 hover:text-gray-600 transition-colors"
                aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
              >
                {showConfirmPassword ? <HiEyeOff className="text-xl" /> : <HiEye className="text-xl" />}
              </button>
            </div>
            
            {/* Password Match Message */}
            {confirmPasswordValue && (
              <div className={`mt-2 flex items-center gap-2 text-sm ${
                passwordsMatch ? 'text-green-600' : 'text-red-600'
              }`}>
                {passwordsMatch ? (
                  <>
                    <HiCheckCircle className="text-lg" />
                    <span>Passwords match!</span>
                  </>
                ) : passwordMismatch ? (
                  <>
                    <HiExclamationCircle className="text-lg" />
                    <span>Passwords don't match</span>
                  </>
                ) : null}
              </div>
            )}
          </div>

          {/* Terms and Conditions */}
          <div>
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                {...register('agreeToTerms')}
                className="w-4 h-4 rounded border-gray-300 text-emerald-500 focus:ring-2 focus:ring-emerald-500 mt-1"
              />
              <span className="text-sm text-gray-700">
                I agree to TalentBridge's{' '}
                <a href="#" className="text-emerald-600 hover:underline font-medium">
                  Terms of Service
                </a>
                {' '}and{' '}
                <a href="#" className="text-emerald-600 hover:underline font-medium">
                  Privacy Policy
                </a>
              </span>
            </label>
            {errors.agreeToTerms && (
              <div className="mt-2 flex items-center gap-2 text-red-600 text-sm">
                <HiExclamationCircle className="text-lg" />
                {errors.agreeToTerms.message}
              </div>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-emerald-500 text-white py-3 rounded-lg font-semibold hover:bg-emerald-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Creating account...
              </span>
            ) : (
              'Create Account'
            )}
          </button>

          {/* Sign In Link */}
          <div className="text-center pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="text-emerald-600 hover:text-emerald-700 font-semibold">
                Sign in here
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
