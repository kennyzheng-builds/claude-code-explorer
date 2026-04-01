import './Architecture.css'
import { modules, layers } from '../../data/architectureData'

interface Props {
  onModuleClick: (id: string) => void
}

export default function ArchitectureView({ onModuleClick }: Props) {
  const grouped = layers.map(layer => ({
    ...layer,
    modules: modules.filter(m => m.layer === layer.id),
  }))

  return (
    <div className="arch-view">
      <div className="arch-sidebar">
        <div className="arch-sidebar-title">模块列表</div>
        {grouped.map(layer => (
          <div key={layer.id} className="arch-layer-group">
            <div className="arch-layer-label" style={{ color: layer.color }}>
              {layer.name}
            </div>
            {layer.modules.map(m => (
              <button
                key={m.id}
                className="arch-module-item"
                onClick={() => onModuleClick(m.id)}
              >
                {m.name}
              </button>
            ))}
          </div>
        ))}
      </div>

      <div className="arch-main">
        <div className="arch-diagram">
          {grouped.map((layer, li) => (
            <div key={layer.id}>
              <div className="arch-layer-section">
                <div className="arch-layer-header" style={{ color: layer.color }}>
                  Layer {layer.id}: {layer.name} ({layer.nameEn})
                </div>
                <div className="arch-layer-modules">
                  {layer.modules.map(m => (
                    <div
                      key={m.id}
                      className="arch-module-card"
                      onClick={() => onModuleClick(m.id)}
                      style={{ borderLeftColor: m.color, borderLeftWidth: 3 }}
                    >
                      <div className="arch-module-name">{m.name}</div>
                      <div className="arch-module-name-en">{m.nameEn}</div>
                      <div className="arch-module-summary">{m.summary}</div>
                    </div>
                  ))}
                </div>
              </div>
              {li < grouped.length - 1 && (
                <div className="arch-connector">▼</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
