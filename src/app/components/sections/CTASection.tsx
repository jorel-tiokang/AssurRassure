import { motion } from 'framer-motion'

export default function CTASection() {
  return (
    <section id="cta" className="py-24 lg:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.7 }}
          className="relative bg-slate-900 rounded-[2rem] overflow-hidden p-10 lg:p-16 text-center z-10"
        >
          {/* Background decor */}
          <div className="absolute inset-0">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-[80px]" />
            <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-cyan-500/15 rounded-full blur-[60px]" />
            <div className="absolute inset-0 bg-grid-pattern opacity-10" />
          </div>

          {/* Diagonal cut top */}
          <div
            className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-600 via-cyan-400 to-blue-600"
          />

          <div className="relative z-10">
            {/* Icon */}
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="w-20 h-20 bg-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-blue-600/40 animate-float"
            >
              <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
              </svg>
            </motion.div>

            <h2
              className="text-4xl lg:text-6xl font-black text-white mb-6 leading-tight"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Prêt à simplifier votre<br />
              <span className="text-gradient-primary">gestion d'assurance ?</span>
            </h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
              Rejoignez AssurRassure aujourd'hui. Inscrivez-vous en quelques minutes
              et découvrez une nouvelle façon de gérer les soins de santé.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
              <button className="group flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-500 text-white font-bold px-8 py-4 rounded-2xl shadow-2xl shadow-blue-600/30 hover:shadow-blue-500/40 transition-all duration-300 hover:-translate-y-1 text-base">
                Créer mon compte gratuitement
                <svg
                  className="w-5 h-5 group-hover:translate-x-1 transition-transform"
                  fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </button>
              <button className="flex items-center justify-center gap-3 border border-white/20 hover:border-white/40 text-white/80 hover:text-white font-semibold px-8 py-4 rounded-2xl hover:bg-white/5 transition-all duration-300 text-base">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                </svg>
                Nous contacter
              </button>
            </div>

            {/* Trust indicators */}
            <div className="flex flex-wrap gap-6 justify-center">
              {[
                'Aucune carte de crédit requise',
                'Configuration en 5 minutes',
                'Support disponible 24/7',
              ].map(text => (
                <div key={text} className="flex items-center gap-2 text-slate-400 text-sm">
                  <svg className="w-4 h-4 text-emerald-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                  {text}
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}