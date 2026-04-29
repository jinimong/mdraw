import { useState, useEffect, useCallback, useRef } from 'react'
import { decodeMarkdownFromHash, isEditMode, copyShareUrlToClipboard, encodeMarkdownToHash } from './utils/url'
import MarkdownViewer from './components/MarkdownViewer'
import MarkdownEditor from './components/MarkdownEditor'
import Toolbar from './components/Toolbar'
import './App.css'

function App() {
  const [markdown, setMarkdown] = useState<string>(() => decodeMarkdownFromHash())
  const [editMode, setEditMode] = useState<boolean>(() => isEditMode())
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied' | 'error'>('idle')

  // 마지막으로 복사한 내용 추적
  const lastCopiedRef = useRef<string>(markdown)
  const isDirty = markdown !== lastCopiedRef.current

  // 해시 변경 감지 (브라우저 뒤로가기 등)
  useEffect(() => {
    const handleHashChange = () => {
      const content = decodeMarkdownFromHash()
      setMarkdown(content)
      lastCopiedRef.current = content
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
      window.location.pathname + (newSearch ? `?${newSearch}` : '') + window.location.hash
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
