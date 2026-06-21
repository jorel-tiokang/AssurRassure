import { Link } from "react-router"
import { Button } from "../components/ui/button"
import { ArrowRight, ShieldCheck, Zap, HeartPulse } from "lucide-react"
import { motion } from "motion/react"
import { ImageWithFallback } from "../components/figma/ImageWithFallback"

export function LandingPage() {
  const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  }

  const stagger = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
  }

  return (
    <div className="w-full">
      {/* Navigation */}
      <nav className="h-20 flex items-center justify-between px-6 md:px-12 max-w-[1400px] mx-auto w-full border-b border-ink/5">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 bg-[#0055FF] rounded-sm flex items-center justify-center">
            <span className="font-display font-bold text-lg text-white leading-none">A</span>
          </div>
          <span className="font-display font-bold text-xl tracking-tight">AssurRassure</span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium">
          <Link to="#" className="hover:text-[#0055FF] transition-colors">La Solution</Link>
          <Link to="#" className="hover:text-[#0055FF] transition-colors">Agents</Link>
          <Link to="#" className="hover:text-[#0055FF] transition-colors">Médecins</Link>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="ghost" asChild className="hidden md:inline-flex">
            <Link to="/login">Se connecter</Link>
          </Button>
          <Button asChild className="bg-[#0055FF] hover:bg-[#0044CC]">
            <Link to="/login">Accéder au portail <ArrowRight className="ml-2 h-4 w-4" /></Link>
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-[1400px] mx-auto px-6 md:px-12 pt-16 md:pt-24 pb-16 lg:pb-32 overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={stagger}
            className="flex flex-col items-start max-w-xl"
          >
            <motion.h1 variants={fadeUp} className="text-5xl md:text-6xl lg:text-7xl font-display font-medium tracking-tight text-ink leading-[1.05]">
              L'assurance santé,<br/> simplifiée et tracée.
            </motion.h1>
            <motion.p variants={fadeUp} className="mt-6 text-lg text-ink-muted leading-relaxed max-w-[500px]">
              AssurRassure centralise la gestion des assurés CAM-SANTE. Connectez agents et médecins, digitalisez les feuilles de maladie et accélérez les remboursements en Francs CFA.
            </motion.p>
            <motion.div variants={fadeUp} className="mt-8 flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <Button size="lg" asChild className="w-full sm:w-auto text-base">
                <Link to="/login">Démarrer une session</Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="w-full sm:w-auto text-base">
                <Link to="/agent/dashboard">Aperçu Agent</Link>
              </Button>
            </motion.div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            className="relative aspect-[4/3] w-full bg-zinc-100 overflow-hidden"
          >
            <ImageWithFallback 
              src="https://images.unsplash.com/photo-1643297654416-05795d62e39c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhZnJpY2FuJTIwZG9jdG9yJTIwcHJvZmVzc2lvbmFsJTIwbW9kZXJufGVufDF8fHx8MTc4MDYwNjE0N3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral" 
              alt="Médecin professionnel consultant un dossier patient" 
              className="w-full h-full object-cover"
            />
            {/* Minimalist UI Overlay */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur-md p-6 border border-white/20 shadow-sm flex items-center justify-between"
            >
              <div>
                <p className="text-sm font-medium text-ink-muted">Feuilles de maladie traitées</p>
                <p className="text-3xl font-display font-medium text-ink mt-1">12 450</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center text-green-700">
                <ShieldCheck className="h-6 w-6" />
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Bento Grid Features */}
      <section className="bg-ink text-white py-24 md:py-32">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={stagger}
            className="max-w-2xl mb-16"
          >
            <motion.h2 variants={fadeUp} className="text-4xl md:text-5xl font-display font-medium tracking-tight">
              L'infrastructure complète pour la santé.
            </motion.h2>
            <motion.p variants={fadeUp} className="mt-4 text-lg text-white/60">
              Des prescriptions médicales aux remboursements intégrés, gérez l'ensemble du cycle de vie de l'assurance avec une traçabilité totale.
            </motion.p>
          </motion.div>

          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={stagger}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[320px]"
          >
            {/* Cell 1: Large feature */}
            <motion.div variants={fadeUp} className="md:col-span-2 bg-white/5 border border-white/10 p-8 flex flex-col justify-between hover:bg-white/10 transition-colors group">
              <div className="h-12 w-12 bg-[#0055FF] flex items-center justify-center">
                <HeartPulse className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-display font-medium mb-2">Parcours Patient 100% Numérique</h3>
                <p className="text-white/60 max-w-[80%]">Attribution des médecins traitants, enregistrement immédiat des consultations et création automatique des feuilles de maladie dès la visite.</p>
              </div>
            </motion.div>

            {/* Cell 2: Image background */}
            <motion.div variants={fadeUp} className="relative border border-white/10 overflow-hidden group">
              <ImageWithFallback 
                src="https://images.unsplash.com/photo-1655635643486-a17bc48771ff?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoZWFsdGhjYXJlJTIwdGVjaG5vbG9neSUyMG1vZGVybiUyMGFic3RyYWN0fGVufDF8fHx8MTc4MDYwNjE1MHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral" 
                alt="Données sécurisées"
                className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/20 to-transparent" />
              <div className="absolute bottom-8 left-8 right-8">
                <h3 className="text-xl font-display font-medium mb-2 text-white">Sécurité par Design</h3>
                <p className="text-sm text-white/70">Journaux d'audit et rôles stricts.</p>
              </div>
            </motion.div>

            {/* Cell 3: Small feature */}
            <motion.div variants={fadeUp} className="bg-white/5 border border-white/10 p-8 flex flex-col justify-between hover:bg-white/10 transition-colors">
              <div className="h-10 w-10 border border-white/20 flex items-center justify-center">
                <Zap className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-display font-medium mb-2">Remboursements Flexibles</h3>
                <p className="text-sm text-white/60">Gestion Cash et Virement, factures PDF instantanées et grilles tarifaires configurables.</p>
              </div>
            </motion.div>

            {/* Cell 4: Large feature (bottom span) */}
            <motion.div variants={fadeUp} className="md:col-span-2 relative overflow-hidden bg-white/5 border border-white/10 p-8 flex flex-col sm:flex-row gap-8 items-center justify-between">
              <div className="flex-1 z-10">
                <h3 className="text-2xl font-display font-medium mb-2">Pensé pour le terrain</h3>
                <p className="text-white/60 mb-6 max-w-sm">Une interface claire, anti-slop, favorisant la lisibilité des KPI (montants en FCFA, répartition par médecins) sans distractions.</p>
                <Button variant="outline" className="text-white border-white/20 hover:bg-white hover:text-ink">
                  Découvrir les fonctionnalités
                </Button>
              </div>
              <div className="w-full sm:w-1/2 aspect-video bg-ink/50 border border-white/10 p-4 transform translate-x-4 translate-y-4 rounded-tl-xl shadow-2xl relative z-0">
                <div className="w-full h-full bg-surface/5 backdrop-blur border border-white/10 p-4 space-y-3">
                  <div className="h-4 w-1/3 bg-white/20 rounded-sm" />
                  <div className="h-12 w-full bg-white/10 rounded-sm" />
                  <div className="h-12 w-full bg-[#0055FF]/40 rounded-sm" />
                  <div className="h-12 w-full bg-white/10 rounded-sm" />
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-24 max-w-[1400px] mx-auto px-6 md:px-12 border-b border-ink/5">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row justify-between items-center gap-12"
        >
          <h2 className="text-2xl font-display font-medium text-ink max-w-xs">
            Conforme aux exigences des réseaux de santé nationaux.
          </h2>
          <div className="flex flex-wrap gap-8 md:gap-16 opacity-40 grayscale items-center justify-center">
            <span className="text-xl font-display font-bold tracking-widest">MINSANTE</span>
            <span className="text-xl font-display font-bold tracking-widest">CAM-SANTE</span>
            <span className="text-xl font-display font-bold tracking-widest">CNPS</span>
            <span className="text-xl font-display font-bold tracking-widest">CLINIQUES PARTENAIRES</span>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="bg-canvas py-12 text-center text-ink-muted text-sm border-t border-ink/5 mt-16">
        <p>© 2026 AssurRassure. Système de gestion de l'assurance sociale CAM-SANTE.</p>
      </footer>
    </div>
  )
}
