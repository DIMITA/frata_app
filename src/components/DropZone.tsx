import { useCallback, useState } from 'react'

interface DropZoneProps {
  onFile: (file: File) => void
}

const ACCEPT = 'image/*,application/pdf,video/*'

export function DropZone({ onFile }: DropZoneProps) {
  const [dragging, setDragging] = useState(false)

  const handleFile = useCallback((file: File) => {
    if (file) onFile(file)
  }, [onFile])

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }, [handleFile])

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragging(true)
  }, [])

  const onDragLeave = useCallback(() => setDragging(false), [])

  const onInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
  }, [handleFile])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 py-16">
      {/* Logo / Header */}
      <div className="mb-12 text-center animate-fade-in">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-brand-500/20 border border-brand-500/30 flex items-center justify-center">
            <svg className="w-5 h-5 text-brand-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.955 11.955 0 01.048 12c0 3.293 1.328 6.272 3.474 8.448A11.955 11.955 0 0112 23.952c2.73 0 5.24-.92 7.238-2.452A11.956 11.956 0 0023.952 12 11.956 11.956 0 0020.478 6a11.959 11.959 0 01-5.978-3.236A11.959 11.959 0 0112 2.048z" />
            </svg>
          </div>
          <span className="text-xl font-semibold tracking-tight text-white">frata</span>
        </div>
        <h1 className="text-4xl font-bold text-white tracking-tight mb-3">
          Supprime tes métadonnées
        </h1>
        <p className="text-zinc-400 text-lg max-w-md mx-auto leading-relaxed">
          Glisse un fichier pour voir ses métadonnées cachées — puis efface-les d'un clic, sans rien envoyer à un serveur.
        </p>
      </div>

      {/* Drop Zone */}
      <label
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        className={`
          relative w-full max-w-2xl cursor-pointer rounded-2xl border-2 border-dashed
          transition-all duration-300 select-none
          ${dragging
            ? 'border-brand-500 bg-brand-500/10 scale-[1.02]'
            : 'border-zinc-700 bg-zinc-900/50 hover:border-zinc-500 hover:bg-zinc-800/50'
          }
        `}
      >
        <input
          type="file"
          accept={ACCEPT}
          onChange={onInputChange}
          className="sr-only"
        />

        <div className="flex flex-col items-center justify-center py-20 px-8 gap-5">
          {/* Icon */}
          <div className={`
            w-20 h-20 rounded-2xl flex items-center justify-center transition-all duration-300
            ${dragging ? 'bg-brand-500/20 scale-110' : 'bg-zinc-800'}
          `}>
            <svg className={`w-9 h-9 transition-colors duration-300 ${dragging ? 'text-brand-400' : 'text-zinc-400'}`}
              fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
            </svg>
          </div>

          <div className="text-center">
            <p className="text-white font-medium text-lg mb-1">
              {dragging ? 'Lâche le fichier ici' : 'Glisse ou clique pour choisir'}
            </p>
            <p className="text-zinc-500 text-sm">
              Images · PDF · Vidéos
            </p>
          </div>
        </div>

        {/* Animated corner accents when dragging */}
        {dragging && (
          <>
            <span className="absolute top-3 left-3 w-4 h-4 border-t-2 border-l-2 border-brand-400 rounded-tl-sm" />
            <span className="absolute top-3 right-3 w-4 h-4 border-t-2 border-r-2 border-brand-400 rounded-tr-sm" />
            <span className="absolute bottom-3 left-3 w-4 h-4 border-b-2 border-l-2 border-brand-400 rounded-bl-sm" />
            <span className="absolute bottom-3 right-3 w-4 h-4 border-b-2 border-r-2 border-brand-400 rounded-br-sm" />
          </>
        )}
      </label>

      {/* Feature pills */}
      <div className="flex flex-wrap items-center justify-center gap-2 mt-8">
        {[
          { icon: '🔒', text: '100% local, rien envoyé' },
          { icon: '🗺️', text: 'GPS & EXIF supprimés' },
          { icon: '⚡', text: 'Instantané' },
        ].map((f) => (
          <span key={f.text} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400 text-sm">
            <span>{f.icon}</span>
            <span>{f.text}</span>
          </span>
        ))}
      </div>
    </div>
  )
}
