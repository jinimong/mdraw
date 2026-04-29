import { describe, it, expect } from 'vitest'
import LZString from 'lz-string'

// ============================================================================
// 압축률 테스트 — base64 vs LZ-string URI Safe
// ============================================================================

/**
 * 마크다운 콘텐츠 → base64 해시 (레거시)
 */
function encodeBase64(markdown: string): string {
  return btoa(unescape(encodeURIComponent(markdown)))
}

/**
 * 마크다운 콘텐츠 → LZ-string URI Safe 해시 (신규)
 */
function encodeLZString(markdown: string): string {
  return '\u2301' + LZString.compressToEncodedURIComponent(markdown)
}

/**
 * 압축률 리포트 생성
 */
function compressionReport(label: string, original: string) {
  const originalBytes = new TextEncoder().encode(original).length
  const base64Hash = encodeBase64(original)
  const lzHash = encodeLZString(original)
  const base64Bytes = new TextEncoder().encode(base64Hash).length
  const lzBytes = new TextEncoder().encode(lzHash).length
  const fullUrlBase = 'https://jinimong.github.io/mdraw/#'

  return {
    label,
    originalBytes,
    base64HashBytes: base64Bytes,
    base64FullUrlBytes: fullUrlBase.length + base64Bytes,
    lzHashBytes: lzBytes,
    lzFullUrlBytes: fullUrlBase.length + lzBytes,
    base64Overhead: ((base64Bytes / originalBytes) * 100).toFixed(1),
    lzOverhead: ((lzBytes / originalBytes) * 100).toFixed(1),
    lzVsBase64: ((1 - lzBytes / base64Bytes) * 100).toFixed(1),
  }
}

// ============================================================================
// 테스트용 샘플 마크다운
// ============================================================================

const SAMPLE_SHORT = `# Hello World

This is a **test** markdown document.

- Item 1
- Item 2
- Item 3

\`\`\`javascript
console.log("hello")
\`\`\`
`

const SAMPLE_MEDIUM = `# 중간 길이 마크다운 문서

## 개요

이 문서는 마크다운 뷰어의 중간 길이 콘텐츠 압축률을 테스트하기 위한 것입니다.
다양한 마크다운 요소를 포함합니다.

## 기능 목록

| 기능 | 상태 | 비고 |
|------|------|------|
| GFM 테이블 | ✅ | remark-gfm |
| 코드 하이라이팅 | ✅ | rehype-highlight |
| LaTeX 수식 | ✅ | rehype-katex |
| 다크모드 | ✅ | prefers-color-scheme |
| XSS 방어 | ✅ | rehype-sanitize |

## 코드 예시

\`\`\`python
def fibonacci(n: int) -> list[int]:
    """피보나치 수열 생성"""
    fib = [0, 1]
    for i in range(2, n):
        fib.append(fib[i-1] + fib[i-2])
    return fib

print(fibonacci(10))
\`\`\`

## 수식

행렬식: $E = mc^2$

적분:

$$
\\int_{-\\infty}^{\\infty} e^{-x^2} dx = \\sqrt{\\pi}
$$

## 체크리스트

- [x] 프로젝트 초기 설정
- [x] URL 해시 파싱
- [x] 마크다운 렌더링
- [ ] LZ-string 압축 적용
- [ ] Mermaid 다이어그램
- [ ] PDF 익스포트

> 이것은 인용구입니다. 마크다운의 다양한 요소가 압축률에 미치는 영향을 확인합니다.
`

const SAMPLE_LONG = `# 깃허브 마크다운 뷰어 — 기획서 및 기술 분석

## 프로젝트 배경

기존 마크다운 공유 도구들은 서버에 콘텐츠를 저장하는 방식이 대부분이었습니다.
하지만 이런 방식은 다음과 같은 문제가 있습니다:

1. **서버 운영 비용** — DB 스토리지, 백업, 가용성 유지
2. **프라이버시** — 서버에 콘텐츠가 저장되므로 잠재적 정보 유출 위험
3. **영속성** — 서비스 종료 시 공유 링크 무효화

이에 반해 URL에 콘텐츠를 직접 인코딩하는 방식은:
- ✅ 서버 불필요 (100% 클라이언트 사이드)
- ✅ 프라이버시 보장 (서버 전송 없음)
- ✅ 영구 공유 (URL만 있으면 항상 접근 가능)
- ⚠️ URL 길이 제한 (브라우저별 차이, 대략 2MB~)

## 기술 스택 선택

### 마크다운 렌더러: react-markdown

| 후보 | 장점 | 단점 |
|------|------|------|
| react-markdown | React 네이티브, remark/unified 생태계 | 번들 크기 |
| marked | 빠름, 가벼움 | React 통합 불편 |
| markdown-it | 플러그인 풍부 | React 비공식 |

react-markdown 선택 이유:
- React 컴포넌트로 마크다운을 렌더링
- remark/unified 파이프라인으로 플러그인 조립
- 보안(rehype-sanitize)과 하이라이팅(rehype-highlight)을 하나의 파이프라인에서 처리

### URL 인코딩: LZ-string

| 방식 | 팽창률 | 특징 |
|------|--------|------|
| 순수 base64 | +33% | 단순, 범용 |
| LZ-string URI Safe | -30~50% | 압축, URI 안전 |
| Base65536 | -50% | 유니코드 활용, 브라우저 호환성 이슈 |

MVP에서 순수 base64를 사용했고, 이번에 LZ-string으로 전환합니다.

## 보안 분석

### XSS 공격 벡터

마크다운 뷰어는 사용자 입력을 HTML로 렌더링하므로 XSS 공격에 취약할 수 있습니다.

**주요 공격 벡터:**

1. \`<script>\` 태그 삽입
2. \`javascript:\` 프로토콜 href
3. \`onerror\`, \`onload\` 등 이벤트 핸들러
4. \`<iframe>\` 삽입
5. \`<svg>\` 내 이벤트 핸들러
6. \`data:\` URI 스푸핑
7. CSS 표현식 공격

**방어: rehype-sanitize**

rehype-sanitize는 HTML을 화이트리스트 기반으로 필터링합니다:
- \`<script>\`, \`<iframe>\`, \`<object>\` 등 위험 태그 제거
- \`on*\` 이벤트 핸들러 속성 제거
- href 프로토콜을 http/https/mailto로 제한
- \`data:\` 프로토콜 차단

### 테스트 케이스

\`\`\`markdown
<script>alert('xss')</script>
[click](javascript:alert(1))
<img src=x onerror="alert('xss')">
<svg onload="alert('xss')"></svg>
\`\`\`

이 모든 케이스가 rehype-sanitize에 의해 차단됩니다.

## 성능 고려사항

### URL 길이 제한

| 브라우저 | 최대 URL 길이 |
|----------|---------------|
| Chrome | 2MB (약 2,097,152자) |
| Firefox | 사실상 무제한 |
| Safari | 약 80KB~2MB |
| Edge | Chrome과 동일 |

LZ-string 압축 시 평균 50~70% 압축률로, 순수 base64 대비 2배 더 긴 마크다운을 공유할 수 있습니다.

### 렌더링 성능

react-markdown은 마크다운을 AST로 파싱한 후 React 엘리먼트로 변환합니다.
대용량 마크다운(100KB 이상)의 경우 디바운싱을 적용하여 입력 중 과도한 리렌더링을 방지해야 합니다.

## 향후 로드맵

1. **Mermaid 다이어그램** — remark-mermaid로 시각화 지원
2. **마인드맵** — markmap으로 마크다운을 마인드맵으로 변환
3. **PDF 익스포트** — html2pdf.js로 PDF 다운로드
4. **.md 파일 업로드** — 드래그앤드롭 지원
5. **URL 단축** — 외부 단축 서비스 연동
6. **테마 선택** — GitHub/Night Owl/One Dark 등
7. **목차(TOC)** — 헤딩 기반 자동 목차 생성

---

## 결론

mdraw는 서버 없이 URL만으로 마크다운을 공유하는 경량 도구입니다.
LZ-string 압축 도입으로 URL 길이 문제를 크게 개선하고, rehype-sanitize로 보안을 보장합니다.
`

const SAMPLE_KOREAN_DENSE = `# QA 면접 질문 정리

## QA란?

QA는 품질보증(Quality Assurance)의 약자로, 제품이 요구사항을 충족하는지 확인하는 활동입니다. 개발팀과 협력하여 버그를 조기 발견하고, 사용자 경험을 개선합니다.

## 필요한 역량

- **소통 능력(Git)**: 개발자와 원활하게 소통하여 버그를 정확히 전달
- **테스트 설계**: 요구사항 기반 테스트 케이스 작성, 엣지 케이스 도출
- **자동화**: Selenium, Cypress 등 테스트 자동화 도구 활용
- **디버깅**: 로그 분석, 네트워크 탭 활용, API 테스트

## QA vs QC

| 구분 | QA (품질보증) | QC (품질관리) |
|------|---------------|---------------|
| 목적 | 결함 예방 | 결함 탐지 |
| 시점 | 개발 전 과정 | 개발 후 |
| 방식 | 프로세스 개선 | 테스트 실행 |

## 기술 면접 예상 질문

### 1. 버그 라이프사이클 설명

> 버그는 발견 → 보고 → 분석 → 수정 → 재테스트 → 종료의 라이프사이클을 가집니다.
> QA는 이 전 과정에서 버그의 상태를 추적하고 관리합니다.

### 2. 테스트 자동화의 장단점

자동화가 특히 효과적인 경우:
- **회귀 테스트**: 반복 실행되는 테스트
- **대량 데이터**: 수동 테스트가 불가능한 대규모 데이터 검증

자동화의 한계:
- 탐색적 테스트는 자동화 불가
- 초기 구축 비용이 높음
- 유지보수 비용 지속 발생

### 3. 크로스 브라우저 테스트 전략

사용자 통계 기반으로 브라우저 우선순위를 정합니다.
- **Tier 1**: Chrome, Safari (가장 많은 사용자)
- **Tier 2**: Firefox, Edge
- **Tier 3**: 이전 버전 브라우저

## 면접 팁

- STAR 기법(상황-과제-행동-결과)으로 경험 서술
- 구체적인 수치와 함께 성과 설명
- "QA는 개발의 검수역할이자 사용자의 대변자"라는 관점 강조

## 요약

QA는 단순한 테스트가 아닌, **제품 품질을 책임지는 핵심 역할**입니다.
자동화 도구 활용 능력과 소통 능력을 갖춘 QA 엔지니어는 어떤 팀에서든 환영받습니다.
`

// ============================================================================
// 테스트
// ============================================================================

describe('LZ-string 압축률 테스트', () => {
  const samples = [
    { name: '짧은 마크다운', content: SAMPLE_SHORT },
    { name: '중간 마크다운', content: SAMPLE_MEDIUM },
    { name: '긴 마크다운 (기획서)', content: SAMPLE_LONG },
    { name: '한국어 밀집 (QA 면접)', content: SAMPLE_KOREAN_DENSE },
  ]

  it('중간 이상 샘플에 대해 LZ-string이 base64보다 짧아야 함', () => {
    // 짧은 텍스트(수백 바이트 미만)는 압축 오버헤드로 인해 이득이 없을 수 있음
    const mediumOrMore = samples.filter(({ content }) => new TextEncoder().encode(content).length >= 500)
    const reports = mediumOrMore.map(({ name, content }) => compressionReport(name, content))

    for (const r of reports) {
      expect(r.lzHashBytes).toBeLessThan(r.base64HashBytes)
    }
  })

  it('짧은 텍스트에서도 LZ-string이 base64보다 길지 않아야 함', () => {
    const reports = samples.map(({ name, content }) => compressionReport(name, content))

    for (const r of reports) {
      expect(r.lzHashBytes).toBeLessThanOrEqual(r.base64HashBytes)
    }
  })

  it('LZ-string 압축 → 복원이 원본과 일치해야 함', () => {
    for (const { content } of samples) {
      const compressed = LZString.compressToEncodedURIComponent(content)
      const decompressed = LZString.decompressFromEncodedURIComponent(compressed)
      expect(decompressed).toBe(content)
    }
  })

  it('레거시 base64도 복원이 가능해야 함', () => {
    for (const { content } of samples) {
      const encoded = encodeBase64(content)
      const decoded = decodeURIComponent(escape(atob(encoded)))
      expect(decoded).toBe(content)
    }
  })

  // 압축률 리포트 출력
  it('압축률 리포트 출력', () => {
    console.log('\n╔══════════════════════════════════════════════════════════════════╗')
    console.log('║              마크다운 URL 압축률 비교 리포트                     ║')
    console.log('╠══════════════════════════════════════════════════════════════════╣')
    console.log('║ 방식           │ 원본 대비 │ base64 대비 │ 전체 URL 크기        ║')
    console.log('╠══════════════════════════════════════════════════════════════════╣')

    for (const { name, content } of samples) {
      const r = compressionReport(name, content)
      console.log(`║ ${name}`)
      console.log(`║   원본:     ${r.originalBytes.toString().padStart(6)} bytes`)
      console.log(`║   Base64:   ${r.base64HashBytes.toString().padStart(6)} bytes (원본 대비 ${r.base64Overhead}%)  URL: ${r.base64FullUrlBytes} bytes`)
      console.log(`║   LZ-string:${r.lzHashBytes.toString().padStart(6)} bytes (원본 대비 ${r.lzOverhead}%)  URL: ${r.lzFullUrlBytes} bytes`)
      console.log(`║   절감:     base64 대비 ${r.lzVsBase64}% 절감`)
      console.log('║')
    }

    console.log('╚══════════════════════════════════════════════════════════════════╝')

    // 리포트가 출력되었는지만 확인 (항상 통과)
    expect(true).toBe(true)
  })
})

describe('URL 해시 인코딩/디코딩', () => {
  it('LZ-string 인코딩은 ⌁ 접두사로 시작해야 함', () => {
    const hash = encodeLZString('test')
    expect(hash.startsWith('\u2301')).toBe(true)
  })

  it('빈 문자열 처리', () => {
    const compressed = LZString.compressToEncodedURIComponent('')
    const decompressed = LZString.decompressFromEncodedURIComponent(compressed)
    expect(decompressed).toBe('')
  })

  it('특수문자 포함 마크다운', () => {
    const content = '# 테스트 `코드` **볼드** [링크](https://example.com?foo=bar&baz=qux)'
    const compressed = LZString.compressToEncodedURIComponent(content)
    const decompressed = LZString.decompressFromEncodedURIComponent(compressed)
    expect(decompressed).toBe(content)
  })

  it('이모지 포함 마크다운', () => {
    const content = '# 🎉 축하합니다! 🚀\n\n- ✅ 완료\n- ❌ 실패\n- 🔥 인기'
    const compressed = LZString.compressToEncodedURIComponent(content)
    const decompressed = LZString.decompressFromEncodedURIComponent(compressed)
    expect(decompressed).toBe(content)
  })

  it('LaTeX 수식 포함', () => {
    const content = '수식: $E = mc^2$\n\n$$\\int_{-\\infty}^{\\infty} e^{-x^2} dx = \\sqrt{\\pi}$$'
    const compressed = LZString.compressToEncodedURIComponent(content)
    const decompressed = LZString.decompressFromEncodedURIComponent(compressed)
    expect(decompressed).toBe(content)
  })
})
