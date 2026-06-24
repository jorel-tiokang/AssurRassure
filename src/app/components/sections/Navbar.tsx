import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { clsx } from 'clsx'

const navLinks = [
  { label: 'Accueil', href: '#hero' },
  { label: 'Fonctionnalités', href: '#features' },
  { label: 'Comment ça marche', href: '#how-it-works' },
  { label: 'Statistiques', href: '#stats' },
  { label: 'Contact', href: '#cta' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [activeLink, setActiveLink] = useState('#hero')

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleNav = (href: string) => {
    setActiveLink(href)
    setMobileOpen(false)
    
    const element = document.querySelector(href)
    if (element) {
      // Offset de 85px pour compenser la hauteur de la navbar fixe
      const offset = 85 
      const bodyRect = document.body.getBoundingClientRect().top
      const elementRect = element.getBoundingClientRect().top
      const elementPosition = elementRect - bodyRect
      const offsetPosition = elementPosition - offset

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      })
    }
  }

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className={clsx(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
          scrolled
            ? 'bg-white/95 backdrop-blur-md shadow-xs border-b border-slate-100 py-3'
            : 'bg-white/60 backdrop-blur-xs py-5'
        )}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between">
            
            {/* LOGO */}
            <button
              onClick={() => handleNav('#hero')}
              className="flex items-center gap-3 group text-left focus:outline-hidden"
            >
              <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-md shadow-blue-600/30 group-hover:scale-105 transition-transform">
                <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                  <path d="m9 12 2 2 4-4"/>
                </svg>
              </div>
              <span className="font-extrabold text-xl tracking-tight text-slate-900">
                Assur<span className="text-blue-600">Rassure</span>
              </span>
            </button>

            {/* DESKTOP NAV (Espacement aéré : gap-8) */}
            <nav className="hidden lg:flex items-center gap-8">
              {navLinks.map(link => {
                const isActive = activeLink === link.href
                return (
                  <button
                    key={link.href}
                    onClick={() => handleNav(link.href)}
                    className={clsx(
                      'relative py-1 text-sm font-semibold transition-colors duration-150',
                      isActive 
                        ? 'text-blue-600' 
                        : 'text-slate-600 hover:text-blue-600'
                    )}
                  >
                    {link.label}
                    {/* Point d'accentuation Framer Motion sous le lien actif */}
                    {isActive && (
                      <motion.span
                        layoutId="activeNavIndicator"
                        className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-blue-600 rounded-full"
                      />
                    )}
                  </button>
                )
              })}
            </nav>

            {/* CTAs DESKTOP */}
            <div className="hidden lg:flex items-center gap-4">
              <button className="text-sm font-semibold text-slate-700 hover:text-blue-600 px-3 py-2 transition-colors">
                Connexion
              </button>
              <button className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-5 py-2.5 rounded-xl shadow-sm hover:shadow-blue-600/25 transition-all duration-150 hover:-translate-y-0.5 active:translate-y-0">
                Commencer
              </button>
            </div>

            {/* HAMBURGER MOBILE */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden flex flex-col gap-1.5 p-2 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors"
            >
              {[0, 1, 2].map(i => (
                <span
                  key={i}
                  className={clsx(
                    'block h-0.5 bg-slate-800 transition-all duration-300 rounded-full',
                    mobileOpen && i === 0 && 'rotate-45 translate-y-2 w-6',
                    mobileOpen && i === 1 && 'opacity-0 w-4',
                    mobileOpen && i === 2 && '-rotate-45 -translate-y-2 w-6',
                    !mobileOpen && 'w-6'
                  )}
                />
              ))}
            </button>
          </div>
        </div>
      </motion.header>

      {/* MOBILE MENU */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="fixed top-20 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-xl lg:hidden px-6 py-6"
          >
            <div className="flex flex-col gap-2">
              {navLinks.map(link => (
                <button
                  key={link.href}
                  onClick={() => handleNav(link.href)}
                  className={clsx(
                    'text-left px-4 py-3 rounded-xl text-base font-semibold transition-all',
                    activeLink === link.href
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-slate-700 hover:bg-slate-50'
                  )}
                >
                  {link.label}
                </button>
              ))}
              <div className="pt-4 mt-2 border-t border-slate-100 flex flex-col gap-2">
                <button className="text-base font-semibold text-slate-700 px-4 py-3 rounded-xl hover:bg-slate-50 text-left">
                  Connexion
                </button>
                <button className="bg-blue-600 hover:bg-blue-700 text-white text-base font-semibold px-4 py-3.5 rounded-xl text-center shadow-sm">
                  Commencer
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}