import { LoginForm } from '@/components/auth/login-form';
import { Suspense } from 'react';

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#020005] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-600/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-cyan-600/20 rounded-full blur-[120px] pointer-events-none" />

      {/* Grid Overlay */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-20 pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold font-boss text-transparent bg-clip-text bg-gradient-to-r from-[#B621FF] to-[#18FFFF] mb-2 glitch-text" data-text="SOLOSUCCESS AI">
            SOLOSUCCESS AI
          </h1>
          <p className="text-gray-400 font-mono text-sm tracking-wider uppercase">
            System Access Portal
          </p>
        </div>
        
        <Suspense fallback={<div className="text-cyan-400 text-center animate-pulse">Initializing Security Protocols...</div>}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
