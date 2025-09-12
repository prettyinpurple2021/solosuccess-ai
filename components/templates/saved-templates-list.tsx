'use client';

import { useState } from 'react';

import { Button } from '@/components/ui/button';
import from 'next/link';

import { useTemplates } from '@/hooks/use-templates-swr';
import { SavedTemplate } from '@/lib/types';
import { Download, } from 'lucide-react';
import { Dialog, DialogContent, DialogTrigger,  } from '@/components/ui/dialog';
// Uses SavedTemplate from hook to avoid duplicate/conflicting types

export function SavedTemplatesList() {
  const [_selectedTemplate, setSelectedTemplate] = useState<SavedTemplate | null>(null);
  const { _templates: savedTemplates,   _isLoading,   _deleteTemplate,   _exportTemplate   } = useTemplates();

  const getTemplateIcon = (_slug: string) => {
    switch (slug) {
      case 'decision-dashboard':
        return '🎯';
      case 'delegation-list-builder':
        return '📋';
      case 'i-hate-this-tracker':
        return '⚠️';
      case 'quarterly-biz-review':
        return '📊';
      default:
        return '📄';
    }
  };

  const formatDate = (_dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const handleViewTemplate = (_template: SavedTemplate) => {
    setSelectedTemplate(template);
  };

  const handleDeleteTemplate = (_templateId: number) => {
    deleteTemplate(templateId);
  };

  const handleExportTemplate = (_template: SavedTemplate) => {
    exportTemplate(template);
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Saved Templates</h3>
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="text-muted-foreground mt-2">Loading templates...</p>
        </div>
      </div>
    );
  }

  if (savedTemplates.length === 0) {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Saved Templates</h3>
        <>
          <className="p-8 text-center">
            <className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h4 className="text-lg font-medium mb-2">No saved templates yet</h4>
            <p className="text-muted-foreground mb-4">
              Save your work from the templates to see them here.
            </p>
            <Button asChild>
              <href="/templates">Go to Templates</>
            </Button>
          </>
        </>
      </div>
    );
  }

  return (
    _<div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold boss-text-gradient">Saved Templates</h3>
        <span className="text-sm text-muted-foreground">{savedTemplates.length} templates</span>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {savedTemplates.map((template) => (
          <key={template.id} className="boss-card">
            <className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{getTemplateIcon(template.template_slug)}</span>
                  <div>
                    <className="text-base gradient-text-secondary">{template.title}</>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(template.created_at)}
                    </p>
                  </div>
                </div>
              </div>
            </>
            <className="pt-0">
              {template.description && (
                <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                  {template.description}
                </p>
              )}
              
              <div className="flex gap-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleViewTemplate(template)}
                    >
                      <className="w-4 h-4 mr-1" />
                      View
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                    <>
                      <className="boss-text-gradient">{template.title}</>
                      <>
                        Template data from {formatDate(template.created_at)}
                      </>
                    </>
                    <div className="space-y-4">
                      <pre className="bg-muted p-4 rounded text-sm overflow-x-auto">
                        {JSON.stringify(template.template_data, null, 2)}
                      </pre>
                    </div>
                  </DialogContent>
                </Dialog>
                
                <Button
                  variant="outline"
                  size="sm"
                  data-testid={`template-export-${template.id}`}
                  onClick={() => handleExportTemplate(template)}
                >
                  <Download className="w-4 h-4 mr-1" />
                  Export
                </Button>
                
                <Button 
                  variant="ghost" 
                  size="sm"
                  data-testid={`template-delete-${template.id}`}
                  onClick={() => handleDeleteTemplate(template.id)}
                  className="text-destructive hover:text-destructive/80"
                >
                  <className="w-4 h-4" />
                </Button>
              </div>
            </>
          </>
        ))}
      </div>
    </div>
  );
} 