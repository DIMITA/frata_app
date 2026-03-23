import type { FileMetadata, MetadataCategory, MetadataField } from '../utils/metadata'
import { formatFileSize } from '../utils/metadata'

interface MetadataPanelProps {
  metadata: FileMetadata
  preview: string | null
}

const CATEGORY_CONFIG: Record<MetadataCategory, { label: string; color: string; icon: string }> = {
  general: { label: 'Général', color: 'text-zinc-300 bg-zinc-800 border-zinc-700', icon: '📄' },
  camera: { label: 'Appareil photo', color: 'text-blue-300 bg-blue-950/50 border-blue-800/50', icon: '📷' },
  location: { label: 'Localisation', color: 'text-red-300 bg-red-950/50 border-red-800/50', icon: '📍' },
  datetime: { label: 'Date & Heure', color: 'text-amber-300 bg-amber-950/50 border-amber-800/50', icon: '🕐' },
  technical: { label: 'Technique', color: 'text-cyan-300 bg-cyan-950/50 border-cyan-800/50', icon: '⚙️' },
  author: { label: 'Auteur / ID', color: 'text-purple-300 bg-purple-950/50 border-purple-800/50', icon: '👤' },
}

function groupFields(fields: MetadataField[]): Map<MetadataCategory, MetadataField[]> {
  const map = new Map<MetadataCategory, MetadataField[]>()
  for (const field of fields) {
    if (!map.has(field.category)) map.set(field.category, [])
    map.get(field.category)!.push(field)
  }
  return map
}

function FileTypeIcon({ type }: { type: string }) {
  if (type.startsWith('image/')) {
    return (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
      </svg>
    )
  }
  if (type === 'application/pdf') {
    return (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
      </svg>
    )
  }
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25zm.375 6.75a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
    </svg>
  )
}

export function MetadataPanel({ metadata, preview }: MetadataPanelProps) {
  const grouped = groupFields(metadata.fields)
  const sensitiveCount = metadata.fields.filter(f => f.sensitive).length
  const totalCount = metadata.fields.length

  return (
    <div className="flex flex-col gap-4 animate-slide-up">
      {/* File info header */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/80 overflow-hidden">
        <div className="flex gap-4 p-4">
          {/* Preview thumbnail */}
          {preview && metadata.fileType.startsWith('image/') && (
            <div className="flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden bg-zinc-800 border border-zinc-700">
              <img src={preview} alt="preview" className="w-full h-full object-cover" />
            </div>
          )}
          {metadata.fileType === 'application/pdf' && (
            <div className="flex-shrink-0 w-20 h-20 rounded-lg bg-red-950/40 border border-red-800/30 flex items-center justify-center text-red-400">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
              </svg>
            </div>
          )}
          {metadata.fileType.startsWith('video/') && (
            <div className="flex-shrink-0 w-20 h-20 rounded-lg bg-purple-950/40 border border-purple-800/30 flex items-center justify-center text-purple-400">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" />
              </svg>
            </div>
          )}

          {/* File details */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start gap-2">
              <div className="text-zinc-400">
                <FileTypeIcon type={metadata.fileType} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-medium text-white truncate text-sm">{metadata.fileName}</p>
                <p className="text-zinc-500 text-xs mt-0.5">
                  {formatFileSize(metadata.fileSize)} · {metadata.fileType || 'Unknown type'}
                </p>
                <p className="text-zinc-600 text-xs mt-0.5">
                  Modifié le {new Date(metadata.lastModified).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Metadata count badge */}
        <div className="px-4 py-2.5 border-t border-zinc-800 bg-zinc-900/50 flex items-center justify-between">
          <span className="text-zinc-400 text-xs">
            {totalCount === 0 ? 'Aucune métadonnée détectée' : `${totalCount} champ${totalCount > 1 ? 's' : ''} de métadonnées`}
          </span>
          {sensitiveCount > 0 && (
            <span className="flex items-center gap-1 text-xs text-red-400 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
              {sensitiveCount} sensible{sensitiveCount > 1 ? 's' : ''}
            </span>
          )}
        </div>
      </div>

      {/* No metadata */}
      {totalCount === 0 && (
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-8 text-center">
          <div className="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center mx-auto mb-3">
            <svg className="w-6 h-6 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-zinc-400 text-sm">Aucune métadonnée lisible trouvée dans ce fichier.</p>
        </div>
      )}

      {/* Grouped metadata */}
      {Array.from(grouped.entries()).map(([category, fields]) => {
        const config = CATEGORY_CONFIG[category]
        return (
          <div key={category} className="rounded-xl border border-zinc-800 bg-zinc-900/50 overflow-hidden">
            {/* Category header */}
            <div className={`px-4 py-2.5 flex items-center gap-2 border-b border-zinc-800`}>
              <span className="text-sm">{config.icon}</span>
              <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">{config.label}</span>
              <span className="ml-auto text-xs text-zinc-600">{fields.length}</span>
            </div>

            {/* Fields */}
            <div className="divide-y divide-zinc-800/50">
              {fields.map((field) => (
                <div key={field.key} className="flex items-start justify-between gap-3 px-4 py-2.5 group">
                  <span className="text-xs text-zinc-500 font-medium mt-0.5 flex-shrink-0 min-w-[120px]">
                    {field.label}
                  </span>
                  <div className="flex items-center gap-2 text-right">
                    <span className={`text-sm font-mono break-all ${field.sensitive ? 'text-red-300' : 'text-zinc-200'}`}>
                      {field.value}
                    </span>
                    {field.sensitive && (
                      <span className="flex-shrink-0 px-1.5 py-0.5 rounded text-[10px] font-medium bg-red-950/60 border border-red-800/40 text-red-400">
                        sensible
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}
