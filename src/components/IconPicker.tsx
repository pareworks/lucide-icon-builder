import { useMemo, useState } from 'react'
import { Segmented } from './controls'
import { isSocialIcon } from '../lib/social'
import { Search } from 'lucide-react'
import { searchIcons, getIconComponent, iconLabel } from '../lib/lucide'

type Props = {
  value: string
  onChange: (name: string) => void
}

export const IconPicker = ({ value, onChange }: Props) => {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState<'all' | 'lucide' | 'social'>(() => isSocialIcon(value) ? 'social' : 'all')
  const results = useMemo(() => searchIcons(query, 200, category), [query, category])

  return (
    <div>
      <div className="mb-2">
        <Segmented value={category} onChange={setCategory} options={[
          { value: 'all', label: 'All' },
          { value: 'lucide', label: 'Lucide' },
          { value: 'social', label: 'Social' },
        ]} />
      </div>
      <div className="relative mb-2">
        <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted" />
        <input
          type="text"
          aria-label="Search icons"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search icons…"
          className="w-full bg-panel-2 text-sm rounded-md pl-7 pr-2 py-1.5 outline-none focus:ring-1 focus:ring-white/40 placeholder:text-muted"
        />
      </div>
      <div className="grid grid-cols-6 gap-1 max-h-44 overflow-y-auto scrollbar-thin">
        {results.map((name) => {
          const Icon = getIconComponent(name)
          if (!Icon) return null
          const selected = name === value
          return (
            <button
              key={name}
              type="button"
              onClick={() => onChange(name)}
              title={iconLabel(name)}
              aria-label={iconLabel(name)}
              aria-pressed={selected}
              className={`aspect-square flex items-center justify-center rounded transition-colors ${
                selected ? 'bg-white text-black' : 'text-muted hover:bg-panel-2 hover:text-white'
              }`}
            >
              <Icon size={16} />
            </button>
          )
        })}
        {results.length === 0 && (
          <div className="col-span-6 text-center text-xs text-muted py-4">No icons match "{query}"</div>
        )}
      </div>
      <div className="mt-2 text-xs text-muted truncate">
        Selected: <span className="text-white">{iconLabel(value)}</span>
      </div>
    </div>
  )
}
