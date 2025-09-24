'use client'

import { useEffect, useState } from 'react'
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
  const [data, setData] = useState<AdminStatus | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch('/api/admin/status', { cache: 'no-store' })
        if (!res.ok) throw new Error('Failed to fetch admin status')
        const json = await res.json()
        setData(json)
      } catch (e: any) {
        setError(e.message)
      } finally {
        setLoading(false)
      }
    }
    load()
    const iv = setInterval(load, 15000)
    return () => clearInterval(iv)
  }, [])

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-500" />
      </div>
    )
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
        {/* Actions */}
        <div className="mt-4 flex gap-3">
          <button onClick={async () => { await fetch('/api/notifications/processor', { method: 'POST', body: JSON.stringify({ action: 'start' }) }) }} className="bold-btn">Start</button>
          <button onClick={async () => { await fetch('/api/notifications/processor', { method: 'POST', body: JSON.stringify({ action: 'stop' }) }) }} className="bold-btn">Stop</button>
          <button onClick={async () => { await fetch('/api/notifications/jobs/cleanup', { method: 'POST', body: JSON.stringify({ days: 30 }) }) }} className="bold-btn">Cleanup</button>
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
        {/* Actions */}
        <div className="mt-4 flex gap-3">
          <button onClick={async () => { await fetch('/api/scraping/metrics', { method: 'POST', body: JSON.stringify({ action: 'start' }) }) }} className="bold-btn">Start</button>
          <button onClick={async () => { await fetch('/api/scraping/metrics', { method: 'POST', body: JSON.stringify({ action: 'stop' }) }) }} className="bold-btn">Stop</button>
        </div>
      </motion.div>
    </div>
  )
}


