import { useState } from 'react'

interface AuthModalProps {
  onClose: () => void
  onLogin: (email: string, password: string) => Promise<void>
  onSignup: (email: string, password: string) => Promise<void>
}

export function AuthModal({ onClose, onLogin, onSignup }: AuthModalProps) {
  const [mode, setMode] = useState<'login' | 'signup'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      if (mode === 'login') {
        await onLogin(email, password)
        onClose()
      } else {
        await onSignup(email, password)
        setSuccess(true)
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Une erreur est survenue.'
      setError(translateError(msg))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-full max-w-sm bg-surface-950 border border-zinc-800 rounded-2xl p-6 shadow-2xl animate-slide-up">
        {/* Logo */}
        <div className="flex items-center gap-2 mb-6">
          <div className="w-7 h-7 rounded-lg bg-brand-500/20 border border-brand-500/30 flex items-center justify-center">
            <svg className="w-3.5 h-3.5 text-brand-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.955 11.955 0 01.048 12c0 3.293 1.328 6.272 3.474 8.448A11.955 11.955 0 0112 23.952c2.73 0 5.24-.92 7.238-2.452A11.956 11.956 0 0023.952 12 11.956 11.956 0 0020.478 6a11.959 11.959 0 01-5.978-3.236A11.959 11.959 0 0112 2.048z" />
            </svg>
          </div>
          <span className="text-sm font-semibold text-white">frata</span>
        </div>

        {success ? (
          <div className="text-center py-4">
            <div className="w-12 h-12 rounded-full bg-success-500/10 border border-success-500/20 flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-success-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
            </div>
            <h2 className="text-white font-semibold mb-2">Vérifie ton email</h2>
            <p className="text-zinc-400 text-sm">Un lien de confirmation a été envoyé à <span className="text-white">{email}</span>.</p>
            <p className="text-zinc-500 text-xs mt-2">3 crédits offerts à l'activation du compte.</p>
          </div>
        ) : (
          <>
            <h2 className="text-lg font-semibold text-white mb-1">
              {mode === 'login' ? 'Connexion' : 'Créer un compte'}
            </h2>
            <p className="text-zinc-500 text-sm mb-5">
              {mode === 'signup' ? '3 crédits offerts à l\'inscription.' : 'Bon retour sur frata.'}
            </p>

            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1.5">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  autoFocus
                  placeholder="toi@exemple.com"
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2.5 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-brand-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1.5">Mot de passe</label>
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  minLength={6}
                  placeholder="••••••••"
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2.5 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-brand-500 transition-colors"
                />
              </div>

              {error && (
                <p className="text-danger-400 text-xs bg-danger-500/10 border border-danger-500/20 rounded-lg px-3 py-2">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-1 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-400 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold transition-colors flex items-center justify-center gap-2"
              >
                {loading && <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
                {mode === 'login' ? 'Se connecter' : 'Créer mon compte'}
              </button>
            </form>

            <p className="text-center text-xs text-zinc-500 mt-4">
              {mode === 'login' ? 'Pas encore de compte ?' : 'Déjà un compte ?'}{' '}
              <button
                onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setError(null) }}
                className="text-brand-400 hover:text-brand-300 font-medium transition-colors"
              >
                {mode === 'login' ? 'S\'inscrire' : 'Se connecter'}
              </button>
            </p>
          </>
        )}

        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-600 hover:text-zinc-400 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  )
}

function translateError(msg: string): string {
  if (msg.includes('Invalid login credentials')) return 'Email ou mot de passe incorrect.'
  if (msg.includes('Email not confirmed')) return 'Confirme ton email avant de te connecter.'
  if (msg.includes('User already registered')) return 'Un compte existe déjà avec cet email.'
  if (msg.includes('Password should be')) return 'Le mot de passe doit contenir au moins 6 caractères.'
  return msg
}
