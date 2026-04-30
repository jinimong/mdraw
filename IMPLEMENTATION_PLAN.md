# mdraw - 구현 계획

배경 및 원인 분석은 [SYNTHESIS.md](./SYNTHESIS.md) 참고.
기준 커밋: `4f0ec6c8bafeb478d9f8a5e742b99ae4e4966fa0`
리뷰 완료: [x]

---

## 커밋 1: `feat(core): URL 해시 파싱/인코딩 + 뷰어/에디터 모드 전환` [x]

<!-- 완료 (3c5e6ee). 변경 파일: src/utils/url.ts, src/App.tsx, src/App.css, src/index.css, index.html -->

---

## 커밋 2: `feat(viewer): 마크다운 렌더링 — GFM + 코드 하이라이팅 + LaTeX + GitHub 스타일` [x]

<!-- 완료 (b0f6bcb). 변경 파일: src/components/MarkdownViewer.tsx, src/hooks/useTheme.ts, src/App.tsx -->

---

## 커밋 3: `feat(editor): 에디터 모드 — textarea + 실시간 미리보기` [x]

<!-- 완료 (2b3fab6). 변경 파일: src/components/MarkdownEditor.tsx, src/components/Toolbar.tsx, src/App.tsx, src/App.css -->

---

## 커밋 4: `feat(share): 공유 URL 생성 + 클립보드 복사` [x]

<!-- 완료 — 커밋 1~3에 통합 구현됨. url.ts에 generateShareUrl/copyShareUrlToClipboard, Toolbar에 복사 버튼 포함 -->

---

## 커밋 5: `feat(security): XSS 방어 — rehype-sanitize 적용 + 보안 테스트` [x]

<!-- 완료 (f54b4af). 변경 파일: src/utils/sanitize.ts, src/components/MarkdownViewer.tsx, src/test/xss-test.md -->

---

## 커밋 6: `chore(deploy): GitHub Pages 배포 설정 + README` [x]

<!-- 완료 (158d4b8). 변경 파일: vite.config.ts, .github/workflows/deploy.yml, README.md, public/favicon.svg, src/utils/sanitize.ts, src/components/MarkdownViewer.tsx -->
