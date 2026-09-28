import { useEffect, useRef, useState } from 'react'
import { IconConfig, DEFAULT_CONFIG } from './types'
import { ResizableSidebar } from './components/ResizableSidebar'
import { Sidebar } from './components/Sidebar'
import { Artboard } from './components/Artboard'
import { ZoomControl, DEFAULT_ZOOM } from './components/ZoomControl'
import { encodeConfig, decodeConfig } from './lib/urlState'

const initialConfig = (): IconConfig => {
  const fromUrl = decodeConfig(window.location.hash.replace(/^#/, ''))
  return { ...DEFAULT_CONFIG, ...fromUrl }
}

export default function App() {
  const [config, setConfig] = useState<IconConfig>(initialConfig)
  const artboardRef = useRef<SVGSVGElement>(null)
  const [zoom, setZoom] = useState<number>(DEFAULT_ZOOM)

  // Sync to URL hash whenever config changes (after first paint)
  useEffect(() => {
    const encoded = encodeConfig(config)
    const next = encoded ? `#${encoded}` : ''
    if (window.location.hash !== next) {
      window.history.replaceState(null, '', `${window.location.pathname}${window.location.search}${next}`)
    }
  }, [config])

  return (
    <div className="flex h-full">
      <ResizableSidebar>
        <Sidebar config={config} setConfig={setConfig} artboardRef={artboardRef} />
      </ResizableSidebar>
      <main className="flex-1 relative dot-grid overflow-hidden" style={{ backgroundSize: `${16 * zoom / 100}px ${16 * zoom / 100}px` }}>
        <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
          <div
            style={{
              transform: `scale(${zoom / 100})`,
              transformOrigin: 'center center',
              transition: 'transform 120ms ease-out',
            }}
          >
            <Artboard ref={artboardRef} config={config} />
          </div>
        </div>
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-3 text-xs text-muted">
          <span className="tabular-nums">
            {config.containerSize} × {config.containerSize} px
          </span>
          <span className="w-px h-3 bg-line" />
          <ZoomControl value={zoom} onChange={setZoom} />
        </div>
      </main>
    </div>
  )
}
