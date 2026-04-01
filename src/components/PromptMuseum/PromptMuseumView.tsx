import { useState } from 'react'
import './PromptMuseum.css'
import { categories, prompts } from '../../data/promptData'

export default function PromptMuseumView() {
  const [activeId, setActiveId] = useState<string | null>(null)
  const [showAnnotation, setShowAnnotation] = useState(true)

  const activePrompt = activeId ? prompts[activeId] : null

  return (
    <div className="prompt-view">
      <div className="prompt-sidebar">
        <div className="prompt-sidebar-title">Prompt 博物馆</div>
        {categories.map(cat => (
          <div key={cat.id} className="prompt-category">
            <div className="prompt-category-name">{cat.name}</div>
            {cat.items.map(id => {
              const p = prompts[id]
              if (!p) return null
              return (
                <button
                  key={id}
                  className={`prompt-item ${activeId === id ? 'active' : ''}`}
                  onClick={() => setActiveId(id)}
                >
                  {p.name}
                </button>
              )
            })}
          </div>
        ))}
      </div>

      <div className="prompt-main">
        {!activePrompt ? (
          <div className="prompt-empty">
            选择左侧的 Prompt 查看原文和中文注解
          </div>
        ) : (
          <>
            <div className="prompt-header">
              <div className="prompt-name">{activePrompt.name}</div>
              <div className="prompt-meta">
                <span className="prompt-meta-item">来源: {activePrompt.source}</span>
                <span className="prompt-meta-item">约 {activePrompt.tokenEstimate}</span>
                <span className={`tag ${activePrompt.cached ? 'tag-green' : 'tag-yellow'}`}>
                  {activePrompt.cached ? '静态 (可缓存)' : '动态 (每轮计算)'}
                </span>
                <button
                  className={`prompt-toggle ${showAnnotation ? 'active' : ''}`}
                  onClick={() => setShowAnnotation(!showAnnotation)}
                >
                  中文注解 {showAnnotation ? 'ON' : 'OFF'}
                </button>
              </div>
            </div>

            <div className="prompt-content-block">{activePrompt.content}</div>

            {showAnnotation && (
              <div className="prompt-annotation-block">
                <div className="prompt-annotation-label">中文注解</div>
                {activePrompt.annotation}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
