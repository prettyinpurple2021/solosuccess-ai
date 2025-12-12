import { RegisterForm } from '@/components/auth/register-form';
import Link from 'next/link';

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-[#020005] flex items-center justify-center p-4 relative overflow-hidden">
       {/* Background Effects */}
      <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[60%] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] left-[-10%] w-[60%] h-[60%] bg-pink-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0))] opacity-20 pointer-events-none" />

      <div className="w-full max-w-lg relative z-10">
        <div className="text-center mb-8">
           <h1 className="text-4xl font-bold font-boss text-transparent bg-clip-text bg-gradient-to-r from-[#FF1FAF] to-[#B621FF] mb-2 glitch-text" data-text="NEW AGENT REGISTRATION">
            NEW AGENT REGISTRATION
          </h1>
          <p className="text-gray-400 font-mono text-xs uppercase tracking-widest">
            Join the SoloSuccess Network // Secure Uplink
          </p>
        </div>

        <RegisterForm />
        
        <div className="mt-8 text-center font-mono text-xs text-gray-500">
           ALREADY HAVE CREDENTIALS? <Link href="/login" className="text-[#18FFFF] hover:neon-glow underline ml-2">ACCESS TERMINAL</Link>
        </div>
      </div>
    </div>
  );
}
