import { Check } from 'lucide-react'
import { PALETTE } from '../data/palette'

type Props = {
  value: string
  onChange: (themeId: string) => void
}

export const ThemePicker = ({ value, onChange }: Props) => {
  return (
    <div className="space-y-1 max-h-72 overflow-y-auto scrollbar-thin pr-1">
      {PALETTE.map((family) => {
        const bg = family.shades['100']
        const fg = family.shades['400']
        const selected = value === family.id
        return (
          <button
            key={family.id}
            type="button"
            onClick={() => onChange(family.id)}
            className={`w-full flex items-center gap-2.5 px-2 py-1.5 rounded-md transition-colors ${
              selected ? 'bg-panel-2' : 'hover:bg-panel-2/60'
            }`}
          >
            <span
              className="w-7 h-7 rounded-md flex items-center justify-center shrink-0"
              style={{ backgroundColor: bg }}
            >
              <span className="w-3 h-3 rounded-full" style={{ backgroundColor: fg }} />
            </span>
            <span className="flex-1 text-left text-sm text-white truncate">
              {family.name}
              {family.label && (
                <span className="ml-1.5 text-[10px] uppercase tracking-wider text-muted">
                  {family.label}
                </span>
              )}
            </span>
            {selected && <Check className="w-3.5 h-3.5 text-white shrink-0" />}
          </button>
        )
      })}
    </div>
  )
}
