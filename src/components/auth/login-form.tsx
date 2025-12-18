'use client';

import { useActionState } from 'react';
import { authenticate, socialLogin } from '@/lib/auth-actions';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';

export function LoginForm() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard';
  const error = searchParams.get('error');
  
  // @ts-ignore
  const [errorMessage, formAction, isPending] = useActionState(
    authenticate,
    undefined
  );

  return (
    <div className="card-boss relative group max-w-md mx-auto">
      {/* Glow check */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-[#B621FF] to-[#18FFFF] rounded-2xl opacity-20 group-hover:opacity-40 transition duration-500 blur"></div>
      
      <div className="relative bg-[#0a0a0f]/90 backdrop-blur-xl p-8 rounded-2xl border border-white/10">


        <form action={formAction} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-cyan-400 font-mono uppercase text-xs tracking-wider">
              Identity / Email
            </Label>
            <Input
              id="email"
              type="email"
              name="email"
              placeholder="agent@solosuccess.ai"
              required
              className="bg-black/50 border-white/10 text-white focus:border-[#18FFFF] focus:ring-[#18FFFF]/20 transition-all font-mono"
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password" className="text-purple-400 font-mono uppercase text-xs tracking-wider">
                Passcode
              </Label>
              <Link href="/forgot-password" className="text-xs text-gray-400 hover:text-[#18FFFF] transition-colors font-mono">
                Recover Access?
              </Link>
            </div>
            <Input
              id="password"
              type="password"
              name="password"
              required
              minLength={6}
              className="bg-black/50 border-white/10 text-white focus:border-[#B621FF] focus:ring-[#B621FF]/20 transition-all font-mono"
            />
          </div>

          <input type="hidden" name="redirectTo" value={callbackUrl} />

          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400 text-sm font-mono flex items-center gap-2">
              <span className="text-lg">⚠️</span>
              {error === 'Configuration' ? 'Server Configuration Error. Check Provider Secrets.' : 
               error === 'CredentialsSignin' ? 'Invalid credentials provided.' : 'Authentication failed.'}
            </div>
          )}
           
          {errorMessage && (
             <div className="p-3 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400 text-sm font-mono flex items-center gap-2">
               <span className="text-lg">x</span>
               <p>{errorMessage}</p>
             </div>
           )}

          <Button 
            className="w-full btn-boss relative overflow-hidden" 
            disabled={isPending}
          >
            {isPending ? (
              <span className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Auth Sequence Initiated...
              </span>
            ) : (
              <span className="relative z-10 flex items-center justify-center gap-2 tracking-widest uppercase">
                Initialize Session
              </span>
            )}
          </Button>
          
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
                type="button" 
                onClick={() => socialLogin('google')} 
                className="border-white/10 hover:bg-white/5 hover:text-white hover:border-white/20 transition-all font-mono"
             >
                Google
             </Button>
             <Button 
                variant="outline" 
                type="button" 
                onClick={() => socialLogin('github')} 
                className="border-white/10 hover:bg-white/5 hover:text-white hover:border-white/20 transition-all font-mono"
             >
                GitHub
             </Button>
          </div>

          <p className="text-center text-sm text-gray-500 mt-6 font-mono">
            New here?{' '}
            <Link href="/register" className="text-[#18FFFF] hover:text-[#B621FF] transition-colors underline decoration-dashed underline-offset-4">
              Register Credentials
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
