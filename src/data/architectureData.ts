import type { CodeSnippet } from '../types'
type PromptSnippet = CodeSnippet

export interface ModuleInfo {
  id: string
  name: string
  nameEn: string
  layer: number
  layerName: string
  summary: string
  color: string
}

export interface ModuleDetailData {
  id: string
  name: string
  nameEn: string
  layer: string
  summary: string
  flowSteps: { step: number; title: string; description: string }[]
  codeSnippets: CodeSnippet[]
  prompts: PromptSnippet[]
  designDecisions: string[]
}

export const layers = [
  { id: 1, name: '核心循环', nameEn: 'Core Loop', color: 'var(--accent-blue)' },
  { id: 2, name: '工具系统', nameEn: 'Tool System', color: 'var(--accent-green)' },
  { id: 3, name: '权限与安全', nameEn: 'Permission & Security', color: 'var(--accent-red)' },
  { id: 4, name: 'Agent 编排', nameEn: 'Agent Orchestration', color: 'var(--accent-purple)' },
  { id: 5, name: '可扩展性', nameEn: 'Extensibility', color: 'var(--accent-orange)' },
]

export const modules: ModuleInfo[] = [
  { id: 'message-loop', name: '消息循环', nameEn: 'Message Loop', layer: 1, layerName: '核心循环', summary: 'while(true) 核心循环：API 调用 → 解析 → 工具执行 → 回传', color: 'var(--accent-blue)' },
  { id: 'system-prompt', name: 'System Prompt 引擎', nameEn: 'System Prompt Engine', layer: 1, layerName: '核心循环', summary: '13 段 Prompt 拼装 + 静态/动态缓存分界', color: 'var(--accent-blue)' },
  { id: 'context-mgmt', name: '上下文管理', nameEn: 'Context Management', layer: 1, layerName: '核心循环', summary: 'CLAUDE.md 多层加载 + 9 段式对话压缩 + 记忆系统', color: 'var(--accent-blue)' },
  { id: 'cost-tracking', name: '费用与限流', nameEn: 'Cost & Rate Limiting', layer: 1, layerName: '核心循环', summary: 'Token 计费 + 限流类型 + 指数退避重试', color: 'var(--accent-blue)' },
  { id: 'tool-registry', name: '工具注册与发现', nameEn: 'Tool Registry', layer: 2, layerName: '工具系统', summary: 'Tool 接口定义 + 注册表 + 排序策略', color: 'var(--accent-green)' },
  { id: 'tool-lifecycle', name: '工具执行生命周期', nameEn: 'Tool Execution Lifecycle', layer: 2, layerName: '工具系统', summary: '10 步完整流程：解析 → 验证 → 权限 → 执行 → 返回', color: 'var(--accent-green)' },
  { id: 'tool-prompts', name: '工具 Prompt 设计', nameEn: 'Tool Prompt Design', layer: 2, layerName: '工具系统', summary: '双重强化策略 + 反例/正例模式', color: 'var(--accent-green)' },
  { id: 'permission-pipeline', name: '权限四层流水线', nameEn: 'Permission Pipeline', layer: 3, layerName: '权限与安全', summary: '规则 → 低风险 → 白名单 → 分类器', color: 'var(--accent-red)' },
  { id: 'security', name: '安全机制', nameEn: 'Security Mechanisms', layer: 3, layerName: '权限与安全', summary: 'Unicode 净化 + 沙箱 + 密钥扫描 + 路径验证', color: 'var(--accent-red)' },
  { id: 'telemetry', name: '遥测与反滥用', nameEn: 'Telemetry & Anti-abuse', layer: 3, layerName: '权限与安全', summary: '设备指纹 + 环境检测 + 反蒸馏三重机制', color: 'var(--accent-red)' },
  { id: 'subagent', name: '子 Agent 系统', nameEn: 'Subagent System', layer: 4, layerName: 'Agent 编排', summary: 'Fork vs Spawn + 工具限制 + Prompt 注入', color: 'var(--accent-purple)' },
  { id: 'coordinator', name: 'Coordinator 模式', nameEn: 'Coordinator Mode', layer: 4, layerName: 'Agent 编排', summary: '研究 → 综合 → 实施 → 验证 多 Worker 流程', color: 'var(--accent-purple)' },
  { id: 'swarm', name: 'Swarm 协作', nameEn: 'Swarm Collaboration', layer: 4, layerName: 'Agent 编排', summary: '三种后端 (tmux/iTerm2/in-process) + 邮箱 + 权限冒泡', color: 'var(--accent-purple)' },
  { id: 'skills-hooks', name: 'Skills & Hooks', nameEn: 'Skills & Hooks', layer: 5, layerName: '可扩展性', summary: 'Markdown 命令定义 + 事件钩子系统', color: 'var(--accent-orange)' },
  { id: 'unreleased', name: '未发布功能', nameEn: 'Unreleased Features', layer: 5, layerName: '可扩展性', summary: 'DAEMON/Teleport/ULTRAPLAN/Buddy 等隐藏功能', color: 'var(--accent-orange)' },
]

export const connections = [
  { from: 'message-loop', to: 'system-prompt' },
  { from: 'message-loop', to: 'tool-registry' },
  { from: 'message-loop', to: 'context-mgmt' },
  { from: 'message-loop', to: 'cost-tracking' },
  { from: 'tool-registry', to: 'tool-lifecycle' },
  { from: 'tool-lifecycle', to: 'permission-pipeline' },
  { from: 'tool-lifecycle', to: 'tool-prompts' },
  { from: 'permission-pipeline', to: 'security' },
  { from: 'security', to: 'telemetry' },
  { from: 'message-loop', to: 'subagent' },
  { from: 'subagent', to: 'coordinator' },
  { from: 'coordinator', to: 'swarm' },
  { from: 'tool-registry', to: 'skills-hooks' },
  { from: 'skills-hooks', to: 'unreleased' },
]

export const moduleDetails: Record<string, ModuleDetailData> = {
  'message-loop': {
    id: 'message-loop', name: '消息循环', nameEn: 'Message Loop', layer: '核心循环',
    summary: 'Claude Code 的核心是一个 while(true) 循环。它持续调用 API，解析模型响应中的 tool_use blocks，执行工具，再把结果传回 API，直到模型不再请求工具调用。',
    flowSteps: [
      { step: 1, title: '接收用户输入', description: 'PromptInput 组件接收用户消息，push 到 messages 数组' },
      { step: 2, title: '组装 System Prompt', description: 'buildSystemPrompt() 拼装 13 个 Section，包含角色、规则、工具、环境' },
      { step: 3, title: '调用 API', description: '发送 { system, messages, tools } 到 Anthropic API' },
      { step: 4, title: '解析响应', description: '分离 text blocks 和 tool_use blocks' },
      { step: 5, title: '判断是否有 tool_use', description: '如果没有 tool_use → 循环结束，显示文本' },
      { step: 6, title: '执行工具', description: 'Promise.all 并行执行可并发的工具，串行执行不可并发的' },
      { step: 7, title: '收集结果', description: '工具结果包装为 tool_result 追加到 messages' },
      { step: 8, title: '继续循环', description: '回到步骤 3，带着新的 messages 再次调用 API' },
    ],
    codeSnippets: [
      { source: 'query.ts', language: 'typescript', code: `async function agentLoop(userMessage: string) {
  const messages = [{ role: 'user', content: userMessage }]
  while (true) {
    const response = await callAPI({
      system: buildSystemPrompt(),
      messages,
      tools: getToolDefinitions(),
    })
    messages.push({ role: 'assistant', content: response.content })
    const toolUses = response.content.filter(b => b.type === 'tool_use')
    if (toolUses.length === 0) break
    const results = await Promise.all(toolUses.map(tu => executeTool(tu)))
    messages.push({ role: 'user', content: results })
  }
}`, annotation: '整个 Claude Code 的核心就是这个 while 循环。简单但强大。' },
    ],
    prompts: [
      { source: 'constants/prompts.ts', language: 'text', code: `You are Claude Code, Anthropic's official CLI for Claude.
You are an interactive agent that helps users with software engineering tasks.
Use the instructions below and the tools available to you to assist the user.`, annotation: 'System Prompt 的第一段：角色定义。简洁明了。' },
    ],
    designDecisions: [
      '用 while(true) 而不是递归 — 递归有栈溢出风险，while 可以无限运行',
      '工具执行后结果包装为 user message — 这是 Anthropic API 的约定：tool_result 放在 user role 中',
      '可并发的工具用 Promise.all — 只读工具（Read, Grep, Glob）可以并行，写操作必须串行',
    ],
  },
  'system-prompt': {
    id: 'system-prompt', name: 'System Prompt 引擎', nameEn: 'System Prompt Engine', layer: '核心循环',
    summary: 'System Prompt 由 13 个 Section 按顺序拼装。前 7 段是静态的（可被 API 缓存），后 6 段是动态的（每轮重新计算）。',
    flowSteps: [
      { step: 1, title: '拼装静态段 (1-7)', description: 'Intro → System → Tasks → Actions → Tools → Tone → Output' },
      { step: 2, title: '插入动态边界', description: 'SYSTEM_PROMPT_DYNAMIC_BOUNDARY 标记缓存分界线' },
      { step: 3, title: '拼装动态段 (8-13)', description: 'Session → Memory → Environment → Language → MCP' },
      { step: 4, title: '注入 CLAUDE.md', description: '多层 CLAUDE.md 内容注入 Memory section' },
      { step: 5, title: '计算环境信息', description: 'CWD, git branch, OS, model, date' },
    ],
    codeSnippets: [
      { source: 'constants/prompts.ts', language: 'typescript', code: `// 静态段 — 可被 API prompt caching 缓存
getIntroSection()          // 角色 + 安全
getSystemSection()         // 系统规则
getDoingTasksSection()     // 任务指南
getActionsSection()        // 操作风险
getUsingYourToolsSection() // 工具优先级
getToneAndStyleSection()   // 语气
getOutputSection()         // 输出规范
// ─── SYSTEM_PROMPT_DYNAMIC_BOUNDARY ───
// 动态段 — 每轮重新计算
getSessionGuidance()       // 会话引导
getMemorySection()         // CLAUDE.md 内容
getEnvironmentInfo()       // 环境信息`, annotation: '动态边界是缓存优化的关键。API 按前缀匹配缓存，静态段不变就能命中。' },
    ],
    prompts: [
      { source: 'constants/prompts.ts', language: 'text', code: `IMPORTANT: Assist with authorized security testing, defensive security,
CTF challenges, and educational contexts. Refuse requests for destructive
techniques, DoS attacks, mass targeting, supply chain compromise, or
detection evasion for malicious purposes.`, annotation: '安全限制在 Intro 段最前面 — 确保模型先看到安全规则再看到其他任何东西。' },
    ],
    designDecisions: [
      '静态/动态分离让 70% 的 Prompt 可被缓存，缓存命中时成本降低 90%',
      '安全限制放在 Intro（第一段）— LLM 对前面的内容更"重视"',
      '重要规则在多个 Section 重复出现（如"不要过度工程"）— 重复强化提高遵从率',
    ],
  },
  'context-mgmt': {
    id: 'context-mgmt', name: '上下文管理', nameEn: 'Context Management', layer: '核心循环',
    summary: '通过 CLAUDE.md 多层加载实现项目指令，通过 9 段式压缩实现长对话支持，通过 AutoDream 实现跨会话记忆。',
    flowSteps: [
      { step: 1, title: '加载 CLAUDE.md', description: 'Managed → User → Project → Local → AutoMemory → TeamMemory' },
      { step: 2, title: '注入 System Prompt', description: 'CLAUDE.md 内容进入 Memory section，带 OVERRIDE 语义' },
      { step: 3, title: '监控上下文大小', description: '持续跟踪 token 数量是否接近窗口限制' },
      { step: 4, title: '触发压缩', description: '当 tokens > windowSize - maxOutput - buffer 时触发' },
      { step: 5, title: '生成 9 段摘要', description: '请求、概念、文件、错误、待办、当前工作、下一步等' },
      { step: 6, title: '替换旧消息', description: '摘要替代旧消息，清除缓存，重新计算' },
    ],
    codeSnippets: [
      { source: 'services/compact/compact.ts', language: 'typescript', code: `// 9 段压缩 Prompt
const sections = [
  '1. Primary Request and Intent',
  '2. Key Technical Concepts',
  '3. Files and Code Sections (with full paths)',
  '4. Errors and Fixes',
  '5. Pending Tasks',
  '6. Current Work (in detail)',
  '7. Next Step',
]
// CRITICAL: Do NOT call any tools. Text only.`, annotation: '最后一句至关重要 — 防止模型在压缩过程中调用工具导致无限循环。' },
    ],
    prompts: [],
    designDecisions: [
      'CLAUDE.md 用 "OVERRIDE" 语义让用户能覆盖默认行为',
      'AutoDream 用三重门控（24h + 5 sessions + lock）防止过度记忆',
      '压缩有熔断器（最多 3 次失败）防止无限重试',
    ],
  },
  'cost-tracking': {
    id: 'cost-tracking', name: '费用与限流', nameEn: 'Cost & Rate Limiting', layer: '核心循环',
    summary: '实时追踪每次 API 调用的 token 使用量和费用，处理限流响应头，用指数退避重试。',
    flowSteps: [
      { step: 1, title: '记录 API 响应', description: 'usage: { input_tokens, output_tokens, cache_read, cache_creation }' },
      { step: 2, title: '计算费用', description: '按模型价格表累加 USD 费用' },
      { step: 3, title: '读取限流头', description: 'anthropic-ratelimit-* 系列响应头' },
      { step: 4, title: '限流处理', description: '429 → 指数退避(最多10次), 529 → 最多3次' },
      { step: 5, title: 'UI 显示', description: '状态栏实时更新 tokens/cost/model' },
    ],
    codeSnippets: [
      { source: 'services/api/retry.ts', language: 'typescript', code: `const DEFAULT_MAX_RETRIES = 10
const MAX_529_RETRIES = 3

function getRetryDelay(attempt: number): number {
  const base = Math.min(1000 * Math.pow(2, attempt - 1), 32000)
  const jitter = Math.random() * 0.25 * base
  return base + jitter
}`, annotation: '指数退避 + 25% 随机抖动避免雷群效应。' },
    ],
    prompts: [],
    designDecisions: [
      '429(限流)重试 10 次但 529(过载)只重试 3 次 — 过载时持续重试会加重负担',
      'Fast Mode 限流时自动降级到普通模式',
      '无人值守场景最长等 6 小时 — 让长时间运行的任务能自动恢复',
    ],
  },
  'tool-registry': {
    id: 'tool-registry', name: '工具注册与发现', nameEn: 'Tool Registry', layer: '工具系统',
    summary: '所有工具实现统一的 Tool 接口，通过注册表管理。工具按名称排序发送给 API（优化 prompt cache）。',
    flowSteps: [
      { step: 1, title: 'Tool 接口定义', description: 'name, description, prompt, inputSchema, call, checkPermissions' },
      { step: 2, title: '注册表管理', description: 'tools.ts 注册所有内置工具，支持别名查找' },
      { step: 3, title: '按名称排序', description: '发送给 API 时按字母排序，保持顺序稳定以命中缓存' },
      { step: 4, title: '条件启用', description: 'isEnabled() 控制工具是否在当前上下文中可用' },
    ],
    codeSnippets: [
      { source: 'Tool.ts', language: 'typescript', code: `interface Tool<Input, Output> {
  name: string
  aliases?: string[]
  call(input, context): Promise<ToolResult<Output>>
  isReadOnly(input): boolean
  isConcurrencySafe(input): boolean
  checkPermissions(input, context): Promise<PermissionResult>
  prompt(options): Promise<string>
  inputSchema: Input
  maxResultSizeChars: number
}`, annotation: '每个工具自己声明 isReadOnly 和 isConcurrencySafe — 系统据此决定是否可以并行执行。' },
    ],
    prompts: [],
    designDecisions: [
      '工具按名称排序 — 保持 API 请求中 tools 数组的顺序稳定，让 prompt cache 命中率更高',
      '默认 isReadOnly: false, isConcurrencySafe: false — 失败安全(fail-safe)设计',
      '工具有 maxResultSizeChars 限制 — 超大结果持久化到磁盘，返回文件路径',
    ],
  },
  'tool-lifecycle': {
    id: 'tool-lifecycle', name: '工具执行生命周期', nameEn: 'Tool Execution Lifecycle', layer: '工具系统',
    summary: '每次工具调用经过 10 步完整流程：从 API 响应解析到结果返回。',
    flowSteps: [
      { step: 1, title: '解析 tool_use', description: '从 API 响应中提取 { name, input, id }' },
      { step: 2, title: '查找工具', description: '在注册表中按 name 或 alias 查找' },
      { step: 3, title: '输入预处理', description: '路径展开、环境变量替换等' },
      { step: 4, title: '输入验证', description: 'validateInput() — 格式检查、先读后改检查' },
      { step: 5, title: '权限检查', description: 'checkPermissions() — 四层流水线' },
      { step: 6, title: '用户确认', description: '如果权限返回 ask → 弹出对话框' },
      { step: 7, title: '执行工具', description: 'tool.call() — 实际执行操作' },
      { step: 8, title: 'Post Hooks', description: 'PostToolUse hooks 执行' },
      { step: 9, title: '结果检查', description: '大小检查 → 超限持久化到磁盘' },
      { step: 10, title: '返回 API', description: '包装为 tool_result 追加到 messages' },
    ],
    codeSnippets: [
      { source: 'tools/executeTool.ts', language: 'typescript', code: `async function executeTool(toolUse: ToolUseBlock) {
  const tool = registry.get(toolUse.name)    // 步骤 2
  const input = preprocess(toolUse.input)     // 步骤 3
  await tool.validateInput(input)             // 步骤 4
  const perm = await tool.checkPermissions(input) // 步骤 5
  if (perm === 'deny') return 'Permission denied'
  if (perm === 'ask') await getUserConfirmation() // 步骤 6
  const result = await tool.call(input)       // 步骤 7
  await runPostHooks(tool, result)            // 步骤 8
  return truncateIfNeeded(result)             // 步骤 9-10
}`, annotation: '10 步流程中，大多数步骤在用户无感知的情况下完成。用户只在"权限确认"步骤被打扰。' },
    ],
    prompts: [],
    designDecisions: [
      '先验证后执行 — 在消耗任何资源前确保输入合法',
      'Post hooks 在执行后运行 — 允许外部系统审计或修改工具行为',
      '结果超限持久化到磁盘 — 防止超长输出（如大文件读取）撑爆上下文',
    ],
  },
  'tool-prompts': {
    id: 'tool-prompts', name: '工具 Prompt 设计', nameEn: 'Tool Prompt Design', layer: '工具系统',
    summary: 'Claude Code 的工具 Prompt 使用"双重强化"策略：System Prompt 和 Tool Prompt 中同时写明规则。',
    flowSteps: [
      { step: 1, title: 'System Prompt 层', description: 'getUsingYourToolsSection() 写明工具选择优先级' },
      { step: 2, title: 'Tool Prompt 层', description: '每个工具的 prompt() 方法返回使用指南' },
      { step: 3, title: '双重强化', description: '两层都说"Read not cat, Grep not grep"' },
      { step: 4, title: '反例/正例', description: 'IMPORTANT: 先说不该做什么，再说该怎么做' },
    ],
    codeSnippets: [
      { source: 'tools/BashTool.ts', language: 'typescript', code: `// BashTool Prompt 模式：限制在前、指南在后
const prompt = \`
Executes a given bash command and returns its output.

IMPORTANT: Avoid using this tool to run find, grep, cat...
Instead, use the appropriate dedicated tool:
- File search: Use Glob (NOT find or ls)
- Content search: Use Grep (NOT grep or rg)
- Read files: Use Read (NOT cat/head/tail)

# Instructions
- Always quote file paths with spaces
- Try to maintain current working directory
\``, annotation: '先说"别用我做什么"，再说"怎么正确用我" — 这个顺序很重要。' },
    ],
    prompts: [],
    designDecisions: [
      '"双重强化"大幅降低模型误用 Bash 的概率 — 两次告诫比一次有效得多',
      'IMPORTANT: 大写标记关键限制 — LLM 对大写更敏感',
      '参数描述越详细越好 — Claude Code 的 inputSchema description 字段都很长',
    ],
  },
  'permission-pipeline': {
    id: 'permission-pipeline', name: '权限四层流水线', nameEn: 'Permission Pipeline', layer: '权限与安全',
    summary: '四层流水线实现效率与安全的平衡：90% 的操作自动通过，10% 需要确认。',
    flowSteps: [
      { step: 1, title: '第一层：规则匹配', description: 'allow/deny/ask 模式匹配，如 Bash(git *) → allow' },
      { step: 2, title: '第二层：低风险检查', description: 'isReadOnly() → true 的工具直接通过' },
      { step: 3, title: '第三层：白名单', description: '用户之前选择 "Always Allow" 的操作自动通过' },
      { step: 4, title: '第四层：分类器', description: 'LLM 判断风险等级，返回 allow/ask/deny' },
      { step: 5, title: '用户确认', description: '只有到这一步的操作才弹出对话框' },
    ],
    codeSnippets: [
      { source: 'types/permissions.ts', language: 'typescript', code: `type PermissionMode = 'default' | 'acceptEdits' | 'bypassPermissions'

// 规则语法: ToolName(内容匹配模式)
type PermissionRule = {
  type: 'allow' | 'deny' | 'ask'
  pattern: string  // e.g. "Bash(git *)", "Edit(~/.ssh/*)"
}

async function canUseTool(tool, input) {
  const rule = matchRules(tool.name, input)
  if (rule) return rule.type
  if (tool.isReadOnly(input)) return 'allow'
  if (isWhitelisted(tool.name, input)) return 'allow'
  return await classifyRisk(tool.name, input)
}`, annotation: '四层设计让大多数操作无需用户干预 — 只有真正不确定的才弹出对话框。' },
    ],
    prompts: [],
    designDecisions: [
      '"渐进信任"：default → acceptEdits → bypassPermissions，随用户熟悉度提高逐步放宽',
      '规则优先于分类器 — 规则是确定性的、零延迟的，分类器需要 API 调用',
      '"Always Allow" 传播给所有子 Agent — Leader 批准的规则广播到 Teammates',
    ],
  },
  'security': {
    id: 'security', name: '安全机制', nameEn: 'Security Mechanisms', layer: '权限与安全',
    summary: '多层安全防护：Unicode 注入防护、沙箱限制、密钥扫描、路径验证。',
    flowSteps: [
      { step: 1, title: 'Unicode 净化', description: 'NFKC 标准化 + 零宽字符过滤 → 防 prompt injection' },
      { step: 2, title: '路径验证', description: '防止 ../ 目录遍历和 UNC 路径（Windows NTLM 泄露）' },
      { step: 3, title: '命令分析', description: 'Bash 工具解析管道、重定向、分号链接' },
      { step: 4, title: '沙箱执行', description: '限制文件系统和网络访问' },
      { step: 5, title: '密钥扫描', description: '上传前扫描 AWS/GCP/GitHub 等密钥模式' },
    ],
    codeSnippets: [
      { source: 'utils/security.ts', language: 'typescript', code: `// Unicode 注入防护
function sanitizeInput(text: string): string {
  // NFKC 标准化 — 将多种 Unicode 表示统一
  text = text.normalize('NFKC')
  // 过滤零宽字符 — 防止隐藏命令
  text = text.replace(/[\\u200B-\\u200F\\u2028-\\u202F\\uFEFF]/g, '')
  return text
}

// 路径验证
function validatePath(path: string): boolean {
  if (path.includes('..')) return false    // 目录遍历
  if (path.startsWith('\\\\\\\\')) return false  // UNC 路径
  return true
}`, annotation: '零宽字符是 prompt injection 的常见载体 — 肉眼不可见但会被 LLM 处理。' },
    ],
    prompts: [],
    designDecisions: [
      'Unicode 净化在所有用户输入的入口处执行 — "不信任外部数据"',
      '密钥扫描用正则模式匹配而非精确比较 — 覆盖各种密钥格式变体',
      '写入保护配置文件 — 防止 AI 通过修改配置绕过沙箱',
    ],
  },
  'telemetry': {
    id: 'telemetry', name: '遥测与反滥用', nameEn: 'Telemetry & Anti-abuse', layer: '权限与安全',
    summary: '设备指纹识别用户身份，环境检测区分人工和自动化调用，反蒸馏保护模型输出。',
    flowSteps: [
      { step: 1, title: '设备 ID', description: '64 字符 hex，存储在 ~/.claude.json，永久标识设备' },
      { step: 2, title: '会话追踪', description: 'sessionId + PID 文件 + 并发会话检测' },
      { step: 3, title: '环境检测', description: '29 个环境变量 + 2 个文件探测' },
      { step: 4, title: '客户端 Headers', description: 'User-Agent, x-app, session-id 等' },
      { step: 5, title: '反蒸馏', description: 'Fake tools + Streamlined 输出 + Connector-text 签名' },
    ],
    codeSnippets: [
      { source: 'utils/config.ts', language: 'typescript', code: `// 持久化设备 ID
function getOrCreateUserID(): string {
  const config = getGlobalConfig()
  if (config.userID) return config.userID
  const userID = randomBytes(32).toString('hex')
  saveGlobalConfig(current => ({ ...current, userID }))
  return userID  // 64 字符 hex, 存在 ~/.claude.json
}

// 反蒸馏：请求 API 注入伪工具
if (feature('ANTI_DISTILLATION_CC')) {
  result.anti_distillation = ['fake_tools']
}`, annotation: '设备 ID 是客户端数据采集的基础。所有遥测事件都携带 device_id。' },
    ],
    prompts: [],
    designDecisions: [
      '设备 ID 不等于封号 — 客户端只采集数据，封禁决策在服务端',
      '并发会话检测通过 PID 文件互相发现 — 轻量级，不需要额外服务',
      '反蒸馏三重机制各保护不同维度：工具定义、交互序列、原始文本',
    ],
  },
  'subagent': {
    id: 'subagent', name: '子 Agent 系统', nameEn: 'Subagent System', layer: 'Agent 编排',
    summary: '通过 AgentTool 创建子 Agent。Fork 模式共享 prompt cache，Spawn 模式使用独立工具集。',
    flowSteps: [
      { step: 1, title: '决定委派', description: '主 Agent 判断任务适合委派给子 Agent' },
      { step: 2, title: '选择模式', description: 'Fork（共享缓存）或 Spawn（独立工具集）' },
      { step: 3, title: '注入 Prompt', description: '子 Agent 额外指令：绝对路径、简洁回复' },
      { step: 4, title: '工具限制', description: 'Explore Agent 只有 Read/Glob/Grep，不能写' },
      { step: 5, title: '执行并返回', description: '子 Agent 完成任务，结果返回主 Agent' },
    ],
    codeSnippets: [
      { source: 'tools/AgentTool.ts', language: 'typescript', code: `// 两种子 Agent 创建方式
// Fork: 共享 prompt cache，高效
Agent({ prompt: "分析代码结构" })

// Spawn: 指定类型，独立工具集
Agent({
  prompt: "探索项目",
  subagent_type: "Explore",
  // Explore 只有: Read, Glob, Grep, Bash(read-only)
})`, annotation: 'Fork 共享缓存省钱，Spawn 有工具隔离更安全。' },
    ],
    prompts: [],
    designDecisions: [
      'Fork 共享 prompt cache — 主 Agent 已建立的缓存子 Agent 可以复用',
      'Explore Agent 只有只读工具 — 探索不应该修改代码',
      '子 Agent Prompt 更精简 — 聚焦任务完成，不需要复杂的交互指南',
    ],
  },
  'coordinator': {
    id: 'coordinator', name: 'Coordinator 模式', nameEn: 'Coordinator Mode', layer: 'Agent 编排',
    summary: '多 Worker 并行编排：Coordinator 分发任务、综合结果、指导实施。',
    flowSteps: [
      { step: 1, title: '分析任务', description: 'Coordinator 接收用户需求，拆分为子任务' },
      { step: 2, title: '并行研究', description: '同时派出多个 Worker 调研不同方面' },
      { step: 3, title: '综合结果', description: 'Coordinator 汇总研究结果，制定方案' },
      { step: 4, title: '并行实施', description: '分配 Worker 实现不同模块' },
      { step: 5, title: '验证测试', description: '最后一个 Worker 运行测试验证' },
    ],
    codeSnippets: [
      { source: 'agents/coordinator.md', language: 'text', code: `You are a coordinator. Your job is to:
- Direct workers to research, implement and verify
- Synthesize results and communicate with the user
- Answer questions directly when possible
- Don't delegate unnecessarily

Parallelism is your superpower.
Launch independent workers concurrently.`, annotation: 'Coordinator 的核心原则：能自己做的不要委派，能并行的不要串行。' },
    ],
    prompts: [],
    designDecisions: [
      '"能自己做就不委派" — 防止过度委派带来的通信开销',
      '研究和实施分两轮 — 先了解全局再动手，减少返工',
      'AgentSummary 每 30 秒生成进度摘要 — 让用户知道子 Agent 在做什么',
    ],
  },
  'swarm': {
    id: 'swarm', name: 'Swarm 协作', nameEn: 'Swarm Collaboration', layer: 'Agent 编排',
    summary: '多 Agent 在独立 Git worktree 中并行工作，通过文件邮箱通信，权限请求冒泡到 Leader。',
    flowSteps: [
      { step: 1, title: '选择后端', description: 'tmux（Linux/macOS）/ iTerm2（macOS）/ In-process' },
      { step: 2, title: '创建 Teammates', description: '每个 Teammate 在独立 tmux pane / worktree 中' },
      { step: 3, title: '邮箱通信', description: '~/.claude/teams/{team}/inboxes/{agent}.json' },
      { step: 4, title: '权限冒泡', description: 'Teammate 需权限 → Leader 邮箱 → 用户确认 → 回传' },
      { step: 5, title: '规则传播', description: 'Leader "Always Allow" 广播给所有 Teammates' },
    ],
    codeSnippets: [
      { source: 'utils/swarm/', language: 'typescript', code: `type BackendType = 'tmux' | 'iterm2' | 'in-process'

// tmux 后端：隔离 socket + 彩色边框
const SWARM_SESSION_NAME = 'claude-swarm'
// 每个 teammate 独立 pane
tmux.splitWindow({ target, color: agent.color })

// 邮箱通信：1 秒轮询
const INBOX_POLL_INTERVAL_MS = 1000
// 路径: ~/.claude/teams/{team}/inboxes/{agent}.json`, annotation: '文件邮箱虽然简单，但足够可靠 — 比 RPC 更容易 debug。' },
    ],
    prompts: [],
    designDecisions: [
      'Git worktree 隔离 — 防止并行工作时的文件冲突',
      '文件邮箱而非 IPC — 简单可靠，可以直接查看文件调试',
      '权限冒泡而非每个 Agent 自己弹窗 — 用户只需在一个终端确认',
    ],
  },
  'skills-hooks': {
    id: 'skills-hooks', name: 'Skills & Hooks', nameEn: 'Skills & Hooks', layer: '可扩展性',
    summary: 'Skills 让用户通过 Markdown 定义 slash 命令；Hooks 在工具调用前后执行自定义逻辑。',
    flowSteps: [
      { step: 1, title: 'Skills 定义', description: '~/.claude/skills/deploy/SKILL.md' },
      { step: 2, title: 'Skills 触发', description: '用户输入 /deploy → 加载 SKILL.md 内容' },
      { step: 3, title: 'Hooks 注册', description: '在 settings.json 中配置 PreToolUse / PostToolUse' },
      { step: 4, title: 'Hooks 执行', description: '工具调用前后运行 shell 命令、LLM 处理或 HTTP 回调' },
    ],
    codeSnippets: [
      { source: 'skills/SKILL.md', language: 'yaml', code: `---
description: Run deployment pipeline
allowed-tools: [Bash, Read]
user-invocable: true
---
Check the current git branch, ensure all tests pass,
then deploy to staging.`, annotation: 'Skill 就是一个 Markdown 文件 — 前面的 YAML frontmatter 定义元数据，后面的内容就是注入给模型的指令。' },
    ],
    prompts: [],
    designDecisions: [
      'Skills 用 Markdown 而非 JSON/YAML — 对非技术用户更友好',
      'Hooks 支持 4 种类型：command / prompt / http / agent — 覆盖各种集成场景',
      'PreToolUse hook 可以拦截和修改工具输入 — 实现自定义验证逻辑',
    ],
  },
  'unreleased': {
    id: 'unreleased', name: '未发布功能', nameEn: 'Unreleased Features', layer: '可扩展性',
    summary: '源码中存在多个通过 Feature Flag 控制的未发布功能。',
    flowSteps: [
      { step: 1, title: 'DAEMON 模式', description: '后台持久化会话，tmux detach/attach' },
      { step: 2, title: 'UDS Inbox', description: 'Unix Domain Socket 跨会话消息传递' },
      { step: 3, title: 'Teleport', description: '本地 ↔ 远程 CCR 会话双向传送' },
      { step: 4, title: 'ULTRAPLAN', description: '远程 CCR 中独立规划，30 分钟超时' },
      { step: 5, title: 'ULTRAREVIEW', description: '远程代码审查，带计费门控' },
      { step: 6, title: 'Buddy', description: '虚拟宠物系统，Mulberry32 确定性生成' },
    ],
    codeSnippets: [
      { source: 'utils/concurrentSessions.ts', language: 'typescript', code: `// DAEMON 模式会话类型
type SessionKind = 'interactive' | 'bg' | 'daemon' | 'daemon-worker'
type SessionStatus = 'busy' | 'idle' | 'waiting'

// 触发方式
// Feature flag: BG_SESSIONS
// CLI: --bg 启动后台 tmux 会话
// 重新连接: claude attach`, annotation: 'DAEMON 让 Claude Code 变成一个持久化后台服务 — 不再需要每次启动一个新会话。' },
    ],
    prompts: [],
    designDecisions: [
      '通过 Feature Flag 控制发布节奏 — 功能可以在代码库中但不对外暴露',
      'ULTRAPLAN 用 30 分钟超时 — 规划不应该无限期运行',
      'Buddy 从 userId hash 生成而非存配置 — 防止用户伪造高稀有度',
    ],
  },
}
