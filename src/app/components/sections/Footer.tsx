const footerLinks = {
  Plateforme: ['Fonctionnalités', 'Tarifs', 'Sécurité', 'Documentation API'],
  'Pour les professionnels': ['Médecins partenaires', 'Assureurs', 'Intégrations', 'Formations'],
  Entreprise: ['À propos', 'Contact', 'Presse', 'Carrières'],
  Légal: ['Mentions légales', 'Politique de confidentialité', 'CGU', 'Cookies'],
}

const socials = [
  {
    name: 'LinkedIn',
    icon: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
  {
    name: 'Twitter',
    icon: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    name: 'Facebook',
    icon: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
  },
]

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-white">
      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-5 gap-10 lg:gap-12">
          {/* Brand column */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2.5 mb-5">
              <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-600/30">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M10 2L3 6V10C3 14.4 6.1 18.5 10 19.4C13.9 18.5 17 14.4 17 10V6L10 2Z" fill="white" />
                  <path d="M7 10L9 12L13 8" stroke="#2563EB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <span
                className="font-bold text-lg text-white"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                AssurRassure
              </span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed mb-6">
              La plateforme d'assurance santé qui simplifie la gestion des soins au Cameroun.
            </p>
            <div className="flex gap-3">
              {socials.map(social => (
                <button
                  key={social.name}
                  className="w-9 h-9 rounded-xl bg-white/5 hover:bg-blue-600/20 hover:text-blue-400 text-slate-400 flex items-center justify-center transition-all duration-200"
                  title={social.name}
                >
                  {social.icon}
                </button>
              ))}
            </div>
          </div>

          {/* Links columns */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="text-white font-semibold text-sm mb-4">{category}</h3>
              <ul className="flex flex-col gap-2.5">
                {links.map(link => (
                  <li key={link}>
                    <button className="text-slate-400 hover:text-white text-sm transition-colors duration-200">
                      {link}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-slate-500 text-xs">
            © 2026 AssurRassure. Tous droits réservés. — Yaoundé, Cameroun
          </p>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-slate-500 text-xs">Tous les systèmes opérationnels</span>
          </div>
        </div>
      </div>
    </footer>
  )
}