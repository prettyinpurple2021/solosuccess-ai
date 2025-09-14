"use client"

import React from 'react'
import templateData from '@/data/templates.json'
import { Card, CardContent } from '@/components/ui/card'
import { templateComponents } from './index'

export function TemplateRenderer({ slug }: { slug: string }) {
  const Component = templateComponents[slug]

  const findTemplateInJson = (s: string) => {
    for (const category of templateData as any[]) {
      const template = category.templates.find((t: any) => t.slug === s)
      if (template) {
        return {
          ...template,
          category: category.category,
          icon: category.icon,
          description: category.description,
          slug: template.slug,
          isInteractive: template.isInteractive,
          requiredRole: template.requiredRole,
          title: template.title,
        }
      }
    }
    return null
  }

  const template = findTemplateInJson(slug)

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
      {template ? <Component template={template} /> : <Component />}
    </div>
  )
}


