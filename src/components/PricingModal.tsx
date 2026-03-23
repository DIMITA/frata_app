import { useEffect, useRef } from 'react'
import { CREDIT_PACKS } from '../lib/supabase'
import type { CreditPack } from '../lib/supabase'

interface PricingModalProps {
  onClose: () => void
  userId: string
  userEmail: string
  onSuccess: () => void
}

const KKIAPAY_PUBLIC_KEY = import.meta.env.VITE_KKIAPAY_PUBLIC_KEY as string
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string

export function PricingModal({ onClose, userId, userEmail, onSuccess }: PricingModalProps) {
  const activePack = useRef<CreditPack | null>(null)

  useEffect(() => {
    function handleSuccess({ transactionId }: { transactionId: string }) {
      if (!activePack.current) return
      verifyAndCredit(transactionId, activePack.current.id, userId)
        .then(() => {
          onSuccess()
          onClose()
        })
        .catch(console.error)
    }

    addKkiapayListener('success', handleSuccess)
    return () => removeKkiapayListener('success', handleSuccess as (...args: unknown[]) => void)
  }, [userId, onSuccess, onClose])

  function handleBuy(pack: CreditPack) {
    activePack.current = pack
    openKkiapayWidget({
      amount: pack.price,
      api_key: KKIAPAY_PUBLIC_KEY,
      sandbox: import.meta.env.DEV,
      email: userEmail,
      name: 'frata',
      data: JSON.stringify({ packId: pack.id, userId }),
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-lg bg-surface-950 border border-zinc-800 rounded-2xl p-6 shadow-2xl animate-slide-up">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-600 hover:text-zinc-400 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="mb-6">
          <h2 className="text-lg font-semibold text-white">Acheter des crédits</h2>
          <p className="text-zinc-500 text-sm mt-1">1 crédit = 1 fichier traité. Paiement sécurisé via KKiaPay.</p>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {CREDIT_PACKS.map((pack) => (
            <PackCard key={pack.id} pack={pack} onBuy={() => handleBuy(pack)} />
          ))}
        </div>

        <div className="mt-5 flex items-center gap-2 text-xs text-zinc-600">
          <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
          </svg>
          Paiement traité par KKiaPay. Les crédits sont ajoutés immédiatement après confirmation.
        </div>
      </div>
    </div>
  )
}

function PackCard({ pack, onBuy }: { pack: CreditPack; onBuy: () => void }) {
  const isPro = pack.id === 'pro'

  return (
    <div className={`relative rounded-xl border p-4 flex flex-col gap-3 transition-colors ${
      isPro
        ? 'border-brand-500/50 bg-brand-500/5'
        : 'border-zinc-800 bg-zinc-900/50 hover:border-zinc-700'
    }`}>
      {isPro && (
        <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 text-[10px] font-bold uppercase tracking-wider bg-brand-500 text-white px-2 py-0.5 rounded-full">
          Populaire
        </span>
      )}

      <div>
        <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">{pack.label}</p>
        <p className="text-2xl font-bold text-white mt-1">{pack.credits}</p>
        <p className="text-xs text-zinc-500">crédits</p>
      </div>

      <p className="text-sm font-semibold text-zinc-300">
        {(pack.price / 100).toLocaleString('fr-FR', { minimumFractionDigits: 0 })} <span className="text-zinc-500 font-normal text-xs">FCFA</span>
      </p>

      <button
        onClick={onBuy}
        className={`w-full py-2 rounded-lg text-xs font-semibold transition-colors ${
          isPro
            ? 'bg-brand-500 hover:bg-brand-400 text-white'
            : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300'
        }`}
      >
        Acheter
      </button>
    </div>
  )
}

async function verifyAndCredit(transactionId: string, packId: string, userId: string) {
  const res = await fetch(`${SUPABASE_URL}/functions/v1/verify-payment`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ transactionId, packId, userId }),
  })
  if (!res.ok) {
    const data = await res.json().catch(() => ({}))
    throw new Error(data.error ?? 'Erreur de vérification du paiement')
  }
}
