"use client";

export const dynamic = 'force-dynamic'

import { useState } from "react";
import { PrimaryButton } from "@/components/ui/button";
import { Input} from "@/components/ui/input";
import { Label} from "@/components/ui/label";
import { Alert } from "@/components/ui/alert";
import { Heading } from "@/components/ui/heading";
import { Mail, CheckCircle} from "lucide-react";
import Link from "next/link";

export default function AccountRecoveryPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handlePasswordResetRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    // Basic email validation
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send reset email');
      }

      setMessage(data.message || "If an account with this email exists, a password reset link has been sent.");
      setEmail(""); // Clear the input field
    } catch (error) {
      setError(error instanceof Error ? error.message : "An unexpected error occurred. Please try again.");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-dark-bg flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute top-[-20%] left-[20%] w-[60%] h-[60%] bg-neon-purple/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0))] opacity-20 pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        <div className="relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-neon-purple to-neon-cyan rounded-2xl opacity-20 group-hover:opacity-40 transition duration-500 blur"></div>
          
          <div className="relative bg-dark-card/90 backdrop-blur-xl p-8 rounded-2xl border border-neon-purple/30">
            <div className="text-center mb-8">
              <Heading level={1} color="purple" glitch={true} className="text-2xl mb-2">
                RECOVER ACCOUNT
              </Heading>
              <p className="text-gray-400 font-mono text-sm">
                Enter your email to receive recovery instructions
              </p>
            </div>

            <form onSubmit={handlePasswordResetRequest} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-neon-purple font-mono uppercase text-xs">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e: any) => setEmail(e.target.value)}
                    placeholder="agent@solosuccess.ai"
                    required
                    className="pl-10 bg-dark-bg/50 border-white/10 focus:border-neon-purple/50 text-white"
                  />
                </div>
              </div>
              
              {message && (
                <Alert variant="success" description={message} />
              )}

              {error && (
                <Alert variant="error" description={error} />
              )}

              <PrimaryButton 
                variant="purple"
                size="lg"
                type="submit" 
                className="w-full"
                disabled={loading}
              >
                {loading ? "Sending..." : "Send Recovery Link"}
              </PrimaryButton>
            </form>
            
            <div className="mt-6 text-center">
              <Link href="/login" className="text-sm font-mono text-gray-400 hover:text-neon-cyan transition-colors">
                Remembered your password? <span className="underline">Sign In</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}