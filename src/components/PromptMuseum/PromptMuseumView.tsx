import { useState } from 'react'
import './PromptMuseum.css'
import { categories, prompts } from '../../data/promptData'

export default function PromptMuseumView() {
  const [activeId, setActiveId] = useState<string | null>(null)
  const [showAnnotation, setShowAnnotation] = useState(true)
  const [lang, setLang] = useState<'en' | 'cn'>('en')

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
            选择左侧的 Prompt 查看原文、中文翻译和深度点评
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
              </div>
              <div className="prompt-controls">
                <div className="prompt-lang-switch">
                  <button
                    className={`prompt-lang-btn ${lang === 'en' ? 'active' : ''}`}
                    onClick={() => setLang('en')}
                  >
                    英文原文
                  </button>
                  <button
                    className={`prompt-lang-btn ${lang === 'cn' ? 'active' : ''}`}
                    onClick={() => setLang('cn')}
                  >
                    中文翻译
                  </button>
                </div>
                <button
                  className={`prompt-toggle ${showAnnotation ? 'active' : ''}`}
                  onClick={() => setShowAnnotation(!showAnnotation)}
                >
                  深度点评 {showAnnotation ? 'ON' : 'OFF'}
                </button>
              </div>
            </div>

            <div className="prompt-content-block">
              {lang === 'en' ? activePrompt.content : activePrompt.contentCn}
            </div>

            {showAnnotation && (
              <div className="prompt-annotation-block">
                <div className="prompt-annotation-label">深度点评</div>
                {activePrompt.annotation.split('\n').map((line, i) => {
                  if (!line.trim()) return <div key={i} className="prompt-annotation-gap" />
                  if (line.startsWith('【') && line.endsWith('】')) {
                    return <div key={i} className="prompt-annotation-heading">{line}</div>
                  }
                  const indent = line.match(/^\d+\.\s/) ? 'prompt-annotation-point' :
                                 line.match(/^\s+-\s/) ? 'prompt-annotation-sub' :
                                 line.match(/^\s{3,}/) ? 'prompt-annotation-detail' :
                                 ''
                  return <div key={i} className={indent}>{line}</div>
                })}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
