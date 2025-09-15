"use client"

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Mic, Sparkles, CheckCircle, AlertCircle, Wand2 } from 'lucide-react'
import VoiceInput from '@/components/ui/voice-input'
import { cn } from '@/lib/utils'

interface VoiceTaskCreatorProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCreateTask: (task: {
    title: string
    description: string
    priority: string
    due_date: string
    goal_id: string
    estimated_minutes: number
  }) => Promise<void>
  goals: Array<{
    id: string
    title: string
    category: string
  }>
}

interface ParsedTaskData {
  title?: string
  description?: string
  priority?: 'low' | 'medium' | 'high' | 'urgent'
  dueDate?: string
  estimatedTime?: number
  goalKeywords?: string[]
  confidence: number
}

export default function VoiceTaskCreator({
  open,
  onOpenChange,
  onCreateTask,
  goals
}: VoiceTaskCreatorProps) {
  const [step, setStep] = useState<'voice' | 'parse' | 'review'>('voice')
  const [voiceTranscript, setVoiceTranscript] = useState('')
  const [parsedData, setParsedData] = useState<ParsedTaskData | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  // Task form state
  const [taskForm, setTaskForm] = useState({
    title: '',
    description: '',
    priority: 'medium',
    due_date: '',
    goal_id: '',
    estimated_minutes: 30
  })

  // Reset state when dialog opens/closes
  useEffect(() => {
    if (!open) {
      setStep('voice')
      setVoiceTranscript('')
      setParsedData(null)
      setIsProcessing(false)
      setError(null)
      setTaskForm({
        title: '',
        description: '',
        priority: 'medium',
        due_date: '',
        goal_id: '',
        estimated_minutes: 30
      })
    }
  }, [open])

  // Parse voice input using AI-like logic (simplified for demo)
  const parseVoiceInput = async (transcript: string): Promise<ParsedTaskData> => {
    try {
      setIsProcessing(true)
      
      // Simple keyword-based parsing (in production, you'd use AI)
      const cleanText = transcript.toLowerCase().trim()
      
      // Extract title (first meaningful phrase)
      const titleMatch = cleanText.match(/^(.*?)(?:\s+(?:for|by|due|priority|urgent|important)|\s*$)/)
      const title = titleMatch ? titleMatch[1].trim() : transcript.slice(0, 50)
      
      // Extract priority
      let priority: ParsedTaskData['priority'] = 'medium'
      if (cleanText.includes('urgent') || cleanText.includes('asap') || cleanText.includes('immediately')) {
        priority = 'urgent'
      } else if (cleanText.includes('important') || cleanText.includes('high priority')) {
        priority = 'high'
      } else if (cleanText.includes('low priority') || cleanText.includes('when possible')) {
        priority = 'low'
      }
      
      // Extract time estimates
      let estimatedTime = 30 // default
      const timeMatch = cleanText.match(/(\d+)\s*(minute|minutes|min|hour|hours|hr)/i)
      if (timeMatch) {
        const value = parseInt(timeMatch[1])
        const unit = timeMatch[2].toLowerCase()
        estimatedTime = unit.startsWith('hour') || unit === 'hr' ? value * 60 : value
      }
      
      // Extract due date keywords
      let dueDate: string | undefined
      const today = new Date()
      if (cleanText.includes('today')) {
        dueDate = today.toISOString().split('T')[0]
      } else if (cleanText.includes('tomorrow')) {
        const tomorrow = new Date(today)
        tomorrow.setDate(today.getDate() + 1)
        dueDate = tomorrow.toISOString().split('T')[0]
      } else if (cleanText.includes('next week')) {
        const nextWeek = new Date(today)
        nextWeek.setDate(today.getDate() + 7)
        dueDate = nextWeek.toISOString().split('T')[0]
      }
      
      // Extract goal keywords
      const goalKeywords = goals
        .filter(goal => cleanText.includes(goal.title.toLowerCase()) || cleanText.includes(goal.category.toLowerCase()))
        .map(goal => goal.title)
      
      // Generate description
      const description = transcript.length > title.length + 10 
        ? transcript.slice(title.length).trim() 
        : `Task created via voice: "${transcript}"`
      
      return {
        title: title.charAt(0).toUpperCase() + title.slice(1),
        description,
        priority,
        dueDate,
        estimatedTime,
        goalKeywords,
        confidence: 0.8 // Mock confidence score
      }
    } catch (error) {
      console.error('Error parsing voice input:', error)
      throw new Error('Failed to parse voice input')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleVoiceTranscript = (transcript: string) => {
    setVoiceTranscript(transcript)
  }

  const handleFinalTranscript = async (transcript: string) => {
    if (transcript.trim().length < 5) {
      setError('Please provide more details about your task')
      return
    }
    
    try {
      setError(null)
      const parsed = await parseVoiceInput(transcript)
      setParsedData(parsed)
      
      // Auto-fill form with parsed data
      setTaskForm({
        title: parsed.title || '',
        description: parsed.description || '',
        priority: parsed.priority || 'medium',
        due_date: parsed.dueDate || '',
        goal_id: findBestMatchingGoal(parsed.goalKeywords),
        estimated_minutes: parsed.estimatedTime || 30
      })
      
      setStep('review')
    } catch (error) {
      setError('Failed to process voice input. Please try again.')
    }
  }

  const findBestMatchingGoal = (keywords?: string[]): string => {
    if (!keywords || keywords.length === 0) return ''
    
    // Find goal that best matches the keywords
    const matchingGoal = goals.find(goal => 
      keywords.some(keyword => 
        goal.title.toLowerCase().includes(keyword.toLowerCase()) ||
        goal.category.toLowerCase().includes(keyword.toLowerCase())
      )
    )
    
    return matchingGoal?.id || ''
  }

  const handleCreateTask = async () => {
    try {
      setIsProcessing(true)
      setError(null)
      
      await onCreateTask(taskForm)
      onOpenChange(false)
    } catch (error) {
      setError('Failed to create task. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleTryAgain = () => {
    setStep('voice')
    setVoiceTranscript('')
    setParsedData(null)
    setError(null)
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800 border-red-200'
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'medium': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'low': return 'bg-green-100 text-green-800 border-green-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mic className="w-5 h-5 text-purple-600" />
            Create Task with Voice
          </DialogTitle>
          <DialogDescription>
            {step === 'voice' && 'Speak naturally to create your task'}
            {step === 'parse' && 'Processing your voice input...'}
            {step === 'review' && 'Review and adjust your task details'}
          </DialogDescription>
        </DialogHeader>

        {/* Step Indicator */}
        <div className="flex items-center gap-2 mb-6">
          {(['voice', 'parse', 'review'] as const).map((stepName, index) => (
            <div key={stepName} className="flex items-center">
              <div 
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium",
                  step === stepName ? "bg-purple-600 text-white" :
                  (['voice', 'parse', 'review'] as const).indexOf(step) > index ? "bg-green-600 text-white" :
                  "bg-gray-200 text-gray-600"
                )}
              >
                {(['voice', 'parse', 'review'] as const).indexOf(step) > index ? (
                  <CheckCircle className="w-4 h-4" />
                ) : (
                  index + 1
                )}
              </div>
              {index < 2 && <div className="w-8 h-0.5 bg-gray-200 mx-2" />}
            </div>
          ))}
        </div>

        {/* Voice Input Step */}
        {step === 'voice' && (
          <div className="space-y-6">
            <VoiceInput
              onTranscript={handleVoiceTranscript}
              onFinalTranscript={handleFinalTranscript}
              placeholder="Say something like: 'Create a high priority task to review quarterly reports due tomorrow'"
              continuous={false}
              interimResults={true}
            />

            <Card className="border-dashed border-purple-200 bg-purple-50/50">
              <CardContent className="p-4">
                <div className="text-sm text-purple-800">
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    Tips for better recognition:
                  </h4>
                  <ul className="space-y-1 text-xs">
                    <li>• Include task title, priority, and deadline</li>
                    <li>• Mention time estimates ("30 minutes", "2 hours")</li>
                    <li>• Reference existing goals if applicable</li>
                    <li>• Speak clearly and at a normal pace</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {error && (
              <div className="text-sm text-red-600 bg-red-50 p-3 rounded border border-red-200 flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                {error}
              </div>
            )}
          </div>
        )}

        {/* Review Step */}
        {step === 'review' && parsedData && (
          <div className="space-y-6">
            {/* Parsed Data Summary */}
            <Card className="border-green-200 bg-green-50/50">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Wand2 className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-medium text-green-800">AI Extracted Information</span>
                  <Badge variant="outline" className="text-xs">
                    {Math.round(parsedData.confidence * 100)}% confidence
                  </Badge>
                </div>
                <div className="text-xs text-green-700">
                  <p className="mb-1">📝 Original: "{voiceTranscript}"</p>
                  <div className="flex flex-wrap gap-1">
                    <Badge className={getPriorityColor(parsedData.priority || 'medium')}>
                      {parsedData.priority || 'medium'} priority
                    </Badge>
                    {parsedData.estimatedTime && (
                      <Badge variant="outline">{parsedData.estimatedTime}min</Badge>
                    )}
                    {parsedData.dueDate && (
                      <Badge variant="outline">Due: {parsedData.dueDate}</Badge>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Editable Task Form */}
            <div className="grid gap-4">
              <div>
                <Label htmlFor="voice-task-title">Title</Label>
                <Input
                  id="voice-task-title"
                  value={taskForm.title}
                  onChange={(e) => setTaskForm({...taskForm, title: e.target.value})}
                  placeholder="Task title"
                />
              </div>

              <div>
                <Label htmlFor="voice-task-description">Description</Label>
                <Textarea
                  id="voice-task-description"
                  value={taskForm.description}
                  onChange={(e) => setTaskForm({...taskForm, description: e.target.value})}
                  placeholder="Task description"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="voice-task-priority">Priority</Label>
                  <Select 
                    value={taskForm.priority} 
                    onValueChange={(value) => setTaskForm({...taskForm, priority: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="voice-task-time">Estimated Time (minutes)</Label>
                  <Input
                    id="voice-task-time"
                    type="number"
                    value={taskForm.estimated_minutes}
                    onChange={(e) => setTaskForm({...taskForm, estimated_minutes: parseInt(e.target.value)})}
                    min="5"
                    step="5"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="voice-task-due">Due Date</Label>
                  <Input
                    id="voice-task-due"
                    type="date"
                    value={taskForm.due_date}
                    onChange={(e) => setTaskForm({...taskForm, due_date: e.target.value})}
                  />
                </div>

                <div>
                  <Label htmlFor="voice-task-goal">Goal (Optional)</Label>
                  <Select 
                    value={taskForm.goal_id} 
                    onValueChange={(value) => setTaskForm({...taskForm, goal_id: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a goal" />
                    </SelectTrigger>
                    <SelectContent>
                      {goals.map((goal) => (
                        <SelectItem key={goal.id} value={goal.id}>
                          {goal.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {error && (
              <div className="text-sm text-red-600 bg-red-50 p-3 rounded border border-red-200 flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                {error}
              </div>
            )}

            <div className="flex justify-between">
              <Button variant="outline" onClick={handleTryAgain}>
                <Mic className="w-4 h-4 mr-2" />
                Try Again
              </Button>
              <Button 
                onClick={handleCreateTask} 
                disabled={!taskForm.title || isProcessing}
              >
                {isProcessing ? 'Creating...' : 'Create Task'}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}