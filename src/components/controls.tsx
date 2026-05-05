import { ReactNode } from 'react'

export const Section = ({ title, children, action }: { title: string; children: ReactNode; action?: ReactNode }) => (
  <section className="border-b border-line py-4 px-4">
    <header className="flex items-center justify-between mb-3">
      <h3 className="text-[11px] uppercase tracking-wider text-muted font-medium">{title}</h3>
      {action}
    </header>
    <div className="space-y-3">{children}</div>
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
}) => (
  <div>
    <div className="flex items-center justify-between mb-1.5">
      <label className="text-sm text-white">{label}</label>
      <span className="text-sm text-muted tabular-nums">
        {Number.isInteger(value) ? value : value.toFixed(2)}
        {suffix}
      </span>
    </div>
    <input
      type="range"
      className="w-full"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={(e) => onChange(parseFloat(e.target.value))}
    />
  </div>
)

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
  <div className="flex bg-panel-2 rounded-md p-0.5">
    {options.map((o) => (
      <button
        key={o.value}
        type="button"
        onClick={() => onChange(o.value)}
        className={`flex-1 text-xs py-1.5 rounded transition-colors ${
          value === o.value ? 'bg-panel-3 text-white' : 'text-muted hover:text-white'
        }`}
      >
        {o.label}
      </button>
    ))}
  </div>
)
