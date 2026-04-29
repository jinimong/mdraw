import { useState, useEffect, useCallback } from 'react'
import { decodeMarkdownFromHash, isEditMode, encodeMarkdownToBase64 } from './utils/url'
import MarkdownViewer from './components/MarkdownViewer'
import './App.css'

function App() {
  const [markdown, setMarkdown] = useState<string>(() => decodeMarkdownFromHash())
  const [editMode, setEditMode] = useState<boolean>(() => isEditMode())

  // 해시 변경 감지 (브라우저 뒤로가기 등)
  useEffect(() => {
    const handleHashChange = () => {
      const content = decodeMarkdownFromHash()
      setMarkdown(content)
      if (!content) setEditMode(true)
    }
    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  // 에디터에서 입력 시 해시 업데이트
  const handleMarkdownChange = useCallback((value: string) => {
    setMarkdown(value)
    window.history.replaceState(null, '', `#${encodeMarkdownToBase64(value)}`)
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

  return (
    <div className="app">
      <div className="toolbar">
        <h1 className="logo">mdraw</h1>
        <div className="toolbar-actions">
          <button type="button" className="btn" onClick={toggleEditMode}>
            {editMode ? '👁️ 뷰어로' : '✏️ 수정모드'}
          </button>
        </div>
      </div>

      {editMode ? (
        <div className="editor-layout">
          <div className="editor-pane">
            <textarea
              className="editor-textarea"
              value={markdown}
              onChange={(e) => handleMarkdownChange(e.target.value)}
              placeholder="여기에 마크다운을 입력하세요..."
              autoFocus
            />
          </div>
          <div className="preview-pane">
            <MarkdownViewer content={markdown} />
          </div>
        </div>
      ) : (
        <div className="viewer-container">
          <MarkdownViewer content={markdown} />
        </div>
      )}
    </div>
  )
}

export default App
