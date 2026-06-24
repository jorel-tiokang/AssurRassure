import { motion } from 'framer-motion'

const steps = [
    {
        number: '01',
        actor: 'Assuré',
        actorColor: 'bg-blue-600',
        actorBadgeText: 'text-blue-700 bg-blue-50',
        actorShadow: 'shadow-blue-600/20',
        title: 'Consultation médicale',
        description:
            "L'assuré consulte un médecin partenaire (généraliste ou spécialiste) inscrit sur la plateforme AssurRassure.",
        icon: (
            <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
            </svg>
        ),
    },
    {
        number: '02',
        actor: 'Médecin',
        actorColor: 'bg-slate-800',
        actorBadgeText: 'text-slate-700 bg-slate-100',
        actorShadow: 'shadow-slate-800/20',
        title: 'Enregistrement & Feuille de soins',
        description:
            "Le médecin enregistre la consultation dans son tableau de bord et génère une feuille de soins numérique transmise automatiquement.",
        icon: (
            <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
            </svg>
        ),
    },
    {
        number: '03',
        actor: 'Assureur',
        actorColor: 'bg-emerald-500',
        actorBadgeText: 'text-emerald-700 bg-emerald-50',
        actorShadow: 'shadow-emerald-500/20',
        title: 'Traitement de la demande',
        description:
            "L'assureur reçoit et examine la feuille de soins. Il applique les règles : 100% pour un généraliste, 80% pour un spécialiste.",
        icon: (
            <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
            </svg>
        ),
    },
    {
        number: '04',
        actor: 'Assuré',
        actorColor: 'bg-blue-600',
        actorBadgeText: 'text-blue-700 bg-blue-50',
        actorShadow: 'shadow-blue-600/20',
        title: 'Remboursement effectué',
        description:
            "L'assuré reçoit son remboursement selon le mode choisi (virement ou cash) et peut suivre l'historique depuis son espace.",
        icon: (
            <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
            </svg>
        ),
    },
]

export default function HowItWorksSection() {
    return (
        <section
            id="how-it-works"
            className="py-24 lg:py-32 bg-slate-50/50 relative overflow-hidden"
        >
            <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">

                {/* Header - Centré avec plus de respiration */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-24"
                >
                    <span className="inline-block text-blue-600 text-sm font-bold uppercase tracking-widest mb-4 bg-blue-50 px-4 py-1.5 rounded-full">
                        Processus simplifié
                    </span>
                    <h2
                        className="text-4xl lg:text-5xl font-extrabold text-slate-900 mb-6 tracking-tight"
                        style={{ fontFamily: 'var(--font-display)' }}
                    >
                        Comment ça marche ?
                    </h2>
                    <p className="text-slate-600 text-lg max-w-2xl mx-auto leading-relaxed">
                        Du rendez-vous médical au remboursement, chaque étape est fluide, traçable
                        et sécurisée.
                    </p>
                </motion.div>

                {/* Steps Container */}
                <div className="relative mb-24">
                    {/* Ligne de connexion corrigée : top-8 correspond parfaitement au centre des icônes w-16 (64px) */}
                    <div className="hidden lg:block absolute top-8 left-[12.5%] right-[12.5%] h-[2px] bg-gradient-to-r from-blue-100 via-slate-200 to-emerald-100" />

                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
                        {steps.map((step, i) => (
                            <motion.div
                                key={step.number}
                                initial={{ opacity: 0, y: 40 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-50px" }}
                                transition={{ duration: 0.6, delay: i * 0.15 }}
                                className="relative flex flex-col items-center text-center px-4 h-full"
                            >
                                {/* Icône avec effet d'ombre et d'anneau */}
                                <div className="relative mb-8 group">
                                    <div className={`w-16 h-16 ${step.actorColor} rounded-2xl flex items-center justify-center text-white shadow-xl ${step.actorShadow} z-10 relative transition-transform duration-300 group-hover:-translate-y-1`}>
                                        {step.icon}
                                    </div>
                                    {/* Numéro de l'étape affiné */}
                                    <span className="absolute -top-3 -right-3 w-7 h-7 bg-white border-2 border-slate-100 shadow-sm rounded-full text-xs font-bold text-slate-600 flex items-center justify-center z-20">
                                        {i + 1}
                                    </span>
                                </div>

                                {/* Badge Acteur plus subtil */}
                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider mb-4 ${step.actorBadgeText}`}>
                                    {step.actor}
                                </span>

                                {/* Textes de l'étape */}
                                <h3
                                    className="text-xl font-bold text-slate-900 mb-3 leading-tight"
                                    style={{ fontFamily: 'var(--font-display)' }}
                                >
                                    {step.title}
                                </h3>
                                <p className="text-slate-600 text-sm leading-relaxed">
                                    {step.description}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Bannière "Transparence" repensée */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-8 lg:p-12 flex flex-col lg:flex-row items-center justify-between gap-10 shadow-2xl relative z-20"
                >
                    <div className="flex-1 text-center lg:text-left max-w-2xl">
                        <p className="text-blue-400 text-sm font-bold uppercase tracking-widest mb-3">
                            Règle de remboursement
                        </p>
                        <h3
                            className="text-3xl lg:text-4xl font-extrabold text-white mb-4 tracking-tight"
                            style={{ fontFamily: 'var(--font-display)' }}
                        >
                            Transparence totale sur les tarifs
                        </h3>
                        <p className="text-slate-400 text-lg leading-relaxed">
                            Les taux de prise en charge sont fixes et définis à l'avance.
                            Aucune mauvaise surprise pour l'assuré.
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-5 shrink-0 w-full sm:w-auto">
                        {/* Bloc Généraliste */}
                        <div className="bg-blue-600 rounded-2xl p-6 lg:p-8 text-center flex-1 sm:min-w-[160px] shadow-lg shadow-blue-900/20">
                            <p className="text-5xl lg:text-6xl font-black text-white mb-2" style={{ fontFamily: 'var(--font-display)' }}>100<span className="text-3xl">%</span></p>
                            <div className="w-8 h-1 bg-blue-400 mx-auto rounded-full mb-3" />
                            <p className="text-blue-100 text-sm font-semibold uppercase tracking-wide">Généraliste</p>
                        </div>

                        {/* Bloc Spécialiste */}
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 lg:p-8 text-center flex-1 sm:min-w-[160px] backdrop-blur-sm">
                            <p className="text-5xl lg:text-6xl font-black text-white mb-2" style={{ fontFamily: 'var(--font-display)' }}>80<span className="text-3xl">%</span></p>
                            <div className="w-8 h-1 bg-slate-600 mx-auto rounded-full mb-3" />
                            <p className="text-slate-300 text-sm font-semibold uppercase tracking-wide">Spécialiste</p>
                        </div>
                    </div>
                </motion.div>

            </div>
        </section>
    )
}