"use client"

import { logger, logError, logWarn, logInfo, logDebug, logApi, logDb, logAuth } from '@/lib/logger'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/use-auth'


export default function ExitIntentSurvey() {
  const [open, setOpen] = useState(false)
  const [role, setRole] = useState('')
  const [goal, setGoal] = useState('')
  const [blocker, setBlocker] = useState('')
  const [email, setEmail] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [dismissed, setDismissed] = useState(false)
  const [canShow, setCanShow] = useState(false)
  const [statusChecked, setStatusChecked] = useState(false)
  const { getToken } = useAuth()

  // Check survey status from database on mount
  useEffect(() => {
    const checkSurveyStatus = async () => {
      try {
        const token = await getToken()
        const headers: HeadersInit = {
          'Content-Type': 'application/json',
        }
        if (token) {
          headers.Authorization = `Bearer ${token}`
        }
        
        const response = await fetch('/api/surveys/exit-intent', {
          method: 'GET',
          headers,
        })
        
        if (response.ok) {
          const data = await response.json()
          const { status, canShow: serverCanShow } = data
          
          if (status === 'submitted') {
            setSubmitted(true)
            setCanShow(false)
          } else if (status === 'dismissed') {
            setDismissed(true)
            setCanShow(false)
          } else if (serverCanShow) {
            // Add 3-second delay before survey can show for new users
            const timer = setTimeout(() => {
              setCanShow(true)
            }, 3000)
            setStatusChecked(true)
            return () => clearTimeout(timer)
          }
        }
        setStatusChecked(true)
      } catch (error) {
        logError('Failed to check survey status:', error)
        // On error, still allow survey after delay for anonymous users
        const timer = setTimeout(() => {
          setCanShow(true)
        }, 3000)
        setStatusChecked(true)
        return () => clearTimeout(timer)
      }
    }
    
    checkSurveyStatus()
  }, [getToken])

  useEffect(() => {
    // Don't show survey if user already submitted, dismissed, not ready yet, or status not checked
    if (submitted || dismissed || !canShow || !statusChecked) return
    
    const onMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 && !submitted && !dismissed && canShow && statusChecked) {
        setOpen(true)
      }
    }
    
    window.addEventListener('mouseout', onMouseLeave)
    return () => window.removeEventListener('mouseout', onMouseLeave)
  }, [submitted, dismissed, canShow, statusChecked])

  const submit = async () => {
    if (submitting) return
    setSubmitting(true)
    try {
      const token = await getToken()
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      }
      if (token) {
        headers.Authorization = `Bearer ${token}`
      }
      
      const response = await fetch('/api/surveys/exit-intent', {
        method: 'POST',
        headers,
        body: JSON.stringify({ role, goal, blocker, email }),
      })
      
      if (response.ok) {
        setSubmitted(true)
        setOpen(false)
      } else {
        logError('Failed to submit survey: Server error')
        // Even if submission fails, mark as submitted to avoid repeated attempts
        setSubmitted(true)
        setOpen(false)
      }
    } catch (error) {
      logError('Failed to submit survey:', error)
      // Even if submission fails, mark as submitted to avoid repeated attempts
      setSubmitted(true)
      setOpen(false)
    } finally {
      setSubmitting(false)
    }
  }

  const handleSkip = async () => {
    try {
      const token = await getToken()
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      }
      if (token) {
        headers.Authorization = `Bearer ${token}`
      }
      
      await fetch('/api/surveys/exit-intent', {
        method: 'POST',
        headers,
        body: JSON.stringify({ action: 'dismiss' }),
      })
      
      setDismissed(true)
      setOpen(false)
    } catch (error) {
      logError('Failed to dismiss survey:', error)
      // Even if API call fails, still dismiss locally
      setDismissed(true)
      setOpen(false)
    }
  }

  if (!open || submitted || dismissed) return null

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
          <Button variant="outline" onClick={handleSkip}>Skip</Button>
          <Button onClick={submit} disabled={submitting}>{submitting ? 'Saving…' : 'Submit'}</Button>
        </div>
      </div>
    </div>
  )
}


