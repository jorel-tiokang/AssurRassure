import { Outlet, Link, useLocation } from "react-router"
import { LayoutDashboard, FileText, PlusCircle, LogOut, Users, Bell } from "lucide-react"

export function MedecinLayout() {
  const location = useLocation()
  
  // Conditionally render "Mes Patients" depending on specialist status
  const isSpecialiste = false; 
  
  const navItems = [
    { name: "Tableau de bord", path: "/medecin/dashboard", icon: LayoutDashboard },
    ...(isSpecialiste ? [] : [{ name: "Mes Patients", path: "/medecin/patients", icon: Users }]),
    { name: "Mes Consultations", path: "/medecin/consultations", icon: FileText },
  ]

  return (
    <div className="flex min-h-screen bg-canvas font-sans">
      <aside className="w-64 bg-ink text-white flex flex-col border-r border-white/10">
        <div className="p-6">
          <Link to="/" className="flex items-center gap-2">
            <div className="h-8 w-8 bg-[#0055FF] rounded-sm flex items-center justify-center">
              <span className="font-display font-bold text-lg text-white leading-none">A</span>
            </div>
            <span className="font-display font-bold text-xl tracking-tight">AssurRassure</span>
          </Link>
          <div className="mt-2 text-xs text-white/50 tracking-widest uppercase font-medium">Espace Médecin</div>
        </div>
        
        <nav className="flex-1 px-4 py-6 space-y-1">
          {navItems.map((item) => {
            const isReallyActive = location.pathname.startsWith(item.path) && (item.path !== '/medecin/consultations' || location.pathname === '/medecin/consultations') || (item.path === '/medecin/consultations' && location.pathname.startsWith('/medecin/consultations'))
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2.5 text-sm font-medium transition-colors ${
                  isReallyActive 
                    ? "bg-white/10 text-white" 
                    : "text-white/60 hover:bg-white/5 hover:text-white"
                }`}
              >
                <item.icon className="h-5 w-5" strokeWidth={1.5} />
                {item.name}
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t border-white/10">
          <Link to="/medecin/profil" className="flex items-center gap-3 px-3 py-3 hover:bg-white/5 transition-colors">
            <div className="h-10 w-10 bg-white/10 rounded-full flex items-center justify-center">
              <span className="text-sm font-medium">DR</span>
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-medium truncate text-white">Dr. Kamga Alain</p>
              <p className="text-xs text-white/60 truncate">RPPS: MED-789012</p>
            </div>
          </Link>
          <Link
            to="/login"
            className="mt-2 flex items-center gap-3 px-3 py-2 text-sm font-medium text-white/60 hover:text-white transition-colors"
          >
            <LogOut className="h-4 w-4" />
            Déconnexion
          </Link>
        </div>
      </aside>
      
      <main className="flex-1 flex flex-col min-h-screen">
        <header className="h-16 border-b border-ink/10 bg-surface flex items-center justify-between px-8">
          <h1 className="font-display text-xl font-medium tracking-tight text-ink">
            {navItems.find(i => {
              if (i.path === '/medecin/consultations') return location.pathname.startsWith('/medecin/consultations')
              return location.pathname.startsWith(i.path)
            })?.name || "Espace Médecin"}
          </h1>
          <div className="flex items-center gap-6">
            {/* Removed notifications and actif badges here */}
          </div>
        </header>
        <div className="flex-1 p-8 overflow-auto">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
