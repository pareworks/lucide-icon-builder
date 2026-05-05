import { IconConfig, DEFAULT_CONFIG } from '../types'

const KEYS: (keyof IconConfig)[] = [
  'iconName', 'themeId', 'containerColor', 'iconColor', 'containerSize',
  'radiusRatio', 'iconRatio', 'strokeWidth', 'absoluteStroke',
  'lockProportions', 'linecap', 'linejoin',
]

const SHORT: Record<keyof IconConfig, string> = {
  iconName: 'i',
  themeId: 't',
  containerColor: 'cc',
  iconColor: 'ic',
  containerSize: 's',
  radiusRatio: 'r',
  iconRatio: 'ir',
  strokeWidth: 'sw',
  absoluteStroke: 'as',
  lockProportions: 'lp',
  linecap: 'lc',
  linejoin: 'lj',
}

export const encodeConfig = (cfg: IconConfig): string => {
  const params = new URLSearchParams()
  for (const k of KEYS) {
    const v = cfg[k]
    const def = DEFAULT_CONFIG[k]
    if (v === def) continue
    let str: string
    if (typeof v === 'boolean') str = v ? '1' : '0'
    else if (typeof v === 'number') str = String(+v.toFixed(4))
    else str = String(v)
    if (k === 'containerColor' || k === 'iconColor') str = str.replace(/^#/, '')
    params.set(SHORT[k], str)
  }
  return params.toString()
}

export const decodeConfig = (search: string): Partial<IconConfig> => {
  const params = new URLSearchParams(search)
  const out: Partial<IconConfig> = {}
  for (const k of KEYS) {
    const raw = params.get(SHORT[k])
    if (raw === null) continue
    const def = DEFAULT_CONFIG[k]
    if (typeof def === 'boolean') (out as Record<string, unknown>)[k] = raw === '1'
    else if (typeof def === 'number') (out as Record<string, unknown>)[k] = parseFloat(raw)
    else if (k === 'containerColor' || k === 'iconColor')
      (out as Record<string, unknown>)[k] = raw.startsWith('#') ? raw : `#${raw}`
    else (out as Record<string, unknown>)[k] = raw
  }
  return out
}
