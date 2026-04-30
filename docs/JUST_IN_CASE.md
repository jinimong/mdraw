# Just In Case / 참고사항 - mdraw

Context that might help future agents working on this. Things that didn't fit neatly in the synthesis but could be useful.

이 작업을 수행할 미래의 에이전트에게 도움이 될 수 있는 맥락. 종합 문서에 깔끔하게 들어가지 않았지만 유용할 수 있는 내용.

## The Bigger Picture / 큰 그림

GeekNews에 소개된 MDshare(mdshare060114.web.app)에서 영감을 받은 프로젝트. MDshare는 개인이 만든 서비스이고 mdraw는 오픈소스로, React + TS로 재구현하면서 GitHub README 스펙을 더 완전하게 지원하는 것이 목표.

## Why These Decisions / 결정의 이유

- **react-markdown 선택**: React 네이티브 컴포넌트라 TS 프로젝트에 가장 자연스럽고, remark/unified 생태계의 플러그인 조립으로 GFM 스펙을 점진적으로 커버 가능
- **에디터는 보조**: 뷰어가 핵심 가치. 에디터는 "수정하기" 진입 시만 노출되는 최소한의 textarea
- **base64 우선, 압축은 나중에**: MVP는 단순함 우선. LZ-string 압축은 URL 길이 한계에 부딪힐 때 추가

## Things Considered But Not Chosen / 고려했으나 선택하지 않은 것들

- **Vditor** (★10,908): 에디터+뷰어 풀패키지지만 React 래핑 필요, 중국 커뮤니티 중심
- **Cherry-Markdown** (★4,668): 텐센트 제작, 기능 풍부하지만 React 래핑 필요
- **HashMD** (★4,348): TS 플러그인 아키텍처, 경량이지만 커뮤니티가 상대적으로 작음
- **순수 HTML/JS**: 의존성 최소화 매력적이었으나 주인님이 React + TS 지정
- **encodeURIComponent**: 짧은 텍스트는 유리하지만 한국어/특수문자에 더 길어짐

## User Working Style Notes / 사용자 작업 스타일 메모

- 주인님은 "상남자식 마크다운"이라는 표현을 좋아함 — 프로젝트 분위기가 약간 코믹/거친 느낌도 OK
- 직접 구현보다 기존 오픈소스를 찾아서 조립하는 방식 선호
- 코딩은 OpenCode 에이전트에 위임 예정

## Potential Gotchas / 주의사항

1. **XSS가 가장 중요한 품질 항목**: GeekNews 댓글에서 실제로 취약점이 발견되었고, `javascript:alert(document.domain)` 형태의 링크 XSS와 HTML 삽입 XSS 두 가지 모두 테스트해야 함
2. **URL 길이**: RFC 2616에는 명시적 제한이 없으나, 브라우저별로 다름 (Chrome ~2MB, Safari ~80KB, IE ~2KB). 참고: https://stackoverflow.com/a/417184
3. **해시 프래그먼트는 서버에 전송 안 됨**: 이것이 보안상 장점이지만, Google Analytics 등으로 페이지뷰 추적 시 해시 내용은 수집 안 됨
4. **Base64 인코딩 시 URL-safe 변환 필요**: `+/=` 문자를 `-_` 등으로 치환해야 URL에서 깨지지 않음

## Related Files / Context / 관련 파일 및 맥락

- 참고 서비스: https://mdshare060114.web.app/
- GeekNews 소개글: https://news.hada.io/topic?id=20861
- 유사 서비스: https://knotend.com/ (kroki 기반 ERD)
- Base65536: https://github.com/qntm/base65536
- markmap.js: https://markmap.js.org/ (마인드맵 뷰 TODO)

---

Good luck, future agent. / 행운을 빕니다, 미래의 에이전트여.
