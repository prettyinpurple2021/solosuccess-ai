'use client';

import { useActionState } from 'react';
import { register } from '@/lib/auth-actions'; // Ensure this action exists or create it
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';

export function RegisterForm() {
  // @ts-ignore
  const [state, formAction, isPending] = useActionState(register, undefined);

  return (
    <div className="card-boss relative group border-pink-500/30">
       <div className="absolute -inset-0.5 bg-gradient-to-r from-[#FF1FAF] to-[#B621FF] rounded-2xl opacity-20 group-hover:opacity-40 transition duration-500 blur"></div>
       
       <div className="relative bg-[#0a0a0f]/90 backdrop-blur-xl p-8 rounded-2xl border border-white/10 space-y-6">
         <form action={formAction} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName" className="text-pink-400 font-mono uppercase text-xs">First Name</Label>
                <Input id="firstName" name="firstName" required className="bg-black/50 border-white/10 focus:border-pink-500/50" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName" className="text-pink-400 font-mono uppercase text-xs">Last Name</Label>
                <Input id="lastName" name="lastName" required className="bg-black/50 border-white/10 focus:border-pink-500/50" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-pink-400 font-mono uppercase text-xs">Email Address</Label>
              <Input id="email" name="email" type="email" required className="bg-black/50 border-white/10 focus:border-pink-500/50" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-pink-400 font-mono uppercase text-xs">Password</Label>
              <Input id="password" name="password" type="password" required minLength={8} className="bg-black/50 border-white/10 focus:border-pink-500/50" />
              <p className="text-[10px] text-gray-500 font-mono">MUST BE 8+ CHARACTERS. ENCRYPTION STANDARD: AES-256</p>
            </div>

            {state?.error && (
              <div className="p-3 bg-red-900/20 border border-red-500/50 rounded text-red-400 text-xs font-mono">
                🛑 ERROR: {state.error}
              </div>
            )}

            <Button className="w-full btn-boss bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 border-none mt-4" disabled={isPending}>
              {isPending ? <Loader2 className="animate-spin mr-2" /> : 'Create Agent Profile'}
            </Button>
         </form>
       </div>
    </div>
  );
}
