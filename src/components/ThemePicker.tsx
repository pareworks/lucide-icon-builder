import { useEffect, useRef, useState } from 'react'
import { Check, ChevronDown } from 'lucide-react'
import { ColorFamily, PALETTE } from '../data/palette'

type Props = {
  containerColor: string
  iconColor: string
  value: string
  onChange: (themeId: string) => void
}

const ColourPreview = ({ containerColor, iconColor }: { containerColor: string; iconColor: string }) => (
  <span className="selector-preview" style={{ backgroundColor: containerColor }} aria-hidden="true">
    <span className="w-4 h-4 rounded-full" style={{ backgroundColor: iconColor }} />
  </span>
)

const shadeLabel = (hex: string) => {
  for (const family of PALETTE) {
    const shade = Object.entries(family.shades).find(([, value]) => value.toLowerCase() === hex.toLowerCase())
    if (shade) return shade[0]
  }
  return 'custom'
}
const familyLabel = (name: string) => name.charAt(0).toUpperCase() + name.slice(1).toLowerCase()

const RowLabel = ({ family }: { family: ColorFamily }) => (
  <span className="flex-1 text-left text-sm text-white truncate">
    {familyLabel(family.name)}
    {family.label && (
      <span className="ml-1.5 text-xs text-muted">
        {family.label}
      </span>
    )}
  </span>
)

export const ThemePicker = ({ value, onChange, containerColor, iconColor }: Props) => {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  const current = PALETTE.find((f) => f.id === value)

  useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    document.addEventListener('keydown', onEsc)
    return () => {
      document.removeEventListener('mousedown', handler)
      document.removeEventListener('keydown', onEsc)
    }
  }, [open])

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="selector-button"
        aria-label="Theme"
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <ColourPreview containerColor={containerColor} iconColor={iconColor} />
        <span className="flex-1 min-w-0 text-left">
          <span className="block text-sm text-white truncate">{current ? familyLabel(current.name) : 'Custom colours'}</span>
          <span className="block text-xs text-muted mt-1">Container {shadeLabel(containerColor)}, icon {shadeLabel(iconColor)}</span>
        </span>
        <ChevronDown
          className={`w-3.5 h-3.5 text-muted shrink-0 transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && (
        <div
          role="listbox"
          className="absolute top-full left-0 right-0 mt-1 bg-panel-2 rounded-md shadow-xl z-30 max-h-72 overflow-y-auto scrollbar-thin"
        >
          <div className="p-1 space-y-0.5">
            {PALETTE.map((family) => {
              const selected = family.id === value
              return (
                <button
                  key={family.id}
                  type="button"
                  role="option"
                  aria-selected={selected}
                  onClick={() => {
                    onChange(family.id)
                    setOpen(false)
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-3 rounded transition-colors ${
                    selected ? 'bg-panel-3' : 'hover:bg-panel-3/60'
                  }`}
                >
                  <ColourPreview containerColor={family.shades['50']} iconColor={family.shades['400']} />
                  <RowLabel family={family} />
                  {selected && <Check className="w-3.5 h-3.5 text-white shrink-0" />}
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
