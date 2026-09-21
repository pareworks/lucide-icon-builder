import { forwardRef, useId } from 'react'
import type { LucideIcon, LucideProps } from 'lucide-react'
import svg0 from '../assets/social/messenger.svg?raw'
import svg1 from '../assets/social/twitch.svg?raw'
import svg2 from '../assets/social/spotify.svg?raw'
import svg3 from '../assets/social/vk.svg?raw'
import svg4 from '../assets/social/signal.svg?raw'
import svg5 from '../assets/social/telegram.svg?raw'
import svg6 from '../assets/social/tumblr.svg?raw'
import svg7 from '../assets/social/tiktok.svg?raw'
import svg8 from '../assets/social/discord.svg?raw'
import svg9 from '../assets/social/reddit.svg?raw'
import svg10 from '../assets/social/dribbble.svg?raw'
import svg11 from '../assets/social/figma.svg?raw'
import svg12 from '../assets/social/whatsapp.svg?raw'
import svg13 from '../assets/social/threads.svg?raw'
import svg14 from '../assets/social/github.svg?raw'
import svg15 from '../assets/social/medium.svg?raw'
import svg16 from '../assets/social/pinterest.svg?raw'
import svg17 from '../assets/social/snapchat.svg?raw'
import svg18 from '../assets/social/apple.svg?raw'
import svg19 from '../assets/social/youtube.svg?raw'
import svg20 from '../assets/social/google.svg?raw'
import svg21 from '../assets/social/linkedin.svg?raw'
import svg22 from '../assets/social/instagram.svg?raw'
import svg23 from '../assets/social/x-twitter.svg?raw'
import svg24 from '../assets/social/facebook.svg?raw'
import svg25 from '../assets/social/bluesky.svg?raw'

// Original SVG geometry exported from the linked Figma file is kept in assets/social.
const sources = {
  'social-messenger': { label: "Messenger", svg: svg0 },
  'social-twitch': { label: "Twitch", svg: svg1 },
  'social-spotify': { label: "Spotify", svg: svg2 },
  'social-vk': { label: "VK", svg: svg3 },
  'social-signal': { label: "Signal", svg: svg4 },
  'social-telegram': { label: "Telegram", svg: svg5 },
  'social-tumblr': { label: "Tumblr", svg: svg6 },
  'social-tiktok': { label: "TikTok", svg: svg7 },
  'social-discord': { label: "Discord", svg: svg8 },
  'social-reddit': { label: "Reddit", svg: svg9 },
  'social-dribbble': { label: "Dribbble", svg: svg10 },
  'social-figma': { label: "Figma", svg: svg11 },
  'social-whatsapp': { label: "WhatsApp", svg: svg12 },
  'social-threads': { label: "Threads", svg: svg13 },
  'social-github': { label: "GitHub", svg: svg14 },
  'social-medium': { label: "Medium", svg: svg15 },
  'social-pinterest': { label: "Pinterest", svg: svg16 },
  'social-snapchat': { label: "Snapchat", svg: svg17 },
  'social-apple': { label: "Apple", svg: svg18 },
  'social-youtube': { label: "YouTube", svg: svg19 },
  'social-google': { label: "Google", svg: svg20 },
  'social-linkedin': { label: "LinkedIn", svg: svg21 },
  'social-instagram': { label: "Instagram", svg: svg22 },
  'social-x-twitter': { label: "X (Twitter)", svg: svg23 },
  'social-facebook': { label: "Facebook", svg: svg24 },
  'social-bluesky': { label: "Bluesky", svg: svg25 },
}

export const SOCIAL_ICON_NAMES = Object.keys(sources).sort()
export const isSocialIcon = (name: string) => Object.hasOwnProperty.call(sources, name)
export const socialIconLabel = (name: string): string | undefined =>
  sources[name as keyof typeof sources]?.label

const createSocialIcon = (source: { label: string; svg: string }): LucideIcon => {
  const viewBox = source.svg.match(/viewBox="([^"]+)"/)![1]
  // Only trusted, checked-in Figma assets are injected, never user input.
  const markup = source.svg.replace(/^[\s\S]*?<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '')
    .replace(/fill="white"/g, 'fill="currentColor"')
  const Icon = forwardRef<SVGSVGElement, LucideProps>(({
    size = 24, color = 'currentColor', strokeWidth: _strokeWidth,
    absoluteStrokeWidth: _absoluteStrokeWidth, children: _children, ...props
  }, ref) => {
    const id = useId().replace(/:/g, '')
    // Picker and artboard can render the same icon; keep clip-path IDs unique.
    const html = markup.replace(/id="([^"]+)"/g, `id="${id}-$1"`)
      .replace(/url\(#([^)]+)\)/g, `url(#${id}-$1)`)
    return <svg {...props} ref={ref} xmlns="http://www.w3.org/2000/svg"
      width={size} height={size} viewBox={viewBox} fill="none" stroke="none"
      color={color} dangerouslySetInnerHTML={{ __html: html }} />
  })
  Icon.displayName = source.label
  return Icon
}

export const socialIcons: Record<string, LucideIcon> = Object.fromEntries(
  Object.entries(sources).map(([name, source]) => [name, createSocialIcon(source)]),
)
