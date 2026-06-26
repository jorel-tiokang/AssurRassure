import { motion } from 'framer-motion'

export default function HeroSection() {
    return (
        <section
            id="hero"
            className="relative min-h-[92vh] flex items-center bg-[#090D16] overflow-hidden pt-24 pb-20"
        >
            {/* 1. AMBIENT GLOW (Un seul, très large, centré en haut. Fini les taches partout) */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[500px] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-600/15 via-transparent to-transparent pointer-events-none" />


            <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 w-full">
                <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">

                    {/* ================= COLONNE GAUCHE (6/12) ================= */}
                    <div className="lg:col-span-6 text-left">

                        <motion.div
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="flex flex-col items-start mb-8"
                        >
                            <span className="text-blue-400 text-sm font-bold uppercase tracking-widest mb-2">
                                Assurance Santé & Automatisation
                            </span>
                            <div className="w-12 h-1 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full" />
                        </motion.div>

                        {/* Headline propre */}
                        <motion.h1
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                            className="text-4xl sm:text-5xl xl:text-6xl font-extrabold text-white tracking-tight leading-[1.08] mb-6"
                        >
                            La gestion des assurés et leurs feuilles de soins, <br className="hidden sm:block" />
                            <span className="text-blue-500">simplifiée et automatisée.</span>
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="text-lg text-slate-400 leading-relaxed mb-10 max-w-xl"
                        >
                            La plateforme dédiée aux Médecins et aux Assureurs pour fluidifier les remboursements.
                            Éditez vos feuilles de soins en consultation et déclenchez les remboursements en un clic selon vos barèmes.
                        </motion.p>

                        {/* Boutons d'action (Fix de l'alignement) */}
                        <motion.div
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                            className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mb-14 max-w-md"
                        >
                            <a href="/login" className="group flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-base px-8 py-4 rounded-xl shadow-lg shadow-blue-600/25 transition-all w-full sm:w-auto">
                                Ouvrir mon espace
                                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                                </svg>
                            </a>
                        </motion.div>

                        {/* Chiffres de rassurance */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5, delay: 0.4 }}
                            className="grid grid-cols-3 gap-6 pt-8 border-t border-slate-800/80 max-w-lg"
                        >
                            <div>
                                <p className="text-2xl sm:text-3xl font-bold text-white tracking-tight">100%</p>
                                <p className="text-xs text-slate-400 mt-1 font-medium">Généralistes</p>
                            </div>
                            <div>
                                <p className="text-2xl sm:text-3xl font-bold text-white tracking-tight">80%</p>
                                <p className="text-xs text-slate-400 mt-1 font-medium">Spécialistes</p>
                            </div>
                            <div>
                                <p className="text-2xl sm:text-3xl font-bold text-white tracking-tight">48h</p>
                                <p className="text-xs text-slate-400 mt-1 font-medium">Délai virement</p>
                            </div>
                        </motion.div>
                    </div>

                    {/* ================= COLONNE DROITE : LA CARTE PREMIUM (6/12) ================= */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.96 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="lg:col-span-6 relative w-full max-w-lg mx-auto lg:max-w-none"
                    >
                        {/* Lueur d'accentuation sous la carte */}
                        <div className="absolute -inset-1 bg-gradient-to-r from-blue-600/20 to-indigo-600/20 rounded-[28px] blur-xl opacity-70" />

                        {/* La carte principale */}
                        <div className="relative bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl">

                            {/* Header de la carte */}
                            <div className="flex items-center justify-between pb-6 mb-6 border-b border-slate-800">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 font-bold text-sm">
                                        FC
                                    </div>
                                    <div>
                                        <p className="text-xs font-medium text-slate-400">Espace Assureur</p>
                                        <p className="text-sm font-bold text-white">Moteur de Remboursement</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-6 h-[1px] bg-emerald-500/30" />
                                    <span className="text-xs text-emerald-400 font-semibold uppercase tracking-widest">
                                        Barème actif
                                    </span>
                                    <div className="w-6 h-[1px] bg-emerald-500/30" />
                                </div>
                            </div>

                            {/* Contenu : Les 2 simulations imbriquées */}
                            <div className="space-y-3.5">

                                {/* Ligne 1 : Généraliste */}
                                <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 hover:border-slate-700 transition-colors">
                                    <div className="flex justify-between items-center mb-2">
                                        <div className="flex items-center gap-2">
                                            <span className="w-2 h-2 rounded-full bg-emerald-400" />
                                            <span className="text-xs sm:text-sm font-semibold text-slate-200">Dr. Jorel (Généraliste)</span>
                                        </div>
                                        <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">100%</span>
                                    </div>
                                    <div className="flex justify-between items-baseline text-xs text-slate-400 pt-2 border-t border-slate-800/50">
                                        <span>Consultation : 15 000 FCFA</span>
                                        <span className="text-sm font-bold text-emerald-400">+15 000 FCFA</span>
                                    </div>
                                </div>

                                {/* Ligne 2 : Spécialiste */}
                                <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 hover:border-slate-700 transition-colors">
                                    <div className="flex justify-between items-center mb-2">
                                        <div className="flex items-center gap-2">
                                            <span className="w-2 h-2 rounded-full bg-blue-400" />
                                            <span className="text-xs sm:text-sm font-semibold text-slate-200">Dr. Mvondo (Cardiologue)</span>
                                        </div>
                                        <span className="text-xs font-bold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded">80%</span>
                                    </div>
                                    <div className="flex justify-between items-baseline text-xs text-slate-400 pt-2 border-t border-slate-800/50">
                                        <span>Consultation : 20 000 FCFA</span>
                                        <span className="text-sm font-bold text-blue-400">+16 000 FCFA</span>
                                    </div>
                                </div>

                            </div>

                            {/* Faux Toast de déclenchement */}
                            <div className="mt-6 p-3.5 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-between text-xs text-blue-300">
                                <div className="flex items-center gap-2.5">
                                    <svg className="w-4 h-4 text-blue-400 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
                                    </svg>
                                    <span className="font-medium">Total débloqué aux assurés</span>
                                </div>
                                <span className="font-mono text-blue-400 font-bold">31 000 FCFA</span>
                            </div>

                        </div>
                    </motion.div>

                </div>
            </div>
        </section>
    )
}