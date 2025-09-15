"use client"

import { SimpleAuth} from "@/components/auth/simple-auth";

// Disable static generation for auth pages
export const dynamic = 'force-dynamic';

export default function SignUpPage() {
  return <SimpleAuth />;
}
