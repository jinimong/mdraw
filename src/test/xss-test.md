# XSS 테스트 케이스 수동 검증용

이 마크다운을 mdraw에 붙여넣어 XSS 방어가 정상 동작하는지 확인합니다.

---

## 테스트 1: HTML 스크립트 삽입

아래 스크립트는 실행되지 않아야 합니다:

<script>alert('xss')</script>

<img src=x onerror="alert('xss')">

<div onload="alert('xss')">test</div>

## 테스트 2: javascript: href 링크

아래 링크를 클릭해도 스크립트가 실행되지 않아야 합니다:

[click me](javascript:alert(document.domain))

[another](javascript:alert(1))

## 테스트 3: data: URI

[click](data:text/html,<script>alert(1)</script>)

## 테스트 4: 이벤트 핸들러 속성

<details open ontoggle="alert('xss')">
<summary>Click</summary>
content
</details>

## 테스트 5: SVG XSS

<svg onload="alert('xss')"></svg>

## 테스트 6: iframe 삽입

<iframe src="javascript:alert(1)"></iframe>

## 테스트 7: CSS 기반 공격

<div style="background-image: url('javascript:alert(1)')">test</div>

---

## ✅ 정상 렌더링 확인

아래 항목들은 정상적으로 렌더링되어야 합니다:

[정상 링크](https://github.com)

**볼드 텍스트** *이탤릭 텍스트* `인라인 코드`

| 컬럼1 | 컬럼2 |
|-------|-------|
| 값1   | 값2   |

- [x] 체크리스트 완료
- [ ] 체크리스트 미완료

```javascript
console.log("코드 하이라이팅 정상 동작")
```

행렬식: $E = mc^2$

블록 수식:

$$
\int_{-\infty}^{\infty} e^{-x^2} dx = \sqrt{\pi}
$$
