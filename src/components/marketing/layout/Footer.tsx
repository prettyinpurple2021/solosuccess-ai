'use client'

import React from 'react';
import Link from 'next/link';

export function Footer() {

    return (
        <footer className="border-t border-neon-cyan/20 bg-dark-bg backdrop-blur-sm relative z-10 mt-auto">
            <div className="max-w-7xl mx-auto px-6 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                    <div className="col-span-1 md:col-span-2">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-6 h-6 bg-gradient-to-br from-neon-cyan to-neon-purple rounded flex items-center justify-center">
                                <span className="font-bold text-white text-xs">S</span>
                            </div>
                            <span className="font-bold text-lg tracking-tight text-white">SOLO<span className="text-neon-cyan">SUCCESS</span>_AI</span>
                        </div>
                        <p className="text-zinc-400 text-sm leading-relaxed max-w-sm">
                            The complete operating system for solopreneurs.
                            Build, optimize, and scale your business with AI-powered tools designed for innovative founders.
                        </p>
                    </div>

                    <div>
                        <h4 className="font-bold text-white mb-4">Product</h4>
                        <ul className="space-y-2 text-sm text-zinc-400">
                            <li><Link href="/features" className="hover:text-neon-cyan transition-colors">Features</Link></li>
                            <li><Link href="/pricing" className="hover:text-neon-cyan transition-colors">Pricing</Link></li>
                            <li><Link href="/signup" className="hover:text-neon-cyan transition-colors">Get Started</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold text-white mb-4">Company</h4>
                        <ul className="space-y-2 text-sm text-zinc-400">
                            <li><Link href="/about" className="hover:text-neon-cyan transition-colors">About Us</Link></li>
                            <li><Link href="/contact" className="hover:text-neon-cyan transition-colors">Contact</Link></li>
                            <li><Link href="/privacy" className="hover:text-neon-cyan transition-colors">Privacy Policy</Link></li>
                            <li><Link href="/terms" className="hover:text-neon-cyan transition-colors">Terms of Service</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="text-zinc-500 text-sm">
                        © {new Date().getFullYear()} SoloSuccess AI. All rights reserved.
                    </div>
                    <div className="flex gap-6 text-sm text-zinc-500">
                        <Link href="/privacy" className="hover:text-neon-cyan transition-colors">Privacy</Link>
                        <Link href="/terms" className="hover:text-neon-cyan transition-colors">Terms</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
