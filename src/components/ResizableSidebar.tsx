import { ReactNode, useEffect, useRef, useState } from 'react'

const MIN_WIDTH = 300
const DEFAULT_WIDTH = 380
const maxWidth = () => Math.max(MIN_WIDTH, Math.min(560, window.innerWidth - 96))
const clampWidth = (width: number) => Math.max(MIN_WIDTH, Math.min(maxWidth(), width))

export const ResizableSidebar = ({ children }: { children: ReactNode }) => {
  const [width, setWidth] = useState(() => clampWidth(DEFAULT_WIDTH))
  const [maximum, setMaximum] = useState(maxWidth)
  const [dragging, setDragging] = useState(false)
  const panel = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const resize = () => { setMaximum(maxWidth()); setWidth((current) => clampWidth(current)) }
    window.addEventListener('resize', resize)
    return () => window.removeEventListener('resize', resize)
  }, [])

  return (
    <div ref={panel} className="resizable-sidebar" style={{ width }}>
      <div id="builder-sidebar" className="h-full">{children}</div>
      <div role="separator" tabIndex={0} aria-label="Resize side panel" aria-orientation="vertical"
        aria-controls="builder-sidebar" aria-valuemin={MIN_WIDTH} aria-valuemax={maximum}
        aria-valuenow={width} aria-valuetext={`${width} pixels`} className="sidebar-divider" data-dragging={dragging}
        title="Drag to resize. Double-click to reset."
        onPointerDown={(e) => { if (e.button !== 0) return; e.preventDefault(); e.currentTarget.focus(); e.currentTarget.setPointerCapture(e.pointerId); setDragging(true) }}
        onPointerMove={(e) => {
          if (e.currentTarget.hasPointerCapture(e.pointerId)) setWidth(clampWidth(Math.round(e.clientX - (panel.current?.getBoundingClientRect().left ?? 0))))
        }}
        onPointerUp={(e) => { if (e.currentTarget.hasPointerCapture(e.pointerId)) e.currentTarget.releasePointerCapture(e.pointerId); setDragging(false) }}
        onPointerCancel={() => setDragging(false)} onLostPointerCapture={() => setDragging(false)}
        onDoubleClick={() => setWidth(clampWidth(DEFAULT_WIDTH))}
        onKeyDown={(e) => {
          if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(e.key)) return
          e.preventDefault()
          setWidth((current) => clampWidth(e.key === 'Home' ? MIN_WIDTH : e.key === 'End' ? maximum : current + (e.key === 'ArrowRight' ? 16 : -16)))
        }}
      />
    </div>
  )
}
