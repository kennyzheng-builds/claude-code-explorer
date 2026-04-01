import type { TerminalLine } from '../../types'

interface Props {
  lines: TerminalLine[]
  activeTarget: string | null
  onLineClick: (target: string) => void
}

const lineClass: Record<string, string> = {
  input: 'line-input',
  text: 'line-text',
  'tool-header': 'line-tool-header',
  'tool-content': 'line-tool-content',
  permission: 'line-permission',
  todo: 'line-todo',
  status: 'line-status',
  'diff-add': 'line-diff-add',
  'diff-del': 'line-diff-del',
  error: 'line-error',
  blank: 'line-blank',
}

export default function TerminalPanel({ lines, activeTarget, onLineClick }: Props) {
  return (
    <div className="terminal-body">
      {lines.map((line, i) => {
        const cls = lineClass[line.type] || ''
        const isClickable = !!line.clickTarget
        const isActive = line.clickTarget === activeTarget
        return (
          <div
            key={i}
            className={`terminal-line ${cls} ${isClickable ? 'clickable' : ''} ${isActive ? 'active' : ''}`}
            onClick={() => line.clickTarget && onLineClick(line.clickTarget)}
          >
            {line.content}
          </div>
        )
      })}
    </div>
  )
}
