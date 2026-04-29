import MarkdownViewer from './MarkdownViewer'

interface MarkdownEditorProps {
  content: string
  onChange: (value: string) => void
}

export default function MarkdownEditor({ content, onChange }: MarkdownEditorProps) {
  const handleFileUpload = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.md,.markdown,.txt'
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (!file) return
      const reader = new FileReader()
      reader.onload = (ev) => {
        const text = ev.target?.result as string
        onChange(text)
      }
      reader.readAsText(file)
    }
    input.click()
  }

  return (
    <div className="editor-layout">
      <div className="editor-pane">
        <div className="editor-pane-header">
          <button type="button" className="btn btn-sm" onClick={handleFileUpload}>
            📁 파일 열기
          </button>
        </div>
        <textarea
          className="editor-textarea"
          value={content}
          onChange={(e) => onChange(e.target.value)}
          placeholder="여기에 마크다운을 입력하세요..."
          autoFocus
        />
      </div>
      <div className="preview-pane">
        <MarkdownViewer content={content} />
      </div>
    </div>
  )
}
