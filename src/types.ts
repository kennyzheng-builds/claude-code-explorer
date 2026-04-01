// Route types
export type ViewId = 'terminal' | 'architecture' | 'module' | 'prompts' | 'tool-sim' | 'buddy' | 'flags'

export interface NavItem {
  id: ViewId
  label: string
  labelEn: string
}

// Terminal scenario types
export interface TerminalLine {
  type: 'input' | 'text' | 'tool-header' | 'tool-content' | 'permission' | 'todo' | 'status' | 'diff-add' | 'diff-del' | 'error' | 'blank'
  content: string
  clickTarget?: string  // ID of what this line reveals in X-ray
}

export interface TerminalScenario {
  id: string
  name: string
  nameEn: string
  description: string
  lines: TerminalLine[]
}

// X-ray panel types
export interface XRayContent {
  id: string
  title: string
  what: string
  dataFlow: DataFlowStep[]
  code?: CodeSnippet
  prompt?: string
  designNote?: string
}

export interface DataFlowStep {
  step: number
  text: string
  highlight?: boolean
}

export interface CodeSnippet {
  source: string
  language: string
  code: string
  annotation?: string
}

// Architecture types
export interface ArchModule {
  id: string
  name: string
  nameEn: string
  layer: number
  layerName: string
  summary: string
  x: number
  y: number
  width: number
  height: number
  color: string
}

export interface ArchConnection {
  from: string
  to: string
  label?: string
}

// Module detail types
export interface ModuleDetail {
  id: string
  name: string
  nameEn: string
  layer: string
  summary: string
  flowSteps: FlowStep[]
  codeSnippets: CodeSnippet[]
  prompts: CodeSnippet[]
  dataStructures: CodeSnippet[]
  designDecisions: string[]
}

export interface FlowStep {
  step: number
  title: string
  description: string
  codeRef?: string
}

// Prompt Museum types
export interface PromptEntry {
  id: string
  category: string
  name: string
  nameEn: string
  source: string
  tokenEstimate: string
  cached: boolean
  content: string
  contentCn: string
  annotation: string
}

// Tool simulator types
export interface ToolSimStep {
  step: number
  title: string
  description: string
  data?: string
  highlight: string
}

export interface ToolSimScenario {
  id: string
  name: string
  nameEn: string
  steps: ToolSimStep[]
}

// Buddy types
export interface BuddySpecies {
  name: string
  ascii: string
  rarity?: string
}

// Feature flags types
export interface FeatureFlag {
  name: string
  status: 'released' | 'beta' | 'unreleased' | 'ant-only'
  description: string
  descriptionEn: string
  triggerCondition: string
  relatedFiles: string[]
  dependencies?: string[]
}
