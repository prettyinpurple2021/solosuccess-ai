import React from 'react';
import { SubscriptionMetrics } from './SubscriptionMetrics';
import { Users, TrendingUp, Zap, Activity } from 'lucide-react';

export function Analytics() {
    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-2xl font-bold text-white mb-2">Platform Overview</h2>
                <p className="text-zinc-400">Real-time insights into platform performance and growth.</p>
            </div>

            {/* Key Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="glass-card p-6 rounded-xl border border-white/10">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                            <Users className="w-5 h-5 text-blue-500" />
                        </div>
                        <h3 className="text-sm font-medium text-zinc-400">Total Users</h3>
                    </div>
                    <p className="text-3xl font-bold text-white">-</p>
                    <p className="text-xs text-zinc-500 mt-1">Backend integration required</p>
                </div>

                <div className="glass-card p-6 rounded-xl border border-white/10">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                            <TrendingUp className="w-5 h-5 text-emerald-500" />
                        </div>
                        <h3 className="text-sm font-medium text-zinc-400">Active Users (30d)</h3>
                    </div>
                    <p className="text-3xl font-bold text-white">-</p>
                    <p className="text-xs text-zinc-500 mt-1">Backend integration required</p>
                </div>

                <div className="glass-card p-6 rounded-xl border border-white/10">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                            <Zap className="w-5 h-5 text-purple-500" />
                        </div>
                        <h3 className="text-sm font-medium text-zinc-400">AI Generations</h3>
                    </div>
                    <p className="text-3xl font-bold text-white">-</p>
                    <p className="text-xs text-zinc-500 mt-1">Backend integration required</p>
                </div>

                <div className="glass-card p-6 rounded-xl border border-white/10">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
                            <Activity className="w-5 h-5 text-amber-500" />
                        </div>
                        <h3 className="text-sm font-medium text-zinc-400">System Health</h3>
                    </div>
                    <p className="text-3xl font-bold text-emerald-500">Healthy</p>
                    <p className="text-xs text-zinc-500 mt-1">All systems operational</p>
                </div>
            </div>

            {/* Subscription Metrics */}
            <div>
                <h3 className="text-xl font-bold text-white mb-4">Revenue \u0026 Subscriptions</h3>
                <SubscriptionMetrics />
            </div>

            <div className="glass-card p-6 rounded-xl border border-white/10">
                <h3 className="text-lg font-semibold text-white mb-2">Feature Usage</h3>
                <p className="text-zinc-400 text-sm">
                    Additional analytics endpoints needed for feature usage tracking.
                    This section will display most-used tools, AI generations per tier, and user engagement patterns.
                </p>
            </div>
        </div>
    );
}
