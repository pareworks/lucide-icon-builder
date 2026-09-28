import { PALETTE, SHADES } from '../data/palette'

type Props = { value: string; onChange: (hex: string) => void }

export const PaletteGrid = ({ value, onChange }: Props) => (
  <div className="palette-grid">
    <div className="palette-row palette-heading" aria-hidden="true">
      <span />{SHADES.map((shade) => <span key={shade}>{shade}</span>)}
    </div>
    {PALETTE.map((family) => (
      <div key={family.id} className="palette-row">
        <span className="palette-family">{family.name.charAt(0) + family.name.slice(1).toLowerCase()}</span>
        {SHADES.map((shade) => {
          const hex = family.shades[shade]
          const selected = hex.toLowerCase() === value.toLowerCase()
          return <button key={shade} type="button" className="palette-swatch" aria-pressed={selected}
            aria-label={`${family.name} ${shade}, ${hex}`} title={`${family.name} ${shade} · ${hex}`}
            style={{ backgroundColor: hex }} onClick={() => onChange(hex)} />
        })}
      </div>
    ))}
  </div>
)
