// components/AuthModal.tsx
'use client';

import React from 'react';
import { X, ArrowRight, Mail, Lock, Eye, EyeOff, Loader2 } from 'lucide-react';
import { FcGoogle } from 'react-icons/fc';
import { motion, AnimatePresence } from 'framer-motion';
import { useSignIn, useSignUp } from '@clerk/nextjs';
import type { ClerkAPIError } from '@clerk/types';

type ButtonVariant = 'default' | 'ghost' | 'outline';
type ButtonSize = 'default' | 'icon';

// Button Component
const Button = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: ButtonVariant; size?: ButtonSize }>(
  ({ className = '', variant = 'default', size = 'default', children, ...props }, ref) => {
    const baseStyles = "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20 disabled:pointer-events-none disabled:opacity-50";
    const variants: Record<ButtonVariant, string> = {
      default: "bg-white text-black hover:bg-gray-100",
      ghost: "hover:bg-white/10",
      outline: "border border-white/30 bg-white/5 hover:bg-white/10"
    };
    const sizes: Record<ButtonSize, string> = {
      default: "h-10 px-4 py-2",
      icon: "h-10 w-10"
    };
    
    return (
      <button
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
        ref={ref}
        {...props}
      >
        {children}
      </button>
    );
  }
);

// Input Component
const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className = '', ...props }, ref) => {
    return (
      <input
        className={`flex h-12 w-full rounded-lg border border-white/20 bg-white/5 backdrop-blur-xl px-4 py-2 text-sm text-white placeholder:text-white/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30 focus-visible:border-white/40 disabled:cursor-not-allowed disabled:opacity-50 transition-all ${className}`}
        ref={ref}
        {...props}
      />
    );
  }
);

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'signup';
}

function AuthModal({ isOpen, onClose, initialMode = 'login' }: AuthModalProps) {
  const [mode, setMode] = React.useState<'login' | 'signup' | 'forgot-password' | 'reset-password'>('login');
  const [showPassword, setShowPassword] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string>('');
  const [successMessage, setSuccessMessage] = React.useState<string>('');
  const [verifying, setVerifying] = React.useState(false);
  const [verificationCode, setVerificationCode] = React.useState('');
  const [resetCode, setResetCode] = React.useState('');
  const [newPassword, setNewPassword] = React.useState('');
  const [formData, setFormData] = React.useState({
    email: '',
    password: ''
  });

  const { signIn, setActive: setActiveSignIn } = useSignIn();
  const { signUp, setActive: setActiveSignUp } = useSignUp();

  React.useEffect(() => {
    setMode(initialMode);
    setError('');
    setSuccessMessage('');
    setVerifying(false);
    setVerificationCode('');
    setResetCode('');
    setNewPassword('');
  }, [initialMode]);

  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setError('');
      setSuccessMessage('');
      setVerifying(false);
      setVerificationCode('');
      setResetCode('');
      setNewPassword('');
      setFormData({ email: '', password: '' });
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleError = (err: any) => {
    console.error('Auth error:', err);
    
    if (err.errors && err.errors.length > 0) {
      const clerkError = err.errors[0] as ClerkAPIError;
      setError(clerkError.message || 'An error occurred');
    } else {
      setError(err.message || 'An error occurred. Please try again.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    setIsLoading(true);

    try {
      if (mode === 'login') {
        if (!signIn) {
          throw new Error('Sign in not initialized');
        }

        const result = await signIn.create({
          identifier: formData.email,
          password: formData.password,
        });

        if (result.status === 'complete') {
          await setActiveSignIn({ session: result.createdSessionId });
          onClose();
        } else {
          setError('Sign in incomplete. Please try again.');
        }
      } else if (mode === 'signup') {
        if (!signUp) {
          throw new Error('Sign up not initialized');
        }

        const result = await signUp.create({
          emailAddress: formData.email,
          password: formData.password,
        });

        if (result.status === 'complete') {
          await setActiveSignUp({ session: result.createdSessionId });
          onClose();
        } else if (result.status === 'missing_requirements') {
          await signUp.prepareEmailAddressVerification({ 
            strategy: 'email_code' 
          });
          setVerifying(true);
          setError('');
        } else {
          setError('Sign up incomplete. Please try again.');
        }
      }
    } catch (err: any) {
      handleError(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (!signUp) {
        throw new Error('Sign up not initialized');
      }

      const result = await signUp.attemptEmailAddressVerification({
        code: verificationCode,
      });

      if (result.status === 'complete') {
        await setActiveSignUp({ session: result.createdSessionId });
        onClose();
      } else {
        setError('Verification incomplete. Please try again.');
      }
    } catch (err: any) {
      handleError(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    setIsLoading(true);

    try {
      if (!signIn) {
        throw new Error('Sign in not initialized');
      }

      // Start the password reset flow
      await signIn.create({
        strategy: 'reset_password_email_code',
        identifier: formData.email,
      });

      setSuccessMessage('Password reset code sent to your email!');
      setMode('reset-password');
    } catch (err: any) {
      handleError(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    setIsLoading(true);

    try {
      if (!signIn) {
        throw new Error('Sign in not initialized');
      }

      // Attempt to reset the password
      const result = await signIn.attemptFirstFactor({
        strategy: 'reset_password_email_code',
        code: resetCode,
        password: newPassword,
      });

      if (result.status === 'complete') {
        await setActiveSignIn({ session: result.createdSessionId });
        setSuccessMessage('Password reset successful!');
        setTimeout(() => {
          onClose();
        }, 1500);
      } else {
        setError('Password reset incomplete. Please try again.');
      }
    } catch (err: any) {
      handleError(err);
    } finally {
      setIsLoading(false);
    }
  };

  const resendVerificationCode = async () => {
    setError('');
    setIsLoading(true);
    
    try {
      if (!signUp) {
        throw new Error('Sign up not initialized');
      }

      await signUp.prepareEmailAddressVerification({ 
        strategy: 'email_code' 
      });
      
      setSuccessMessage('Verification code resent! Check your email.');
    } catch (err: any) {
      handleError(err);
    } finally {
      setIsLoading(false);
    }
  };

  const resendResetCode = async () => {
    setError('');
    setIsLoading(true);
    
    try {
      if (!signIn) {
        throw new Error('Sign in not initialized');
      }

      await signIn.create({
        strategy: 'reset_password_email_code',
        identifier: formData.email,
      });
      
      setSuccessMessage('Reset code resent! Check your email.');
    } catch (err: any) {
      handleError(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setIsLoading(true);

    try {
      if (mode === 'login') {
        if (!signIn) throw new Error('Sign in not initialized');
        await signIn.authenticateWithRedirect({
          strategy: 'oauth_google',
          redirectUrl: '/sso-callback',
          redirectUrlComplete: '/',
        });
      } else {
        if (!signUp) throw new Error('Sign up not initialized');
        await signUp.authenticateWithRedirect({
          strategy: 'oauth_google',
          redirectUrl: '/sso-callback',
          redirectUrlComplete: '/',
        });
      }
    } catch (err: any) {
      handleError(err);
      setIsLoading(false);
    }
  };

  const getFormContent = () => {
    if (mode === 'forgot-password') {
      return {
        title: 'Reset Password',
        subtitle: 'Enter your email to receive a reset code',
        onSubmit: handleForgotPassword,
      };
    } else if (mode === 'reset-password') {
      return {
        title: 'Enter New Password',
        subtitle: `Reset code sent to ${formData.email}`,
        onSubmit: handleResetPassword,
      };
    } else if (verifying) {
      return {
        title: 'Verify Your Email',
        subtitle: `We sent a code to ${formData.email}`,
        onSubmit: handleVerifyCode,
      };
    } else {
      return {
        title: mode === 'login' ? 'Welcome Back' : 'Create Account',
        subtitle: mode === 'login' ? 'Sign in to continue to your account' : 'Join us and start your journey',
        onSubmit: handleSubmit,
      };
    }
  };

  const formContent = getFormContent();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md"
            onClick={onClose}
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="w-full max-w-[380px] sm:max-w-md pointer-events-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative bg-black/95 backdrop-blur-2xl border border-white/20 rounded-2xl shadow-2xl shadow-white/10 overflow-hidden">
                {/* Gradient Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent pointer-events-none" />
                
                {/* Close Button */}
                <button
                  onClick={onClose}
                  className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10 rounded-full p-2 text-white/60 hover:text-white hover:bg-white/10 transition-all"
                  disabled={isLoading}
                >
                  <X className="h-5 w-5" />
                </button>

                {/* Content */}
                <form onSubmit={formContent.onSubmit} className="relative p-5 sm:p-8">
                  {/* Agency Logo */}
                  <div className="flex justify-center mb-6 sm:mb-8">
                    <img 
                      src="agency_logo.png" 
                      alt="dev365" 
                      className="h-12 sm:h-16 w-auto"
                    />
                  </div>

                  {/* Error Message */}
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20"
                    >
                      <p className="text-red-400 text-xs sm:text-sm">{error}</p>
                    </motion.div>
                  )}

                  {/* Success Message */}
                  {successMessage && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mb-4 p-3 rounded-lg bg-green-500/10 border border-green-500/20"
                    >
                      <p className="text-green-400 text-xs sm:text-sm">{successMessage}</p>
                    </motion.div>
                  )}

                  {/* Clerk CAPTCHA Container */}
                  {!verifying && mode !== 'forgot-password' && mode !== 'reset-password' && (
                    <div id="clerk-captcha" className="mb-4"></div>
                  )}

                  {/* Form Fields */}
                  <div className="space-y-3 sm:space-y-4">
                    {mode === 'forgot-password' ? (
                      /* Forgot Password - Email Input */
                      <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="space-y-3 sm:space-y-4"
                      >
                        <div className="relative">
                          <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none z-10">
                            <Mail className="h-5 w-5 text-white/60" />
                          </div>
                          <Input
                            type="email"
                            placeholder="Email Address"
                            className="pl-11 h-12 relative"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            disabled={isLoading}
                            required
                            autoFocus
                          />
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            setMode('login');
                            setError('');
                            setSuccessMessage('');
                          }}
                          disabled={isLoading}
                          className="text-xs sm:text-sm text-white/60 hover:text-white transition-colors w-full text-center"
                        >
                          ← Back to sign in
                        </button>
                      </motion.div>
                    ) : mode === 'reset-password' ? (
                      /* Reset Password - Code + New Password */
                      <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="space-y-3 sm:space-y-4"
                      >
                        <div className="relative">
                          <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none z-10">
                            <Mail className="h-5 w-5 text-white/60" />
                          </div>
                          <Input
                            type="text"
                            placeholder="Enter 6-digit code"
                            className="pl-11 h-12 text-center text-lg tracking-widest relative"
                            value={resetCode}
                            onChange={(e) => setResetCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                            disabled={isLoading}
                            required
                            maxLength={6}
                            autoFocus
                          />
                        </div>

                        <div className="relative">
                          <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none z-10">
                            <Lock className="h-5 w-5 text-white/60" />
                          </div>
                          <Input
                            type={showPassword ? 'text' : 'password'}
                            placeholder="New Password"
                            className="pl-11 pr-11 h-12 relative"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            disabled={isLoading}
                            required
                            minLength={8}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition-colors z-10"
                            disabled={isLoading}
                          >
                            {showPassword ? (
                              <EyeOff className="h-5 w-5" />
                            ) : (
                              <Eye className="h-5 w-5" />
                            )}
                          </button>
                        </div>

                        <div className="text-center">
                          <button
                            type="button"
                            onClick={resendResetCode}
                            disabled={isLoading}
                            className="text-xs sm:text-sm text-white/60 hover:text-white transition-colors"
                          >
                            Didn't receive code? Resend
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            setMode('forgot-password');
                            setResetCode('');
                            setNewPassword('');
                            setError('');
                            setSuccessMessage('');
                          }}
                          disabled={isLoading}
                          className="text-xs sm:text-sm text-white/60 hover:text-white transition-colors w-full text-center"
                        >
                          ← Back
                        </button>
                      </motion.div>
                    ) : verifying ? (
                      /* Email Verification Code Input */
                      <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="space-y-3 sm:space-y-4"
                      >
                        <div className="relative">
                          <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none z-10">
                            <Mail className="h-5 w-5 text-white/60" />
                          </div>
                          <Input
                            type="text"
                            placeholder="Enter 6-digit code"
                            className="pl-11 h-12 text-center text-lg tracking-widest relative"
                            value={verificationCode}
                            onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                            disabled={isLoading}
                            required
                            maxLength={6}
                            autoFocus
                          />
                        </div>

                        <div className="text-center">
                          <button
                            type="button"
                            onClick={resendVerificationCode}
                            disabled={isLoading}
                            className="text-xs sm:text-sm text-white/60 hover:text-white transition-colors"
                          >
                            Didn't receive code? Resend
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            setVerifying(false);
                            setVerificationCode('');
                            setError('');
                            setSuccessMessage('');
                          }}
                          disabled={isLoading}
                          className="text-xs sm:text-sm text-white/60 hover:text-white transition-colors w-full text-center"
                        >
                          ← Back to sign up
                        </button>
                      </motion.div>
                    ) : (
                      /* Login/Signup Form */
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={mode}
                          initial={{ opacity: 0, x: mode === 'signup' ? 20 : -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: mode === 'signup' ? -20 : 20 }}
                          transition={{ duration: 0.3 }}
                          className="space-y-3 sm:space-y-4"
                        >
                          <div className="relative">
                            <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none z-10">
                              <Mail className="h-5 w-5 text-white/60" />
                            </div>
                            <Input
                              type="email"
                              placeholder="Email Address"
                              className="pl-11 h-12 relative"
                              value={formData.email}
                              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                              disabled={isLoading}
                              required
                            />
                          </div>

                          <div className="relative">
                            <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none z-10">
                              <Lock className="h-5 w-5 text-white/60" />
                            </div>
                            <Input
                              type={showPassword ? 'text' : 'password'}
                              placeholder="Password"
                              className="pl-11 pr-11 h-12 relative"
                              value={formData.password}
                              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                              disabled={isLoading}
                              required
                              minLength={8}
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition-colors z-10"
                              disabled={isLoading}
                            >
                              {showPassword ? (
                                <EyeOff className="h-5 w-5" />
                              ) : (
                                <Eye className="h-5 w-5" />
                              )}
                            </button>
                          </div>

                          {mode === 'login' && (
                            <div className="flex justify-end">
                              <button
                                type="button"
                                onClick={() => {
                                  setMode('forgot-password');
                                  setError('');
                                  setSuccessMessage('');
                                }}
                                className="text-xs sm:text-sm text-white/60 hover:text-white transition-colors"
                                disabled={isLoading}
                              >
                                Forgot password?
                              </button>
                            </div>
                          )}
                        </motion.div>
                      </AnimatePresence>
                    )}

                    {/* Submit Button */}
                    <Button
                      type="submit"
                      disabled={
                        isLoading || 
                        (verifying && verificationCode.length !== 6) ||
                        (mode === 'reset-password' && (resetCode.length !== 6 || newPassword.length < 8))
                      }
                      className="w-full h-12 bg-white text-black hover:bg-gray-100 shadow-lg shadow-white/10 group relative overflow-hidden mt-2"
                    >
                      <span className="relative z-10 flex items-center justify-center gap-2 font-medium text-sm">
                        {isLoading ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            {mode === 'forgot-password' ? 'Sending Code...' :
                             mode === 'reset-password' ? 'Resetting...' :
                             verifying ? 'Verifying...' : 
                             mode === 'login' ? 'Signing In...' : 'Creating Account...'}
                          </>
                        ) : (
                          <>
                            {mode === 'forgot-password' ? 'Send Reset Code' :
                             mode === 'reset-password' ? 'Reset Password' :
                             verifying ? 'Verify Email' : 
                             mode === 'login' ? 'Sign In' : 'Create Account'}
                            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                          </>
                        )}
                      </span>
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                    </Button>

                    {!verifying && mode !== 'forgot-password' && mode !== 'reset-password' && (
                      <>
                        {/* Divider */}
                        <div className="relative">
                          <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-white/10"></div>
                          </div>
                          <div className="relative flex justify-center text-xs">
                            <span className="bg-black/95 px-2 text-white/40">OR</span>
                          </div>
                        </div>

                        {/* Google Sign In */}
                        <Button
                          type="button"
                          variant="outline"
                          className="w-full h-12 border-white/20 bg-white/5 hover:bg-white/10 text-white text-sm"
                          onClick={handleGoogleSignIn}
                          disabled={isLoading}
                        >
                          <FcGoogle className="h-5 w-5 mr-2" />
                          Continue with Google
                        </Button>
                      </>
                    )}
                  </div>

                  {/* Toggle Mode */}
                  {!verifying && mode !== 'forgot-password' && mode !== 'reset-password' && (
                    <div className="mt-6 text-center">
                      <p className="text-xs sm:text-sm text-white/60">
                        {mode === 'login' ? "Don't have an account?" : 'Already have an account?'}
                        {' '}
                        <button
                          type="button"
                          onClick={() => {
                            setMode(mode === 'login' ? 'signup' : 'login');
                            setError('');
                            setSuccessMessage('');
                          }}
                          className="text-white font-medium hover:underline transition-all"
                          disabled={isLoading}
                        >
                          {mode === 'login' ? 'Sign Up' : 'Sign In'}
                        </button>
                      </p>
                    </div>
                  )}
                </form>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}

export default AuthModal;