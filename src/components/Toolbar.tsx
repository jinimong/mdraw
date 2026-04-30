interface ToolbarProps {
  isEditing: boolean
  onToggleEdit: () => void
  onCopyUrl: () => void
  copyStatus: 'idle' | 'copied' | 'error'
  isDirty: boolean
}

export default function Toolbar({ isEditing, onToggleEdit, onCopyUrl, copyStatus, isDirty }: ToolbarProps) {
  return (
    <div className="toolbar">
      <h1 className="logo">
        <a href={window.location.pathname}>raw-md</a>
      </h1>
      <div className="toolbar-actions">
        {isEditing && isDirty && (
          <span className="toolbar-hint toolbar-hint-dirty">
            ⚠️ 수정됨 — 다시 링크 복사 필요
          </span>
        )}
        <button
          type="button"
          className="btn"
          onClick={onCopyUrl}
        >
          {copyStatus === 'copied' ? '✅ 복사됨!' : copyStatus === 'error' ? '❌ 실패' : '🔗 링크 복사'}
        </button>
        <button type="button" className="btn" onClick={onToggleEdit}>
          {isEditing ? '👁️ 뷰어로' : '✏️ 수정모드'}
        </button>
      </div>
    </div>
  )
}
