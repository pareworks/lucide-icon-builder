import { useEffect, useMemo, useRef, useState } from 'react'
import { ChevronRight, Search, X } from 'lucide-react'
import { Segmented } from './controls'
import { isSocialIcon } from '../lib/social'
import { searchIcons, getIconComponent, iconLabel } from '../lib/lucide'

type Props = { value: string; onChange: (name: string) => void }
const PAGE_SIZE = 96

export const IconPicker = ({ value, onChange }: Props) => {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState<'all' | 'lucide' | 'social'>(() => isSocialIcon(value) ? 'social' : 'all')
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)
  const dialog = useRef<HTMLDialogElement>(null)
  const resultsPane = useRef<HTMLDivElement>(null)
  const search = useRef<HTMLInputElement>(null)
  const results = useMemo(() => searchIcons(query, category), [query, category])
  const SelectedIcon = getIconComponent(value)

  useEffect(() => {
    if (open) { dialog.current?.showModal(); search.current?.focus() }
    else dialog.current?.close()
  }, [open])

  const resetResults = () => {
    setVisibleCount(PAGE_SIZE)
    resultsPane.current?.scrollTo({ top: 0 })
  }

  return (
    <>
      <button type="button" className="flex w-full items-center gap-3 rounded-md bg-panel-2 p-3 text-left hover:bg-panel-3"
        aria-label={`Choose icon, current: ${iconLabel(value)}`} aria-haspopup="dialog" onClick={() => setOpen(true)}>
        <span className="flex h-9 w-9 items-center justify-center rounded bg-panel-3 text-white">
          {SelectedIcon && <SelectedIcon size={22} />}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-sm text-white capitalize">{iconLabel(value)}</span>
          <span className="block text-xs text-muted mt-0.5">Browse icons &amp; logos</span>
        </span>
        <ChevronRight size={16} className="text-muted" />
      </button>
      <dialog ref={dialog} className="icon-dialog" aria-labelledby="icon-library-title"
        onCancel={() => setOpen(false)} onClose={() => setOpen(false)}
        onClick={(e) => {
          if (e.target !== e.currentTarget) return
          const rect = e.currentTarget.getBoundingClientRect()
          if (e.clientX < rect.left || e.clientX > rect.right || e.clientY < rect.top || e.clientY > rect.bottom) setOpen(false)
        }}>
        <div className="p-5 border-b border-line space-y-4">
          <div className="flex items-center justify-between">
            <h2 id="icon-library-title" className="text-base font-medium text-white">Choose an icon</h2>
            <button type="button" aria-label="Close icon library" className="p-2 rounded hover:bg-panel-3 text-muted" onClick={() => setOpen(false)}><X size={18} /></button>
          </div>
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
            <input ref={search} type="search" aria-label="Search icons" placeholder="Search by name…" value={query}
              onChange={(e) => { setQuery(e.target.value); resetResults() }}
              className="w-full rounded-md bg-panel-2 py-2.5 pl-10 pr-3 text-sm text-white placeholder:text-muted" />
          </div>
          <Segmented value={category} onChange={(next) => { setCategory(next); resetResults() }} options={[
            { value: 'all', label: 'All' }, { value: 'lucide', label: 'Lucide' }, { value: 'social', label: 'Logos' },
          ]} />
        </div>
        <div ref={resultsPane} className="icon-results scrollbar-thin">
          <p role="status" className="text-xs text-muted mb-3">{results.length.toLocaleString()} {category === 'social' ? 'logos' : 'icons'}{query ? ` matching “${query}”` : ''}</p>
          <div className="icon-grid">
            {results.slice(0, visibleCount).map((name) => {
              const Icon = getIconComponent(name)
              if (!Icon) return null
              return <button key={name} type="button" className="icon-option" aria-label={iconLabel(name)}
                aria-pressed={name === value} title={iconLabel(name)}
                onClick={() => { onChange(name); setOpen(false) }}>
                <Icon size={24} aria-hidden="true" />
                <span>{iconLabel(name)}</span>
              </button>
            })}
          </div>
          {results.length === 0 && <p className="text-sm text-muted text-center py-12">No matches. Try another name.</p>}
          {visibleCount < results.length && <button type="button" className="w-full rounded-md bg-panel-2 py-3 mt-4 text-sm text-white hover:bg-panel-3"
            onClick={() => setVisibleCount((count) => count + PAGE_SIZE)}>Show more · {Math.min(visibleCount, results.length)} of {results.length.toLocaleString()}</button>}
        </div>
      </dialog>
    </>
  )
}
