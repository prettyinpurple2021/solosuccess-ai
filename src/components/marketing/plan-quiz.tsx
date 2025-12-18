"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'

export default function PlanQuiz() {
  const [answers, setAnswers] = useState({ team: 'solo', automation: 'low', budget: 'low' })
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const recommend = () => {
    if (answers.automation === 'high' || answers.team !== 'solo') return 'Dominator'
    if (answers.automation === 'medium') return 'Accelerator'
    return 'Launch'
  }

  const submit = async () => {
    await fetch('/api/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ event_name: 'quiz_submit', metadata: { answers, recommended: recommend() }, path: '/pricing' }),
    })
    if (email) {
      await fetch('/api/newsletter', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, source: 'plan_quiz' }) })
    }
    setSubmitted(true)
  }

  if (submitted) {
    const rec = recommend()
    const href = rec === 'Launch' ? '/pricing/launch' : rec === 'Accelerator' ? '/pricing/accelerator' : '/pricing/dominator'
    return (
      <div className="rounded-xl border p-6 bg-white">
        <div className="text-lg font-semibold">Recommended plan: {rec}</div>
        <a className="text-purple-600 underline" href={href}>Go to {rec}</a>
      </div>
    )
  }

  return (
    <div className="rounded-xl border p-6 bg-white">
      <div className="text-lg font-semibold mb-3">Which plan fits you?</div>
      <div className="grid gap-3">
        <label className="sr-only" htmlFor="quiz-team">Team size</label>
        <select id="quiz-team" aria-label="Team size" className="border rounded-lg px-3 py-2" value={answers.team} onChange={(e) => setAnswers(a => ({ ...a, team: e.target.value }))}>
          <option value="solo">I work solo</option>
          <option value="small">Small team</option>
        </select>
        <label className="sr-only" htmlFor="quiz-automation">Automation needs</label>
        <select id="quiz-automation" aria-label="Automation needs" className="border rounded-lg px-3 py-2" value={answers.automation} onChange={(e) => setAnswers(a => ({ ...a, automation: e.target.value }))}>
          <option value="low">Automation needs: low</option>
          <option value="medium">Automation needs: medium</option>
          <option value="high">Automation needs: high</option>
        </select>
        <label className="sr-only" htmlFor="quiz-budget">Budget</label>
        <select id="quiz-budget" aria-label="Budget" className="border rounded-lg px-3 py-2" value={answers.budget} onChange={(e) => setAnswers(a => ({ ...a, budget: e.target.value }))}>
          <option value="low">Budget: lean</option>
          <option value="medium">Budget: growing</option>
          <option value="high">Budget: flexible</option>
        </select>
        <input className="border rounded-lg px-3 py-2" type="email" placeholder="Email for your plan guide (optional)" value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>
      <div className="mt-3 flex justify-end">
        <Button onClick={submit}>Get Recommendation</Button>
      </div>
    </div>
  )
}


