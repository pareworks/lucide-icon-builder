import { icons as lucideIcons, LucideIcon } from 'lucide-react'
import { socialIcons, SOCIAL_ICON_NAMES, socialIconLabel } from './social'

// lucide-react exports icons keyed by PascalCase name. We expose kebab-case for URLs/UI.
export const ICON_NAMES: string[] = [...Object.keys(lucideIcons), ...SOCIAL_ICON_NAMES].sort()

const pascalToKebab = (s: string) =>
  s.replace(/([a-z0-9])([A-Z])/g, '$1-$2').replace(/([A-Z])([A-Z][a-z])/g, '$1-$2').toLowerCase()

const kebabToPascal = (s: string) =>
  s.split('-').map((p) => p.charAt(0).toUpperCase() + p.slice(1)).join('')

export const iconLabel = (pascal: string): string => socialIconLabel(pascal) ?? pascalToKebab(pascal).replace(/-/g, ' ')
export const iconSlug = (pascal: string): string => pascalToKebab(pascal)

export const getIconComponent = (name: string): LucideIcon | undefined => {
  if (socialIcons[name]) return socialIcons[name]
  if (lucideIcons[name as keyof typeof lucideIcons]) return lucideIcons[name as keyof typeof lucideIcons]
  const pascal = kebabToPascal(name) as keyof typeof lucideIcons
  return lucideIcons[pascal]
}

export const resolveIconName = (name: string): string | undefined => {
  if (socialIcons[name]) return name
  if (lucideIcons[name as keyof typeof lucideIcons]) return name
  const pascal = kebabToPascal(name)
  if (lucideIcons[pascal as keyof typeof lucideIcons]) return pascal
  return undefined
}

export const searchIcons = (query: string, limit = 200, category: 'all' | 'lucide' | 'social' = 'all'): string[] => {
  const q = query.trim().toLowerCase()
  const names = category === 'social' ? SOCIAL_ICON_NAMES
    : category === 'lucide' ? ICON_NAMES.filter((name) => !socialIcons[name]) : ICON_NAMES
  if (!q) return names.slice(0, limit)
  const out: string[] = []
  for (const name of names) {
    const slug = pascalToKebab(name)
    if (slug.includes(q) || iconLabel(name).toLowerCase().includes(q)) {
      out.push(name)
      if (out.length >= limit) break
    }
  }
  return out
}
