import rawTemplateData from '../../data/templates.json'

export type TemplateDifficulty = 'beginner' | 'intermediate' | 'advanced'

export type TemplateRole = 'free_launchpad' | 'pro_accelerator' | 'empire_dominator'

export type TemplateSummary = {
  id: string
  slug: string
  title: string
  description: string
  category: string
  categoryId: string
  categoryName: string
  difficulty: TemplateDifficulty
  estimatedTime: string
  tags: string[]
  isAiGenerated?: boolean
  generatedAt?: string
  generatedBy?: string
  aiInsights?: string[]
  recommendations?: string[]
  requiredRole: TemplateRole
  isInteractive: boolean
}

export type TemplateCategoryRecord = {
  id: string
  slug: string
  name: string
  description: string
  icon: string
  color: string
  templates: TemplateSummary[]
}

type RawTemplate = {
  title: string
  description: string
  slug: string
  isInteractive?: boolean
  requiredRole: TemplateRole
  difficulty?: TemplateDifficulty
  estimatedTime?: string
  tags?: string[]
  isAiGenerated?: boolean
  generatedAt?: string
  generatedBy?: string
  aiInsights?: string[]
  recommendations?: string[]
}

type RawTemplateCategory = {
  category: string
  icon?: string
  description: string
  templates: RawTemplate[]
}

const DEFAULT_ESTIMATED_TIME = '30 minutes'
const DEFAULT_DIFFICULTY: TemplateDifficulty = 'intermediate'
const DEFAULT_COLOR = 'from-military-hot-pink to-military-blush-pink'
const DEFAULT_ICON = 'Target'

const categoryOverrides: Record<string, { slug?: string; icon?: string; color?: string }> = {
  'founder systems & self-mgmt': {
    slug: 'founder-systems',
    icon: 'Focus',
    color: 'from-purple-500 to-pink-500',
  },
  'lead gen & sales': {
    slug: 'lead-gen-sales',
    icon: 'TrendingUp',
    color: 'from-amber-500 to-orange-500',
  },
  'thinking & planning tools': {
    slug: 'thinking-planning',
    icon: 'Brain',
    color: 'from-blue-500 to-sky-500',
  },
  'content & collab': {
    slug: 'content-collab',
    icon: 'Users',
    color: 'from-emerald-500 to-teal-500',
  },
}

const toSlug = (value: string) =>
  value
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

const normalizeDifficulty = (value?: string): TemplateDifficulty => {
  if (value === 'beginner' || value === 'intermediate' || value === 'advanced') {
    return value
  }
  return DEFAULT_DIFFICULTY
}

const allTemplates: TemplateSummary[] = []

const normalizedCategories: TemplateCategoryRecord[] = (rawTemplateData as RawTemplateCategory[]).map((category) => {
  const override = categoryOverrides[category.category.toLowerCase()]
  const categorySlug = (override?.slug ?? toSlug(category.category)).replace(/^-+|-+$/g, '')
  const categoryIcon = override?.icon ?? category.icon ?? DEFAULT_ICON
  const categoryColor = override?.color ?? DEFAULT_COLOR

  const normalizedTemplates: TemplateSummary[] = category.templates.map((template) => {
    // Use original slug if provided, otherwise generate from title
    const templateSlug = template.slug || toSlug(template.title)
    const templateSummary: TemplateSummary = {
      id: templateSlug,
      slug: templateSlug,
      title: template.title,
      description: template.description,
      category: category.category,
      categoryId: categorySlug,
      categoryName: category.category,
      difficulty: normalizeDifficulty(template.difficulty),
      estimatedTime: template.estimatedTime || DEFAULT_ESTIMATED_TIME,
      tags: Array.isArray(template.tags) ? template.tags : [],
      isAiGenerated: template.isAiGenerated,
      generatedAt: template.generatedAt,
      generatedBy: template.generatedBy,
      aiInsights: Array.isArray(template.aiInsights) ? template.aiInsights : [],
      recommendations: Array.isArray(template.recommendations) ? template.recommendations : [],
      requiredRole: template.requiredRole,
      isInteractive: Boolean(template.isInteractive),
    }
    allTemplates.push(templateSummary)
    return templateSummary
  })

  return {
    id: categorySlug,
    slug: categorySlug,
    name: category.category,
    description: category.description,
    icon: categoryIcon,
    color: categoryColor,
    templates: normalizedTemplates,
  }
})

export const templateCategories = normalizedCategories
export const templateList = allTemplates

const templateLookup = new Map(templateList.map((t) => [t.slug, t]))

export function getTemplateBySlug(slug: string): TemplateSummary | null {
  return templateLookup.get(slug) ?? null
}

export function getCategoryBySlug(slug: string): TemplateCategoryRecord | null {
  return normalizedCategories.find((c) => c.slug === slug) ?? null
}

export function getTemplatesByCategory(categorySlug: string): TemplateSummary[] {
  const category = getCategoryBySlug(categorySlug)
  return category?.templates ?? []
}
