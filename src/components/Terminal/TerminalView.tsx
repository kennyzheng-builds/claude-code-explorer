import { useState } from 'react'
import './Terminal.css'
import { scenarios, xrayContents } from '../../data/terminalData'
import TerminalPanel from './TerminalPanel'
import XRayPanel from './XRayPanel'

export default function TerminalView() {
  const [scenarioId, setScenarioId] = useState(scenarios[0].id)
  const [activeTarget, setActiveTarget] = useState<string | null>(null)

  const scenario = scenarios.find(s => s.id === scenarioId) || scenarios[0]
  const xrayContent = activeTarget ? xrayContents[activeTarget] || null : null

  return (
    <div className="terminal-view">
      <div className="terminal-left">
        <div className="scenario-tabs">
          {scenarios.map(s => (
            <button
              key={s.id}
              className={`scenario-tab ${s.id === scenarioId ? 'active' : ''}`}
              onClick={() => { setScenarioId(s.id); setActiveTarget(null) }}
              title={s.description}
            >
              {s.name}
            </button>
          ))}
        </div>
        <TerminalPanel
          lines={scenario.lines}
          activeTarget={activeTarget}
          onLineClick={setActiveTarget}
        />
      </div>
      <div className="terminal-right">
        <div className="xray-header">X-Ray 透视</div>
        <XRayPanel content={xrayContent} />
      </div>
    </div>
  )
}
