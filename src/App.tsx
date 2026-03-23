import { useState, useCallback } from 'react'
import './index.css'
import { DropZone } from './components/DropZone'
import { MetadataPanel } from './components/MetadataPanel'
import { EraseButton } from './components/EraseButton'
import { readMetadata, stripMetadata, downloadBlob } from './utils/metadata'
import type { FileMetadata } from './utils/metadata'

type AppState = 'idle' | 'loading' | 'ready' | 'erasing' | 'done'

export default function App() {
  const [state, setState] = useState<AppState>('idle')
  const [file, setFile] = useState<File | null>(null)
  const [metadata, setMetadata] = useState<FileMetadata | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleFile = useCallback(async (f: File) => {
    setFile(f)
    setError(null)
    setState('loading')

    // Generate image preview
    if (f.type.startsWith('image/')) {
      const url = URL.createObjectURL(f)
      setPreview(url)
    } else {
      setPreview(null)
    }

    try {
      const meta = await readMetadata(f)
      setMetadata(meta)
      setState('ready')
    } catch {
      setError('Impossible de lire les métadonnées de ce fichier.')
      setState('idle')
    }
  }, [])

  const handleErase = useCallback(async () => {
    if (!file) return
    setState('erasing')
    setError(null)

    try {
      const cleaned = await stripMetadata(file)
      downloadBlob(cleaned, file.name)
      setState('done')
    } catch {
      setError('Erreur lors de la suppression des métadonnées.')
      setState('ready')
    }
  }, [file])

  const handleReset = useCallback(() => {
    if (preview) URL.revokeObjectURL(preview)
    setFile(null)
    setMetadata(null)
    setPreview(null)
    setError(null)
    setState('idle')
  }, [preview])

  if (state === 'idle') {
    return <DropZone onFile={handleFile} />
  }

  return (
    <div className="min-h-screen bg-surface-900">
      {/* Top bar */}
      <header className="sticky top-0 z-10 border-b border-zinc-800 bg-surface-900/80 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          <button
            onClick={handleReset}
            className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors text-sm"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            Retour
          </button>

          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-brand-500/20 border border-brand-500/30 flex items-center justify-center">
              <svg className="w-3 h-3 text-brand-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.955 11.955 0 01.048 12c0 3.293 1.328 6.272 3.474 8.448A11.955 11.955 0 0112 23.952c2.73 0 5.24-.92 7.238-2.452A11.956 11.956 0 0023.952 12 11.956 11.956 0 0020.478 6a11.959 11.959 0 01-5.978-3.236A11.959 11.959 0 0112 2.048z" />
              </svg>
            </div>
            <span className="text-sm font-semibold text-white">frata</span>
          </div>

          <div className="w-16" />
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        {state === 'loading' && (
          <div className="flex flex-col items-center justify-center py-32 gap-4 animate-fade-in">
            <div className="w-12 h-12 rounded-full border-2 border-brand-500/30 border-t-brand-500 animate-spin" />
            <p className="text-zinc-400 text-sm">Lecture des métadonnées…</p>
          </div>
        )}

        {error && (
          <div className="mb-6 rounded-xl border border-danger-500/30 bg-danger-500/10 px-4 py-3 flex items-center gap-3">
            <svg className="w-4 h-4 text-danger-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
            </svg>
            <p className="text-danger-300 text-sm">{error}</p>
          </div>
        )}

        {(state === 'ready' || state === 'erasing' || state === 'done') && metadata && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left: metadata panel */}
            <div className="lg:col-span-2">
              <MetadataPanel metadata={metadata} preview={preview} />
            </div>

            {/* Right: actions sidebar */}
            <div className="flex flex-col gap-4">
              {/* Privacy score */}
              <PrivacyScore metadata={metadata} />

              {/* Erase button */}
              <EraseButton
                onErase={handleErase}
                onReset={handleReset}
                erasing={state === 'erasing'}
                done={state === 'done'}
                disabled={state !== 'ready' && state !== 'erasing'}
              />

              {/* Info card */}
              <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4">
                <p className="text-xs text-zinc-500 leading-relaxed">
                  <span className="text-zinc-400 font-medium">100% local.</span>{' '}
                  Aucun fichier n'est envoyé à un serveur. Tout le traitement se passe dans ton navigateur.
                </p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

function PrivacyScore({ metadata }: { metadata: FileMetadata }) {
  const total = metadata.fields.length
  const sensitive = metadata.fields.filter(f => f.sensitive).length

  const score = total === 0 ? 100 : Math.round(Math.max(0, 100 - (sensitive * 25) - (total * 2)))
  const capped = Math.min(100, Math.max(0, score))

  const color = capped >= 70 ? 'text-success-400' : capped >= 40 ? 'text-amber-400' : 'text-danger-400'
  const bgColor = capped >= 70 ? 'bg-success-500' : capped >= 40 ? 'bg-amber-500' : 'bg-danger-500'
  const label = capped >= 70 ? 'Bon' : capped >= 40 ? 'Risqué' : 'Exposé'

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Score de confidentialité</span>
        <span className={`text-sm font-bold ${color}`}>{label}</span>
      </div>

      <div className="flex items-end gap-3 mb-3">
        <span className={`text-4xl font-bold tabular-nums ${color}`}>{capped}</span>
        <span className="text-zinc-600 text-sm mb-1">/100</span>
      </div>

      {/* Progress bar */}
      <div className="h-1.5 rounded-full bg-zinc-800 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ${bgColor}`}
          style={{ width: `${capped}%` }}
        />
      </div>

      {total > 0 && (
        <p className="text-zinc-600 text-xs mt-2">
          {sensitive > 0
            ? `${sensitive} champ${sensitive > 1 ? 's' : ''} sensible${sensitive > 1 ? 's' : ''} détecté${sensitive > 1 ? 's' : ''}`
            : `${total} métadonnée${total > 1 ? 's' : ''}, aucune sensible`
          }
        </p>
      )}
    </div>
  )
}
