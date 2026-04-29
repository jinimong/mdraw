import LZString from 'lz-string'

// URL 해시에서 마크다운을 읽고 쓰는 유틸

/**
 * URL 해시에서 마크다운을 디코딩한다.
 * 해시가 비어있으면 빈 문자열을 반환한다.
 * 
 * 지원 포맷 (하위 호환):
 * 1. LZ-string URI Safe (신규) — "⌁" 접두사로 식별
 * 2. 순수 base64 (레거시) — 기존 공유 URL
 */
export function decodeMarkdownFromHash(): string {
  const hash = window.location.hash.slice(1); // '#' 제거
  if (!hash) return '';

  // LZ-string URI Safe 포맷 (접두사 ⌁)
  if (hash.startsWith('\u2301')) {
    try {
      const decompressed = LZString.decompressFromEncodedURIComponent(hash.slice(1));
      return decompressed || '';
    } catch {
      return '';
    }
  }

  // 레거시: 순수 base64
  try {
    return decodeURIComponent(escape(atob(hash)));
  } catch {
    // base64 디코딩 실패 시 원본 반환
    return hash;
  }
}

/**
 * 마크다운 문자열을 LZ-string으로 압축하여 URI-safe 인코딩한다.
 */
export function encodeMarkdownToHash(markdown: string): string {
  const compressed = LZString.compressToEncodedURIComponent(markdown);
  return `\u2301${compressed}`;
}

/**
 * 마크다운 문자열을 base64로 인코딩한다. (레거시)
 */
export function encodeMarkdownToBase64(markdown: string): string {
  return btoa(unescape(encodeURIComponent(markdown)));
}

/**
 * 현재 URL이 에디터 모드인지 확인한다.
 * ?edit=true 쿼리 파라미터 또는 해시가 비어있을 때 에디터 모드.
 */
export function isEditMode(): boolean {
  const params = new URLSearchParams(window.location.search);
  if (params.get('edit') === 'true') return true;
  // 빈 해시 = 신규 작성 = 에디터 모드
  if (!window.location.hash.slice(1)) return true;
  return false;
}

/**
 * 공유 URL을 생성한다.
 * 해시에 마크다운을 LZ-string으로 압축하여 포함.
 */
export function generateShareUrl(markdown: string): string {
  const base = window.location.origin + window.location.pathname;
  return `${base}#${encodeMarkdownToHash(markdown)}`;
}

/**
 * 공유 URL을 클립보드에 복사한다.
 * @returns 복사 성공 여부
 */
export async function copyShareUrlToClipboard(markdown: string): Promise<boolean> {
  const url = generateShareUrl(markdown);
  try {
    await navigator.clipboard.writeText(url);
    return true;
  } catch {
    return false;
  }
}
