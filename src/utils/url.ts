// URL 해시에서 base64로 인코딩된 마크다운을 읽고 쓰는 유틸

/**
 * URL 해시에서 마크다운을 디코딩한다.
 * 해시가 비어있으면 빈 문자열을 반환한다.
 */
export function decodeMarkdownFromHash(): string {
  const hash = window.location.hash.slice(1); // '#' 제거
  if (!hash) return '';
  try {
    return decodeURIComponent(escape(atob(hash)));
  } catch {
    // base64 디코딩 실패 시 원본 반환
    return hash;
  }
}

/**
 * 마크다운 문자열을 base64로 인코딩한다.
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
 * 해시에 마크다운을 base64로 인코딩하여 포함.
 */
export function generateShareUrl(markdown: string): string {
  const base = window.location.origin + window.location.pathname;
  return `${base}#${encodeMarkdownToBase64(markdown)}`;
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
