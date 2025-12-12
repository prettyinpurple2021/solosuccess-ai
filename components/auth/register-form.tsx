'use client';

import { useActionState } from 'react';
import { register, socialLogin } from '@/lib/auth-actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, AlertCircle } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import Link from 'next/link';

export function RegisterForm() {
  // @ts-ignore
  const [state, formAction, isPending] = useActionState(register, undefined);

  return (
    <div className="card-boss relative group border-pink-500/30 max-w-lg mx-auto">
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
              <Label htmlFor="dateOfBirth" className="text-pink-400 font-mono uppercase text-xs">Date of Birth (18+)</Label>
              <Input id="dateOfBirth" name="dateOfBirth" type="date" required className="bg-black/50 border-white/10 focus:border-pink-500/50 text-white" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-pink-400 font-mono uppercase text-xs">Email Address</Label>
              <Input id="email" name="email" type="email" required className="bg-black/50 border-white/10 focus:border-pink-500/50" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-pink-400 font-mono uppercase text-xs">Password</Label>
              <Input id="password" name="password" type="password" required minLength={8} className="bg-black/50 border-white/10 focus:border-pink-500/50" />
              <p className="text-[10px] text-gray-500 font-mono">Must be 8+ characters.</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-pink-400 font-mono uppercase text-xs">Confirm Password</Label>
              <Input id="confirmPassword" name="confirmPassword" type="password" required minLength={8} className="bg-black/50 border-white/10 focus:border-pink-500/50" />
            </div>

            <div className="flex items-start gap-3 pt-2">
              <div className="flex items-center h-5">
                <Checkbox id="terms" name="terms" required className="border-pink-500 data-[state=checked]:bg-pink-600" />
              </div>
              <Label htmlFor="terms" className="text-sm font-normal text-gray-400 leading-tight">
                I agree to the <Link href="/terms" className="text-pink-400 hover:underline">Terms of Service</Link> and <Link href="/privacy" className="text-pink-400 hover:underline">Privacy Policy</Link>.
              </Label>
            </div>

            {state?.error && (
              <div className="p-3 bg-red-900/20 border border-red-500/50 rounded flex items-start gap-2 text-red-400 text-xs font-mono break-words">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{state.error}</span>
              </div>
            )}

            <Button className="w-full btn-boss bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 border-none mt-4" disabled={isPending}>
              {isPending ? <Loader2 className="animate-spin mr-2" /> : 'Register Account'}
            </Button>
         </form>

         <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-white/10" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-[#0a0a0f] px-2 text-gray-500 font-mono">
                Or Connect Via
              </span>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
             <Button 
                variant="outline" 
                onClick={() => socialLogin('google')} 
                className="border-white/10 hover:bg-white/5 hover:text-white hover:border-white/20 transition-all font-mono"
             >
                Google
             </Button>
             <Button 
                variant="outline" 
                onClick={() => socialLogin('github')} 
                className="border-white/10 hover:bg-white/5 hover:text-white hover:border-white/20 transition-all font-mono"
             >
                GitHub
             </Button>
          </div>

          <p className="text-center text-sm text-gray-500 mt-6 font-mono">
            Already have an account?{' '}
            <Link href="/login" className="text-pink-400 hover:text-purple-400 transition-colors underline decoration-dashed underline-offset-4">
              Sign In
            </Link>
          </p>
       </div>
    </div>
  );
}
