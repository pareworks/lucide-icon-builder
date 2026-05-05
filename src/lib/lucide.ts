import { icons as lucideIcons, LucideIcon } from 'lucide-react'

// lucide-react exports icons keyed by PascalCase name. We expose kebab-case for URLs/UI.
export const ICON_NAMES: string[] = Object.keys(lucideIcons).sort()

const pascalToKebab = (s: string) =>
  s.replace(/([a-z0-9])([A-Z])/g, '$1-$2').replace(/([A-Z])([A-Z][a-z])/g, '$1-$2').toLowerCase()

const kebabToPascal = (s: string) =>
  s.split('-').map((p) => p.charAt(0).toUpperCase() + p.slice(1)).join('')

export const iconLabel = (pascal: string): string => pascalToKebab(pascal).replace(/-/g, ' ')
export const iconSlug = (pascal: string): string => pascalToKebab(pascal)

export const getIconComponent = (name: string): LucideIcon | undefined => {
  if (lucideIcons[name as keyof typeof lucideIcons]) return lucideIcons[name as keyof typeof lucideIcons]
  const pascal = kebabToPascal(name) as keyof typeof lucideIcons
  return lucideIcons[pascal]
}

export const resolveIconName = (name: string): string | undefined => {
  if (lucideIcons[name as keyof typeof lucideIcons]) return name
  const pascal = kebabToPascal(name)
  if (lucideIcons[pascal as keyof typeof lucideIcons]) return pascal
  return undefined
}

export const searchIcons = (query: string, limit = 200): string[] => {
  const q = query.trim().toLowerCase()
  if (!q) return ICON_NAMES.slice(0, limit)
  const out: string[] = []
  for (const name of ICON_NAMES) {
    const slug = pascalToKebab(name)
    if (slug.includes(q)) {
      out.push(name)
      if (out.length >= limit) break
    }
  }
  return out
}
