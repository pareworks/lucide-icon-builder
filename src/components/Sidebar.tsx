import { RefObject, useState } from 'react'
import { IconConfig, SIZE_PRESETS, DEFAULT_CONFIG } from '../types'
import { PALETTE_BY_ID, DEFAULT_BACKGROUND_SHADE, DEFAULT_FOREGROUND_SHADE } from '../data/palette'
import { Section, Slider, Toggle, Segmented } from './controls'
import { ThemePicker } from './ThemePicker'
import { isSocialIcon } from '../lib/social'
import { ColorPicker } from './ColorPicker'
import { IconPicker } from './IconPicker'
import { ExportPanel } from './ExportPanel'

type Props = {
  config: IconConfig
  setConfig: (updater: (prev: IconConfig) => IconConfig) => void
  artboardRef: RefObject<SVGSVGElement>
}

export const Sidebar = ({ config, setConfig, artboardRef }: Props) => {
  const [activePreset, setActivePreset] = useState<string>(() =>
    config.radiusRatio === DEFAULT_CONFIG.radiusRatio && config.iconRatio === DEFAULT_CONFIG.iconRatio
      && config.strokeWidth === DEFAULT_CONFIG.strokeWidth
      ? SIZE_PRESETS.find((p) => p.size === config.containerSize)?.id ?? '' : '')

  const setSize = (containerSize: number) => {
    setActivePreset('')
    setConfig((prev) => ({ ...prev, containerSize, lockProportions: true }))
  }

  const updateSlider = (key: 'radiusRatio' | 'iconRatio' | 'strokeWidth', value: number) => {
    setActivePreset('')
    setConfig((prev) => ({ ...prev, [key]: value }))
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
    <aside className="w-full bg-panel h-full overflow-y-auto scrollbar-thin">
      <Section title="Icon">
        <IconPicker containerColor={config.containerColor} iconColor={config.iconColor} containerVisible={config.containerVisible} value={config.iconName} onChange={(name) => update('iconName', name)} />
      </Section>

      <Section title="Theme">
        <ThemePicker containerColor={config.containerColor} iconColor={config.iconColor} value={config.themeId} onChange={applyTheme} />
      </Section>

      <Section title="Custom colours">
        <Toggle
          label="Show container fill"
          checked={config.containerVisible}
          onChange={(v) => update('containerVisible', v)}
        />
        <ColorPicker
          label="Container"
          value={config.containerColor}
          onChange={(hex) => setConfig((p) => ({ ...p, containerColor: hex, themeId: 'custom' }))}
        />
        <ColorPicker
          label="Icon"
          value={config.iconColor}
          onChange={(hex) => setConfig((p) => ({ ...p, iconColor: hex, themeId: 'custom' }))}
        />
      </Section>

      <Section title="Size">
        <Segmented
          value={activePreset}
          onChange={(id) => {
            const preset = SIZE_PRESETS.find((p) => p.id === id)
            if (!preset) return
            setActivePreset(id)
            setConfig((prev) => ({ ...prev, containerSize: preset.size,
              radiusRatio: DEFAULT_CONFIG.radiusRatio, iconRatio: DEFAULT_CONFIG.iconRatio,
              strokeWidth: DEFAULT_CONFIG.strokeWidth, lockProportions: true }))
          }}
          options={SIZE_PRESETS.map((p) => ({ value: p.id, label: `${p.label} ${p.size}` }))}
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
          onChange={(v) => updateSlider('radiusRatio', v / 100)}
          suffix="%"
        />
        <Slider
          label="Icon scale"
          value={Math.round(config.iconRatio * 100)}
          min={20}
          max={90}
          step={1}
          onChange={(v) => updateSlider('iconRatio', v / 100)}
          suffix="%"
        />
      </Section>

      <Section title="Stroke">
        {isSocialIcon(config.iconName) ? (
          <p className="text-xs text-muted">Logos use filled shapes.</p>
        ) : (<>
        <Slider
          label="Stroke width"
          value={config.strokeWidth}
          min={0.5}
          max={3}
          step={0.25}
          onChange={(v) => updateSlider('strokeWidth', v)}
          suffix="px"
        />
        <Toggle
          label="Absolute stroke width"
          checked={config.absoluteStroke}
          onChange={(v) => update('absoluteStroke', v)}
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
        </>)}
      </Section>

      <Section title="Export">
        <ExportPanel config={config} artboardRef={artboardRef} />
      </Section>
    </aside>
  )
}
