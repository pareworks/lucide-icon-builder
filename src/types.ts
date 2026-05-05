export type LineCap = 'butt' | 'round' | 'square'
export type LineJoin = 'miter' | 'round' | 'bevel'

export type IconConfig = {
  iconName: string
  themeId: string // color family id, or 'custom'
  containerColor: string // hex
  iconColor: string // hex
  containerVisible: boolean // when false, container is transparent but geometry is kept
  containerSize: number // px
  radiusRatio: number // 0-0.5 (of container size)
  iconRatio: number // 0-1 (icon size / container size)
  strokeWidth: number // px at default 24 viewBox
  absoluteStroke: boolean
  lockProportions: boolean
  linecap: LineCap
  linejoin: LineJoin
}

export const SIZE_PRESETS: { id: 'sm' | 'md' | 'lg'; label: string; size: number }[] = [
  { id: 'sm', label: 'S', size: 48 },
  { id: 'md', label: 'M', size: 64 },
  { id: 'lg', label: 'L', size: 96 },
]

export const DEFAULT_CONFIG: IconConfig = {
  iconName: 'telescope',
  themeId: 'deep-orange',
  containerColor: '#F6C7BB',
  iconColor: '#F06035',
  containerVisible: true,
  containerSize: 64,
  radiusRatio: 0.15,
  iconRatio: 0.5,
  strokeWidth: 2,
  absoluteStroke: false,
  lockProportions: true,
  linecap: 'round',
  linejoin: 'round',
}
