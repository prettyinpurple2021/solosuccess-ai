"use client"

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'

export default function ExitIntentSurvey() {
  const [open, setOpen] = useState(false)
  const [role, setRole] = useState('')
  const [goal, setGoal] = useState('')
  const [blocker, setBlocker] = useState('')
  const [email, setEmail] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    const onMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 && !submitted) setOpen(true)
    }
    window.addEventListener('mouseout', onMouseLeave)
    return () => window.removeEventListener('mouseout', onMouseLeave)
  }, [submitted])

  const submit = async () => {
    if (submitting) return
    setSubmitting(true)
    try {
      await fetch('/api/surveys/exit-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role, goal, blocker, email }),
      })
      setSubmitted(true)
      setOpen(false)
    } finally {
      setSubmitting(false)
    }
  }

  if (!open || submitted) return null

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/30 p-4">
      <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl border">
        <h3 className="text-xl font-semibold mb-2">Before you go—mind a 1‑minute survey?</h3>
        <p className="text-gray-600 mb-4">Help us tailor SoloSuccess AI for you. Totally optional.</p>
        <div className="grid grid-cols-1 gap-3">
          <input className="border rounded-lg px-3 py-2" placeholder="Your role (e.g., Solo Founder)" value={role} onChange={(e) => setRole(e.target.value)} />
          <input className="border rounded-lg px-3 py-2" placeholder="Primary goal (e.g., automate content)" value={goal} onChange={(e) => setGoal(e.target.value)} />
          <input className="border rounded-lg px-3 py-2" placeholder="Top blocker (e.g., time)" value={blocker} onChange={(e) => setBlocker(e.target.value)} />
          <input className="border rounded-lg px-3 py-2" placeholder="Email (optional)" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className="mt-4 flex gap-2 justify-end">
          <Button variant="outline" onClick={() => setOpen(false)}>Skip</Button>
          <Button onClick={submit} disabled={submitting}>{submitting ? 'Saving…' : 'Submit'}</Button>
        </div>
      </div>
    </div>
  )
}


