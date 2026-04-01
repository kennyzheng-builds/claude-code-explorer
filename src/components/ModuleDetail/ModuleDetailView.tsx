import { useState } from 'react'
import '../Architecture/Architecture.css'
import { moduleDetails } from '../../data/architectureData'

interface Props {
  moduleId: string
  onBack: () => void
}

export default function ModuleDetailView({ moduleId, onBack }: Props) {
  const [activeStep, setActiveStep] = useState(0)
  const [activeTab, setActiveTab] = useState<'code' | 'prompts'>('code')

  const detail = moduleDetails[moduleId]
  if (!detail) {
    return (
      <div className="module-view">
        <button className="module-back" onClick={onBack}>← 返回架构图</button>
        <p>模块未找到: {moduleId}</p>
      </div>
    )
  }

  const currentSnippets = activeTab === 'code' ? detail.codeSnippets : detail.prompts

  return (
    <div className="module-view">
      <button className="module-back" onClick={onBack}>← 返回架构图</button>

      <div className="module-header">
        <div className="module-title">{detail.name}</div>
        <div className="module-title-en">{detail.nameEn}</div>
        <div className="module-layer-tag">
          <span className="tag tag-blue">{detail.layer}</span>
        </div>
        <div className="module-summary">{detail.summary}</div>
      </div>

      <div className="module-content">
        <div>
          <div className="module-flow-title">流程图</div>
          <div className="module-flow">
            {detail.flowSteps.map((step, i) => (
              <div key={i}>
                <div
                  className={`flow-step ${activeStep === i ? 'active' : ''}`}
                  onClick={() => setActiveStep(i)}
                >
                  <span className="flow-step-number">{step.step}</span>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 13 }}>{step.title}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2 }}>
                      {step.description}
                    </div>
                  </div>
                </div>
                {i < detail.flowSteps.length - 1 && (
                  <div className="flow-arrow" style={{ textAlign: 'center', padding: '4px 0', color: 'var(--text-muted)' }}>↓</div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="module-code-section">
          <div className="module-tabs">
            <button
              className={`module-tab ${activeTab === 'code' ? 'active' : ''}`}
              onClick={() => setActiveTab('code')}
            >
              TypeScript 代码 ({detail.codeSnippets.length})
            </button>
            <button
              className={`module-tab ${activeTab === 'prompts' ? 'active' : ''}`}
              onClick={() => setActiveTab('prompts')}
            >
              Prompt 原文 ({detail.prompts.length})
            </button>
          </div>

          {currentSnippets.length === 0 ? (
            <div style={{ color: 'var(--text-muted)', fontSize: 13, padding: 20 }}>
              该标签下暂无内容
            </div>
          ) : (
            currentSnippets.map((snippet, i) => (
              <div key={i} className="module-code-block" style={{ marginBottom: 16 }}>
                <div className="module-code-header">{snippet.source}</div>
                <div className="module-code-body">{snippet.code}</div>
                {snippet.annotation && (
                  <div className="module-code-annotation">{snippet.annotation}</div>
                )}
              </div>
            ))
          )}
        </div>

        <div className="module-decisions">
          <div className="module-decisions-title">设计决策</div>
          {detail.designDecisions.map((d, i) => (
            <div key={i} className="module-decision">{d}</div>
          ))}
        </div>
      </div>
    </div>
  )
}
