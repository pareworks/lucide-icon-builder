import { useEffect, useRef, useState } from 'react'
import { Check, ChevronDown } from 'lucide-react'
import { ColorFamily, PALETTE } from '../data/palette'

type Props = {
  value: string
  onChange: (themeId: string) => void
}

const Swatch = ({ family }: { family: ColorFamily }) => (
  <span
    className="w-7 h-7 rounded-md flex items-center justify-center shrink-0"
    style={{ backgroundColor: family.shades['100'] }}
  >
    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: family.shades['400'] }} />
  </span>
)

const RowLabel = ({ family }: { family: ColorFamily }) => (
  <span className="flex-1 text-left text-sm text-white truncate">
    {family.name}
    {family.label && (
      <span className="ml-1.5 text-[10px] uppercase tracking-wider text-muted">
        {family.label}
      </span>
    )}
  </span>
)

export const ThemePicker = ({ value, onChange }: Props) => {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  const current = PALETTE.find((f) => f.id === value) ?? PALETTE[0]

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
        className="w-full flex items-center gap-2.5 px-2 py-1.5 rounded-md bg-panel-2 hover:bg-panel-3 transition-colors"
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <Swatch family={current} />
        <RowLabel family={current} />
        <ChevronDown
          className={`w-3.5 h-3.5 text-muted shrink-0 transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && (
        <div
          role="listbox"
          className="absolute top-full left-0 right-0 mt-1 bg-panel-2 border border-line rounded-md shadow-xl z-30 max-h-72 overflow-y-auto scrollbar-thin"
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
                  className={`w-full flex items-center gap-2.5 px-2 py-1.5 rounded transition-colors ${
                    selected ? 'bg-panel-3' : 'hover:bg-panel-3/60'
                  }`}
                >
                  <Swatch family={family} />
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
