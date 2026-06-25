import { motion } from 'framer-motion'

const profiles = [
  {
    role: 'Espace Médecin',
    headline: 'Gérez vos actes sans friction.',
    description:
      "Saisissez le motif de consultation en deux clics. Le logiciel génère la feuille de soins numérique et l'injecte dans le canal de l'assureur.",
    accentTheme: {
      iconBg: 'bg-slate-900 text-white shadow-lg shadow-slate-900/20',
      badgeClass: 'bg-slate-100 text-slate-800 border-slate-200/80',
      checkColor: 'text-slate-900',
      hoverBorder: 'hover:border-slate-400 hover:shadow-slate-900/5',
      indicator: 'bg-slate-800'
    },
    tag: 'Interface de saisie praticien',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z" />
      </svg>
    ),
    perks: ['Saisie d’acte en 15 secondes', 'Télétransmission instantanée', 'Protection des données de santé'],
  },
  {
    role: 'Espace Assureur',
    headline: 'Automatisez vos barèmes de A à Z.',
    description:
      "Supervisez les flux de télétransmission. Le moteur applique automatiquement vos règles de calcul avant d'ordonner le virement bancaire.",
    accentTheme: {
      iconBg: 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20',
      badgeClass: 'bg-emerald-50 text-emerald-800 border-emerald-200/80',
      checkColor: 'text-emerald-600',
      hoverBorder: 'hover:border-emerald-500/40 hover:shadow-emerald-500/5',
      indicator: 'bg-emerald-500'
    },
    tag: 'Barème : 100% Généraliste / 80% Spécialiste',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
      </svg>
    ),
    perks: ['Application stricte des 80% / 100%', 'Ajout de praticiens & assurés', 'Export de bordereaux comptables'],
  },
]

export default function ValuePropSection() {
  return (
    <section id="features" className="py-32 bg-slate-50/50 relative overflow-hidden">
      
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        
        {/* EN-TÊTE DE SECTION (Aéré, marges de titan) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-24"
        >
          <div className="flex flex-col items-center justify-center mb-6">
            <span className="text-blue-600 text-sm font-bold uppercase tracking-[0.2em] mb-3">
              Écosystème Connecté
            </span>
            <div className="w-16 h-1 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-full" />
          </div>
          <h2 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-[1.15] mb-6">
            Deux profils d'utilisateurs. <br />
            <span className="text-blue-600">Une seule vérité comptable.</span>
          </h2>
          <p className="text-slate-600 text-lg leading-[1.85]">
            Chaque acteur dispose d'une interface débarrassée du bruit visuel, 
            uniquement concentrée sur l'accélération du cycle de remboursement.
          </p>
        </motion.div>

        {/* ZONES DE TEXTES ALIGNÉES HORIZONTALEMENT */}
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-start">
          {profiles.map((profile, i) => (
            <motion.div
              key={profile.role}
              initial={{ opacity: 0, x: i === 0 ? -30 : 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex flex-col relative"
            >
              {/* Ligne Top : Icône + Badge */}
              <div className="flex items-center gap-6 mb-8">
                <div className={`w-16 h-16 rounded-2xl ${profile.accentTheme.iconBg} flex items-center justify-center shrink-0`}>
                  {profile.icon}
                </div>
                <span className={`text-sm font-bold px-4 py-2 rounded-full border ${profile.accentTheme.badgeClass}`}>
                  {profile.role}
                </span>
              </div>

              {/* Titre */}
              <h3 className="text-3xl font-extrabold text-slate-900 mb-6 leading-[1.3] tracking-tight">
                {profile.headline}
              </h3>

              {/* Description */}
              <p className="text-slate-600 text-lg font-normal leading-[1.85] mb-10">
                {profile.description}
              </p>

              {/* Liste des avantages */}
              <ul className="space-y-5 mb-12">
                {profile.perks.map(perk => (
                  <li key={perk} className="flex items-start gap-4 text-base text-slate-700 font-medium leading-relaxed">
                    <svg className={`w-6 h-6 ${profile.accentTheme.checkColor} shrink-0 mt-0.5`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                    <span>{perk}</span>
                  </li>
                ))}
              </ul>

              {/* Règle métier */}
              <div className="pt-6 border-t border-slate-200 mt-auto">
                <div className="flex items-center gap-3 text-sm font-bold text-slate-500 uppercase tracking-wider">
                  <span className={`w-2.5 h-2.5 rounded-full ${profile.accentTheme.indicator}`} />
                  <span>{profile.tag}</span>
                </div>
              </div>

            </motion.div>
          ))}
        </div>

      </div>
    </section>
  )
}