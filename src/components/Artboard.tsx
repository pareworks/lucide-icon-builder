import { forwardRef } from 'react'
import { IconConfig } from '../types'
import { getIconComponent } from '../lib/lucide'

type Props = {
  config: IconConfig
}

// Renders the icon-in-container as a single SVG element used for both live
// preview and export. The Lucide component renders its own nested <svg> with
// its 24-unit viewBox; we wrap it in a translation group to position it inside
// the container.
export const Artboard = forwardRef<SVGSVGElement, Props>(({ config }, ref) => {
  const {
    iconName, containerColor, containerVisible, iconColor, containerSize,
    radiusRatio, iconRatio, strokeWidth, absoluteStroke,
    linecap, linejoin,
  } = config

  const Icon = getIconComponent(iconName)

  const radiusPx = containerSize * radiusRatio
  const iconSizePx = containerSize * iconRatio
  const iconOffset = (containerSize - iconSizePx) / 2

  return (
    <svg
      ref={ref}
      xmlns="http://www.w3.org/2000/svg"
      width={containerSize}
      height={containerSize}
      viewBox={`0 0 ${containerSize} ${containerSize}`}
      fill="none"
    >
      <rect
        x={0}
        y={0}
        width={containerSize}
        height={containerSize}
        rx={radiusPx}
        ry={radiusPx}
        fill={containerVisible ? containerColor : 'none'}
      />
      {Icon && (
        <g transform={`translate(${iconOffset}, ${iconOffset})`}>
          <Icon
            size={iconSizePx}
            color={iconColor}
            strokeWidth={strokeWidth}
            absoluteStrokeWidth={absoluteStroke}
            strokeLinecap={linecap}
            strokeLinejoin={linejoin}
          />
        </g>
      )}
    </svg>
  )
})

Artboard.displayName = 'Artboard'
