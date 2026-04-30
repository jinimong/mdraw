import { useCallback, useEffect, useRef, useState } from 'react'
import MarkdownEditor from './components/MarkdownEditor'
import MarkdownViewer from './components/MarkdownViewer'
import Toolbar from './components/Toolbar'
import { useTheme } from './hooks/useTheme'
import { copyShareUrlToClipboard, decodeMarkdownFromHash, encodeMarkdownToHash, isEditMode } from './utils/url'

const DEFAULT_MARKDOWN = `# Welcome to raw-md 🚀

URL에 마크다운을 담아 공유하는 **심플 뷰어**입니다.

---

## ✨ 기능

- 📝 에디터에서 마크다운 작성
- 🔗 URL 복사로 공유 — 서버 없이
- 🌙 다크 모드 지원
- 📱 반응형 레이아웃
- 🧮 수식 (KaTeX) 지원

## 코드 예시

\`\`\`javascript
const greeting = "Hello, World!"
console.log(greeting)
\`\`\`

## 표

| 기능 | 상태 |
|------|------|
| 마크다운 렌더링 | ✅ |
| 다크 모드 | ✅ |
| URL 공유 | ✅ |
| 수식 | ✅ |

> 공유는 간단합니다 — URL만 복사하세요.

[GitHub](https://github.com/jinimong/raw-md)`

function App() {
  const [markdown, setMarkdown] = useState<string>(() => {
    const decoded = decodeMarkdownFromHash()
    return decoded || DEFAULT_MARKDOWN
  })
  const [editMode, setEditMode] = useState<boolean>(() => isEditMode())
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied' | 'error'>('idle')
  const { mode: colorMode, toggleTheme } = useTheme()

  // 마지막으로 복사한 내용 추적
  const lastCopiedRef = useRef<string>(markdown)
  const isDirty = markdown !== lastCopiedRef.current

  // 해시 변경 감지 (브라우저 뒤로가기 등)
  useEffect(() => {
    const handleHashChange = () => {
      const content = decodeMarkdownFromHash()
      const value = content || DEFAULT_MARKDOWN
      setMarkdown(value)
      lastCopiedRef.current = value
      if (!content) setEditMode(true)
    }
    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  // 에디터에서 입력 시 해시 업데이트
  const handleMarkdownChange = useCallback((value: string) => {
    setMarkdown(value)
    window.history.replaceState(null, '', `#${encodeMarkdownToHash(value)}`)
  }, [])

  const toggleEditMode = useCallback(() => {
    const newMode = !editMode
    setEditMode(newMode)
    const params = new URLSearchParams(window.location.search)
    if (newMode) {
      params.set('edit', 'true')
    } else {
      params.delete('edit')
    }
    const newSearch = params.toString()
    window.history.replaceState(
      null,
      '',
      window.location.pathname + (newSearch ? `?${newSearch}` : '') + window.location.hash,
    )
  }, [editMode])

  const handleCopyUrl = useCallback(async () => {
    const ok = await copyShareUrlToClipboard(markdown)
    setCopyStatus(ok ? 'copied' : 'error')
    if (ok) lastCopiedRef.current = markdown
    setTimeout(() => setCopyStatus('idle'), 2000)
  }, [markdown])

  return (
    <div className="app">
      <Toolbar
        isEditing={editMode}
        onToggleEdit={toggleEditMode}
        onCopyUrl={handleCopyUrl}
        copyStatus={copyStatus}
        isDirty={isDirty}
        themeMode={colorMode}
        onToggleTheme={toggleTheme}
      />
      {editMode ? (
        <MarkdownEditor content={markdown} onChange={handleMarkdownChange} />
      ) : (
        <div className="viewer-container">
          <MarkdownViewer content={markdown} />
        </div>
      )}
    </div>
  )
}

export default App
