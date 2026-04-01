import { useState } from 'react'
import './BuddyLab.css'
import {
  SPECIES,
  generateBuddy,
  randomUserId,
  RARITY_COLORS,
  RARITY_LABELS,
  STAT_LABELS,
  STAT_COLORS,
  HAT_LABELS,
  EYE_CHARS,
  EYE_LABELS,
  hashUserId,
  type GeneratedBuddy,
  type Rarity,
  type BuddySpeciesData,
} from '../../data/buddyData'

const MULBERRY32_CODE = `function mulberry32(seed: number): () => number {
  return function() {
    let t = seed += 0x6D2B79F5;
    t = Math.imul(t ^ t >>> 15, t | 1);
    t ^= t + Math.imul(t ^ t >>> 7, t | 61);
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  }
}`

const HASH_CODE = `function hashUserId(userId: string): number {
  let hash = 0x811c9dc5;  // FNV-1a offset basis
  for (let i = 0; i < userId.length; i++) {
    hash ^= userId.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193); // FNV prime
  }
  return hash >>> 0; // ensure unsigned 32-bit
}`

export default function BuddyLabView() {
  const [userId, setUserId] = useState('user_claude42')
  const [buddy, setBuddy] = useState<GeneratedBuddy>(() => generateBuddy('user_claude42'))
  const [selectedSpecies, setSelectedSpecies] = useState<BuddySpeciesData | null>(null)
  const [showPrng, setShowPrng] = useState(false)

  const handleGenerate = () => {
    if (userId.trim()) {
      setBuddy(generateBuddy(userId.trim()))
    }
  }

  const handleRandom = () => {
    const id = randomUserId()
    setUserId(id)
    setBuddy(generateBuddy(id))
  }

  const seed = hashUserId(userId)
  const rarityColor = RARITY_COLORS[buddy.species.rarity as Rarity]

  const algoSteps = [
    { label: 'userId', value: `"${buddy.userId}"` },
    { label: 'seed = hash(userId)', value: `0x${seed.toString(16).toUpperCase().padStart(8, '0')} (${seed})` },
    { label: 'rng = mulberry32(seed)', value: `PRNG instance initialized` },
    { label: 'rarity tier', value: `"${buddy.species.rarity}" (${RARITY_COLORS[buddy.species.rarity as Rarity]})` },
    { label: 'species', value: `"${buddy.species.name}"` },
    { label: 'stats', value: Object.entries(buddy.stats).map(([k, v]) => `${k}=${v}`).join(', ') },
    { label: 'hat', value: `"${buddy.hat}" → ${HAT_LABELS[buddy.hat]}` },
    { label: 'eyes', value: `"${buddy.eyes}" → ${EYE_CHARS[buddy.eyes]}` },
    { label: 'name', value: `"${buddy.name}"` },
  ]

  return (
    <div className="buddy-lab">
      {/* Header */}
      <div className="buddy-lab-header">
        <h2>Buddy 实验室</h2>
        <p>基于用户 ID 通过确定性 PRNG 生成你的专属虚拟伙伴——相同 ID 永远生成相同 Buddy</p>
      </div>

      {/* Your Buddy */}
      <div className="your-buddy-section">
        {/* Buddy card */}
        <div
          className="buddy-card"
          style={{ '--buddy-color': buddy.species.color } as React.CSSProperties}
        >
          <div className="buddy-ascii-display">{buddy.species.ascii}</div>

          <div className="buddy-name-row">
            <span className="buddy-name">{buddy.name}</span>
            <span className="buddy-species-label">
              {buddy.hat !== 'none' ? `[${HAT_LABELS[buddy.hat]}] ` : ''}{buddy.species.name}
            </span>
            <span
              className="rarity-badge"
              style={{
                color: rarityColor,
                borderColor: rarityColor,
                backgroundColor: `${rarityColor}18`
              }}
            >
              {buddy.species.rarity === 'legendary' ? '✦ ' : ''}
              {RARITY_LABELS[buddy.species.rarity as Rarity]}
            </span>
          </div>

          <div className="buddy-accessories">
            <span className="accessory-pill">
              <span>眼睛</span>
              <strong style={{ color: buddy.species.color }}>{EYE_CHARS[buddy.eyes]}</strong>
              <span>{EYE_LABELS[buddy.eyes]}</span>
            </span>
            <span className="accessory-pill">
              <span>帽子</span>
              <strong>{HAT_LABELS[buddy.hat]}</strong>
            </span>
          </div>
        </div>

        {/* Stats */}
        <div className="buddy-stats-panel">
          <div className="buddy-stats-title">属性面板 · Stats</div>
          {(Object.keys(STAT_LABELS) as Array<keyof typeof STAT_LABELS>).map((key) => (
            <div className="stat-row" key={key}>
              <span className="stat-label">{STAT_LABELS[key]}</span>
              <div className="stat-bar-track">
                <div
                  className="stat-bar-fill"
                  style={{
                    width: `${buddy.stats[key] * 10}%`,
                    backgroundColor: STAT_COLORS[key]
                  }}
                />
              </div>
              <span className="stat-value" style={{ color: STAT_COLORS[key] }}>
                {buddy.stats[key]}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Generate section */}
      <div className="generate-section">
        <div className="generate-controls">
          <label>用户 ID / User ID</label>
          <div className="generate-input-row">
            <input
              className="buddy-user-input"
              type="text"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
              placeholder="输入任意用户 ID..."
              spellCheck={false}
            />
            <button className="buddy-gen-btn" onClick={handleGenerate}>生成</button>
            <button className="buddy-gen-btn secondary" onClick={handleRandom}>随机</button>
          </div>
          <p style={{ fontSize: 12, color: 'var(--text-secondary)', margin: 0 }}>
            相同的 ID 总是生成相同的 Buddy（确定性算法）
          </p>
        </div>

        {/* Algorithm display */}
        <div className="algo-display">
          <div className="algo-display-title">生成算法步骤 · Generation Steps</div>
          {algoSteps.map((s, i) => (
            <div className="algo-step" key={i}>
              <span className="algo-step-num">{i + 1}</span>
              <span className="algo-step-text">
                {s.label}:{' '}
                <span className="algo-step-value">{s.value}</span>
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Species Gallery */}
      <div className="gallery-section">
        <div className="gallery-title">物种图鉴 · Species Gallery</div>
        <div className="species-grid">
          {SPECIES.map((sp) => {
            const color = RARITY_COLORS[sp.rarity as Rarity]
            return (
              <div
                key={sp.name}
                className={`species-card ${selectedSpecies?.name === sp.name ? 'selected' : ''}`}
                style={{ '--species-color': color } as React.CSSProperties}
                onClick={() => setSelectedSpecies(selectedSpecies?.name === sp.name ? null : sp)}
              >
                <div className="species-card-ascii">{sp.ascii}</div>
                <span className="species-card-name">{sp.name}</span>
                <span
                  className="species-rarity-tag"
                  style={{ color, borderColor: color, backgroundColor: `${color}18` }}
                >
                  {RARITY_LABELS[sp.rarity as Rarity]}
                </span>
              </div>
            )
          })}
        </div>

        {/* Species detail panel */}
        {selectedSpecies && (
          <div
            style={{
              background: 'var(--bg-card)',
              border: `1px solid ${RARITY_COLORS[selectedSpecies.rarity as Rarity]}`,
              borderRadius: 8,
              padding: 20,
              display: 'flex',
              gap: 20,
              alignItems: 'flex-start',
              marginTop: 8,
            }}
          >
            <pre style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 18,
              lineHeight: 1.5,
              color: RARITY_COLORS[selectedSpecies.rarity as Rarity],
              margin: 0,
              textShadow: `0 0 16px ${RARITY_COLORS[selectedSpecies.rarity as Rarity]}`,
            }}>
              {selectedSpecies.ascii}
            </pre>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', textTransform: 'capitalize' }}>
                {selectedSpecies.name}
              </div>
              <span
                className="rarity-badge"
                style={{
                  color: RARITY_COLORS[selectedSpecies.rarity as Rarity],
                  borderColor: RARITY_COLORS[selectedSpecies.rarity as Rarity],
                  backgroundColor: `${RARITY_COLORS[selectedSpecies.rarity as Rarity]}18`,
                  alignSelf: 'flex-start'
                }}
              >
                {RARITY_LABELS[selectedSpecies.rarity as Rarity]}
              </span>
              <p style={{ fontSize: 12, color: 'var(--text-secondary)', margin: 0 }}>
                出现概率 Probability:{' '}
                <strong style={{ color: 'var(--text-primary)' }}>
                  {selectedSpecies.rarityWeight}%
                </strong>
                {' '}(在该稀有度层级内均匀分布)
              </p>
            </div>
          </div>
        )}
      </div>

      {/* PRNG Code section */}
      <div className="prng-section">
        <div
          className="prng-section-header"
          onClick={() => setShowPrng((v) => !v)}
          style={{ cursor: 'pointer' }}
        >
          <span style={{ fontSize: 12, opacity: 0.6 }}>{showPrng ? '▼' : '▶'}</span>
          <span className="prng-section-title">核心代码 · Mulberry32 PRNG &amp; 反作弊设计</span>
          <span className="prng-section-subtitle">点击展开 / Click to expand</span>
        </div>
        {showPrng && (
          <div className="prng-section-body">
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <pre className="prng-code-block">{MULBERRY32_CODE}</pre>
              <pre className="prng-code-block" style={{ borderTop: '1px solid var(--border-color)' }}>
                {HASH_CODE}
              </pre>
            </div>
            <div className="prng-design-note">
              <h4>反作弊设计说明</h4>
              <p>
                Buddy 系统使用 <strong style={{ color: 'var(--accent-blue)' }}>确定性 PRNG</strong> 而非随机数，
                这意味着：
              </p>
              <ul>
                <li>相同 userId → 永远生成相同 Buddy</li>
                <li>用户无法通过刷新/重试来"reroll"稀有 Buddy</li>
                <li>Buddy 是用户身份的函数，不可操纵</li>
                <li>服务端和客户端生成结果完全一致（无需同步）</li>
              </ul>
              <p style={{ marginTop: 8 }}>
                <strong style={{ color: 'var(--accent-yellow)' }}>Mulberry32</strong> 是一种高质量、
                低碰撞的 32 位 PRNG，通过位混合（bit mixing）确保即使相似的 seed 也能产生
                完全不同的序列，防止用户通过猜测 userId 来预测特定 Buddy。
              </p>
              <p>
                哈希函数基于 <strong>FNV-1a</strong>，对字符串有良好的均匀分布特性，
                确保不同长度、不同字符的 userId 都能得到分散的 seed 值。
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
