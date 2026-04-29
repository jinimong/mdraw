interface ToolbarProps {
  isEditing: boolean
  onToggleEdit: () => void
  onCopyUrl: () => void
  copyStatus: 'idle' | 'copied' | 'error'
}

export default function Toolbar({ isEditing, onToggleEdit, onCopyUrl, copyStatus }: ToolbarProps) {
  return (
    <div className="toolbar">
      <h1 className="logo">
        <a href={window.location.pathname}>mdraw</a>
      </h1>
      <div className="toolbar-actions">
        {isEditing && (
          <span className="toolbar-hint">
            ※ 수정 후 링크를 복사하여 다시 공유하세요
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
