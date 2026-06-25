import { motion, useInView, useMotionValue, useTransform, animate } from 'framer-motion'
import { useRef, useEffect } from 'react'

function CountUp({ to, suffix = '', duration = 2 }: { to: number; suffix?: string; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null)
  const count = useMotionValue(0)
  const rounded = useTransform(count, v => Math.round(v).toLocaleString('fr-FR') + suffix)
  const inView = useInView(ref, { once: true })

  useEffect(() => {
    if (!inView) return
    const controls = animate(count, to, { duration, ease: 'easeOut' })
    return controls.stop
  }, [inView, to, count, duration])

  return <motion.span ref={ref}>{rounded}</motion.span>
}

const stats = [
  { value: 2500, suffix: '+', label: 'Dossiers de soins traités', sub: 'sur la plateforme', color: 'text-blue-600' },
  { value: 340, suffix: '', label: 'Médecins partenaires', sub: 'généralistes & spécialistes', color: 'text-slate-900' },
  { value: 98, suffix: '%', label: 'Satisfaction client', sub: 'taux moyen mensuel', color: 'text-emerald-600' },
  { value: 12000, suffix: '+', label: 'Remboursements traités', sub: 'depuis le lancement', color: 'text-blue-600' },
]

const features = [
  {
    title: 'Sécurité des données',
    description: 'Toutes les données médicales sont chiffrées et stockées en conformité avec les normes de santé.',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
      </svg>
    ),
  },
  {
    title: 'Traçabilité complète',
    description: "Chaque action est horodatée. Consultation, transmission, validation, remboursement : tout est tracé.",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 010 3.75H5.625a1.875 1.875 0 010-3.75z" />
      </svg>
    ),
  },
  {
    title: 'Disponible partout',
    description: "Interface responsive accessible depuis n'importe quel appareil, à tout moment.",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
      </svg>
    ),
  },
]

export default function StatsSection() {
  return (
    <section id="stats" className="py-24 lg:py-32 bg-slate-50 relative overflow-hidden">
      {/* Diagonal top separator */}
      <div className="absolute top-0 left-0 right-0 h-16 bg-white clip-diagonal" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 pt-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="flex flex-col items-center justify-center mb-6">
            <span className="text-blue-600 text-sm font-bold uppercase tracking-widest mb-3">
              Chiffres clés
            </span>
            <div className="w-16 h-1 bg-gradient-to-r from-blue-600 to-cyan-400 rounded-full" />
          </div>
          <h2
            className="text-4xl lg:text-5xl font-black text-slate-900"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            La confiance en chiffres
          </h2>
        </motion.div>

        {/* Stats grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 text-center"
            >
              <p className={`text-4xl lg:text-5xl font-black mb-2 ${stat.color}`} style={{ fontFamily: 'var(--font-display)' }}>
                <CountUp to={stat.value} suffix={stat.suffix} />
              </p>
              <p className="text-slate-900 font-semibold text-sm mb-1">{stat.label}</p>
              <p className="text-slate-400 text-xs">{stat.sub}</p>
            </motion.div>
          ))}
        </div>

        {/* Features row */}
        <div className="grid lg:grid-cols-3 gap-6">
          {features.map((feat, i) => (
            <motion.div
              key={feat.title}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: 0.4 + i * 0.1 }}
              className="flex gap-4 bg-white rounded-2xl p-6 border border-slate-100 shadow-sm"
            >
              <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                {feat.icon}
              </div>
              <div>
                <h3 className="font-bold text-slate-900 mb-1 text-base">{feat.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{feat.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}