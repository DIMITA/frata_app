import exifr from 'exifr'
import { PDFDocument } from 'pdf-lib'

export type MetadataCategory = 'general' | 'camera' | 'location' | 'datetime' | 'technical' | 'author'

export interface MetadataField {
  key: string
  label: string
  value: string
  category: MetadataCategory
  sensitive: boolean
}

export interface FileMetadata {
  fileName: string
  fileSize: number
  fileType: string
  lastModified: number
  fields: MetadataField[]
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`
}

function formatGPS(lat: number, lng: number): string {
  const latDir = lat >= 0 ? 'N' : 'S'
  const lngDir = lng >= 0 ? 'E' : 'W'
  return `${Math.abs(lat).toFixed(6)}° ${latDir}, ${Math.abs(lng).toFixed(6)}° ${lngDir}`
}

export async function readImageMetadata(file: File): Promise<FileMetadata> {
  const fields: MetadataField[] = []

  try {
    const exif = await exifr.parse(file, {
      tiff: true,
      exif: true,
      gps: true,
      iptc: true,
      xmp: true,
      icc: true,
      ihdr: true,
      sanitize: false,
      reviveValues: true,
      translateKeys: true,
      translateValues: true,
    })

    if (exif) {
      // Camera info
      if (exif.Make) fields.push({ key: 'Make', label: 'Camera Make', value: String(exif.Make), category: 'camera', sensitive: false })
      if (exif.Model) fields.push({ key: 'Model', label: 'Camera Model', value: String(exif.Model), category: 'camera', sensitive: false })
      if (exif.LensModel) fields.push({ key: 'LensModel', label: 'Lens', value: String(exif.LensModel), category: 'camera', sensitive: false })
      if (exif.Software) fields.push({ key: 'Software', label: 'Software', value: String(exif.Software), category: 'camera', sensitive: false })

      // Technical
      if (exif.ExposureTime) fields.push({ key: 'ExposureTime', label: 'Exposure', value: `1/${Math.round(1 / exif.ExposureTime)}s`, category: 'technical', sensitive: false })
      if (exif.FNumber) fields.push({ key: 'FNumber', label: 'Aperture', value: `f/${exif.FNumber}`, category: 'technical', sensitive: false })
      if (exif.ISO) fields.push({ key: 'ISO', label: 'ISO', value: String(exif.ISO), category: 'technical', sensitive: false })
      if (exif.FocalLength) fields.push({ key: 'FocalLength', label: 'Focal Length', value: `${exif.FocalLength}mm`, category: 'technical', sensitive: false })
      if (exif.Flash !== undefined) fields.push({ key: 'Flash', label: 'Flash', value: String(exif.Flash), category: 'technical', sensitive: false })
      if (exif.WhiteBalance !== undefined) fields.push({ key: 'WhiteBalance', label: 'White Balance', value: String(exif.WhiteBalance), category: 'technical', sensitive: false })
      if (exif.ImageWidth) fields.push({ key: 'ImageWidth', label: 'Width', value: `${exif.ImageWidth}px`, category: 'technical', sensitive: false })
      if (exif.ImageHeight) fields.push({ key: 'ImageHeight', label: 'Height', value: `${exif.ImageHeight}px`, category: 'technical', sensitive: false })
      if (exif.ColorSpace) fields.push({ key: 'ColorSpace', label: 'Color Space', value: String(exif.ColorSpace), category: 'technical', sensitive: false })
      if (exif.Orientation) fields.push({ key: 'Orientation', label: 'Orientation', value: String(exif.Orientation), category: 'technical', sensitive: false })

      // DateTime
      if (exif.DateTimeOriginal) fields.push({ key: 'DateTimeOriginal', label: 'Date Taken', value: exif.DateTimeOriginal instanceof Date ? exif.DateTimeOriginal.toLocaleString() : String(exif.DateTimeOriginal), category: 'datetime', sensitive: false })
      if (exif.DateTime) fields.push({ key: 'DateTime', label: 'Date Modified', value: exif.DateTime instanceof Date ? exif.DateTime.toLocaleString() : String(exif.DateTime), category: 'datetime', sensitive: false })
      if (exif.DateTimeDigitized) fields.push({ key: 'DateTimeDigitized', label: 'Date Digitized', value: exif.DateTimeDigitized instanceof Date ? exif.DateTimeDigitized.toLocaleString() : String(exif.DateTimeDigitized), category: 'datetime', sensitive: false })

      // GPS — sensitive!
      if (exif.latitude !== undefined && exif.longitude !== undefined) {
        fields.push({ key: 'GPS', label: 'GPS Coordinates', value: formatGPS(exif.latitude, exif.longitude), category: 'location', sensitive: true })
      }
      if (exif.GPSAltitude !== undefined) fields.push({ key: 'GPSAltitude', label: 'Altitude', value: `${exif.GPSAltitude.toFixed(1)}m`, category: 'location', sensitive: true })

      // Author / IPTC / XMP
      if (exif.Artist) fields.push({ key: 'Artist', label: 'Artist', value: String(exif.Artist), category: 'author', sensitive: true })
      if (exif.Copyright) fields.push({ key: 'Copyright', label: 'Copyright', value: String(exif.Copyright), category: 'author', sensitive: true })
      if (exif.ImageDescription) fields.push({ key: 'ImageDescription', label: 'Description', value: String(exif.ImageDescription), category: 'author', sensitive: false })
      if (exif.UserComment) fields.push({ key: 'UserComment', label: 'User Comment', value: String(exif.UserComment), category: 'author', sensitive: true })
      if (exif.Creator) fields.push({ key: 'Creator', label: 'Creator', value: String(exif.Creator), category: 'author', sensitive: true })
      if (exif.Author) fields.push({ key: 'Author', label: 'Author', value: String(exif.Author), category: 'author', sensitive: true })
    }
  } catch {
    // No EXIF or unreadable
  }

  return {
    fileName: file.name,
    fileSize: file.size,
    fileType: file.type,
    lastModified: file.lastModified,
    fields,
  }
}

export async function readPdfMetadata(file: File): Promise<FileMetadata> {
  const fields: MetadataField[] = []

  try {
    const arrayBuffer = await file.arrayBuffer()
    const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true })

    const title = pdfDoc.getTitle()
    const author = pdfDoc.getAuthor()
    const subject = pdfDoc.getSubject()
    const keywords = pdfDoc.getKeywords()
    const creator = pdfDoc.getCreator()
    const producer = pdfDoc.getProducer()
    const creationDate = pdfDoc.getCreationDate()
    const modDate = pdfDoc.getModificationDate()

    if (title) fields.push({ key: 'title', label: 'Title', value: title, category: 'general', sensitive: false })
    if (author) fields.push({ key: 'author', label: 'Author', value: author, category: 'author', sensitive: true })
    if (subject) fields.push({ key: 'subject', label: 'Subject', value: subject, category: 'general', sensitive: false })
    if (keywords) fields.push({ key: 'keywords', label: 'Keywords', value: keywords, category: 'general', sensitive: false })
    if (creator) fields.push({ key: 'creator', label: 'Creator App', value: creator, category: 'technical', sensitive: false })
    if (producer) fields.push({ key: 'producer', label: 'PDF Producer', value: producer, category: 'technical', sensitive: false })
    if (creationDate) fields.push({ key: 'creationDate', label: 'Created', value: creationDate.toLocaleString(), category: 'datetime', sensitive: false })
    if (modDate) fields.push({ key: 'modDate', label: 'Modified', value: modDate.toLocaleString(), category: 'datetime', sensitive: false })

    const pageCount = pdfDoc.getPageCount()
    fields.push({ key: 'pages', label: 'Pages', value: String(pageCount), category: 'general', sensitive: false })
  } catch {
    // unreadable PDF
  }

  return {
    fileName: file.name,
    fileSize: file.size,
    fileType: file.type,
    lastModified: file.lastModified,
    fields,
  }
}

export function readVideoMetadata(file: File): FileMetadata {
  const fields: MetadataField[] = []

  // Basic info readable from the File object
  fields.push({ key: 'type', label: 'Format', value: file.type || 'Unknown', category: 'technical', sensitive: false })

  return {
    fileName: file.name,
    fileSize: file.size,
    fileType: file.type,
    lastModified: file.lastModified,
    fields,
  }
}

export async function readMetadata(file: File): Promise<FileMetadata> {
  const type = file.type

  if (type.startsWith('image/')) {
    return readImageMetadata(file)
  } else if (type === 'application/pdf') {
    return readPdfMetadata(file)
  } else if (type.startsWith('video/')) {
    return readVideoMetadata(file)
  }

  return {
    fileName: file.name,
    fileSize: file.size,
    fileType: file.type,
    lastModified: file.lastModified,
    fields: [],
  }
}

// ─── Stripping ────────────────────────────────────────────────────────────────

export async function stripImageMetadata(file: File): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    const url = URL.createObjectURL(file)

    img.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = img.naturalWidth
      canvas.height = img.naturalHeight
      const ctx = canvas.getContext('2d')!
      ctx.drawImage(img, 0, 0)
      URL.revokeObjectURL(url)

      // Determine output format
      const outputType = file.type === 'image/jpeg' || file.type === 'image/jpg'
        ? 'image/jpeg'
        : 'image/png'

      canvas.toBlob((blob) => {
        if (blob) resolve(blob)
        else reject(new Error('Canvas toBlob failed'))
      }, outputType, 0.95)
    }

    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('Image load failed'))
    }

    img.src = url
  })
}

export async function stripPdfMetadata(file: File): Promise<Blob> {
  const arrayBuffer = await file.arrayBuffer()
  const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true })

  pdfDoc.setTitle('')
  pdfDoc.setAuthor('')
  pdfDoc.setSubject('')
  pdfDoc.setKeywords([])
  pdfDoc.setCreator('')
  pdfDoc.setProducer('')
  pdfDoc.setCreationDate(new Date(0))
  pdfDoc.setModificationDate(new Date(0))

  const pdfBytes = await pdfDoc.save()
  return new Blob([pdfBytes.buffer as ArrayBuffer], { type: 'application/pdf' })
}

export async function stripMetadata(file: File): Promise<Blob> {
  const type = file.type

  if (type.startsWith('image/')) {
    return stripImageMetadata(file)
  } else if (type === 'application/pdf') {
    return stripPdfMetadata(file)
  }

  // For other types (video, etc.) return as-is
  return file
}

export function downloadBlob(blob: Blob, originalName: string): void {
  const ext = originalName.lastIndexOf('.')
  const base = ext > -1 ? originalName.slice(0, ext) : originalName
  const extension = ext > -1 ? originalName.slice(ext) : ''
  const cleanName = `${base}_clean${extension}`

  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = cleanName
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

export function formatFileSize(bytes: number): string {
  return formatBytes(bytes)
}

export const ACCEPTED_TYPES: Record<string, string[]> = {
  'image/*': ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.tiff', '.heic'],
  'application/pdf': ['.pdf'],
  'video/*': ['.mp4', '.mov', '.avi', '.mkv', '.webm'],
}
