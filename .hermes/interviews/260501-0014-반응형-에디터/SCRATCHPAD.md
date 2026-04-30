# Interview Scratchpad / 인터뷰 메모 - 반응형 에디터

## Context / 맥락
- Date / 날짜: 2026-05-01
- Reference / 참고자료: /tmp/mdraw/src/components/MarkdownEditor.tsx
- 참고 프로젝트: StackEdit, Dillinger, HackMD, Notion, iOS Safari

## Emerging Themes / 주요 주제
- 모바일에서 편집 영역 최대화
- 자연스러운 네비게이션 전환 (iOS Safari 스타일)

## Requirements Captured / 수집된 요구사항
- Breakpoint: 768px
- 768px 이하: 편집 모드에서 미리보기 패널 숨김 → 에디터만 전체 너비
- 768px 이하: 뷰어 모드로 전환해야만 렌더링된 마크다운 확인 가능
- 모바일 툴바: 스크롤 다운 시 숨김, 스크롤 업 시 나타남 (자연스러운 애니메이션)
- 데스크탑: 기존과 동일 (툴바 항상 고정, 분할 레이아웃)

## Constraints / 제약사항
- 심플 원칙 유지
- 데스크탑 경험 변경 없음
- 자연스러운 UX — iOS Safari, Chrome 모바일 주소창 같은 패턴

## Decisions Made / 결정사항
- 768px 분기점
- 모바일 편집 = 에디터만, 미리보기 없음
- 모바일 툴바 = scroll direction 기반 hide/show (Option B)
- 참고: iOS Safari 주소창, Notion 모바일 툴바

## Tensions / Trade-offs / 긴장관계 및 트레이드오프
- 발견성(discoverability) vs 편집 영역 최대화 → 모바일에서는 영역 최대화 우선
- 최초 진입 시 툴바가 보여야 함 (최소한 뷰어 전환 버튼은)

## Areas to Dig Deeper / 더 탐색할 영역
- [x] 분기점 → 768px
- [x] 전환 방식 → 툴바 scroll hide/show
- [x] 미리보기 → 모바일에서 제거, 뷰어 전환 필요

## Key Quotes / 핵심 인용
- "모바일 태블릿뷰에서는 미리보기 지원이 없는거지. 뷰어모드로 변환해야만 보이도록"
- "모바일에서는 b로 하자. 대신 자연스럽게 구현해야해. 다른 프로젝트들을 많이 참고해서"

## Open Questions / 미해결 질문
- (해결됨 — 모든 주요 결정 완료)
