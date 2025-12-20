import { ForgotPasswordForm } from '@/components/auth/forgot-password-form';
import Link from 'next/link';

export const dynamic = 'force-dynamic'

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen bg-[#020005] flex items-center justify-center p-4 relative overflow-hidden">
       {/* Background Effects */}
      <div className="absolute top-[-20%] left-[20%] w-[60%] h-[60%] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0))] opacity-20 pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
           <h1 className="text-3xl font-bold font-boss text-transparent bg-clip-text bg-gradient-to-r from-[#18FFFF] to-[#B621FF] mb-2 glitch-text" data-text="RECOVER ACCESS">
            RECOVER ACCESS
          </h1>
          <p className="text-gray-400 font-mono text-xs uppercase tracking-widest">
            Initiate Credential Reset Protocol
          </p>
        </div>

        <ForgotPasswordForm />
        
        <div className="mt-8 text-center font-mono text-xs text-gray-500">
           REMEMBERED CREDENTIALS? <Link href="/login" className="text-[#B621FF] hover:neon-glow underline ml-2">RETURN TO LOGIN</Link>
        </div>
      </div>
    </div>
  );
}
