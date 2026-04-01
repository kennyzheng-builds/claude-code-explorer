import { useState, useEffect } from 'react'
import './App.css'
import type { ViewId } from './types'
import TerminalView from './components/Terminal/TerminalView'
import ArchitectureView from './components/Architecture/ArchitectureView'
import ModuleDetailView from './components/ModuleDetail/ModuleDetailView'
import PromptMuseumView from './components/PromptMuseum/PromptMuseumView'
import ToolSimulatorView from './components/ToolSimulator/ToolSimulatorView'
import BuddyLabView from './components/BuddyLab/BuddyLabView'
import FeatureFlagsView from './components/FeatureFlags/FeatureFlagsView'

const NAV_ITEMS: { id: ViewId; label: string }[] = [
  { id: 'terminal', label: 'X-Ray Terminal' },
  { id: 'architecture', label: '全景架构' },
  { id: 'prompts', label: 'Prompt 博物馆' },
  { id: 'tool-sim', label: '工具模拟器' },
  { id: 'buddy', label: 'Buddy 实验室' },
  { id: 'flags', label: 'Feature Flags' },
]

function parseHash(): { view: ViewId; param?: string } {
  const hash = window.location.hash.slice(1) || 'terminal'
  const [view, param] = hash.split('/')
  return { view: view as ViewId, param }
}

function App() {
  const [route, setRoute] = useState(parseHash)

  useEffect(() => {
    const onHash = () => setRoute(parseHash())
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  const navigate = (view: ViewId, param?: string) => {
    window.location.hash = param ? `${view}/${param}` : view
  }

  const renderView = () => {
    switch (route.view) {
      case 'terminal':
        return <TerminalView />
      case 'architecture':
        return <ArchitectureView onModuleClick={(id) => navigate('module', id)} />
      case 'module':
        return <ModuleDetailView moduleId={route.param || 'message-loop'} onBack={() => navigate('architecture')} />
      case 'prompts':
        return <PromptMuseumView />
      case 'tool-sim':
        return <ToolSimulatorView />
      case 'buddy':
        return <BuddyLabView />
      case 'flags':
        return <FeatureFlagsView />
      default:
        return <TerminalView />
    }
  }

  return (
    <div className="app">
      <nav className="top-nav">
        <span className="nav-logo">claude-code-explorer</span>
        {NAV_ITEMS.map((item) => (
          <a
            key={item.id}
            href={`#${item.id}`}
            className={`nav-link ${route.view === item.id || (item.id === 'architecture' && route.view === 'module') ? 'active' : ''}`}
          >
            {item.label}
          </a>
        ))}
      </nav>
      <main className="main-content">
        {renderView()}
      </main>
    </div>
  )
}

export default App
