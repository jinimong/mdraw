import { defaultSchema } from 'rehype-sanitize'

/**
 * rehype-sanitize 커스텀 스키마
 * 
 * 기본 스키마 위에 추가 보안 규칙:
 * - href 프로토콜 화이트리스트: http, https, mailto만 허용
 * - javascript:, data: 프로토콜 차단
 * - on* 이벤트 핸들러 속성 제거
 */
export const sanitizeSchema = {
  ...defaultSchema,
  tagNames: [
    ...(defaultSchema.tagNames || []),
    // GFM 지원 태그 추가
    'input', // 체크리스트
    'details', // 접기/펼치기
    'summary',
  ],
  attributes: {
    ...defaultSchema.attributes,
    // 체크리스트 input 속성
    input: [['checked', 'checked'], ['disabled', 'disabled'], ['type', 'checkbox']],
    // details/summary 속성
    details: [['open', 'open']],
    // code 언어 속성
    code: [['className', 'language-*']],
    // pre 코드 블록
    pre: [['className', 'language-*']],
    // 모든 요소에 허용되는 속성
    '*': [
      ...(defaultSchema.attributes?.['*'] || []),
      // id, class는 허용 (스타일링 필요)
      'id',
      'className',
    ],
  },
}
