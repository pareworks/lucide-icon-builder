import { useEffect, useRef, useState } from 'react'
import { ChevronDown, Check, RotateCcw } from 'lucide-react'

export const ZOOM_LEVELS = [100, 200, 300, 400, 600, 800] as const
export const DEFAULT_ZOOM = 100
export type ZoomLevel = (typeof ZOOM_LEVELS)[number]

type Props = {
  value: number
  onChange: (zoom: number) => void
}

export const ZoomControl = ({ value, onChange }: Props) => {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const isActual = value === DEFAULT_ZOOM

  useEffect(() => {
    if (!open) return
    const onMouseDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onMouseDown)
    document.addEventListener('keydown', onEsc)
    return () => {
      document.removeEventListener('mousedown', onMouseDown)
      document.removeEventListener('keydown', onEsc)
    }
  }, [open])

  return (
    <div className="flex items-center gap-1">
      <div ref={ref} className="relative">
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="flex items-center gap-1.5 px-2 py-1 rounded bg-panel-2 hover:bg-panel-3 text-white text-xs tabular-nums"
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-label="Preview zoom"
          title={isActual ? '100% — actual pixel size of the exported icon' : `${value}% preview zoom`}
        >
          <span>{value}%</span>
          {isActual && <span className="text-muted">· Actual size</span>}
          <ChevronDown className={`w-3 h-3 text-muted transition-transform ${open ? 'rotate-180' : ''}`} />
        </button>
        {open && (
          <div
            role="listbox"
            className="absolute bottom-full mb-1 right-0 bg-panel-2 border border-line rounded-md shadow-xl z-30 py-1 min-w-[160px]"
          >
            {ZOOM_LEVELS.map((z) => {
              const selected = z === value
              const actual = z === DEFAULT_ZOOM
              return (
                <button
                  key={z}
                  type="button"
                  role="option"
                  aria-selected={selected}
                  onClick={() => {
                    onChange(z)
                    setOpen(false)
                  }}
                  className={`w-full flex items-center justify-between gap-3 px-2.5 py-1 text-xs tabular-nums transition-colors ${
                    selected ? 'bg-panel-3 text-white' : 'text-muted hover:bg-panel-3/60 hover:text-white'
                  }`}
                >
                  <span className="flex items-baseline gap-1.5">
                    <span>{z}%</span>
                    {actual && <span className="text-[10px] uppercase tracking-wider opacity-70">Actual size</span>}
                  </span>
                  {selected && <Check className="w-3 h-3 shrink-0" />}
                </button>
              )
            })}
          </div>
        )}
      </div>
      <button
        type="button"
        onClick={() => onChange(DEFAULT_ZOOM)}
        disabled={isActual}
        className="p-1.5 rounded bg-panel-2 hover:bg-panel-3 text-white transition-colors disabled:opacity-40 disabled:cursor-default disabled:hover:bg-panel-2"
        title="Reset zoom to 100% (actual size)"
        aria-label="Reset zoom to 100%"
      >
        <RotateCcw className="w-3 h-3" />
      </button>
    </div>
  )
}
