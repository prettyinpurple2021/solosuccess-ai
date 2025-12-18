'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';

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
        <div className="card-boss relative bg-[#0a0a0f]/90 backdrop-blur-xl p-8 rounded-2xl border border-[#18FFFF]/30 text-center">
             <div className="text-[#18FFFF] text-4xl mb-4">✓</div>
             <h3 className="text-white font-boss text-lg mb-2">PROTOCOL INITIATED</h3>
             <p className="text-gray-400 font-mono text-sm">
                If an active agent profile exists for that email, recovery instructions have been transmitted.
             </p>
        </div>
     );
  }

  return (
    <div className="card-boss relative group border-blue-500/30">
       <div className="absolute -inset-0.5 bg-gradient-to-r from-[#18FFFF] to-[#B621FF] rounded-2xl opacity-20 group-hover:opacity-40 transition duration-500 blur"></div>
       
       <div className="relative bg-[#0a0a0f]/90 backdrop-blur-xl p-8 rounded-2xl border border-white/10 space-y-6">
         <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-cyan-400 font-mono uppercase text-xs">Email Address</Label>
              <Input id="email" name="email" type="email" required className="bg-black/50 border-white/10 focus:border-cyan-500/50" placeholder="agent@solosuccess.ai" />
            </div>

            <Button className="w-full btn-boss bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 border-none mt-4" disabled={isPending}>
              {isPending ? <Loader2 className="animate-spin mr-2" /> : 'Transmit Recovery Link'}
            </Button>
         </form>
       </div>
    </div>
  );
}
