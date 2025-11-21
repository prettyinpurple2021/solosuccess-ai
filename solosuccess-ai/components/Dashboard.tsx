
import React, { useState, useEffect } from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { TrendingUp, Users, ShieldAlert, Activity, ArrowUpRight, Zap, Eye, CheckCircle2, CalendarClock, ArrowRight, FileText, X, Quote } from 'lucide-react';
import { AGENTS } from '../constants';
import { AgentId, DailyBriefing, Task } from '../types';
import { generateDailyBriefing } from '../services/geminiService';
import { storageService } from '../services/storageService';

interface StatCardProps {
    label: string;
    value: string | number;
    subValue?: string;
    icon: React.ReactNode;
    color: string;
}

const StatCard: React.FC<StatCardProps> = ({ label, value, subValue, icon, color }) => (
    <div className="glass-card p-6 rounded-xl hover:border-emerald-500/30 transition-all group relative overflow-hidden">
        <div className={`absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity ${color} blur-xl`}>
            {icon}
        </div>
        <div className="flex justify-between items-start mb-4 relative z-10">
            <div className={`p-2 bg-white/5 rounded-lg border border-white/10 ${color} shadow-[0_0_15px_rgba(0,0,0,0.5)]`}>
                {icon}
            </div>
        </div>
        <div className="relative z-10">
            <div className="text-3xl font-black text-white tracking-tighter mb-1 drop-shadow-md">{value}</div>
            <div className="flex items-center justify-between">
                <div className="text-xs text-zinc-400 font-mono uppercase tracking-wide font-bold">{label}</div>
                {subValue && <div className={`text-[10px] px-2 py-0.5 rounded bg-white/5 border border-white/10 ${color}`}>{subValue}</div>}
            </div>
        </div>
    </div>
);

export const Dashboard: React.FC = () => {
    const [stats, setStats] = useState({
        intelCount: 0,
        activeTasks: 0,
        completedTasks: 0,
        totalTasks: 0,
        completionRate: 0,
        systemHealth: 98
    });
    const [feed, setFeed] = useState<any[]>([]);
    const [founderName, setFounderName] = useState('COMMANDER');
    const [chartData, setChartData] = useState<any[]>([]);

    // Briefing State
    const [briefing, setBriefing] = useState<DailyBriefing | null>(null);
    const [loadingBriefing, setLoadingBriefing] = useState(false);
    const [showBriefingModal, setShowBriefingModal] = useState(false);

    useEffect(() => {
        // PRODUCTION NOTE: Dashboard aggregates data from localStorage keys.
        // In production, this should be a server-side aggregation query or a unified API endpoint.

        const loadData = async () => {
            // Load Context
            try {
                const ctx = await storageService.getContext();
                if (ctx) {
                    setFounderName(ctx.founderName.toUpperCase());
                }
            } catch (e) { console.error(e); }

            // Load Reports
            let reports: any[] = [];
            try {
                reports = await storageService.getCompetitorReports();
            } catch (e) { console.error(e); }

            // Load Tasks
            let tasks: Task[] = [];
            try {
                tasks = await storageService.getTasks();
            } catch (e) { console.error(e); }

            // Calc Stats
            const active = tasks.filter((t) => t.status === 'in_progress').length;
            const done = tasks.filter((t) => t.status === 'done').length;
            const total = tasks.length;
            const rate = total > 0 ? Math.round((done / total) * 100) : 0;

            setStats(prev => ({
                ...prev,
                intelCount: reports.length,
                activeTasks: active,
                completedTasks: done,
                totalTasks: total,
                completionRate: rate
            }));

            // Build Feed
            const reportItems = reports.map((r: any) => ({
                id: `rep-${r.competitorName}-${r.generatedAt}`,
                type: 'INTEL',
                title: 'COMPETITOR ANALYZED',
                details: r.competitorName,
                agentId: AgentId.LEXI,
                time: new Date(r.generatedAt).getTime(),
                rawTime: r.generatedAt
            }));

            const taskItems = tasks.map((t: any) => {
                let ts = Date.now();
                if (t.createdAt) {
                    ts = new Date(t.createdAt).getTime();
                } else {
                    const parts = t.id.split('-');
                    if (parts.length > 1) ts = parseInt(parts[1]) || Date.now();
                }

                return {
                    id: t.id,
                    type: 'OPS',
                    title: t.status === 'done' ? 'TASK COMPLETED' : 'TASK CREATED',
                    details: t.title,
                    agentId: t.assignee,
                    time: ts,
                    rawTime: new Date(ts).toISOString()
                };
            });

            const combined = [...reportItems, ...taskItems]
                .sort((a, b) => b.time - a.time)
                .slice(0, 15); // Top 15 events

            setFeed(combined);

            // === GENERATE REAL CHART DATA (Burn-up) ===
            const generateChartData = () => {
                const days = 7;
                const data = [];
                const now = new Date();

                // Initialize last 7 days
                for (let i = days - 1; i >= 0; i--) {
                    const d = new Date();
                    d.setDate(now.getDate() - i);
                    const dateStr = d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });

                    // Filter tasks completed on or before this date
                    const completedCount = tasks.filter(t => {
                        if (t.status !== 'done') return false;
                        // If completedAt exists, use it. Otherwise assume it was done today (fallback)
                        const doneDate = t.completedAt ? new Date(t.completedAt) : new Date();
                        // Set to end of day for comparison
                        doneDate.setHours(0, 0, 0, 0);
                        const compareDate = new Date(d);
                        compareDate.setHours(0, 0, 0, 0);
                        return doneDate <= compareDate;
                    }).length;

                    data.push({ name: dateStr, value: completedCount });
                }
                setChartData(data);
            };

            generateChartData();

        };

        loadData();
    }, []);

    const handleGenerateBriefing = async () => {
        setLoadingBriefing(true);
        setBriefing(null);
        const data = await generateDailyBriefing();
        if (data) {
            setBriefing(data);
            setShowBriefingModal(true);
        }
        setLoadingBriefing(false);
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-700 relative">

            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-end border-b border-white/5 pb-6 gap-4">
                <div>
                    <div className="flex items-center gap-2 text-emerald-500 font-mono text-xs font-bold uppercase tracking-widest mb-2">
                        <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_#10b981]" />
                        Live Feed // Connection Established
                    </div>
                    <h2 className="text-4xl font-black text-white tracking-tighter drop-shadow-glow">MISSION CONTROL</h2>
                    <p className="text-zinc-400 mt-1">Welcome back, {founderName}. Systems operational.</p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={handleGenerateBriefing}
                        disabled={loadingBriefing}
                        className="px-4 py-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 hover:text-emerald-300 rounded border border-emerald-500/20 hover:border-emerald-500/50 flex items-center gap-2 transition-all disabled:opacity-50 shadow-[0_0_15px_rgba(16,185,129,0.1)]"
                    >
                        {loadingBriefing ? <Activity className="animate-spin" size={16} /> : <FileText size={16} />}
                        <span className="text-xs font-bold uppercase tracking-wider">
                            {loadingBriefing ? 'Compiling...' : 'Morning Brief'}
                        </span>
                    </button>
                    <div className="px-4 py-2 bg-white/5 rounded border border-white/10 flex flex-col items-end">
                        <span className="text-[10px] text-zinc-500 font-bold uppercase">Current Date</span>
                        <span className="text-xs font-mono text-white">{new Date().toLocaleDateString()}</span>
                    </div>
                </div>
            </div>

            {/* Briefing Modal Overlay */}
            {showBriefingModal && briefing && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-zinc-950 border border-zinc-700 w-full max-w-2xl rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                        {/* Modal Header */}
                        <div className="p-6 border-b border-zinc-800 flex justify-between items-center bg-zinc-900">
                            <div>
                                <div className="flex items-center gap-2 text-emerald-500 font-mono text-xs font-bold uppercase tracking-widest mb-1">
                                    <Zap size={12} fill="currentColor" /> Executive Summary
                                </div>
                                <h3 className="text-xl font-black text-white">DAILY BRIEFING // {briefing.date}</h3>
                            </div>
                            <button onClick={() => setShowBriefingModal(false)} className="text-zinc-500 hover:text-white">
                                <X size={24} />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-8 overflow-y-auto space-y-8 custom-scrollbar">

                            {/* Quote */}
                            <div className="flex gap-4 items-start">
                                <Quote className="text-zinc-600 shrink-0 rotate-180" size={24} />
                                <p className="text-lg italic text-zinc-300 font-serif leading-relaxed">"{briefing.motivationalQuote}"</p>
                            </div>

                            {/* Summary */}
                            <div className="bg-zinc-900/50 p-4 rounded border border-zinc-800">
                                <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Situation Report</h4>
                                <p className="text-zinc-200 leading-relaxed">{briefing.summary}</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Focus Points */}
                                <div>
                                    <h4 className="text-xs font-bold text-emerald-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                                        <CheckCircle2 size={14} /> Primary Objectives
                                    </h4>
                                    <ul className="space-y-3">
                                        {briefing.focusPoints.map((pt, i) => (
                                            <li key={i} className="flex items-start gap-2 text-sm text-zinc-300">
                                                <span className="text-emerald-500/50 mt-1">›</span> {pt}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {/* Threats */}
                                <div>
                                    <h4 className="text-xs font-bold text-red-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                                        <ShieldAlert size={14} /> Threat Matrix
                                    </h4>
                                    {briefing.threatAlerts.length > 0 ? (
                                        <ul className="space-y-3">
                                            {briefing.threatAlerts.map((pt, i) => (
                                                <li key={i} className="flex items-start gap-2 text-sm text-zinc-300">
                                                    <span className="text-red-500/50 mt-1">›</span> {pt}
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p className="text-sm text-zinc-500 italic">No immediate threats detected.</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="p-4 border-t border-zinc-800 bg-zinc-900/50 text-center">
                            <button onClick={() => setShowBriefingModal(false)} className="text-xs font-bold uppercase tracking-widest text-zinc-500 hover:text-white">
                                Dismiss Briefing
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* KPI Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    label="Intel Gathered"
                    value={stats.intelCount}
                    subValue="Dossiers"
                    color="text-blue-400"
                    icon={<Eye size={20} />}
                />
                <StatCard
                    label="Active Ops"
                    value={stats.activeTasks}
                    subValue="In Progress"
                    color="text-amber-400"
                    icon={<Activity size={20} />}
                />
                <StatCard
                    label="Ops Velocity"
                    value={`${stats.completionRate}%`}
                    subValue="Completion Rate"
                    color="text-emerald-400"
                    icon={<Zap size={20} />}
                />
                <StatCard
                    label="System Health"
                    value={`${stats.systemHealth}%`}
                    color="text-zinc-400"
                    icon={<ShieldAlert size={20} />}
                />
            </div>

            {/* Main Content Split */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 min-h-[400px]">

                {/* Left Column: Chart */}
                <div className="lg:col-span-2 glass-panel rounded-xl p-6 flex flex-col shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-emerald-500/5 to-transparent pointer-events-none" />
                    <div className="flex justify-between items-center mb-8 relative z-10">
                        <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                            <TrendingUp size={16} className="text-emerald-500" /> Productivity Velocity (7 Days)
                        </h3>
                        <div className="flex gap-2">
                            <span className="w-3 h-3 bg-emerald-500/20 border border-emerald-500/50 rounded-full shadow-[0_0_5px_#10b981]"></span>
                            <span className="w-3 h-3 bg-zinc-800 rounded-full"></span>
                        </div>
                    </div>

                    <div className="flex-1 w-full min-h-0 relative z-10">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData}>
                                <defs>
                                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                                <XAxis dataKey="name" stroke="#52525b" tick={{ fontSize: 10, fontFamily: 'monospace' }} tickLine={false} axisLine={false} />
                                <YAxis stroke="#52525b" tick={{ fontSize: 10, fontFamily: 'monospace' }} tickLine={false} axisLine={false} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#09090b', borderColor: 'rgba(255,255,255,0.1)', color: '#fff', borderRadius: '8px', textTransform: 'uppercase', fontSize: '12px', fontWeight: 'bold', boxShadow: '0 10px 30px -10px rgba(0,0,0,0.5)' }}
                                    itemStyle={{ color: '#10b981' }}
                                    cursor={{ stroke: '#27272a', strokeWidth: 2 }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="value"
                                    stroke="#10b981"
                                    strokeWidth={3}
                                    fillOpacity={1}
                                    fill="url(#colorValue)"
                                    animationDuration={2000}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Right Column: Activity Pulse */}
                <div className="glass-panel rounded-xl flex flex-col overflow-hidden shadow-2xl">
                    <div className="p-6 border-b border-white/5 bg-white/5">
                        <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                            <Activity size={16} className="text-amber-500" /> The Pulse
                        </h3>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 custom-scrollbar bg-black/20">
                        {feed.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-zinc-600 opacity-50">
                                <Activity size={48} strokeWidth={1} />
                                <p className="mt-4 text-xs font-mono uppercase">No Activity Detected</p>
                            </div>
                        ) : (
                            <div className="space-y-6 relative">
                                {/* Timeline Line */}
                                <div className="absolute left-4 top-2 bottom-2 w-0.5 bg-white/5"></div>

                                {feed.map((item) => {
                                    const agent = AGENTS[item.agentId as AgentId] || AGENTS[AgentId.ROXY];
                                    return (
                                        <div key={item.id} className="relative pl-10 group">
                                            {/* Timeline Dot */}
                                            <div className={`absolute left-[11px] top-1 w-2.5 h-2.5 rounded-full border-2 border-zinc-950 transition-all
                                    ${item.type === 'INTEL' ? 'bg-blue-500 group-hover:shadow-[0_0_10px_rgba(59,130,246,0.5)]' : 'bg-emerald-500 group-hover:shadow-[0_0_10px_rgba(16,185,129,0.5)]'}
                                `}></div>

                                            <div className="flex items-start justify-between gap-4">
                                                <div>
                                                    <div className={`text-[10px] font-bold uppercase tracking-wider mb-0.5
                                            ${item.type === 'INTEL' ? 'text-blue-400' : 'text-emerald-400'}
                                        `}>
                                                        {item.title}
                                                    </div>
                                                    <div className="text-sm text-zinc-300 font-medium leading-tight mb-1 group-hover:text-white transition-colors">
                                                        {item.details}
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <img src={agent.avatar} className="w-4 h-4 rounded-full grayscale opacity-70" alt="avatar" />
                                                        <span className="text-[10px] text-zinc-500 font-mono uppercase">{agent.name}</span>
                                                    </div>
                                                </div>
                                                <span className="text-[10px] text-zinc-600 font-mono shrink-0">
                                                    {new Date(item.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                    <div className="p-3 border-t border-white/5 bg-white/5 text-center">
                        <p className="text-[10px] text-zinc-500 font-mono uppercase animate-pulse">System Monitoring Active</p>
                    </div>
                </div>
            </div>
        </div>

    );
};
