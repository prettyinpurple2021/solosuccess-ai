'use client';

import { useState } from 'react';
import { PrimaryButton } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert } from '@/components/ui/alert';
import { Loader2 } from 'lucide-react';
import { Heading } from '@/components/ui/Heading';

export function ForgotPasswordForm() {
  const [isPending, setIsPending] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPending(true);
    // Simulate API call
    setTimeout(() => {
        setIsPending(false);
        setSubmitted(true);
    }, 1500);
  };

  if (submitted) {
     return (
        <div className="relative bg-dark-card/90 backdrop-blur-xl p-8 rounded-2xl border border-neon-cyan/30 text-center">
             <div className="text-neon-cyan text-4xl mb-4">✓</div>
             <Heading level={3} color="cyan" className="mb-2">PROTOCOL INITIATED</Heading>
             <p className="text-gray-400 font-mono text-sm">
                If an active agent profile exists for that email, recovery instructions have been transmitted.
             </p>
        </div>
     );
  }

  return (
    <div className="relative group">
       <div className="absolute -inset-0.5 bg-gradient-to-r from-neon-cyan to-neon-purple rounded-2xl opacity-20 group-hover:opacity-40 transition duration-500 blur"></div>
       
       <div className="relative bg-dark-card/90 backdrop-blur-xl p-8 rounded-2xl border border-neon-cyan/30 space-y-6">
         <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-neon-cyan font-mono uppercase text-xs">Email Address</Label>
              <Input id="email" name="email" type="email" required className="bg-dark-bg/50 border-white/10 focus:border-neon-cyan/50 text-white" placeholder="agent@solosuccess.ai" />
            </div>

            <PrimaryButton variant="cyan" size="lg" className="w-full mt-4" disabled={isPending} type="submit">
              {isPending ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="animate-spin" />
                  Transmit Recovery Link
                </span>
              ) : (
                'Transmit Recovery Link'
              )}
            </PrimaryButton>
         </form>
       </div>
    </div>
  );
}
