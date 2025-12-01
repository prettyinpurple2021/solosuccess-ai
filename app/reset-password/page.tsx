"use client";

export const dynamic = 'force-dynamic'

import { useState, useEffect, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { 
  Lock, 
  AlertCircle, 
  CheckCircle, 
  Eye, 
  EyeOff,
  Shield,
  Target,
  Crown,
  ArrowRight,
  ArrowLeft,
  Mail,
  Key
} from "lucide-react";
import { 
  TacticalButton, 
  GlassCard, 
  RankStars, 
  CamoBackground, 
  SergeantDivider,
  StatsBadge,
  TacticalGrid
} from '@/components/military'
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Link from "next/link";

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [token, setToken] = useState<string | null>(null);
  
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [passwordErrors, setPasswordErrors] = useState<string[]>([]);

  useEffect(() => {
    const tokenParam = searchParams.get('token');
    if (tokenParam) {
      setToken(tokenParam);
    } else {
      setError("Invalid or missing recovery token. Please request a new password reset.");
    }
  }, [searchParams]);

  const validatePassword = (password: string): string[] => {
    const errors: string[] = [];
    
    if (password.length < 8) {
      errors.push("Password must be at least 8 characters long");
    }
    
    if (!/[A-Z]/.test(password)) {
      errors.push("Password must contain at least one uppercase letter");
    }
    
    if (!/[a-z]/.test(password)) {
      errors.push("Password must contain at least one lowercase letter");
    }
    
    if (!/[0-9]/.test(password)) {
      errors.push("Password must contain at least one number");
    }
    
    if (!/[^A-Za-z0-9]/.test(password)) {
      errors.push("Password must contain at least one special character");
    }
    
    return errors;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!token) {
      setError("Invalid recovery token");
      return;
    }

    const errors = validatePassword(password);
    if (errors.length > 0) {
      setPasswordErrors(errors);
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          token, 
          password 
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("Tactical credentials successfully updated. You may now access your command center.");
        setTimeout(() => {
          router.push('/signin');
        }, 3000);
      } else {
        setError(data.error || "Mission failed. Please try again.");
      }
    } catch (err) {
      setError("Communication error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (message) {
    return (
      <div className="min-h-screen bg-military-midnight relative overflow-hidden">
        <CamoBackground opacity={0.1} withGrid>
          <div className="container mx-auto px-4 py-32">
            <GlassCard className="max-w-2xl mx-auto p-12 text-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
              >
                <div className="w-20 h-20 mx-auto mb-8 rounded-2xl bg-gradient-to-br from-military-hot-pink to-military-blush-pink flex items-center justify-center">
                  <CheckCircle className="w-10 h-10 text-white" />
                </div>
                
                <h1 className="font-heading text-4xl font-bold text-white mb-4">
                  Mission Accomplished
                </h1>
                
                <p className="text-lg text-military-storm-grey mb-8">
                  {message}
                </p>
                
                <div className="flex flex-wrap justify-center gap-4">
                  <Link href="/signin">
                    <TacticalButton className="group">
                      Access Command Center
                      <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </TacticalButton>
                  </Link>
                  <Link href="/">
                    <TacticalButton variant="outline">
                      Return to Base
                    </TacticalButton>
                  </Link>
                </div>
              </motion.div>
            </GlassCard>
          </div>
        </CamoBackground>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-military-midnight relative overflow-hidden">
      <CamoBackground opacity={0.1} withGrid>
        {/* Navigation */}
        <nav className="fixed top-0 left-0 right-0 z-50 glass-panel-strong border-b border-military-hot-pink/30">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between h-20">
              <Link href="/" className="flex items-center gap-3">
                <motion.div 
                  className="w-12 h-12 rounded-xl bg-gradient-to-br from-military-hot-pink to-military-blush-pink flex items-center justify-center shadow-lg"
                  whileHover={{ scale: 1.05 }}
                >
                  <Crown className="w-6 h-6 text-white" />
                </motion.div>
                <span className="font-heading text-xl font-bold text-white">SoloSuccess AI</span>
              </Link>
              
              <div className="flex items-center gap-4">
                <Link href="/signin">
                  <TacticalButton variant="outline" size="sm">
                    Sign In
                  </TacticalButton>
                </Link>
                <Link href="/signup">
                  <TacticalButton size="sm">
                    Get Started
                  </TacticalButton>
                </Link>
              </div>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-32">
          <div className="max-w-2xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <div className="flex items-center justify-center gap-2 mb-6">
                <RankStars count={5} size="lg" />
                <span className="text-military-hot-pink font-tactical text-sm uppercase tracking-wider">
                  Security Protocol
                </span>
              </div>
              
              <h1 className="font-heading text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
                Reset <span className="text-transparent bg-clip-text bg-gradient-to-r from-military-hot-pink to-military-blush-pink">Credentials</span>
              </h1>
              
              <p className="text-xl text-military-storm-grey leading-relaxed">
                Establish new tactical credentials for your command center. 
                Use elite security standards for maximum protection.
              </p>
            </motion.div>

            <GlassCard className="p-12">
              <form onSubmit={handleSubmit} className="space-y-8">
                <div>
                  <Label htmlFor="password" className="block text-white font-tactical text-sm uppercase tracking-wider mb-3">
                    New Tactical Password
                  </Label>
                  <div className="relative">
                    <Key className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-military-storm-grey" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your new tactical password"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        setPasswordErrors([]);
                      }}
                      className="pl-12 pr-12 py-4 bg-military-tactical/50 border-military-hot-pink/30 text-white placeholder-military-storm-grey focus:border-military-hot-pink text-lg"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-military-storm-grey hover:text-military-hot-pink transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <Label htmlFor="confirmPassword" className="block text-white font-tactical text-sm uppercase tracking-wider mb-3">
                    Confirm Tactical Password
                  </Label>
                  <div className="relative">
                    <Shield className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-military-storm-grey" />
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm your new tactical password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="pl-12 pr-12 py-4 bg-military-tactical/50 border-military-hot-pink/30 text-white placeholder-military-storm-grey focus:border-military-hot-pink text-lg"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-military-storm-grey hover:text-military-hot-pink transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {passwordErrors.length > 0 && (
                  <Alert className="bg-red-500/10 border-red-500/30 text-red-400">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      <ul className="list-disc list-inside space-y-1">
                        {passwordErrors.map((error, index) => (
                          <li key={index}>{error}</li>
                        ))}
                      </ul>
                    </AlertDescription>
                  </Alert>
                )}

                {error && (
                  <Alert className="bg-red-500/10 border-red-500/30 text-red-400">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <TacticalButton 
                  type="submit" 
                  size="lg" 
                  disabled={loading || !token}
                  className="w-full group"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Updating Credentials...
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4 mr-2" />
                      Update Tactical Credentials
                    </>
                  )}
                </TacticalButton>
              </form>
            </GlassCard>

            {/* Security Requirements */}
            <div className="mt-12">
              <GlassCard className="p-8">
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-6 rounded-xl bg-gradient-to-br from-military-hot-pink to-military-blush-pink flex items-center justify-center">
                    <Shield className="w-8 h-8 text-white" />
                  </div>
                  
                  <h3 className="font-heading text-2xl font-bold text-white mb-4">
                    Elite Security Requirements
                  </h3>
                  
                  <p className="text-military-storm-grey mb-6 leading-relaxed">
                    Your tactical credentials must meet military-grade security standards 
                    to protect your command center from unauthorized access.
                  </p>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="text-left space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 rounded-full bg-military-hot-pink/20 flex items-center justify-center">
                          <CheckCircle className="w-4 h-4 text-military-hot-pink" />
                        </div>
                        <span className="text-military-storm-grey">Minimum 8 characters</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 rounded-full bg-military-hot-pink/20 flex items-center justify-center">
                          <CheckCircle className="w-4 h-4 text-military-hot-pink" />
                        </div>
                        <span className="text-military-storm-grey">Uppercase letters</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 rounded-full bg-military-hot-pink/20 flex items-center justify-center">
                          <CheckCircle className="w-4 h-4 text-military-hot-pink" />
                        </div>
                        <span className="text-military-storm-grey">Lowercase letters</span>
                      </div>
                    </div>
                    
                    <div className="text-left space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 rounded-full bg-military-hot-pink/20 flex items-center justify-center">
                          <CheckCircle className="w-4 h-4 text-military-hot-pink" />
                        </div>
                        <span className="text-military-storm-grey">Numbers</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 rounded-full bg-military-hot-pink/20 flex items-center justify-center">
                          <CheckCircle className="w-4 h-4 text-military-hot-pink" />
                        </div>
                        <span className="text-military-storm-grey">Special characters</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 rounded-full bg-military-hot-pink/20 flex items-center justify-center">
                          <CheckCircle className="w-4 h-4 text-military-hot-pink" />
                        </div>
                        <span className="text-military-storm-grey">Unique and secure</span>
                      </div>
                    </div>
                  </div>
                </div>
              </GlassCard>
            </div>

            {/* Back to Sign In */}
            <div className="text-center mt-8">
              <Link href="/signin" className="inline-flex items-center gap-2 text-military-storm-grey hover:text-military-hot-pink transition-colors">
                <ArrowLeft className="w-4 h-4" />
                Return to Sign In
              </Link>
            </div>
          </div>
        </div>
      </CamoBackground>
    </div>
  );
}