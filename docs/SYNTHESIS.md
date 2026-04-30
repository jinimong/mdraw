# mdraw - Requirements Synthesis / 요구사항 종합

## What This Is / 개요

마크다운 콘텐츠를 URL 해시 프래그먼트에 인코딩하여, DB/서버 없이 브라우저만으로 공유할 수 있는 마크다운 뷰어/에디터. GeekNews에 소개된 MDshare에서 영감을 받았으며, React + TypeScript로 GitHub Pages에 호스팅되는 오픈소스 사이드 프로젝트.

## Key Requirements / 핵심 요구사항

1. URL 해시 프래그먼트(`#`)에 마크다운 콘텐츠를 base64로 인코딩하여 삽입
2. 공유 URL 접속 시 뷰어 모드 기본 노출, "수정하기" 진입 시 에디터 모드 전환
3. 에디터 모드에서 실시간 마크다운 미리보기 지원
4. GitHub README 스펙 완전 호환 (GFM 전체: 테이블, 체크리스트, 코드블록, 링크, 이미지 등)
5. LaTeX 수식 렌더링 ($ 기호, KaTeX)
6. 코드 문법 하이라이팅
7. GitHub README 스타일과 최대한 유사한 렌더링 비주얼
8. 다크모드: 브라우저 시스템 설정(prefers-color-scheme) 따름
9. XSS 방어: HTML 삽입 및 `javascript:` href 차단 (rehype-sanitize 등)
10. 공유 URL 복사 버튼 제공
11. 빈 URL 접속 시 신규 작성 에디터 노출

## Constraints / 제약사항

- DB 사용 금지 — 모든 데이터는 URL에 자체 포함
- 서버 사이드 스토리지 금지 — 순수 클라이언트 사이드 동작
- 해시 프래그먼트는 서버에 전송되지 않으므로 자연스러운 데이터 보안 보장
- XSS 취약점에 대한 철저한 방어 필수 (GeekNews 커뮤니티 피드백 반영)

## Decisions / 결정사항

- 프로젝트명: **mdraw** (md + raw / draw 이중의미)
- 기술 스택: React + TypeScript
- 핵심 라이브러리: react-markdown + remark/unified 생태계
  - remark-gfm (GFM 지원)
  - rehype-katex (수식)
  - rehype-highlight 또는 prism (코드 하이라이팅)
  - rehype-sanitize (XSS 방어)
- 호스팅: GitHub Pages
- URL 포맷: `https://<domain>/#<base64-encoded-markdown>` (뷰어), `?edit=true#<base64>` (에디터)
- MVP 인코딩: 순수 base64
- 에디터는 핵심 니즈가 아님 — 뷰어가 주 목적, 에디터는 보조 기능

## Architecture / Approach / 아키텍처 및 접근방식

```
단일 SPA 페이지
├── URL 해시 프래그먼트 파싱 (base64 디코딩)
├── 뷰어 모드 (기본)
│   └── react-markdown + remark/rehype 플러그인으로 렌더링
├── 에디터 모드 ("수정하기" 클릭 시 전환)
│   ├── textarea (마크다운 입력)
│   └── 실시간 미리보기 (동일 렌더러)
├── URL 생성 (base64 인코딩 → 해시 프래그먼트)
└── 클립보드 복사
```

## What's Deferred / 보류된 항목

- URL 압축 (LZ-string 등) — 더 긴 콘텐츠 지원
- Base65536 인코딩 검토 — URL에서 더 효율적인 인코딩 가능성
- Mermaid 다이어그램 렌더링
- 마인드맵 뷰 모드 (markmap.js 연동)
- URL 단축 서비스 연동 가이드
- .md 파일 업로드 기능
- PDF 익스포트

## Key Quotes / 핵심 인용

> "공유 URL 자체에 마크다운 콘텐츠가 삽입되는 방식이야. only local client side 기능이지."

> "fragment(#) 영역은 User agent가 처리하는 값이라 서버로 보내지도 않네요. 완벽한 데이터 보안입니다"

> "마크다운내 HTML을 삽입할 경우 JavaScript가 실행 가능한 XSS 취약점이 있습니다."

> "url 단축기랑 엮어서 사용하면 진짜로 간단한 호스팅 대용으로 써먹을만 하겠네요"

## Next Steps / 다음 단계

1. GitHub 리포지토리 생성 (mdraw)
2. React + TS 프로젝트 셋업 (Vite)
3. OpenCode로 MVP 구현 위임 — 인터뷰 종합 문서를 컨텍스트로 전달
4. XSS 테스트 케이스 포함한 품질 검증
5. GitHub Pages 배포
