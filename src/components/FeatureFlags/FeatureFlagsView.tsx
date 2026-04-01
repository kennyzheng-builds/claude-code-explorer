import { useState, useMemo } from 'react'
import './FeatureFlags.css'
import { featureFlags, FLAG_STATUS_LABELS, FLAG_STATUS_COLORS } from '../../data/flagsData'
import type { FeatureFlag } from '../../types'

type FilterStatus = 'all' | FeatureFlag['status']

const STATUS_DOT_CHARS: Record<FeatureFlag['status'], string> = {
  released: '●',
  beta: '◐',
  unreleased: '○',
  'ant-only': '◆'
}

export default function FeatureFlagsView() {
  const [filter, setFilter] = useState<FilterStatus>('all')
  const [search, setSearch] = useState('')
  const [expandedFlags, setExpandedFlags] = useState<Set<string>>(new Set())

  const toggleExpand = (name: string) => {
    setExpandedFlags((prev) => {
      const next = new Set(prev)
      if (next.has(name)) next.delete(name)
      else next.add(name)
      return next
    })
  }

  const filteredFlags = useMemo(() => {
    return featureFlags.filter((f) => {
      const matchesFilter = filter === 'all' || f.status === filter
      const q = search.toLowerCase()
      const matchesSearch =
        !q ||
        f.name.toLowerCase().includes(q) ||
        f.description.includes(q) ||
        f.descriptionEn.toLowerCase().includes(q)
      return matchesFilter && matchesSearch
    })
  }, [filter, search])

  const countByStatus = useMemo(() => {
    const counts: Record<string, number> = { all: featureFlags.length }
    for (const f of featureFlags) {
      counts[f.status] = (counts[f.status] || 0) + 1
    }
    return counts
  }, [])

  const filterOptions: { id: FilterStatus; label: string }[] = [
    { id: 'all', label: '全部' },
    { id: 'released', label: '已发布' },
    { id: 'beta', label: '测试版' },
    { id: 'unreleased', label: '未发布' },
    { id: 'ant-only', label: '内部专用' },
  ]

  return (
    <div className="feature-flags">
      {/* Header */}
      <div className="ff-header">
        <h2>Feature Flag 探索器</h2>
        <p>探索 Claude Code 中已知的功能标志——从已发布功能到内部实验性特性</p>
      </div>

      {/* Stats row */}
      <div className="ff-stats-row">
        {(['released', 'beta', 'unreleased', 'ant-only'] as const).map((s) => (
          <div className="ff-stat-chip" key={s}>
            <div
              className="ff-stat-dot"
              style={{ backgroundColor: FLAG_STATUS_COLORS[s] }}
            />
            <span className="ff-stat-label">{FLAG_STATUS_LABELS[s]}</span>
            <span className="ff-stat-value">{countByStatus[s] || 0}</span>
          </div>
        ))}
      </div>

      {/* Controls */}
      <div className="ff-controls">
        <input
          className="ff-search"
          type="text"
          placeholder="搜索 flag 名称或描述..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          spellCheck={false}
        />
        <div className="ff-filter-tabs">
          {filterOptions.map((opt) => (
            <button
              key={opt.id}
              className={`ff-filter-btn ${filter === opt.id ? 'active' : ''}`}
              onClick={() => setFilter(opt.id)}
            >
              {opt.label}
              <span className="ff-count">{countByStatus[opt.id] || 0}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Flags grid */}
      <div className="flags-grid">
        {filteredFlags.length === 0 ? (
          <div className="ff-empty">
            没有匹配的 Feature Flag
            {search && <><br /><span style={{ fontSize: 12 }}>搜索词: "{search}"</span></>}
          </div>
        ) : (
          filteredFlags.map((flag) => {
            const isExpanded = expandedFlags.has(flag.name)
            const statusColor = FLAG_STATUS_COLORS[flag.status]
            return (
              <div
                key={flag.name}
                className={`flag-card ${isExpanded ? 'expanded' : ''}`}
                style={{ '--flag-color': statusColor } as React.CSSProperties}
                onClick={() => toggleExpand(flag.name)}
              >
                {/* Card header */}
                <div className="flag-card-header">
                  <span className="flag-name">{flag.name}</span>
                  <span
                    className="flag-status-badge"
                    style={{
                      color: statusColor,
                      borderColor: statusColor,
                      backgroundColor: `${statusColor}18`
                    }}
                  >
                    {STATUS_DOT_CHARS[flag.status]} {FLAG_STATUS_LABELS[flag.status]}
                  </span>
                  <span className="flag-expand-icon">▶</span>
                </div>

                {/* Card body — always visible */}
                <div className="flag-card-body">
                  <p className="flag-description">{flag.description}</p>
                  <div className="flag-trigger">
                    <span className="flag-trigger-label">触发条件</span>
                    <span className="flag-trigger-value">{flag.triggerCondition}</span>
                  </div>
                </div>

                {/* Expanded details */}
                {isExpanded && (
                  <div className="flag-expanded-details" onClick={(e) => e.stopPropagation()}>
                    {/* English description */}
                    <div className="flag-detail-section">
                      <span className="flag-detail-label">English</span>
                      <p className="flag-desc-en">{flag.descriptionEn}</p>
                    </div>

                    {/* Related files */}
                    <div className="flag-detail-section">
                      <span className="flag-detail-label">相关文件 · Related Files</span>
                      <div className="flag-files-list">
                        {flag.relatedFiles.map((f) => (
                          <span key={f} className="flag-file-item">{f}</span>
                        ))}
                      </div>
                    </div>

                    {/* Dependencies */}
                    {flag.dependencies && flag.dependencies.length > 0 && (
                      <div className="flag-detail-section">
                        <span className="flag-detail-label">依赖 · Dependencies</span>
                        <div className="flag-deps-list">
                          {flag.dependencies.map((dep) => (
                            <span key={dep} className="flag-dep-chip">{dep}</span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
