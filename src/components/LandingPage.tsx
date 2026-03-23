import type { User } from '@supabase/supabase-js'
import { CREDIT_PACKS } from '../lib/supabase'
import type { CreditPack } from '../lib/supabase'

interface LandingPageProps {
  user: User | null
  onStartApp: () => void
  onAuthClick: () => void
  onSignOut: () => void
  onBuyCredits: (pack?: CreditPack) => void
  credits: number | null
}

export function LandingPage({ user, onStartApp, onAuthClick, onSignOut, onBuyCredits, credits }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-surface-900 text-white">
      {/* ── Navigation ───────────────────────────────────────── */}
      <nav className="sticky top-0 z-20 border-b border-zinc-800/60 bg-surface-900/80 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-brand-500/20 border border-brand-500/30 flex items-center justify-center">
              <svg className="w-3.5 h-3.5 text-brand-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.955 11.955 0 01.048 12c0 3.293 1.328 6.272 3.474 8.448A11.955 11.955 0 0112 23.952c2.73 0 5.24-.92 7.238-2.452A11.956 11.956 0 0023.952 12 11.956 11.956 0 0020.478 6a11.959 11.959 0 01-5.978-3.236A11.959 11.959 0 0112 2.048z" />
              </svg>
            </div>
            <span className="font-bold text-white tracking-tight">frata</span>
          </div>

          {/* Nav links */}
          <div className="hidden md:flex items-center gap-6 text-sm text-zinc-400">
            <a href="#fonctionnement" className="hover:text-white transition-colors">Comment ça marche</a>
            <a href="#tarifs" className="hover:text-white transition-colors">Tarifs</a>
          </div>

          {/* Auth / user */}
          <div className="flex items-center gap-2">
            {user ? (
              <>
                <button
                  onClick={() => onBuyCredits()}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-brand-500/10 border border-brand-500/20 text-brand-400 hover:bg-brand-500/20 transition-colors"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {credits ?? '…'} crédit{credits !== 1 ? 's' : ''}
                </button>
                <button
                  onClick={onStartApp}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-brand-500 hover:bg-brand-400 text-white transition-colors"
                >
                  Ouvrir l'app →
                </button>
                <button onClick={onSignOut} className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors ml-1">
                  Déconnexion
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={onAuthClick}
                  className="text-sm text-zinc-400 hover:text-white transition-colors"
                >
                  Se connecter
                </button>
                <button
                  onClick={onAuthClick}
                  className="ml-2 px-4 py-1.5 rounded-lg text-sm font-semibold bg-brand-500 hover:bg-brand-400 text-white transition-colors"
                >
                  Commencer
                </button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-4 pt-24 pb-20 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-xs font-semibold mb-6 animate-fade-in">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-400 animate-pulse" />
          100% local — aucun fichier envoyé à un serveur
        </div>

        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-white leading-tight mb-5 animate-fade-in">
          Tes fichiers te trahissent.<br />
          <span className="text-brand-400">On arrange ça.</span>
        </h1>

        <p className="text-zinc-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed mb-10 animate-fade-in">
          frata supprime les métadonnées cachées de tes images, PDF et vidéos —
          coordonnées GPS, infos de l'appareil, nom d'auteur — en un clic, sans quitter ton navigateur.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 animate-slide-up">
          <button
            onClick={user ? onStartApp : onAuthClick}
            className="px-8 py-3.5 rounded-xl bg-brand-500 hover:bg-brand-400 text-white font-bold text-base transition-colors shadow-lg shadow-brand-500/20"
          >
            {user ? 'Lancer l\'app →' : 'Commencer gratuitement →'}
          </button>
          {!user && (
            <p className="text-xs text-zinc-500">3 crédits offerts à l'inscription. Sans carte bancaire.</p>
          )}
        </div>

        {/* Preview mockup */}
        <div className="mt-16 relative max-w-3xl mx-auto animate-slide-up">
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/80 p-4 text-left">
            <div className="flex items-center gap-1.5 mb-3">
              <span className="w-3 h-3 rounded-full bg-zinc-700" />
              <span className="w-3 h-3 rounded-full bg-zinc-700" />
              <span className="w-3 h-3 rounded-full bg-zinc-700" />
              <span className="text-xs text-zinc-600 ml-2 font-mono">photo_vacances.jpg</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <MetaRow icon="📍" label="GPS" value="48.8566° N, 2.3522° E" sensitive />
                <MetaRow icon="📷" label="Appareil" value="iPhone 15 Pro" />
                <MetaRow icon="👤" label="Auteur" value="Jean Dupont" sensitive />
                <MetaRow icon="🕐" label="Date" value="2025-06-12 14:32:07" />
                <MetaRow icon="⚙️" label="Logiciel" value="iOS 18.1" />
              </div>
              <div className="flex flex-col items-center justify-center rounded-xl bg-success-500/5 border border-success-500/20 gap-2 py-6">
                <div className="w-10 h-10 rounded-full bg-success-500/10 border border-success-500/20 flex items-center justify-center">
                  <svg className="w-5 h-5 text-success-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                </div>
                <p className="text-success-400 text-sm font-semibold">Nettoyé !</p>
                <p className="text-xs text-zinc-500 text-center px-2">5 métadonnées supprimées</p>
              </div>
            </div>
          </div>
          {/* Glow */}
          <div className="absolute -inset-px rounded-2xl bg-gradient-to-b from-brand-500/10 to-transparent pointer-events-none" />
        </div>
      </section>

      {/* ── Features ─────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-4 py-20 border-t border-zinc-800/60">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-3">Pourquoi supprimer les métadonnées ?</h2>
          <p className="text-zinc-400 max-w-xl mx-auto">Chaque fichier que tu partages contient des informations invisibles mais sensibles.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {FEATURES.map(f => (
            <div key={f.title} className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5 hover:border-zinc-700 transition-colors">
              <div className="text-2xl mb-3">{f.icon}</div>
              <h3 className="font-semibold text-white mb-1.5">{f.title}</h3>
              <p className="text-zinc-500 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── How it works ─────────────────────────────────────── */}
      <section id="fonctionnement" className="max-w-6xl mx-auto px-4 py-20 border-t border-zinc-800/60">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-3">Comment ça marche ?</h2>
          <p className="text-zinc-400">Trois étapes, quelques secondes.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
          {/* Connecting line */}
          <div className="hidden md:block absolute top-8 left-1/3 right-1/3 h-px bg-gradient-to-r from-transparent via-brand-500/30 to-transparent" />

          {STEPS.map((step, i) => (
            <div key={step.title} className="flex flex-col items-center text-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center relative">
                <span className="text-2xl">{step.icon}</span>
                <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-brand-500 text-white text-xs font-bold flex items-center justify-center">
                  {i + 1}
                </span>
              </div>
              <div>
                <h3 className="font-semibold text-white mb-1">{step.title}</h3>
                <p className="text-zinc-500 text-sm leading-relaxed">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Pricing ──────────────────────────────────────────── */}
      <section id="tarifs" className="max-w-6xl mx-auto px-4 py-20 border-t border-zinc-800/60">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-3">Tarifs simples</h2>
          <p className="text-zinc-400 max-w-md mx-auto">
            1 crédit = 1 fichier traité. Achète uniquement ce dont tu as besoin.
            <br />
            <span className="text-brand-400 font-medium">3 crédits offerts</span> à l'inscription.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-3xl mx-auto">
          {CREDIT_PACKS.map((pack) => {
            const isPro = pack.id === 'pro'
            return (
              <div
                key={pack.id}
                className={`relative rounded-2xl border p-6 flex flex-col gap-5 ${
                  isPro
                    ? 'border-brand-500/50 bg-brand-500/5 shadow-lg shadow-brand-500/10'
                    : 'border-zinc-800 bg-zinc-900/50'
                }`}
              >
                {isPro && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-[10px] font-bold uppercase tracking-wider bg-brand-500 text-white px-3 py-1 rounded-full">
                    Populaire
                  </span>
                )}

                <div>
                  <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">{pack.label}</p>
                  <div className="mt-2 flex items-end gap-1">
                    <span className="text-4xl font-extrabold text-white">{pack.credits}</span>
                    <span className="text-zinc-500 mb-1">crédits</span>
                  </div>
                  <p className="text-zinc-400 text-sm mt-1">
                    {(pack.price / 100).toLocaleString('fr-FR')} <span className="text-zinc-500">FCFA</span>
                    <span className="text-zinc-600 text-xs ml-2">
                      ({Math.round(pack.price / pack.credits)} FCFA/crédit)
                    </span>
                  </p>
                </div>

                <ul className="flex flex-col gap-2 text-sm text-zinc-400">
                  <li className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-success-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                    {pack.credits} fichiers traités
                  </li>
                  <li className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-success-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                    Images, PDF, Vidéos
                  </li>
                  <li className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-success-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                    Crédits sans expiration
                  </li>
                </ul>

                <button
                  onClick={() => onBuyCredits(pack)}
                  className={`w-full py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                    isPro
                      ? 'bg-brand-500 hover:bg-brand-400 text-white'
                      : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300'
                  }`}
                >
                  {user ? 'Acheter' : 'Commencer'}
                </button>
              </div>
            )
          })}
        </div>
      </section>

      {/* ── CTA banner ───────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-4 py-16 border-t border-zinc-800/60">
        <div className="rounded-2xl bg-gradient-to-br from-brand-500/10 to-transparent border border-brand-500/20 p-10 text-center">
          <h2 className="text-2xl font-bold text-white mb-3">Prêt à protéger ta vie privée ?</h2>
          <p className="text-zinc-400 mb-6">Commence avec 3 crédits gratuits. Aucune carte bancaire requise.</p>
          <button
            onClick={user ? onStartApp : onAuthClick}
            className="px-8 py-3 rounded-xl bg-brand-500 hover:bg-brand-400 text-white font-bold transition-colors"
          >
            {user ? 'Utiliser frata →' : 'Créer un compte gratuit →'}
          </button>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────────── */}
      <footer className="border-t border-zinc-800/60 py-8">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-md bg-brand-500/20 border border-brand-500/30 flex items-center justify-center">
              <svg className="w-2.5 h-2.5 text-brand-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.955 11.955 0 01.048 12c0 3.293 1.328 6.272 3.474 8.448A11.955 11.955 0 0112 23.952c2.73 0 5.24-.92 7.238-2.452A11.956 11.956 0 0023.952 12 11.956 11.956 0 0020.478 6a11.959 11.959 0 01-5.978-3.236A11.959 11.959 0 0112 2.048z" />
              </svg>
            </div>
            <span className="text-sm font-semibold text-white">frata</span>
          </div>
          <p className="text-xs text-zinc-600">© {new Date().getFullYear()} frata. Traitement 100% local, zéro serveur.</p>
        </div>
      </footer>
    </div>
  )
}

function MetaRow({ icon, label, value, sensitive }: { icon: string; label: string; value: string; sensitive?: boolean }) {
  return (
    <div className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs ${sensitive ? 'bg-danger-500/10 border border-danger-500/20' : 'bg-zinc-800/50'}`}>
      <span>{icon}</span>
      <span className={`font-medium ${sensitive ? 'text-danger-300' : 'text-zinc-400'}`}>{label}</span>
      <span className="text-zinc-500 truncate ml-auto">{value}</span>
      {sensitive && <span className="text-danger-500 text-[10px] font-bold flex-shrink-0">SENSIBLE</span>}
    </div>
  )
}

const FEATURES = [
  {
    icon: '📍',
    title: 'Coordonnées GPS supprimées',
    desc: 'Tes photos contiennent souvent ta localisation exacte. frata les efface pour que personne ne sache où tu étais.',
  },
  {
    icon: '📷',
    title: 'Infos d\'appareil retirées',
    desc: 'Marque, modèle, numéro de série de ton téléphone ou appareil photo — tout est supprimé.',
  },
  {
    icon: '👤',
    title: 'Données d\'auteur effacées',
    desc: 'Nom, email, entreprise souvent intégrés dans les documents Word ou PDF. frata les retire avant que tu ne partages.',
  },
  {
    icon: '🔒',
    title: '100% dans ton navigateur',
    desc: 'Aucun fichier ne quitte ton appareil. Tout le traitement se fait localement — zéro serveur, zéro cloud.',
  },
  {
    icon: '📄',
    title: 'Images, PDF et vidéos',
    desc: 'Compatible avec JPEG, PNG, WebP, HEIC, PDF, MP4 et bien d\'autres formats courants.',
  },
  {
    icon: '⚡',
    title: 'Résultat instantané',
    desc: 'Quelques secondes suffisent. Le fichier nettoyé est téléchargé automatiquement.',
  },
]

const STEPS = [
  {
    icon: '📂',
    title: 'Dépose ton fichier',
    desc: 'Glisse-dépose une image, un PDF ou une vidéo. frata analyse immédiatement ses métadonnées.',
  },
  {
    icon: '🔍',
    title: 'Visualise les données cachées',
    desc: 'Vois exactement ce que ton fichier révèle : GPS, appareil, auteur, dates…',
  },
  {
    icon: '✅',
    title: 'Télécharge le fichier nettoyé',
    desc: 'Un clic sur "Effacer" et ton fichier est prêt, sans aucune métadonnée sensible.',
  },
]
