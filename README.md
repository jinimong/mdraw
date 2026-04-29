# mdraw

> 상남자식 마크다운 공유 — URL에 마크다운을 담아 공유하는 클라이언트 사이드 뷰어/에디터

## 소개

mdraw는 서버나 데이터베이스 없이, 마크다운 콘텐츠를 URL 해시 프래그먼트에 base64로 인코딩하여 공유하는 도구입니다.

- 🔗 **URL이 곧 문서** — 링크 하나로 마크다운을 공유
- 👁️ **GitHub 스타일 렌더링** — README와 동일한 스타일
- ✏️ **인라인 에디터** — 수정 후 바로 공유 가능
- 🌙 **다크모드** — 시스템 설정 자동 감지
- 🛡️ **XSS 방어** — rehype-sanitize로 안전한 렌더링
- 📐 **LaTeX 수식** — `$E=mc^2$`, `$$\sum_{i=1}^{n}$$` 지원
- 🎨 **코드 하이라이팅** — 다양한 언어 지원

## 사용법

1. [mdraw 페이지](https://jinimong.github.io/mdraw/) 접속
2. 에디터에 마크다운 작성
3. **🔗 링크 복사** 버튼 클릭
4. 복사된 URL을 공유

공유받은 사람은 URL만 열면 바로 렌더링된 마크다운을 볼 수 있습니다.

## 기술 스택

| 역할 | 기술 |
|------|------|
| 프레임워크 | React + TypeScript |
| 빌드 | Vite |
| 마크다운 렌더링 | react-markdown + remark-gfm + remark-math |
| 코드 하이라이팅 | rehype-highlight (highlight.js) |
| LaTeX 수식 | rehype-katex |
| XSS 방어 | rehype-sanitize |
| 스타일 | github-markdown-css |
| 호스팅 | GitHub Pages |

## 개발

```bash
# 설치
npm install

# 개발 서버
npm run dev

# 빌드
npm run build

# 타입 체크
npx tsc --noEmit
```

## 라이선스

MIT
