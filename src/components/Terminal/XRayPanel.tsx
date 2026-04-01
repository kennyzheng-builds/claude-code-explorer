import type { XRayContent } from '../../types'

interface Props {
  content: XRayContent | null
}

export default function XRayPanel({ content }: Props) {
  if (!content) {
    return (
      <div className="xray-hint">
        <div>
          点击左侧终端中的任何元素<br />
          查看其背后的实现原理<br /><br />
          <span style={{ color: 'var(--accent-blue)' }}>用户输入</span> — System Prompt 拼装过程<br />
          <span style={{ color: 'var(--text-primary)' }}>AI 回复</span> — 消息循环流程<br />
          <span style={{ color: 'var(--accent-yellow)' }}>工具调用</span> — 工具执行生命周期<br />
          <span style={{ color: 'var(--accent-red)' }}>权限弹窗</span> — 四层权限流水线<br />
          <span style={{ color: 'var(--accent-cyan)' }}>Todo 面板</span> — TodoWriteTool<br />
          <span style={{ color: 'var(--text-muted)' }}>状态栏</span> — Cost Tracking
        </div>
      </div>
    )
  }

  return (
    <div className="xray-body">
      <div className="xray-title">{content.title}</div>
      <div className="xray-what">{content.what}</div>

      <div className="xray-section-title">数据流</div>
      <div className="data-flow">
        {content.dataFlow.map((step, i) => (
          <div key={i} className={`data-flow-step ${step.highlight ? 'highlight' : ''}`}>
            <span className="flow-num">{step.step}</span>
            <span>{step.text}</span>
            {i < content.dataFlow.length - 1 && <span className="flow-arrow" />}
          </div>
        ))}
      </div>

      {content.code && (
        <>
          <div className="xray-section-title">关键代码</div>
          <div className="xray-code-panel">
            <div className="xray-code-header">
              <span>{content.code.source}</span>
              <span>{content.code.language}</span>
            </div>
            <div className="xray-code-body">{content.code.code}</div>
          </div>
          {content.code.annotation && (
            <div className="xray-annotation">{content.code.annotation}</div>
          )}
        </>
      )}

      {content.prompt && (
        <>
          <div className="xray-section-title">Prompt 原文</div>
          <div className="xray-code-panel">
            <div className="xray-code-header"><span>Prompt</span></div>
            <div className="xray-code-body">{content.prompt}</div>
          </div>
        </>
      )}

      {content.designNote && (
        <div className="xray-design-note">
          <div className="xray-design-note-title">设计决策</div>
          <div className="xray-design-note-text">{content.designNote}</div>
        </div>
      )}
    </div>
  )
}
