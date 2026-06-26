import { useState } from "react"
import { useNavigate } from "react-router"
import { Button } from "../../components/ui/button"
import { authService } from "../../lib/authService"

const FloatingInput = ({ id, type, label, required, value, onChange }: { id: string, type: string, label: string, required?: boolean, value?: string, onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void }) => (
  <div className="relative">
    <input
      id={id}
      type={type}
      className="block px-3 py-3 w-full text-sm text-ink bg-transparent rounded-lg border border-zinc-300 appearance-none focus:outline-none focus:ring-2 focus:ring-[#0055FF]/20 focus:border-[#0055FF] peer"
      placeholder=" "
      required={required}
      value={value}
      onChange={onChange}
    />
    <label
      htmlFor={id}
      className="absolute text-sm text-ink-muted duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-1 start-2 peer-focus:text-[#0055FF] peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 cursor-text"
    >
      {label}
    </label>
  </div>
)

export function LoginPage() {
  const [role, setRole] = useState<"AGENT" | "MEDECIN">("AGENT")
  const [email, setEmail] = useState("")
  const [identifiant, setIdentifiant] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const navigate = useNavigate()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const creds = role === "AGENT" 
        ? { email, password } 
        : { identifiant, password };

      const response = await authService.login(creds)
      
      if (response.role === "AGENT") {
        navigate("/agent/dashboard")
      } else {
        navigate("/medecin/dashboard")
      }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.message || "Erreur lors de la connexion. Vérifiez vos identifiants.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center login-page-bg p-4 sm:p-6">
      <div className="w-full max-w-[900px] bg-white shadow-2xl rounded-2xl overflow-hidden flex flex-col md:flex-row">
        
        {/* Left Form Column */}
        <div className="w-full md:w-[450px] p-8 sm:p-12 relative z-10 bg-white flex flex-col justify-center">
          <div className="mb-8 flex flex-col items-center text-center">
                            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-md shadow-blue-600/30 group-hover:scale-105 transition-transform">
                                <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                                    <path d="m9 12 2 2 4-4" />
                                </svg>
                            </div>
            <h1 className="text-3xl font-display font-medium text-ink tracking-tight">
              Se connecter
            </h1>
            <p className="text-ink-muted mt-2">
              Accédez au système de gestion AssurRassure.
            </p>
          </div>

          <div className="flex gap-2 mb-8 p-1 bg-zinc-100 rounded-lg">
            <button
              type="button"
              onClick={() => setRole("AGENT")}
              className={`flex-1 py-2 text-sm font-medium transition-colors rounded-md ${
                role === "AGENT" ? "bg-white text-ink shadow-sm" : "text-ink-muted hover:text-ink"
              }`}
            >
              Assureur
            </button>
            <button
              type="button"
              onClick={() => setRole("MEDECIN")}
              className={`flex-1 py-2 text-sm font-medium transition-colors rounded-md ${
                role === "MEDECIN" ? "bg-white text-ink shadow-sm" : "text-ink-muted hover:text-ink"
              }`}
            >
              Médecin
            </button>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            {error && (
              <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-200">
                {error}
              </div>
            )}
            
            <div className="overflow-hidden w-full relative">
              <div
                className="flex transition-transform duration-500 ease-in-out"
                style={{
                  width: '200%',
                  transform: role === 'AGENT' ? 'translateX(0)' : 'translateX(-50%)'
                }}
              >
                <div className="w-1/2 flex-shrink-0 pr-2">
                  <FloatingInput
                    id="email"
                    type="email"
                    label="Adresse email"
                    required={role === "AGENT"}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="w-1/2 flex-shrink-0 pl-2">
                  <FloatingInput
                    id="identifiant"
                    type="text"
                    label="Identifiant médecin (RPPS)"
                    required={role === "MEDECIN"}
                    value={identifiant}
                    onChange={(e) => setIdentifiant(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div>
              <FloatingInput
                id="password"
                type="password"
                label="Mot de passe"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="mt-6">
              <Button disabled={isLoading} type="submit" className="w-full bg-[#0055FF] hover:bg-[#0044CC] h-12 text-base rounded-lg shadow-md hover:shadow-lg transition-all duration-300 disabled:opacity-50">
                {isLoading ? "Connexion en cours..." : "Connexion"}
              </Button>
            </div>
          </form>

          <div className="mt-8 text-center text-xs text-ink-muted">
            <p>AssurRassure v1.0 • Accès restreint</p>
          </div>
        </div>

        {/* Right Image Column */}
        <div className="hidden md:block flex-1 relative bg-zinc-100">
          <img fetchPriority="high" src="/loginImage.jpg" alt="Login background" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#005092]/80 to-transparent mix-blend-multiply"></div>
        </div>

      </div>
    </div>
  )
}
