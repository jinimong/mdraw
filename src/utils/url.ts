import LZString from 'lz-string'

// URL 해시에서 마크다운을 읽고 쓰는 유틸

/**
 * URL 해시에서 마크다운을 디코딩한다.
 * 해시가 비어있으면 빈 문자열을 반환한다.
 */
export function decodeMarkdownFromHash(): string {
  const raw = window.location.hash.slice(1) // '#' 제거
  if (!raw) return ''

  try {
    const hash = decodeURIComponent(raw)
    const decompressed = LZString.decompressFromEncodedURIComponent(hash)
    return decompressed || ''
  } catch {
    return ''
  }
}

/**
 * 마크다운 문자열을 LZ-string으로 압축한다.
 */
export function encodeMarkdownToHash(markdown: string): string {
  return LZString.compressToEncodedURIComponent(markdown)
}

/**
 * 현재 URL이 에디터 모드인지 확인한다.
 * 해시가 비어있으면 에디터 모드.
 */
export function isEditMode(): boolean {
  return !window.location.hash.slice(1)
}

/**
 * 공유 URL을 생성한다.
 */
export function generateShareUrl(markdown: string): string {
  const base = window.location.origin + window.location.pathname
  return `${base}#${encodeMarkdownToHash(markdown)}`
}

/**
 * 공유 URL을 클립보드에 복사한다.
 */
export async function copyShareUrlToClipboard(markdown: string): Promise<boolean> {
  const url = generateShareUrl(markdown)
  try {
    await navigator.clipboard.writeText(url)
    return true
  } catch {
    return false
  }
}
