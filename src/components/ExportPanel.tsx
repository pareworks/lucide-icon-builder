import { useState, RefObject } from 'react'
import { Copy, Download, Check } from 'lucide-react'
import { IconConfig } from '../types'
import {
  serializeSvg, downloadFile, copyText, renderSvgToPngBlob, copyImageBlob, buildFilename,
} from '../lib/exporters'
import { Segmented } from './controls'

type Format = 'svg' | 'png'

type Props = {
  config: IconConfig
  artboardRef: RefObject<SVGSVGElement>
}

export const ExportPanel = ({ config, artboardRef }: Props) => {
  const [format, setFormat] = useState<Format>('svg')
  const [pngScale, setPngScale] = useState<1 | 2 | 3>(2)
  const [flash, setFlash] = useState<'copy' | 'download' | null>(null)
  const [error, setError] = useState<string | null>(null)

  const flashOk = (which: 'copy' | 'download') => {
    setFlash(which)
    setError(null)
    setTimeout(() => setFlash(null), 1200)
  }

  const handleCopy = async () => {
    if (!artboardRef.current) return
    try {
      const svg = serializeSvg(artboardRef.current)
      if (format === 'svg') {
        await copyText(svg)
      } else {
        const blob = await renderSvgToPngBlob(svg, pngScale)
        await copyImageBlob(blob)
      }
      flashOk('copy')
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Copy failed')
    }
  }

  const handleDownload = async () => {
    if (!artboardRef.current) return
    try {
      const svg = serializeSvg(artboardRef.current)
      if (format === 'svg') {
        const blob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' })
        downloadFile(blob, buildFilename(config, 'svg'))
      } else {
        const blob = await renderSvgToPngBlob(svg, pngScale)
        downloadFile(blob, buildFilename(config, 'png'))
      }
      flashOk('download')
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Download failed')
    }
  }

  return (
    <div className="space-y-3">
      <Segmented<Format>
        value={format}
        onChange={setFormat}
        options={[
          { value: 'svg', label: 'SVG' },
          { value: 'png', label: 'PNG' },
        ]}
      />
      {format === 'png' && (
        <Segmented
          value={String(pngScale)}
          onChange={(v) => setPngScale(parseInt(v) as 1 | 2 | 3)}
          options={[
            { value: '1', label: '1×' },
            { value: '2', label: '2×' },
            { value: '3', label: '3×' },
          ]}
        />
      )}
      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={handleCopy}
          className="flex items-center justify-center gap-1.5 bg-panel-2 hover:bg-panel-3 text-white text-sm py-2 rounded-md transition-colors"
        >
          {flash === 'copy' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
          {flash === 'copy' ? 'Copied' : 'Copy'}
        </button>
        <button
          type="button"
          onClick={handleDownload}
          className="flex items-center justify-center gap-1.5 bg-white text-black text-sm py-2 rounded-md hover:bg-white/90 transition-colors"
        >
          {flash === 'download' ? <Check className="w-3.5 h-3.5" /> : <Download className="w-3.5 h-3.5" />}
          {flash === 'download' ? 'Saved' : 'Download'}
        </button>
      </div>
      {error && <div className="text-xs text-red-400">{error}</div>}
      <p className="text-xs text-muted leading-relaxed">
        SVG: paste into Webflow's code editor, or import the file into Canva.
      </p>
    </div>
  )
}
