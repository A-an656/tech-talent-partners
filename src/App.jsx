import { useEffect, useRef, useState } from 'react'
import {
  motion, AnimatePresence, useMotionValue, useSpring, useScroll, useTransform,
} from 'motion/react'
import {
  ArrowRight, ArrowUpRight, Mail, Menu, X, Code2, Briefcase, Layers, Check, Send,
  FileText, Users, MessagesSquare, Rocket,
} from 'lucide-react'
import { Glass, GlassFilters, Aurora } from './Glass.jsx'

const EMAIL = 'info.techtalentpartners@gmail.com'
const ease = [0.2, 0.7, 0.2, 1]

const NAV = [
  { href: '#hire', label: 'Hire talent' },
  { href: '#projects', label: 'Projects' },
  { href: '#careers', label: 'Find a job' },
  { href: '#contact', label: 'Contact' },
]

/* ---------------------------------------------------------------- helpers */
function Rise({ children, delay = 0, className = '' }) {
  return (
    <motion.div className={className}
      initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }} transition={{ duration: 0.8, delay, ease }}>
      {children}
    </motion.div>
  )
}

/* heading whose words slide up from a mask, once, when it enters view */
function Title({ as: Tag = 'h2', text, accent, className = '', onLoad = false }) {
  const words = text.split(' ')
  const anim = onLoad ? { animate: 'show' } : { whileInView: 'show', viewport: { once: true, margin: '-60px' } }
  const MTag = motion[Tag]
  return (
    <MTag className={className} initial="hidden" {...anim}
      variants={{ show: { transition: { staggerChildren: 0.06, delayChildren: onLoad ? 0.3 : 0 } } }}>
      {words.map((w, i) => (
        <span key={i} className="inline-block overflow-hidden pb-[0.08em] align-bottom">
          <motion.span className={`inline-block pr-[0.22em] ${accent?.includes(w) ? 'text-amber' : ''}`}
            variants={{ hidden: { y: '105%' }, show: { y: 0, transition: { duration: 0.8, ease } } }}>
            {w}
          </motion.span>
        </span>
      ))}
    </MTag>
  )
}

function Eyebrow({ children, dark }) {
  return (
    <Rise>
      <p className={`text-sm font-semibold uppercase tracking-[0.16em] ${dark ? 'text-amber' : 'text-amber-deep'}`}>{children}</p>
    </Rise>
  )
}

/* ------------------------------------------------------------------ nav */
function Nav() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 40)
    on(); window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [])
  useEffect(() => { document.body.style.overflow = open ? 'hidden' : '' }, [open])

  return (
    <motion.header className="fixed inset-x-0 top-3 z-50"
      initial={{ y: -90, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.9, ease, delay: 0.1 }}>
      <div className="wrap">
        <Glass tone={scrolled ? 'light' : 'dark'} radius="999px"
          className={`transition-colors duration-300 ${scrolled ? 'text-ink' : 'text-white'}`}>
          <nav className="flex h-16 items-center justify-between pl-5 pr-2" aria-label="Main">
            <a href="#top" className="flex items-center gap-2.5 font-display text-lg font-bold tracking-tight">
              <Logo />
              <span>Tech Talent <span className="text-amber-deep">Partners</span></span>
            </a>
            <ul className="hidden items-center gap-7 text-sm font-medium md:flex">
              {NAV.map(n => (
                <li key={n.href}><a className="ulink py-2" href={n.href}>{n.label}</a></li>
              ))}
            </ul>
            <a href="#contact" className="btn btn-amber hidden md:inline-flex">
              Talk to us <ArrowRight size={16} />
            </a>
            <button className="grid h-12 w-12 place-items-center rounded-full md:hidden"
              aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open}
              onClick={() => setOpen(o => !o)}>
              {open ? <X /> : <Menu />}
            </button>
          </nav>
        </Glass>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 -z-10 overflow-hidden bg-ink pt-28 md:hidden">
            <Aurora tone="dark" grid={false} />
            <ul className="wrap relative flex flex-col gap-2">
              {NAV.map((n, i) => (
                <motion.li key={n.href} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 * i, ease }}>
                  <a href={n.href} onClick={() => setOpen(false)}
                    className="block py-3 font-display text-4xl font-bold text-paper">{n.label}</a>
                </motion.li>
              ))}
              <li className="mt-6">
                <a href="#contact" onClick={() => setOpen(false)} className="btn btn-amber w-full">Talk to us</a>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}

function Logo() {
  return (
    <svg width="30" height="30" viewBox="0 0 64 64" aria-hidden="true">
      <rect width="64" height="64" rx="16" fill="#0b1220" />
      <path d="M16 20h32v7H35.5v23h-7V27H16z" fill="#f2b84b" />
      <circle cx="46" cy="44" r="5" fill="#7fd4ff" />
    </svg>
  )
}

/* ----------------------------------------------------------------- hero */
const BUBBLES = [
  { f: 'java', n: 'Java', cls: 'left-[-9%] top-[-12%]', d: 0 },
  { f: 'react', n: 'React', cls: 'right-[-5%] top-[-14%]', d: 0.6 },
  { f: 'aws', n: 'AWS', cls: 'right-[-8%] bottom-[-6%]', d: 1.2 },
  { f: 'selenium', n: 'Selenium', cls: 'left-[-10%] bottom-[-10%]', d: 1.8 },
]

function Hero() {
  const ref = useRef(null)
  const x = useMotionValue(-400), y = useMotionValue(-400)
  const sx = useSpring(x, { stiffness: 140, damping: 18, mass: 0.6 })
  const sy = useSpring(y, { stiffness: 140, damping: 18, mass: 0.6 })
  const [lensOn, setLensOn] = useState(false)

  /* gentle tilt-free parallax of the glass stack toward the pointer */
  const px = useMotionValue(0), py = useMotionValue(0)
  const spx = useSpring(px, { stiffness: 60, damping: 20 }), spy = useSpring(py, { stiffness: 60, damping: 20 })

  const move = e => {
    const r = ref.current.getBoundingClientRect()
    x.set(e.clientX - r.left - 110); y.set(e.clientY - r.top - 110)
    px.set(((e.clientX - r.left) / r.width - 0.5) * 18)
    py.set(((e.clientY - r.top) / r.height - 0.5) * 18)
  }

  const item = {
    hidden: { opacity: 0, y: 24, filter: 'blur(8px)' },
    show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.9, ease } },
  }

  return (
    <section id="top" ref={ref} data-enter onPointerMove={move}
      onPointerEnter={e => e.pointerType === 'mouse' && setLensOn(true)}
      onPointerLeave={() => setLensOn(false)}
      className="relative flex min-h-svh items-center overflow-hidden bg-ink text-white">
      <Aurora tone="dark" />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-ink to-transparent" />

      <motion.div aria-hidden="true"
        className="lens pointer-events-none absolute left-0 top-0 z-20 hidden h-[220px] w-[220px] rounded-full md:block"
        style={{
          x: sx, y: sy,
          boxShadow: 'inset 2px 2px 1px rgb(255 255 255 / .65), inset -2px -2px 2px rgb(255 255 255 / .25), 0 24px 60px -12px rgb(0 0 0 / .55)',
        }}
        animate={{ opacity: lensOn ? 1 : 0, scale: lensOn ? 1 : 0.6 }}
        transition={{ duration: 0.35, ease }} />

      <div className="wrap relative z-10 grid gap-14 pb-16 pt-32 lg:grid-cols-[1.25fr_1fr] lg:items-center lg:gap-10">
        <motion.div initial="hidden" animate="show"
          variants={{ show: { transition: { staggerChildren: 0.12, delayChildren: 0.2 } } }}>
          <motion.div variants={item}>
            <Glass tone="dark" radius="999px" className="mb-6 inline-block">
              <p className="flex items-center gap-2 px-4 py-2 text-xs text-white/90 sm:text-sm">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-amber" />
                </span>
                Staffing and IT projects for companies worldwide
              </p>
            </Glass>
          </motion.div>
          <Title as="h1" onLoad text="IT people and IT projects for businesses worldwide."
            accent={['worldwide.']}
            className="font-display text-[clamp(2.6rem,6vw,5.4rem)] font-extrabold leading-[0.98] tracking-tight" />
          <motion.p variants={item} className="mt-6 max-w-xl text-lg text-white/80">
            We place tech and non-tech professionals with clients around the world, and we build software projects end to end.
          </motion.p>
          <motion.div variants={item} className="mt-9 flex flex-col gap-3 sm:flex-row">
            <a href="#contact" className="btn btn-amber">Hire talent <ArrowRight size={18} /></a>
            <Glass as="a" href="#careers" tone="dark" radius="999px" className="btn-glass text-white">
              <span className="flex min-h-12 items-center justify-center px-6 font-semibold">Send your resume</span>
            </Glass>
          </motion.div>
        </motion.div>

        <motion.div className="relative mx-auto w-full max-w-md lg:max-w-none"
          style={{ x: spx, y: spy }}
          initial={{ opacity: 0, scale: 0.94, y: 30 }} animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1.1, delay: 0.5, ease }}>
          <Glass tone="dark" className="p-2">
            <div className="flex items-center justify-between px-4 pb-2 pt-3">
              <span className="font-display text-sm font-bold text-white/70">What we provide</span>
              <span className="flex gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-white/25" />
                <span className="h-2.5 w-2.5 rounded-full bg-white/25" />
                <span className="h-2.5 w-2.5 rounded-full bg-amber" />
              </span>
            </div>
            <ul className="divide-y divide-white/10">
              {[
                { icon: Code2, t: 'Tech roles', d: 'Developers, QA, cloud, data, DevOps' },
                { icon: Briefcase, t: 'Non-tech roles', d: 'Recruiting, HR, sales, support, admin' },
                { icon: Layers, t: 'IT projects', d: 'Web apps, automation, cloud work' },
              ].map(({ icon: I, t, d }, i) => (
                <motion.li key={t} className="flex items-center gap-4 rounded-2xl px-4 py-4 transition-colors hover:bg-white/5"
                  initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.9 + i * 0.12, duration: 0.7, ease }}>
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-white/10 text-amber"><I size={20} /></span>
                  <span>
                    <span className="block font-display text-lg font-bold">{t}</span>
                    <span className="block text-sm text-white/70">{d}</span>
                  </span>
                </motion.li>
              ))}
            </ul>
          </Glass>

          {BUBBLES.map(b => (
            <motion.div key={b.f} className={`absolute hidden sm:block ${b.cls}`}
              initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1, y: [0, -10, 0] }}
              transition={{ opacity: { delay: 1.2 + b.d / 3 }, scale: { delay: 1.2 + b.d / 3, type: 'spring' }, y: { duration: 4, repeat: Infinity, ease: 'easeInOut', delay: b.d } }}>
              <Glass tone="white" radius="20px" className="grid h-16 w-16 place-items-center">
                <img src={`icons/${b.f}.svg`} alt={b.n} className="h-8 w-8 object-contain" />
              </Glass>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------ hire talent */
const STEPS = [
  { icon: FileText, t: 'Share the role', d: 'Tell us the job, the skills and the location or time zone. A short email is enough to start.' },
  { icon: Users, t: 'Get a shortlist', d: 'We screen candidates against your brief and send only the people who match it.' },
  { icon: MessagesSquare, t: 'Interview and pick', d: 'You meet the candidates and choose. We handle scheduling and follow-ups.' },
  { icon: Rocket, t: 'They start work', d: 'Your new hire joins the team, and we stay in touch while they settle in.' },
]

function Hire() {
  return (
    <section id="hire" className="relative overflow-hidden py-24 md:py-32">
      <Aurora tone="light" />
      <div className="wrap relative grid gap-12 lg:grid-cols-2 lg:gap-16">
        <div>
          <Eyebrow>For companies</Eyebrow>
          <Title text="Hiring for your team? Send us the role."
            className="mt-3 font-display text-[clamp(2.2rem,4.4vw,3.6rem)] font-extrabold leading-[1.02] tracking-tight" />
          <Rise delay={0.1}>
            <p className="mt-5 max-w-lg text-lg text-muted">
              Engineers, testers and analysts, or recruiters, sales and support staff. We find them, screen them and bring you a shortlist.
            </p>
          </Rise>
          <Rise delay={0.15} className="photo mt-10 aspect-[4/3] lg:aspect-[5/4]">
            <img src="img/photo-f86419362-960.jpg"
              srcSet="img/photo-f86419362-500.jpg 500w, img/photo-f86419362-960.jpg 960w"
              sizes="(max-width: 1023px) 100vw, 50vw"
              alt="A team working at long tables in a bright office" loading="lazy" decoding="async" />
          </Rise>
        </div>

        <ol className="relative grid content-start gap-4 lg:pt-28">
          {/* progress line that draws as the steps come in */}
          <motion.span aria-hidden="true" className="absolute bottom-24 left-[2.35rem] top-4 hidden w-px origin-top bg-gradient-to-b from-amber to-sky sm:block lg:top-32"
            initial={{ scaleY: 0 }} whileInView={{ scaleY: 1 }} viewport={{ once: true, margin: '-120px' }}
            transition={{ duration: 1.4, ease }} />
          {STEPS.map((s, i) => (
            <Rise key={s.t} delay={0.08 * i}>
              <Glass as="li" tone="light" className="list-none transition-transform duration-200 hover:-translate-y-0.5">
                <div className="flex gap-5 p-6">
                  <span className="relative grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-ink text-amber">
                    <s.icon size={20} />
                  </span>
                  <span>
                    <span className="block text-xs font-semibold tracking-widest text-amber-deep">STEP 0{i + 1}</span>
                    <span className="block font-display text-xl font-bold">{s.t}</span>
                    <span className="mt-1 block text-muted">{s.d}</span>
                  </span>
                </div>
              </Glass>
            </Rise>
          ))}
          <Rise delay={0.35}>
            <a href="#contact" className="btn btn-ink mt-2 w-full sm:w-auto">Send us a role <ArrowRight size={18} /></a>
          </Rise>
        </ol>
      </div>
    </section>
  )
}

/* ------------------------------------------- moment: words light up on scroll */
const STATEMENT = 'Two kinds of help, one partner: the people your team is missing, and the software you need built.'

function Statement() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.85', 'end 0.4'] })
  const words = STATEMENT.split(' ')
  return (
    <section ref={ref} className="relative overflow-hidden bg-paper-2 py-28 md:py-40" aria-label="What we do">
      <Aurora tone="light" grid={false} />
      <div className="wrap relative">
        <h2 className="sr-only">What Tech Talent Partners does</h2>
        <Glass tone="light" radius="36px" className="p-8 md:p-14">
          <p className="font-display text-[clamp(1.9rem,4.4vw,3.8rem)] font-bold leading-[1.08] tracking-tight">
            {words.map((w, i) => (
              <Word key={i} progress={scrollYProgress} range={[i / words.length, (i + 1) / words.length]}>{w}</Word>
            ))}
          </p>
        </Glass>
      </div>
    </section>
  )
}
function Word({ children, progress, range }) {
  const opacity = useTransform(progress, range, [0.15, 1])
  const y = useTransform(progress, range, [6, 0])
  return <motion.span style={{ opacity, y }} className="inline-block pr-[0.25em]">{children}</motion.span>
}

/* --------------------------------------------------------------- projects */
const STACK = [
  ['java', 'Java'], ['react', 'React'], ['python', 'Python'], ['nodejs', 'Node.js'],
  ['aws', 'AWS'], ['azure', 'Azure'], ['docker', 'Docker'], ['kubernetes', 'Kubernetes'],
  ['selenium', 'Selenium'], ['playwright', 'Playwright'], ['salesforce', 'Salesforce'], ['jira', 'Jira'],
]
const PROJECTS = [
  { icon: Code2, t: 'Web and mobile apps', d: 'Customer portals, internal tools and dashboards, from first design to launch.' },
  { icon: Check, t: 'Test automation', d: 'Selenium and Playwright suites wired into your build so releases stop breaking.' },
  { icon: Layers, t: 'Cloud and DevOps', d: 'Moves to AWS or Azure, containers, pipelines and the monitoring around them.' },
]

function Projects() {
  return (
    <section id="projects" className="relative overflow-hidden bg-ink py-24 text-white md:py-32">
      <img src="img/photo-f61684334.jpg" alt="" aria-hidden="true" loading="lazy"
        className="absolute inset-0 h-full w-full object-cover opacity-20" />
      <Aurora tone="dark" grid={false} />
      <div className="absolute inset-0 bg-gradient-to-br from-ink/80 via-ink/50 to-ink/20" />

      <div className="wrap relative">
        <Eyebrow dark>IT projects</Eyebrow>
        <Title text="Need it built, not just staffed? We run the project."
          className="mt-3 max-w-3xl font-display text-[clamp(2.2rem,4.4vw,3.6rem)] font-extrabold leading-[1.02] tracking-tight" />

        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {PROJECTS.map((p, i) => (
            <Rise key={p.t} delay={0.08 * i} className="h-full">
              <Glass tone="dark" className="group h-full p-7 transition-transform duration-200 hover:-translate-y-0.5">
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-amber text-ink transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6">
                  <p.icon size={20} />
                </span>
                <h3 className="mt-6 font-display text-2xl font-bold">{p.t}</h3>
                <p className="mt-2 text-white/75">{p.d}</p>
              </Glass>
            </Rise>
          ))}
        </div>

        <Rise delay={0.15}>
          <Glass tone="dark" className="mt-4 p-6 md:p-8">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <p className="max-w-xs font-display text-xl font-bold">Tools our teams work in every day</p>
              <ul className="grid grid-cols-4 gap-3 sm:grid-cols-6">
                {STACK.map(([f, n], i) => (
                  <motion.li key={f} title={n}
                    whileHover={{ y: -6, scale: 1.08 }}
                    animate={{ y: [0, -4, 0] }}
                    transition={{ y: { duration: 3, repeat: Infinity, delay: i * 0.25, ease: 'easeInOut' } }}>
                    <Glass tone="white" radius="18px" className="grid h-14 w-14 place-items-center">
                      <img src={`icons/${f}.svg`} alt={n} className="h-7 w-7 object-contain" />
                    </Glass>
                  </motion.li>
                ))}
              </ul>
            </div>
          </Glass>
        </Rise>
      </div>
    </section>
  )
}

/* ---------------------------------------------------------------- careers */
const ROLES = ['Software developers', 'QA and automation testers', 'Cloud and DevOps engineers', 'Data and BI analysts', 'IT recruiters and HR', 'Sales and support staff']

function Careers() {
  return (
    <section id="careers" className="relative overflow-hidden py-24 md:py-32">
      <Aurora tone="light" />
      <div className="wrap relative grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <Rise className="relative order-2 lg:order-1">
          <div className="photo aspect-[4/3]">
            <img src="img/photo-f84610204-960.jpg"
              srcSet="img/photo-f84610204-500.jpg 500w, img/photo-f84610204-960.jpg 960w"
              sizes="(max-width: 1023px) 100vw, 50vw"
              alt="People working at computers in an open-plan office" loading="lazy" decoding="async" />
          </div>
          <motion.div className="absolute -bottom-6 left-4 right-4 sm:left-auto sm:right-6 sm:w-72"
            animate={{ y: [0, -8, 0] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}>
            <Glass tone="light" radius="22px">
              <div className="flex items-center gap-3 p-4">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-amber text-ink"><Mail size={18} /></span>
                <span className="text-sm">
                  <span className="block font-semibold">Resume received?</span>
                  <span className="block text-muted">We reply with openings that fit.</span>
                </span>
              </div>
            </Glass>
          </motion.div>
        </Rise>
        <div className="order-1 lg:order-2">
          <Eyebrow>For job seekers</Eyebrow>
          <Title text="Looking for your next IT job?"
            className="mt-3 font-display text-[clamp(2.2rem,4.4vw,3.6rem)] font-extrabold leading-[1.02] tracking-tight" />
          <Rise delay={0.1}>
            <p className="mt-5 max-w-lg text-lg text-muted">
              We fill tech and non-tech roles for clients in many countries. Email your resume with the role you want, and we will match you to openings that fit.
            </p>
          </Rise>
          <ul className="mt-7 flex flex-wrap gap-2.5">
            {ROLES.map((r, i) => (
              <motion.li key={r} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }} transition={{ delay: 0.05 * i, duration: 0.5, ease }}>
                <Glass tone="light" radius="999px" className="transition-transform duration-200 hover:-translate-y-0.5">
                  <span className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium">
                    <Check size={16} className="text-amber-deep" />{r}
                  </span>
                </Glass>
              </motion.li>
            ))}
          </ul>
          <Rise delay={0.2}>
            <a href={`mailto:${EMAIL}?subject=Resume%20-%20`} className="btn btn-ink mt-9 w-full sm:w-auto">
              Email your resume <Mail size={18} />
            </a>
          </Rise>
        </div>
      </div>
    </section>
  )
}

/* ---------------------------------------------------------------- contact */
function Contact() {
  const [v, setV] = useState({ name: '', email: '', topic: 'Hiring talent', msg: '' })
  const [err, setErr] = useState({})
  const [sent, setSent] = useState(false)

  const submit = e => {
    e.preventDefault()
    const n = {}
    if (!v.name.trim()) n.name = 'Please add your name.'
    if (!/^\S+@\S+\.\S+$/.test(v.email)) n.email = 'Please add a valid email address.'
    if (v.msg.trim().length < 10) n.msg = 'A line or two about what you need, please.'
    setErr(n)
    if (Object.keys(n).length) return
    const body = `Name: ${v.name}\nEmail: ${v.email}\nTopic: ${v.topic}\n\n${v.msg}`
    window.location.href = `mailto:${EMAIL}?subject=${encodeURIComponent(`${v.topic} — ${v.name}`)}&body=${encodeURIComponent(body)}`
    setSent(true)
  }
  const field = 'mt-2 w-full rounded-2xl border border-white/15 bg-white/10 px-4 py-3.5 text-white placeholder:text-white/40 outline-none transition focus:border-amber focus:bg-white/15'

  return (
    <section id="contact" className="relative overflow-hidden bg-ink py-24 text-white md:py-32">
      <Aurora tone="dark" />
      <div className="wrap relative grid gap-12 lg:grid-cols-[1.1fr_1fr] lg:items-center">
        <div>
          <Eyebrow dark>Contact</Eyebrow>
          <Title text="Tell us who you need, or what to build."
            className="mt-3 font-display text-[clamp(2.2rem,4.4vw,3.6rem)] font-extrabold leading-[1.02] tracking-tight" />
          <Rise delay={0.15}>
            <Glass as="a" href={`mailto:${EMAIL}`} tone="dark" radius="22px" className="group mt-8 inline-block max-w-full">
              <span className="flex items-center gap-3 px-5 py-4 font-display text-[clamp(1rem,4.4vw,1.6rem)] font-bold text-amber">
                <Mail className="shrink-0" />
                <span className="min-w-0 [overflow-wrap:anywhere]">{EMAIL}</span>
                <ArrowUpRight className="shrink-0 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" />
              </span>
            </Glass>
            <p className="mt-4 max-w-md text-white/70">Companies, candidates and project enquiries all reach the same inbox.</p>
          </Rise>
        </div>

        <Rise delay={0.1}>
          <Glass tone="dark" className="p-6 md:p-8">
            <AnimatePresence mode="wait">
              {sent ? (
                <motion.div key="sent" className="py-10 text-center" role="status"
                  initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
                  <Send className="mx-auto text-amber" />
                  <p className="mt-4 font-display text-2xl font-bold">Your email app should be open now.</p>
                  <p className="mt-2 text-white/70">Press send there, or write to us directly at {EMAIL}.</p>
                  <button onClick={() => setSent(false)} className="btn mt-6 border border-white/25 text-white">Write another message</button>
                </motion.div>
              ) : (
                <motion.form key="form" noValidate onSubmit={submit} className="grid gap-5"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <label className="block text-sm font-medium">Your name
                    <input className={field} value={v.name} onChange={e => setV({ ...v, name: e.target.value })} autoComplete="name" aria-invalid={!!err.name} />
                    {err.name && <span className="mt-1.5 block text-sm text-amber">{err.name}</span>}
                  </label>
                  <label className="block text-sm font-medium">Work email
                    <input type="email" className={field} value={v.email} onChange={e => setV({ ...v, email: e.target.value })} autoComplete="email" aria-invalid={!!err.email} />
                    {err.email && <span className="mt-1.5 block text-sm text-amber">{err.email}</span>}
                  </label>
                  <fieldset>
                    <legend className="text-sm font-medium">I am writing about</legend>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {['Hiring talent', 'An IT project', 'A job for me'].map(t => (
                        <button type="button" key={t} onClick={() => setV({ ...v, topic: t })} aria-pressed={v.topic === t}
                          className="relative min-h-11 rounded-full bg-white/10 px-4 text-sm font-medium transition hover:bg-white/20">
                          {v.topic === t && (
                            <motion.span layoutId="topic-pill" className="absolute inset-0 rounded-full bg-amber"
                              transition={{ type: 'spring', stiffness: 400, damping: 32 }} />
                          )}
                          <span className={`relative ${v.topic === t ? 'text-ink' : 'text-white'}`}>{t}</span>
                        </button>
                      ))}
                    </div>
                  </fieldset>
                  <label className="block text-sm font-medium">Message
                    <textarea rows={4} className={field} value={v.msg} onChange={e => setV({ ...v, msg: e.target.value })} aria-invalid={!!err.msg} />
                    {err.msg && <span className="mt-1.5 block text-sm text-amber">{err.msg}</span>}
                  </label>
                  <button className="btn btn-amber w-full">Send message <ArrowRight size={18} /></button>
                </motion.form>
              )}
            </AnimatePresence>
          </Glass>
        </Rise>
      </div>
    </section>
  )
}

/* ----------------------------------------------------------------- footer */
function Footer() {
  return (
    <footer className="bg-ink pb-10 text-white/60">
      <div className="wrap border-t border-white/10 pt-10">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
          <a href="#top" className="flex items-center gap-2.5 font-display text-lg font-bold text-white">
            <Logo /> Tech Talent Partners
          </a>
          <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
            {NAV.map(n => <li key={n.href}><a className="ulink inline-block py-2 hover:text-white" href={n.href}>{n.label}</a></li>)}
          </ul>
        </div>
        <p className="mt-8 text-xs leading-relaxed text-white/40">
          © {new Date().getFullYear()} Tech Talent Partners · {EMAIL} · Photos: Crew crew (CC0), Thecommondesk (CC BY-SA 4.0), Espacio Nolich (CC BY-SA 4.0), via Wikimedia Commons.
        </p>
      </div>
    </footer>
  )
}

/* thin progress bar at the top of the page */
function ScrollBar() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30 })
  return <motion.div aria-hidden="true" style={{ scaleX }} className="fixed inset-x-0 top-0 z-[60] h-[3px] origin-left bg-gradient-to-r from-amber via-amber to-sky" />
}

export default function App() {
  return (
    <>
      <a href="#main" className="skip btn btn-amber">Skip to content</a>
      <GlassFilters />
      <ScrollBar />
      <Nav />
      <main id="main">
        <Hero />
        <Hire />
        <Statement />
        <Projects />
        <Careers />
        <Contact />
      </main>
      <Footer />
    </>
  )
}
