import { useEffect, useId, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'
import { PaletteGrid } from './PaletteGrid'

type Props = { label: string; value: string; onChange: (hex: string) => void }

export const ColorPicker = ({ label, value, onChange }: Props) => {
  const [open, setOpen] = useState(false)
  const [position, setPosition] = useState({ left: 0, top: 0, transformOrigin: 'left center' })
  const trigger = useRef<HTMLButtonElement>(null)
  const panel = useRef<HTMLDivElement>(null)
  const id = useId()
  const close = () => { setOpen(false); trigger.current?.focus() }

  useLayoutEffect(() => {
    if (panel.current) panel.current.inert = !open
    if (!open) return
    const place = () => {
      if (!trigger.current || !panel.current) return
      const anchor = trigger.current.getBoundingClientRect()
      const sidebar = trigger.current.closest('aside')!.getBoundingClientRect()
      const bounds = { width: panel.current.offsetWidth, height: panel.current.offsetHeight }
      const beside = sidebar.right + 12
      const left = beside + bounds.width <= window.innerWidth - 16
        ? beside : Math.max(16, window.innerWidth - bounds.width - 16)
      const top = Math.max(16, Math.min(anchor.top, window.innerHeight - bounds.height - 16))
      setPosition({ left, top, transformOrigin: `${Math.max(0, Math.min(bounds.width, anchor.right - left))}px ${Math.max(0, Math.min(bounds.height, anchor.top + anchor.height / 2 - top))}px` })
    }
    place()
    window.addEventListener('resize', place)
    window.addEventListener('scroll', place, true)
    const observer = new ResizeObserver(place)
    observer.observe(trigger.current!.closest('aside')!)
    return () => {
      window.removeEventListener('resize', place)
      window.removeEventListener('scroll', place, true)
      observer.disconnect()
    }
  }, [open])

  useEffect(() => {
    if (!open) return
    const selected = panel.current?.querySelector<HTMLButtonElement>('[aria-pressed="true"]')
      ?? panel.current?.querySelector<HTMLButtonElement>('.palette-swatch')
    selected?.focus({ preventScroll: true })
    const outside = (e: PointerEvent) => {
      if (!panel.current?.contains(e.target as Node) && !trigger.current?.contains(e.target as Node)) setOpen(false)
    }
    const escape = (e: KeyboardEvent) => { if (e.key === 'Escape') { e.preventDefault(); close() } }
    document.addEventListener('pointerdown', outside)
    document.addEventListener('keydown', escape)
    return () => { document.removeEventListener('pointerdown', outside); document.removeEventListener('keydown', escape) }
  }, [open])

  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-sm text-white">{label}</span>
      <button ref={trigger} type="button" className="colour-trigger" aria-label={`${label} colour, ${value}`}
        aria-expanded={open} aria-haspopup="dialog" aria-controls={open ? id : undefined} onClick={() => setOpen((v) => !v)}>
        <span className="w-5 h-5 rounded shrink-0" style={{ backgroundColor: value }} />
        <span className="font-mono text-sm">{value.toUpperCase()}</span>
      </button>
      {createPortal(
        <div ref={panel} id={id} role="dialog" data-open={open} aria-hidden={!open} aria-label={`${label} colour`} className="colour-popover" style={position}>
          <header className="flex items-center justify-between px-5 py-4">
            <h2 className="text-sm font-medium">{label} colour</h2>
            <button type="button" aria-label="Close colour picker" className="p-2 rounded hover:bg-panel-3" onClick={close}><X size={16} /></button>
          </header>
          <div className="colour-palette-scroll scrollbar-thin"><PaletteGrid value={value} onChange={onChange} /></div>
        </div>, document.body,
      )}
    </div>
  )
}
