import { useEffect, useRef, useState } from 'react'
import { Link2, Check } from 'lucide-react'
import { IconConfig, DEFAULT_CONFIG } from './types'
import { Sidebar } from './components/Sidebar'
import { Artboard } from './components/Artboard'
import { encodeConfig, decodeConfig } from './lib/urlState'
import { copyText } from './lib/exporters'

const initialConfig = (): IconConfig => {
  const fromUrl = decodeConfig(window.location.hash.replace(/^#/, ''))
  return { ...DEFAULT_CONFIG, ...fromUrl }
}

export default function App() {
  const [config, setConfig] = useState<IconConfig>(initialConfig)
  const artboardRef = useRef<SVGSVGElement>(null)
  const [shared, setShared] = useState(false)

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
      setShared(true)
      setTimeout(() => setShared(false), 1200)
    } catch {
      /* ignore */
    }
  }

  return (
    <div className="flex h-full">
      <Sidebar config={config} setConfig={setConfig} artboardRef={artboardRef} />
      <main className="flex-1 relative checker overflow-hidden">
        <button
          type="button"
          onClick={handleShare}
          className="absolute top-4 right-4 flex items-center gap-1.5 bg-panel-2/80 backdrop-blur hover:bg-panel-3 text-white text-xs px-3 py-1.5 rounded-md transition-colors border border-line"
          title="Copy a shareable link to this configuration"
        >
          {shared ? <Check className="w-3 h-3" /> : <Link2 className="w-3 h-3" />}
          {shared ? 'Link copied' : 'Share'}
        </button>
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            className="rounded-sm shadow-2xl"
            style={{
              filter: 'drop-shadow(0 8px 24px rgba(0,0,0,0.35))',
            }}
          >
            <Artboard ref={artboardRef} config={config} />
          </div>
        </div>
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-xs text-muted">
          {config.containerSize} × {config.containerSize} px
        </div>
      </main>
    </div>
  )
}
