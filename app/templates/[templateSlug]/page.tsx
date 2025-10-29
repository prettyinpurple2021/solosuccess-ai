import { notFound } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { TemplateRenderer } from '@/components/templates/template-renderer'
import { getTemplateBySlug, type TemplateSummary } from '@/lib/template-catalog'

// Force dynamic rendering to prevent auth issues during static generation
export const dynamic = 'force-dynamic'

// Edge Runtime disabled due to Node.js dependency incompatibility

// Note: generateStaticParams removed to make compatible with Edge Runtime
// All templates will be rendered dynamically

type TemplatePageProps = {
  params: Promise<{
    templateSlug: string;
  }>;
};

/**
 * Template page component that renders dynamic templates
 * Includes proper error handling and environment validation
 */
export default async function TemplatePage({ params }: TemplatePageProps) {
  const { templateSlug } = await params;

  // Get template information from JSON data
  const template: TemplateSummary | undefined = getTemplateBySlug(templateSlug);

  if (!template) {
    notFound();
  }

  return (
    <div className="container mx-auto py-8">
      <div className="rounded-xl p-[2px] SoloSuccess-gradient animate-gradient mb-6">
        <div className="rounded-xl bg-background/70 backdrop-blur-md border-2 border-purple-200 px-6 py-4">
          <h1 className="text-4xl font-bold boss-text-gradient">{template.title}</h1>
          <p className="text-lg text-muted-foreground mt-2">{template.description}</p>
          <div className="mt-4 flex space-x-2">
            <Badge variant="outline">Role: {template.requiredRole}</Badge>
            <Badge variant={template.isInteractive ? 'default' : 'secondary'}>
              {template.isInteractive ? 'Interactive' : 'Static'}
            </Badge>
          </div>
        </div>
      </div>

      <TemplateRenderer slug={template.slug} />
    </div>
  );
}