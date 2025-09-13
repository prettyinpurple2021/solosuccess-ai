"use client"

import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { templateComponents } from './index'

export function TemplateRenderer({ slug }: { slug: string }) {
  const Component = templateComponents[slug]

  if (!Component) {
    return (
      <Card className="boss-card">
        <CardContent className="p-6">
          <p className="text-muted-foreground">
            This template does not have an interactive component yet.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="mt-6">
      <Component />
    </div>
  )
}


