import { useState, useEffect, useRef } from 'react'
import './ToolSimulator.css'
import { toolSimScenarios, PIPELINE_STEPS } from '../../data/toolSimData'
import type { ToolSimScenario } from '../../types'

export default function ToolSimulatorView() {
  const [selectedScenario, setSelectedScenario] = useState<ToolSimScenario>(toolSimScenarios[0])
  const [currentStep, setCurrentStep] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(false)
  const [showCode, setShowCode] = useState(false)
  const autoPlayRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const step = selectedScenario.steps[currentStep]
  const totalSteps = selectedScenario.steps.length
  const progressPct = ((currentStep + 1) / totalSteps) * 100

  // Auto-play logic
  useEffect(() => {
    if (isAutoPlaying) {
      autoPlayRef.current = setInterval(() => {
        setCurrentStep((prev) => {
          if (prev >= totalSteps - 1) {
            setIsAutoPlaying(false)
            return prev
          }
          return prev + 1
        })
      }, 1800)
    }
    return () => {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current)
    }
  }, [isAutoPlaying, totalSteps])

  const handleScenarioChange = (scenario: ToolSimScenario) => {
    setSelectedScenario(scenario)
    setCurrentStep(0)
    setIsAutoPlaying(false)
    setShowCode(false)
  }

  const handlePrev = () => {
    setCurrentStep((p) => Math.max(0, p - 1))
    setIsAutoPlaying(false)
  }

  const handleNext = () => {
    setCurrentStep((p) => Math.min(totalSteps - 1, p + 1))
  }

  const handleAutoPlay = () => {
    if (isAutoPlaying) {
      setIsAutoPlaying(false)
    } else {
      if (currentStep >= totalSteps - 1) setCurrentStep(0)
      setIsAutoPlaying(true)
    }
  }

  const getStepState = (idx: number) => {
    if (idx < currentStep) return 'completed'
    if (idx === currentStep) return 'active'
    return 'pending'
  }

  return (
    <div className="tool-sim">
      {/* Header */}
      <div className="tool-sim-header">
        <h2>工具执行模拟器</h2>
        <p>逐步探索 Claude Code 工具调用的完整生命周期——从 API 响应到结果返回</p>
      </div>

      {/* Scenario selector */}
      <div className="scenario-tabs">
        {toolSimScenarios.map((s) => (
          <button
            key={s.id}
            className={`scenario-tab ${s.id === selectedScenario.id ? 'active' : ''}`}
            onClick={() => handleScenarioChange(s)}
          >
            {s.name}
            <span style={{ opacity: 0.5, marginLeft: 6, fontSize: 11 }}>{s.nameEn}</span>
          </button>
        ))}
      </div>

      {/* Main step display */}
      <div className="sim-main">
        {/* Step info */}
        <div className="step-info">
          <div className="step-badge">
            <span className="step-number">{step.step}</span>
            <span className="step-title">{step.title}</span>
          </div>
          <p className="step-description">{step.description}</p>

          {/* Progress bar */}
          <div className="progress-section">
            <div className="progress-label">
              <span>执行进度</span>
              <span>步骤 {currentStep + 1} / {totalSteps}</span>
            </div>
            <div className="progress-bar-track">
              <div className="progress-bar-fill" style={{ width: `${progressPct}%` }} />
            </div>
          </div>

          {/* Controls */}
          <div className="sim-controls">
            <button className="ctrl-btn" onClick={handlePrev} disabled={currentStep === 0}>
              ← 上一步
            </button>
            <button
              className={`ctrl-btn ${isAutoPlaying ? 'autoplay-active' : 'primary'}`}
              onClick={handleAutoPlay}
            >
              {isAutoPlaying ? '⏸ 暂停' : '▶ 自动播放'}
            </button>
            <button className="ctrl-btn" onClick={handleNext} disabled={currentStep === totalSteps - 1}>
              下一步 →
            </button>
            <span className="step-counter">
              {currentStep + 1}/{totalSteps}
            </span>
          </div>
        </div>

        {/* Data block */}
        <div className="step-data-panel">
          <span className="step-data-label">步骤数据 / Data</span>
          {step.data ? (
            <pre className="step-data-code">{step.data}</pre>
          ) : (
            <div className="step-data-empty">此步骤无数据</div>
          )}
        </div>
      </div>

      {/* Pipeline overview */}
      <div className="pipeline-overview">
        <div className="pipeline-overview-title">工具执行管线 · Tool Execution Pipeline</div>
        <div className="pipeline-steps-row">
          {PIPELINE_STEPS.map((pStep, idx) => {
            const state = getStepState(idx)
            const isLast = idx === PIPELINE_STEPS.length - 1
            return (
              <div key={pStep.id} style={{ display: 'flex', alignItems: 'center' }}>
                <div
                  className={`pipeline-step-node ${state}`}
                  onClick={() => { setCurrentStep(idx); setIsAutoPlaying(false) }}
                  title={pStep.labelEn}
                >
                  <div className="pipeline-step-circle">{idx + 1}</div>
                  <span className="pipeline-step-label">{pStep.label}</span>
                </div>
                {!isLast && (
                  <div className={`pipeline-connector ${state === 'completed' ? 'passed' : ''}`} />
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Show Code section */}
      <div className="show-code-section">
        <button
          className={`show-code-toggle ${showCode ? 'open' : ''}`}
          onClick={() => setShowCode((v) => !v)}
        >
          <span className="toggle-arrow">▶</span>
          <span>查看源代码注释 · Show Code Reference</span>
          <span style={{ marginLeft: 'auto', fontSize: 11, opacity: 0.6 }}>
            {selectedScenario.nameEn} · Step {step.step}: {step.title}
          </span>
        </button>
        {showCode && (
          <div className="show-code-content">
{`// === ${selectedScenario.nameEn} — Step ${step.step}: ${step.title} ===
// ${step.description}
//
// Pipeline stage: ${step.highlight}
//
// Key code reference:
// ─────────────────────────────────────────────────────────
// File: src/tools/${selectedScenario.id.replace('-', '')}/index.ts
//
// The tool execution lifecycle follows this sequence:
//   1. API returns tool_use block (type='tool_use', name, input)
//   2. toolRegistry.get(name) -> specific Tool implementation
//   3. tool.preprocessInput(input) -> normalized, resolved paths
//   4. tool.validateInput(normalized) -> throws on bad input
//   5. permissionChecker.check(tool, input) -> decision
//   6. Show PermissionRequest UI if decision === 'ask'
//   7. tool.call(input) -> executes the actual operation
//   8. Run PostToolUse hooks (lint, format, tracking)
//   9. enforceResultSizeLimit(result, maxResultSizeChars)
//  10. Return { type: 'tool_result', tool_use_id, content }
//
// Current step data:
${step.data ? step.data.split('\n').map(l => '// ' + l).join('\n') : '// (no data for this step)'}
`}
          </div>
        )}
      </div>
    </div>
  )
}
