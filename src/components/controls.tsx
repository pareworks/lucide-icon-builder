import { ReactNode, useId, useState } from 'react'

export const Section = ({ title, children, action }: { title: string; children: ReactNode; action?: ReactNode }) => (
  <section className="py-6 px-6">
    <header className="flex items-center justify-between mb-4">
      <h3 className="text-sm text-muted font-medium">{title}</h3>
      {action}
    </header>
    <div className="space-y-4">{children}</div>
  </section>
)

export const Slider = ({
  label, value, min, max, step = 1, onChange, suffix,
}: {
  label: string
  value: number
  min: number
  max: number
  step?: number
  onChange: (v: number) => void
  suffix?: string
}) => {
  const id = useId()
  const [draft, setDraft] = useState<string | null>(null)
  const [dragging, setDragging] = useState(false)
  const position = Math.max(0, Math.min(100, (value - min) / (max - min) * 100))
  const update = (next: number) => {
    if (!Number.isFinite(next)) return
    const snapped = min + Math.round((next - min) / step) * step
    const nextValue = Number(Math.max(min, Math.min(max, snapped)).toFixed(4))
    if (nextValue !== value) onChange(nextValue)
  }
  const commit = () => {
    if (draft !== null && draft.trim()) update(Number(draft))
    setDraft(null)
  }
  return (
    <div className="integrated-slider" data-dragging={dragging}>
      <span className="slider-fill" aria-hidden="true" style={{ width: `${position}%` }} />
      <span className="slider-ticks" aria-hidden="true">
        {Array.from({ length: 9 }, (_, i) => <i key={i} style={{ left: `${(i + 1) * 10}%` }} />)}
      </span>
      <span className="slider-grip" aria-hidden="true" style={{ left: `clamp(4px, ${position}%, calc(100% - 6px))` }} />
      <label htmlFor={id}>{label}</label>
      <input id={id} type="range" min={min} max={max} step={step} value={value}
        aria-valuetext={`${value}${suffix ?? ''}`}
        onPointerDown={(e) => { setDragging(true); e.currentTarget.setPointerCapture(e.pointerId) }}
        onPointerUp={() => setDragging(false)} onPointerCancel={() => setDragging(false)}
        onLostPointerCapture={() => setDragging(false)}
        onChange={(e) => update(e.target.valueAsNumber)} />
      <span className="slider-value">
        <input type="number" aria-label={`${label}, exact value`} min={min} max={max} step={step}
          value={draft ?? value} onFocus={() => setDraft(String(value))}
          onChange={(e) => setDraft(e.target.value)} onBlur={commit}
          onKeyDown={(e) => {
            if (e.key === 'Enter') e.currentTarget.blur()
            if (e.key === 'Escape') { e.preventDefault(); setDraft(String(value)); e.currentTarget.select() }
          }} />
        <span aria-hidden="true">{suffix}</span>
      </span>
    </div>
  )
}

export const Toggle = ({ label, checked, onChange, hint }: { label: string; checked: boolean; onChange: (v: boolean) => void; hint?: string }) => (
  <div className="flex items-start justify-between gap-3 py-1">
    <div className="min-w-0">
      <div className="text-sm text-white">{label}</div>
      {hint && <div className="text-xs text-muted mt-0.5">{hint}</div>}
    </div>
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`shrink-0 w-9 h-5 rounded-full transition-colors relative ${checked ? 'bg-white' : 'bg-panel-3'}`}
      aria-label={label}
      aria-pressed={checked}
    >
      <span className={`absolute top-0.5 w-4 h-4 rounded-full transition-all ${checked ? 'bg-black left-[18px]' : 'bg-white left-0.5'}`} />
    </button>
  </div>
)

export const Segmented = <T extends string>({
  value, options, onChange,
}: {
  value: T
  options: { value: T; label: string }[]
  onChange: (v: T) => void
}) => (
  <div className="flex bg-panel-2 rounded-md">
    {options.map((o) => (
      <button
        key={o.value}
        type="button"
        onClick={() => onChange(o.value)}
        aria-pressed={value === o.value}
        className={`flex-1 text-xs py-2.5 rounded-md transition-colors ${
          value === o.value ? 'bg-panel-3 text-white' : 'text-muted hover:text-white'
        }`}
      >
        {o.label}
      </button>
    ))}
  </div>
)
