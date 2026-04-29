import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import rehypeHighlight from 'rehype-highlight'
import rehypeKatex from 'rehype-katex'
import rehypeSanitize from 'rehype-sanitize'
import { useTheme } from '../hooks/useTheme'
import { sanitizeSchema } from '../utils/sanitize'
import 'github-markdown-css/github-markdown-light.css'
import 'github-markdown-css/github-markdown-dark.css'
import 'katex/dist/katex.min.css'
import 'highlight.js/styles/github.css'

interface MarkdownViewerProps {
  content: string
}

export default function MarkdownViewer({ content }: MarkdownViewerProps) {
  const theme = useTheme()

  if (!content) {
    return (
      <div className="markdown-body" data-theme={theme}>
        <p style={{ color: 'var(--muted)' }}>마크다운을 입력하면 여기에 렌더링됩니다.</p>
      </div>
    )
  }

  return (
    <div
      className={`markdown-body ${theme === 'dark' ? 'markdown-body-dark' : ''}`}
      data-theme={theme}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[
          [rehypeSanitize, sanitizeSchema],
          rehypeHighlight,
          rehypeKatex,
        ]}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}
