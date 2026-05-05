import { PALETTE, SHADES } from '../data/palette'

type Props = {
  value: string
  onChange: (hex: string) => void
}

export const PaletteGrid = ({ value, onChange }: Props) => {
  const norm = value.toUpperCase()
  return (
    <div className="space-y-1">
      {PALETTE.map((family) => (
        <div key={family.id} className="flex items-center gap-2">
          <div className="w-16 shrink-0 text-[10px] text-muted truncate">{family.name}</div>
          <div className="flex gap-0.5 flex-1">
            {SHADES.map((s) => {
              const hex = family.shades[s].toUpperCase()
              const selected = hex === norm
              return (
                <button
                  key={s}
                  type="button"
                  onClick={() => onChange(family.shades[s])}
                  title={`${family.name} ${s} — ${family.shades[s]}`}
                  className={`flex-1 aspect-square rounded-sm transition-transform ${selected ? 'ring-2 ring-white scale-110 z-10 relative' : 'hover:scale-105'}`}
                  style={{ backgroundColor: family.shades[s] }}
                />
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}
