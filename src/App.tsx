import { useEffect, useRef, useState } from 'react'
import { Link2, Check, AlertCircle } from 'lucide-react'
import { IconConfig, DEFAULT_CONFIG } from './types'
import { Sidebar } from './components/Sidebar'
import { Artboard } from './components/Artboard'
import { ZoomControl, DEFAULT_ZOOM } from './components/ZoomControl'
import { encodeConfig, decodeConfig } from './lib/urlState'
import { copyText } from './lib/exporters'

type ShareState = 'idle' | 'copied' | 'error'

const initialConfig = (): IconConfig => {
  const fromUrl = decodeConfig(window.location.hash.replace(/^#/, ''))
  return { ...DEFAULT_CONFIG, ...fromUrl }
}

export default function App() {
  const [config, setConfig] = useState<IconConfig>(initialConfig)
  const artboardRef = useRef<SVGSVGElement>(null)
  const [shareState, setShareState] = useState<ShareState>('idle')
  const [zoom, setZoom] = useState<number>(DEFAULT_ZOOM)

  // Sync to URL hash whenever config changes (after first paint)
  useEffect(() => {
    const encoded = encodeConfig(config)
    const next = encoded ? `#${encoded}` : ''
    if (window.location.hash !== next) {
      window.history.replaceState(null, '', `${window.location.pathname}${window.location.search}${next}`)
    }
  }, [config])

  const handleShare = async () => {
    const url = `${window.location.origin}${window.location.pathname}${window.location.search}#${encodeConfig(config)}`
    try {
      await copyText(url)
      setShareState('copied')
      setTimeout(() => setShareState('idle'), 1500)
    } catch (e) {
      console.error('Share failed:', e)
      setShareState('error')
      setTimeout(() => setShareState('idle'), 2500)
      // Last-resort fallback so the user can still copy manually
      window.prompt('Copy this link to share:', url)
    }
  }

  return (
    <div className="flex h-full">
      <Sidebar config={config} setConfig={setConfig} artboardRef={artboardRef} />
      <main className="flex-1 relative checker overflow-hidden">
        <button
          type="button"
          onClick={handleShare}
          className={`absolute top-4 right-4 flex items-center gap-1.5 backdrop-blur text-white text-xs px-3 py-1.5 rounded-md transition-colors border ${
            shareState === 'error'
              ? 'bg-red-500/20 hover:bg-red-500/30 border-red-500/40'
              : 'bg-panel-2/80 hover:bg-panel-3 border-line'
          }`}
          title="Copy a shareable link to this configuration"
        >
          {shareState === 'copied' && <Check className="w-3 h-3" />}
          {shareState === 'error' && <AlertCircle className="w-3 h-3" />}
          {shareState === 'idle' && <Link2 className="w-3 h-3" />}
          {shareState === 'copied' && 'Link copied'}
          {shareState === 'error' && 'Copy failed'}
          {shareState === 'idle' && 'Share'}
        </button>
        <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
          <div
            className="rounded-sm shadow-2xl"
            style={{
              transform: `scale(${zoom / 100})`,
              transformOrigin: 'center center',
              transition: 'transform 120ms ease-out',
              filter: 'drop-shadow(0 8px 24px rgba(0,0,0,0.35))',
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
