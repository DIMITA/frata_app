interface CreditDisplayProps {
  credits: number | null
  onBuy: () => void
  onSignOut: () => void
  email: string
}

export function CreditDisplay({ credits, onBuy, onSignOut, email }: CreditDisplayProps) {
  const low = credits !== null && credits <= 1

  return (
    <div className="flex items-center gap-2">
      {/* Credits badge */}
      <button
        onClick={onBuy}
        title="Acheter des crédits"
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors border ${
          low
            ? 'bg-amber-500/10 border-amber-500/30 text-amber-400 hover:bg-amber-500/20'
            : 'bg-brand-500/10 border-brand-500/20 text-brand-400 hover:bg-brand-500/20'
        }`}
      >
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        {credits === null ? '…' : credits}
        {low && credits === 0 && ' · Recharger'}
      </button>

      {/* User menu */}
      <div className="group relative">
        <button className="w-7 h-7 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-xs font-bold text-zinc-400 hover:border-zinc-600 transition-colors uppercase">
          {email.charAt(0)}
        </button>
        <div className="absolute right-0 top-full mt-1 w-44 bg-surface-950 border border-zinc-800 rounded-xl shadow-xl opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-150 z-20">
          <div className="px-3 py-2 border-b border-zinc-800">
            <p className="text-xs text-zinc-400 truncate">{email}</p>
            <p className="text-xs text-zinc-600 mt-0.5">{credits ?? '…'} crédit{credits !== 1 ? 's' : ''}</p>
          </div>
          <button
            onClick={onBuy}
            className="w-full text-left px-3 py-2 text-xs text-zinc-400 hover:text-white hover:bg-zinc-800/50 transition-colors"
          >
            Acheter des crédits
          </button>
          <button
            onClick={onSignOut}
            className="w-full text-left px-3 py-2 text-xs text-zinc-500 hover:text-white hover:bg-zinc-800/50 transition-colors rounded-b-xl"
          >
            Se déconnecter
          </button>
        </div>
      </div>
    </div>
  )
}
