import { RefObject, useState } from 'react'
import { IconConfig, SIZE_PRESETS } from '../types'
import { PALETTE_BY_ID, DEFAULT_BACKGROUND_SHADE, DEFAULT_FOREGROUND_SHADE } from '../data/palette'
import { Section, Slider, Toggle, Segmented } from './controls'
import { ThemePicker } from './ThemePicker'
import { PaletteGrid } from './PaletteGrid'
import { IconPicker } from './IconPicker'
import { ExportPanel } from './ExportPanel'

type Props = {
  config: IconConfig
  setConfig: (updater: (prev: IconConfig) => IconConfig) => void
  artboardRef: RefObject<SVGSVGElement>
}

const ColorRow = ({
  label, value, onChange, onOpen, isOpen,
}: {
  label: string
  value: string
  onChange: (hex: string) => void
  onOpen: () => void
  isOpen: boolean
}) => (
  <div>
    <div className="flex items-center justify-between mb-1.5">
      <label className="text-sm text-white">{label}</label>
      <button
        type="button"
        onClick={onOpen}
        className="flex items-center gap-2 bg-panel-2 hover:bg-panel-3 px-2 py-1 rounded text-xs text-muted"
      >
        <span className="w-3.5 h-3.5 rounded-sm border border-white/10" style={{ backgroundColor: value }} />
        <span className="font-mono">{value.toUpperCase()}</span>
      </button>
    </div>
    {isOpen && (
      <div className="bg-panel-2 rounded-md p-2 mt-1">
        <PaletteGrid value={value} onChange={onChange} />
      </div>
    )}
  </div>
)

export const Sidebar = ({ config, setConfig, artboardRef }: Props) => {
  const [openColor, setOpenColor] = useState<'container' | 'icon' | null>(null)

  const setSize = (newSize: number) => {
    setConfig((prev) => {
      if (prev.lockProportions) {
        // Ratios stay; rendered px scale automatically
        return { ...prev, containerSize: newSize }
      }
      // Preserve absolute pixel values for radius and icon size
      const oldRadiusPx = prev.radiusRatio * prev.containerSize
      const oldIconPx = prev.iconRatio * prev.containerSize
      return {
        ...prev,
        containerSize: newSize,
        radiusRatio: Math.min(0.5, oldRadiusPx / newSize),
        iconRatio: Math.min(1, oldIconPx / newSize),
      }
    })
  }

  const applyTheme = (themeId: string) => {
    const family = PALETTE_BY_ID[themeId]
    if (!family) return
    setConfig((prev) => ({
      ...prev,
      themeId,
      containerColor: family.shades[DEFAULT_BACKGROUND_SHADE],
      iconColor: family.shades[DEFAULT_FOREGROUND_SHADE],
    }))
  }

  const update = <K extends keyof IconConfig>(key: K, value: IconConfig[K]) =>
    setConfig((prev) => ({ ...prev, [key]: value }))

  return (
    <aside className="w-[340px] shrink-0 bg-panel border-r border-line h-full overflow-y-auto scrollbar-thin">
      <div className="px-4 py-4 border-b border-line">
        <h1 className="text-base font-semibold text-white">Lucide Icon Builder</h1>
      </div>

      <Section title="Icon">
        <IconPicker value={config.iconName} onChange={(name) => update('iconName', name)} />
      </Section>

      <Section title="Theme">
        <ThemePicker value={config.themeId} onChange={applyTheme} />
        <p className="text-xs text-muted mt-2">Background uses the 100 shade · icon uses the 400 shade.</p>
      </Section>

      <Section title="Custom Colors">
        <Toggle
          label="Show container fill"
          checked={config.containerVisible}
          onChange={(v) => update('containerVisible', v)}
          hint="When off, the container is transparent but its size still defines the SVG bounding box for alignment."
        />
        <ColorRow
          label="Container"
          value={config.containerColor}
          onChange={(hex) => setConfig((p) => ({ ...p, containerColor: hex, themeId: 'custom' }))}
          onOpen={() => setOpenColor(openColor === 'container' ? null : 'container')}
          isOpen={openColor === 'container'}
        />
        <ColorRow
          label="Icon"
          value={config.iconColor}
          onChange={(hex) => setConfig((p) => ({ ...p, iconColor: hex, themeId: 'custom' }))}
          onOpen={() => setOpenColor(openColor === 'icon' ? null : 'icon')}
          isOpen={openColor === 'icon'}
        />
      </Section>

      <Section
        title="Size"
        action={
          <button
            type="button"
            onClick={() => update('lockProportions', !config.lockProportions)}
            className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded ${config.lockProportions ? 'bg-white text-black' : 'bg-panel-2 text-muted'}`}
            title="Lock proportions: radius, icon, and stroke scale with container size"
          >
            {config.lockProportions ? 'Locked' : 'Free'}
          </button>
        }
      >
        <Segmented
          value={
            SIZE_PRESETS.find((p) => p.size === config.containerSize)?.id ?? 'custom'
          }
          onChange={(v) => {
            if (v === 'custom') return
            const preset = SIZE_PRESETS.find((p) => p.id === v)
            if (preset) setSize(preset.size)
          }}
          options={[
            ...SIZE_PRESETS.map((p) => ({ value: p.id, label: `${p.label} ${p.size}` })),
            { value: 'custom', label: 'Custom' },
          ]}
        />
        <Slider
          label="Container size"
          value={config.containerSize}
          min={24}
          max={512}
          step={1}
          onChange={setSize}
          suffix="px"
        />
        <Slider
          label="Corner radius"
          value={Math.round(config.radiusRatio * 100)}
          min={0}
          max={50}
          step={1}
          onChange={(v) => update('radiusRatio', v / 100)}
          suffix="%"
        />
        <Slider
          label="Icon scale"
          value={Math.round(config.iconRatio * 100)}
          min={20}
          max={90}
          step={1}
          onChange={(v) => update('iconRatio', v / 100)}
          suffix="%"
        />
      </Section>

      <Section title="Stroke">
        <Slider
          label="Stroke width"
          value={config.strokeWidth}
          min={0.5}
          max={3}
          step={0.25}
          onChange={(v) => update('strokeWidth', v)}
          suffix="px"
        />
        <Toggle
          label="Absolute stroke width"
          checked={config.absoluteStroke}
          onChange={(v) => update('absoluteStroke', v)}
          hint="Lucide flag — keeps stroke at exactly this px regardless of icon scale"
        />
        <div>
          <label className="text-xs text-muted block mb-1.5">Line cap</label>
          <Segmented
            value={config.linecap}
            onChange={(v) => update('linecap', v)}
            options={[
              { value: 'butt', label: 'Butt' },
              { value: 'round', label: 'Round' },
              { value: 'square', label: 'Square' },
            ]}
          />
        </div>
        <div>
          <label className="text-xs text-muted block mb-1.5">Line join</label>
          <Segmented
            value={config.linejoin}
            onChange={(v) => update('linejoin', v)}
            options={[
              { value: 'miter', label: 'Miter' },
              { value: 'round', label: 'Round' },
              { value: 'bevel', label: 'Bevel' },
            ]}
          />
        </div>
      </Section>

      <Section title="Export">
        <ExportPanel config={config} artboardRef={artboardRef} />
      </Section>
    </aside>
  )
}
