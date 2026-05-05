import { IconConfig } from '../types'

// Build a clean, self-contained SVG string from a live SVG element.
// We re-serialize with xmlns and pretty whitespace stripped.
export const serializeSvg = (svg: SVGSVGElement): string => {
  const clone = svg.cloneNode(true) as SVGSVGElement
  clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg')
  if (!clone.getAttribute('xmlns:xlink')) clone.removeAttribute('xmlns:xlink')
  // Drop class attributes (only used for live preview)
  clone.removeAttribute('class')
  clone.querySelectorAll('[class]').forEach((el) => el.removeAttribute('class'))
  const xml = new XMLSerializer().serializeToString(clone)
  return xml
}

const svgToBlob = (svgString: string) => new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' })

export const downloadFile = (blob: Blob, filename: string) => {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}

export const copyText = async (text: string) => {
  await navigator.clipboard.writeText(text)
}

export const renderSvgToPngBlob = async (svgString: string, scale = 2): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const img = new Image()
    const url = URL.createObjectURL(svgToBlob(svgString))
    img.onload = () => {
      const canvas = document.createElement('canvas')
      // Read width/height from the SVG itself
      const parser = new DOMParser()
      const doc = parser.parseFromString(svgString, 'image/svg+xml')
      const root = doc.documentElement as unknown as SVGSVGElement
      const w = parseFloat(root.getAttribute('width') || '64')
      const h = parseFloat(root.getAttribute('height') || '64')
      canvas.width = w * scale
      canvas.height = h * scale
      const ctx = canvas.getContext('2d')!
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
      URL.revokeObjectURL(url)
      canvas.toBlob((blob) => {
        if (blob) resolve(blob)
        else reject(new Error('Canvas toBlob returned null'))
      }, 'image/png')
    }
    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('Failed to load SVG into image'))
    }
    img.src = url
  })
}

export const buildFilename = (cfg: IconConfig, ext: string): string => {
  const slug = cfg.iconName
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/([A-Z])([A-Z][a-z])/g, '$1-$2')
    .toLowerCase()
  const theme = cfg.themeId
  return `${slug}_${theme}.${ext}`
}

export const copyImageBlob = async (blob: Blob): Promise<void> => {
  // ClipboardItem may not be available in all browsers
  if (typeof ClipboardItem === 'undefined') {
    throw new Error('Image clipboard not supported in this browser')
  }
  await navigator.clipboard.write([new ClipboardItem({ [blob.type]: blob })])
}
