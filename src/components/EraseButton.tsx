interface EraseButtonProps {
  onErase: () => void
  onReset: () => void
  erasing: boolean
  done: boolean
  disabled: boolean
}

export function EraseButton({ onErase, onReset, erasing, done, disabled }: EraseButtonProps) {
  if (done) {
    return (
      <div className="flex flex-col items-center gap-3 animate-slide-up">
        {/* Success state */}
        <div className="w-full rounded-xl border border-success-500/30 bg-success-500/10 px-5 py-4 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-success-500/20 flex items-center justify-center flex-shrink-0">
            <svg className="w-4 h-4 text-success-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          </div>
          <div>
            <p className="text-success-400 font-semibold text-sm">Métadonnées effacées !</p>
            <p className="text-zinc-500 text-xs mt-0.5">Le fichier nettoyé a été téléchargé.</p>
          </div>
        </div>

        <button
          onClick={onReset}
          className="w-full rounded-xl border border-zinc-700 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white font-medium py-3 transition-all duration-200 text-sm"
        >
          Analyser un autre fichier
        </button>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Erase button */}
      <button
        onClick={onErase}
        disabled={disabled || erasing}
        className={`
          relative w-full rounded-xl font-semibold py-4 text-sm overflow-hidden
          transition-all duration-200
          ${disabled || erasing
            ? 'bg-zinc-800 text-zinc-600 cursor-not-allowed border border-zinc-700'
            : 'bg-danger-600 hover:bg-danger-500 active:scale-[0.98] text-white border border-danger-500/50 shadow-lg shadow-danger-900/30'
          }
        `}
      >
        {/* Scanning animation overlay while erasing */}
        {erasing && (
          <span className="absolute inset-0 bg-gradient-to-b from-transparent via-white/10 to-transparent animate-[scan_1.2s_ease-in-out_infinite]" />
        )}

        <span className="relative flex items-center justify-center gap-2">
          {erasing ? (
            <>
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              <span>Effacement en cours…</span>
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
              </svg>
              <span>Effacer les métadonnées</span>
            </>
          )}
        </span>
      </button>

      <button
        onClick={onReset}
        className="w-full rounded-xl border border-zinc-800 bg-transparent hover:bg-zinc-800/50 text-zinc-500 hover:text-zinc-300 font-medium py-2.5 transition-all duration-200 text-sm"
      >
        Changer de fichier
      </button>
    </div>
  )
}
