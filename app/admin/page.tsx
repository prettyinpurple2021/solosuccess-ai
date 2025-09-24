'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/hooks/use-auth'
import { motion } from 'framer-motion'

type AdminStatus = {
  uptimeSeconds: number
  serverTime: string
  notifications: {
    status: { running: boolean; lastProcessedAt: string | null }
    stats: {
      pending: number
      processing: number
      completed: number
      failed: number
      cancelled: number
      total: number
    }
  }
  scraping: {
    running: boolean
    lastLoopAt: string | null
    metrics: {
      totalJobs: number
      pendingJobs: number
      runningJobs: number
      completedJobs: number
      failedJobs: number
      averageExecutionTime: number
      successRate: number
    }
  }
}

export default function AdminPage() {
  const { user, loading: authLoading } = useAuth()
  const [data, setData] = useState<AdminStatus | null>(null)
  const [flags, setFlags] = useState<{ enableNotifications: boolean; enableScraping: boolean; notifDailyCap: number; scrapingUserHourlyCap: number } | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (authLoading) return
    if (!user) {
      setError('Unauthorized')
      setLoading(false)
      return
    }
    const load = async () => {
      try {
        const res = await fetch('/api/admin/status', { cache: 'no-store' })
        if (!res.ok) throw new Error('Failed to fetch admin status')
        const json = await res.json()
        setData(json)
        const fres = await fetch('/api/admin/flags', { cache: 'no-store' })
        if (fres.ok) setFlags(await fres.json())
      } catch (e: any) {
        setError(e.message)
      } finally {
        setLoading(false)
      }
    }
    load()
    const iv = setInterval(load, 15000)
    return () => clearInterval(iv)
  }, [authLoading, user])

  if (authLoading || loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-500" />
      </div>
    )
  }

  if (!user) {
    if (typeof window !== 'undefined') window.location.href = '/signin'
    return null
  }

  if (error || !data) {
    return (
      <div className="p-6">
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-800">{error || 'Failed to load admin data'}</div>
      </div>
    )
  }

  const fmt = (n: number) => new Intl.NumberFormat().format(n)
  const pct = (n: number) => `${Math.round(n * 100)}%`

  return (
    <div className="p-6 space-y-6">
      {/* Feature Flags */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl p-6 border glass">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">Feature Flags & Budget</h2>
        </div>
        {flags && (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-lg p-4 bg-white/60 border space-y-2">
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={flags.enableNotifications} onChange={async (e) => {
                  const updated = { ...flags, enableNotifications: e.target.checked }
                  setFlags(updated)
                  await fetch('/api/admin/flags', { method: 'POST', body: JSON.stringify({ enableNotifications: e.target.checked }) })
                }} />
                Enable Notifications
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={flags.enableScraping} onChange={async (e) => {
                  const updated = { ...flags, enableScraping: e.target.checked }
                  setFlags(updated)
                  await fetch('/api/admin/flags', { method: 'POST', body: JSON.stringify({ enableScraping: e.target.checked }) })
                }} />
                Enable Scraping
              </label>
            </div>
            <div className="rounded-lg p-4 bg-white/60 border space-y-2">
              <label className="flex items-center gap-2 text-sm">
                Daily Notif Cap
                <input type="number" className="border rounded px-2 py-1 w-24" value={flags.notifDailyCap} onChange={async (e) => {
                  const v = parseInt(e.target.value || '0', 10)
                  const updated = { ...flags, notifDailyCap: v }
                  setFlags(updated)
                  await fetch('/api/admin/flags', { method: 'POST', body: JSON.stringify({ notifDailyCap: v }) })
                }} />
              </label>
              <label className="flex items-center gap-2 text-sm">
                Scrape/User Hourly Cap
                <input type="number" className="border rounded px-2 py-1 w-24" value={flags.scrapingUserHourlyCap} onChange={async (e) => {
                  const v = parseInt(e.target.value || '0', 10)
                  const updated = { ...flags, scrapingUserHourlyCap: v }
                  setFlags(updated)
                  await fetch('/api/admin/flags', { method: 'POST', body: JSON.stringify({ scrapingUserHourlyCap: v }) })
                }} />
              </label>
            </div>
          </div>
        )}
      </motion.div>
      {/* Header with holographic overlay */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl p-6 gradient-empowerment holo-overlay text-white">
        <div className="relative z-10">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="opacity-90">Health, queues, and controls</p>
        </div>
      </motion.div>

      {/* Uptime and server time */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          className="rounded-xl p-4 glass border">
          <div className="text-sm text-gray-500">Uptime</div>
          <div className="text-2xl font-bold">{fmt(data.uptimeSeconds)}s</div>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          className="rounded-xl p-4 glass border">
          <div className="text-sm text-gray-500">Server Time</div>
          <div className="text-2xl font-bold">{new Date(data.serverTime).toLocaleString()}</div>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          className="rounded-xl p-4 glass border">
          <div className="text-sm text-gray-500">Admin</div>
          <div className="text-2xl font-bold">You</div>
        </motion.div>
      </div>

      {/* Notifications */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl p-6 border glass-shine">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">Notifications</h2>
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${data.notifications.status.running ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
            {data.notifications.status.running ? 'Running' : 'Stopped'}
          </span>
        </div>
        <div className="mt-4 grid grid-cols-2 md:grid-cols-6 gap-3">
          {['pending','processing','completed','failed','cancelled','total'].map((k) => (
            <div key={k} className="rounded-lg p-3 bg-white/60 border">
              <div className="text-xs text-gray-500">{k}</div>
              <div className="text-xl font-semibold">{fmt((data.notifications.stats as any)[k])}</div>
            </div>
          ))}
        </div>
        <div className="mt-3 text-sm text-gray-600">Last processed: {data.notifications.status.lastProcessedAt ? new Date(data.notifications.status.lastProcessedAt).toLocaleString() : '—'}</div>
        {/* Recent failures */}
        <div className="mt-4">
          <RecentFailures />
        </div>
        {/* Actions */}
        <div className="mt-4 flex gap-3">
          <button onClick={async () => { if (confirm('Are you sure you want to START the notification processor?')) await fetch('/api/notifications/processor', { method: 'POST', body: JSON.stringify({ action: 'start' }) }) }} className="bold-btn">Start</button>
          <button onClick={async () => { if (confirm('Are you sure you want to STOP the notification processor?')) await fetch('/api/notifications/processor', { method: 'POST', body: JSON.stringify({ action: 'stop' }) }) }} className="bold-btn">Stop</button>
          <button onClick={async () => { if (confirm('Cleanup old jobs (>30 days)?')) await fetch('/api/notifications/jobs/cleanup', { method: 'POST', body: JSON.stringify({ days: 30 }) }) }} className="bold-btn">Cleanup</button>
        </div>
      </motion.div>

      {/* Scraping */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl p-6 border glass-shine">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">Scraping</h2>
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${data.scraping.running ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
            {data.scraping.running ? 'Running' : 'Stopped'}
          </span>
        </div>
        <div className="mt-4 grid grid-cols-2 md:grid-cols-6 gap-3">
          {([
            ['Pending', data.scraping.metrics.pendingJobs],
            ['Running', data.scraping.metrics.runningJobs],
            ['Completed', data.scraping.metrics.completedJobs],
            ['Failed', data.scraping.metrics.failedJobs],
            ['Success', pct(data.scraping.metrics.successRate)],
            ['Avg ms', fmt(data.scraping.metrics.averageExecutionTime)]
          ] as const).map(([label, value]) => (
            <div key={label} className="rounded-lg p-3 bg-white/60 border">
              <div className="text-xs text-gray-500">{label}</div>
              <div className="text-xl font-semibold">{value}</div>
            </div>
          ))}
        </div>
        <div className="mt-3 text-sm text-gray-600">Last loop: {data.scraping.lastLoopAt ? new Date(data.scraping.lastLoopAt).toLocaleString() : '—'}</div>
        {/* Recent scraping failures */}
        <div className="mt-4">
          <ScrapeFailures />
        </div>
        {/* Actions */}
        <div className="mt-4 flex gap-3">
          <button onClick={async () => { if (confirm('Start scraping scheduler?')) await fetch('/api/scraping/metrics', { method: 'POST', body: JSON.stringify({ action: 'start' }) }) }} className="bold-btn">Start</button>
          <button onClick={async () => { if (confirm('Stop scraping scheduler?')) await fetch('/api/scraping/metrics', { method: 'POST', body: JSON.stringify({ action: 'stop' }) }) }} className="bold-btn">Stop</button>
        </div>
      </motion.div>
    </div>
  )
}

function RecentFailures() {
  const [rows, setRows] = useState<any[]>([])
  useEffect(() => {
    const load = async () => {
      const res = await fetch('/api/notifications/jobs?status=failed&limit=10&offset=0', { cache: 'no-store' })
      if (res.ok) {
        const json = await res.json()
        setRows(json.jobs || [])
      }
    }
    load()
  }, [])
  if (!rows.length) return <div className="text-sm text-gray-500">No recent failures</div>
  return (
    <div className="overflow-x-auto rounded-lg border bg-white/60">
      <table className="min-w-full text-sm">
        <thead>
          <tr className="bg-gray-50">
            <th className="px-3 py-2 text-left">Job</th>
            <th className="px-3 py-2 text-left">Error</th>
            <th className="px-3 py-2 text-left">Processed</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.id} className="border-t">
              <td className="px-3 py-2">{r.id}</td>
              <td className="px-3 py-2 text-red-700">{r.error || '—'}</td>
              <td className="px-3 py-2">{r.processedAt ? new Date(r.processedAt).toLocaleString() : '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function ScrapeFailures() {
  const [rows, setRows] = useState<any[]>([])
  useEffect(() => {
    const load = async () => {
      const res = await fetch('/api/scraping/failures?limit=10', { cache: 'no-store' })
      if (res.ok) {
        const json = await res.json()
        setRows(json.items || [])
      }
    }
    load()
  }, [])
  if (!rows.length) return <div className="text-sm text-gray-500">No recent failures</div>
  return (
    <div className="overflow-x-auto rounded-lg border bg-white/60">
      <table className="min-w-full text-sm">
        <thead>
          <tr className="bg-gray-50">
            <th className="px-3 py-2 text-left">Job</th>
            <th className="px-3 py-2 text-left">Error</th>
            <th className="px-3 py-2 text-left">Completed</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.jobId} className="border-t">
              <td className="px-3 py-2">{r.jobId}</td>
              <td className="px-3 py-2 text-red-700">{r.error || '—'}</td>
              <td className="px-3 py-2">{r.completedAt ? new Date(r.completedAt).toLocaleString() : '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}


