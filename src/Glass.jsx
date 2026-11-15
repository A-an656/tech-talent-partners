import { motion } from 'motion/react'

/* Liquid glass building blocks.
   <GlassFilters/> mounts the SVG filters once; <Glass> is the layered surface. */

export function GlassFilters() {
  return (
    <svg aria-hidden="true" width="0" height="0" style={{ position: 'absolute' }}>
      <defs>
        {/* Rippled glass for panels: low-frequency noise bends what sits behind */}
        <filter id="liquid-glass" x="0%" y="0%" width="100%" height="100%" filterUnits="objectBoundingBox">
          <feTurbulence type="fractalNoise" baseFrequency="0.008 0.008" numOctaves="2" seed="7" result="noise" />
          <feGaussianBlur in="noise" stdDeviation="2" result="soft" />
          <feDisplacementMap in="SourceGraphic" in2="soft" scale="70" xChannelSelector="R" yChannelSelector="G" />
        </filter>
        {/* Lens: a living, slowly shifting bend with a slight chromatic split */}
        <filter id="liquid-lens" x="-10%" y="-10%" width="120%" height="120%">
          <feTurbulence type="fractalNoise" baseFrequency="0.012" numOctaves="1" seed="3" result="n">
            <animate attributeName="baseFrequency" values="0.010;0.016;0.010" dur="9s" repeatCount="indefinite" />
          </feTurbulence>
          <feGaussianBlur in="n" stdDeviation="3" result="nb" />
          <feDisplacementMap in="SourceGraphic" in2="nb" scale="70" xChannelSelector="R" yChannelSelector="G" result="d1" />
          <feDisplacementMap in="SourceGraphic" in2="nb" scale="80" xChannelSelector="R" yChannelSelector="G" result="d2" />
          <feColorMatrix in="d1" type="matrix" values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0" result="r" />
          <feColorMatrix in="d2" type="matrix" values="0 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 1 0" result="gb" />
          <feBlend in="r" in2="gb" mode="screen" />
        </filter>
      </defs>
    </svg>
  )
}

/* pointer-following specular highlight */
const track = e => {
  const r = e.currentTarget.getBoundingClientRect()
  e.currentTarget.style.setProperty('--mx', `${e.clientX - r.left}px`)
  e.currentTarget.style.setProperty('--my', `${e.clientY - r.top}px`)
}

export function Glass({ as = 'div', tone = 'dark', className = '', radius, children, style, ...rest }) {
  const Tag = typeof as === 'string' ? motion[as] : as
  return (
    <Tag
      className={`lg ${tone === 'white' ? 'lg-light lg-white' : tone === 'light' ? 'lg-light' : 'lg-dark'} ${className}`}
      style={{ ...(radius ? { '--lg-r': radius } : null), ...style }}
      onPointerMove={track}
      {...rest}
    >
      <span className="lg-fx" aria-hidden="true" />
      <span className="lg-tint" aria-hidden="true" />
      <span className="lg-shine" aria-hidden="true" />
      <span className="lg-rim" aria-hidden="true" />
      <div className="lg-body">{children}</div>
    </Tag>
  )
}

/* Slow drifting colour fields: the ground the glass refracts */
const DARK = [
  { c: '#f2b84b', s: 520, x: '-8%', y: '-10%', o: 0.55, d: 18 },
  { c: '#2f7bff', s: 640, x: '55%', y: '-18%', o: 0.55, d: 22 },
  { c: '#19c3b4', s: 480, x: '70%', y: '45%', o: 0.4, d: 20 },
  { c: '#ff6b4a', s: 380, x: '20%', y: '60%', o: 0.3, d: 24 },
]
const LIGHT = [
  { c: '#f2b84b', s: 520, x: '-10%', y: '0%', o: 0.35, d: 20 },
  { c: '#7fd4ff', s: 600, x: '60%', y: '-10%', o: 0.45, d: 24 },
  { c: '#9be8c9', s: 460, x: '35%', y: '55%', o: 0.35, d: 22 },
]

export function Aurora({ tone = 'dark', grid = true }) {
  const blobs = tone === 'dark' ? DARK : LIGHT
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      {blobs.map((b, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full blur-[90px]"
          style={{ width: b.s, height: b.s, left: b.x, top: b.y, background: b.c, opacity: b.o }}
          animate={{ x: [0, 90, -40, 0], y: [0, -60, 50, 0], scale: [1, 1.15, 0.95, 1] }}
          transition={{ duration: b.d, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}
      {grid && (
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(${tone === 'dark' ? 'rgb(255 255 255 / .09)' : 'rgb(11 18 32 / .07)'} 1px, transparent 1px)`,
            backgroundSize: '28px 28px',
            maskImage: 'radial-gradient(ellipse at center, black 30%, transparent 75%)',
            WebkitMaskImage: 'radial-gradient(ellipse at center, black 30%, transparent 75%)',
          }}
        />
      )}
    </div>
  )
}
