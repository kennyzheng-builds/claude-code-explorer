import type { TerminalScenario, XRayContent } from '../types'

export const scenarios: TerminalScenario[] = [
  {
    id: 'basic',
    name: '基础对话',
    nameEn: 'Basic Dialogue',
    description: '用户要求给 login 函数添加错误处理 — 读文件、编辑、权限确认、Todo 追踪',
    lines: [
      { type: 'input', content: '> 帮我给 login 函数加上错误处理', clickTarget: 'user-input' },
      { type: 'blank', content: '' },
      { type: 'text', content: '我来看看 login 函数的实现。', clickTarget: 'ai-response' },
      { type: 'blank', content: '' },
      { type: 'tool-header', content: '── Read src/auth.ts ──────────────────────', clickTarget: 'tool-read' },
      { type: 'tool-content', content: 'function login(email: string, password: string) {', clickTarget: 'tool-read' },
      { type: 'tool-content', content: '  const user = await db.findUser(email);', clickTarget: 'tool-read' },
      { type: 'tool-content', content: '  if (!user) return null;', clickTarget: 'tool-read' },
      { type: 'tool-content', content: '  const valid = await bcrypt.compare(password, user.hash);', clickTarget: 'tool-read' },
      { type: 'tool-content', content: '  return valid ? generateToken(user) : null;', clickTarget: 'tool-read' },
      { type: 'tool-content', content: '}', clickTarget: 'tool-read' },
      { type: 'blank', content: '' },
      { type: 'text', content: '我发现 login 函数没有错误处理。我来添加 try-catch 包裹。', clickTarget: 'ai-response' },
      { type: 'blank', content: '' },
      { type: 'tool-header', content: '── Edit src/auth.ts ─── Allow? [y/n/a] ──', clickTarget: 'permission-prompt' },
      { type: 'diff-del', content: '- function login(email: string, password: string) {', clickTarget: 'diff-display' },
      { type: 'diff-add', content: '+ async function login(email: string, password: string) {', clickTarget: 'diff-display' },
      { type: 'diff-add', content: '+   try {', clickTarget: 'diff-display' },
      { type: 'tool-content', content: '      const user = await db.findUser(email);', clickTarget: 'diff-display' },
      { type: 'diff-del', content: '-     return valid ? generateToken(user) : null;', clickTarget: 'diff-display' },
      { type: 'diff-add', content: '+     return valid ? generateToken(user) : null;', clickTarget: 'diff-display' },
      { type: 'diff-add', content: '+   } catch (error) {', clickTarget: 'diff-display' },
      { type: 'diff-add', content: '+     throw new AuthError(`Login failed: ${error.message}`);', clickTarget: 'diff-display' },
      { type: 'diff-add', content: '+   }', clickTarget: 'diff-display' },
      { type: 'blank', content: '' },
      { type: 'todo', content: '✓ 读取 login 函数', clickTarget: 'todo-panel' },
      { type: 'todo', content: '● 添加错误处理', clickTarget: 'todo-panel' },
      { type: 'todo', content: '○ 运行测试验证', clickTarget: 'todo-panel' },
      { type: 'blank', content: '' },
      { type: 'status', content: 'tokens: 12.4k  cost: $0.03  model: opus  latency: 2.1s', clickTarget: 'status-bar' },
    ],
  },
  {
    id: 'concurrent',
    name: '多工具并发',
    nameEn: 'Concurrent Tools',
    description: '并行搜索 — Grep + Glob 同时执行，展示 isConcurrencySafe',
    lines: [
      { type: 'input', content: '> 找到所有使用 deprecated API 的文件', clickTarget: 'user-input' },
      { type: 'blank', content: '' },
      { type: 'text', content: '我同时搜索代码内容和文件名模式。', clickTarget: 'ai-response' },
      { type: 'blank', content: '' },
      { type: 'tool-header', content: '── Grep "deprecatedApi" ──── (concurrent) ─', clickTarget: 'tool-grep' },
      { type: 'tool-content', content: 'src/services/user.ts:42  deprecatedApi.getUser(id)', clickTarget: 'tool-grep' },
      { type: 'tool-content', content: 'src/services/auth.ts:18  deprecatedApi.validateToken(t)', clickTarget: 'tool-grep' },
      { type: 'tool-content', content: 'src/utils/legacy.ts:7   import { deprecatedApi }', clickTarget: 'tool-grep' },
      { type: 'blank', content: '' },
      { type: 'tool-header', content: '── Glob "**/*legacy*" ──── (concurrent) ───', clickTarget: 'tool-glob' },
      { type: 'tool-content', content: 'src/utils/legacy.ts', clickTarget: 'tool-glob' },
      { type: 'tool-content', content: 'src/utils/legacy-helpers.ts', clickTarget: 'tool-glob' },
      { type: 'tool-content', content: 'tests/legacy.test.ts', clickTarget: 'tool-glob' },
      { type: 'blank', content: '' },
      { type: 'text', content: '找到 3 个文件使用了 deprecatedApi，2 个 legacy 相关文件。', clickTarget: 'ai-response' },
      { type: 'text', content: 'Grep 和 Glob 都标记了 isConcurrencySafe: true，所以可以并发执行。', clickTarget: 'ai-response' },
      { type: 'blank', content: '' },
      { type: 'status', content: 'tokens: 8.2k  cost: $0.02  model: opus  parallel: 2 tools', clickTarget: 'status-bar' },
    ],
  },
  {
    id: 'permission-denied',
    name: '权限被拒',
    nameEn: 'Permission Denied',
    description: '危险 Bash 命令被拦截 — 展示分类器和四层权限流水线',
    lines: [
      { type: 'input', content: '> 清理所有临时文件', clickTarget: 'user-input' },
      { type: 'blank', content: '' },
      { type: 'text', content: '我来清理临时文件。', clickTarget: 'ai-response' },
      { type: 'blank', content: '' },
      { type: 'tool-header', content: '── Bash ─────────────────────────────────', clickTarget: 'tool-bash' },
      { type: 'tool-content', content: 'rm -rf /tmp/* ./node_modules/.cache', clickTarget: 'tool-bash' },
      { type: 'blank', content: '' },
      { type: 'permission', content: '⚠ Permission DENIED — 分类器判定为高风险操作', clickTarget: 'permission-denied' },
      { type: 'error', content: '原因: rm -rf 匹配危险命令模式，/tmp/* 可能影响系统', clickTarget: 'permission-denied' },
      { type: 'blank', content: '' },
      { type: 'text', content: '抱歉，这个命令被权限系统拦截了。让我用更安全的方式：', clickTarget: 'ai-response' },
      { type: 'blank', content: '' },
      { type: 'tool-header', content: '── Bash ─── Allow? [y/n/a] ──────────────', clickTarget: 'permission-prompt' },
      { type: 'tool-content', content: 'find ./tmp -name "*.tmp" -mtime +7 -delete', clickTarget: 'tool-bash' },
      { type: 'blank', content: '' },
      { type: 'text', content: '改用 find 命令，只删除 7 天前的 .tmp 文件，更安全。', clickTarget: 'ai-response' },
      { type: 'blank', content: '' },
      { type: 'status', content: 'tokens: 6.8k  cost: $0.02  model: opus', clickTarget: 'status-bar' },
    ],
  },
  {
    id: 'agent',
    name: 'Agent 委派',
    nameEn: 'Agent Delegation',
    description: '主 Agent 创建子 Agent 探索代码库 — 展示 Fork 机制',
    lines: [
      { type: 'input', content: '> 帮我理解这个项目的整体架构', clickTarget: 'user-input' },
      { type: 'blank', content: '' },
      { type: 'text', content: '这是个比较大的任务，我来启动一个专门的探索 Agent。', clickTarget: 'ai-response' },
      { type: 'blank', content: '' },
      { type: 'tool-header', content: '── Agent (Explore) ──────────────────────', clickTarget: 'agent-delegation' },
      { type: 'tool-content', content: 'prompt: "探索项目结构，找到核心入口和主要模块"', clickTarget: 'agent-delegation' },
      { type: 'tool-content', content: 'subagent_type: Explore', clickTarget: 'agent-delegation' },
      { type: 'tool-content', content: 'tools: [Read, Glob, Grep, Bash(read-only)]', clickTarget: 'agent-delegation' },
      { type: 'blank', content: '' },
      { type: 'tool-content', content: '... Explore Agent 正在分析 ...', clickTarget: 'agent-delegation' },
      { type: 'tool-content', content: '  → Glob **/*.ts 找到 156 个 TypeScript 文件', clickTarget: 'agent-delegation' },
      { type: 'tool-content', content: '  → Read src/index.ts 找到主入口', clickTarget: 'agent-delegation' },
      { type: 'tool-content', content: '  → Grep "export class" 发现 23 个核心类', clickTarget: 'agent-delegation' },
      { type: 'blank', content: '' },
      { type: 'text', content: '子 Agent 探索完成。项目架构如下：', clickTarget: 'ai-response' },
      { type: 'text', content: '- src/index.ts — 主入口，Express 服务', clickTarget: 'ai-response' },
      { type: 'text', content: '- src/routes/ — 12 个 API 路由模块', clickTarget: 'ai-response' },
      { type: 'text', content: '- src/services/ — 8 个业务逻辑服务', clickTarget: 'ai-response' },
      { type: 'text', content: '- src/models/ — 6 个数据模型', clickTarget: 'ai-response' },
      { type: 'blank', content: '' },
      { type: 'status', content: 'tokens: 24.6k  cost: $0.08  model: opus  agents: 1 fork', clickTarget: 'status-bar' },
    ],
  },
  {
    id: 'compact',
    name: '上下文压缩',
    nameEn: 'Context Compression',
    description: '长对话触发自动压缩 — 展示 9 段式摘要',
    lines: [
      { type: 'error', content: '[System] Context approaching limit (187k/200k tokens)', clickTarget: 'compact-trigger' },
      { type: 'blank', content: '' },
      { type: 'text', content: '触发自动压缩...', clickTarget: 'compact-trigger' },
      { type: 'blank', content: '' },
      { type: 'tool-header', content: '── Compact (9-section summary) ──────────', clickTarget: 'compact-trigger' },
      { type: 'tool-content', content: '1. Primary Request: 重构用户认证系统', clickTarget: 'compact-trigger' },
      { type: 'tool-content', content: '2. Key Concepts: JWT → Session, OAuth 集成', clickTarget: 'compact-trigger' },
      { type: 'tool-content', content: '3. Files: src/auth/*.ts, src/middleware/auth.ts', clickTarget: 'compact-trigger' },
      { type: 'tool-content', content: '4. Errors Fixed: Token 过期处理、Race condition', clickTarget: 'compact-trigger' },
      { type: 'tool-content', content: '5. Pending: 测试覆盖、文档更新', clickTarget: 'compact-trigger' },
      { type: 'tool-content', content: '6. Current Work: 实现 Session 存储层', clickTarget: 'compact-trigger' },
      { type: 'tool-content', content: '7. Next Step: 编写 SessionStore 接口', clickTarget: 'compact-trigger' },
      { type: 'blank', content: '' },
      { type: 'text', content: '压缩完成，从 187k 减少到 12k tokens。继续之前的工作。', clickTarget: 'compact-trigger' },
      { type: 'blank', content: '' },
      { type: 'status', content: 'tokens: 12.0k (compacted)  cost: $0.15  model: opus', clickTarget: 'status-bar' },
    ],
  },
  {
    id: 'memory',
    name: '记忆触发',
    nameEn: 'Memory Trigger',
    description: 'AI 检测到用户偏好并自动记忆 — 展示 CLAUDE.md 和 AutoMemory',
    lines: [
      { type: 'input', content: '> 写一个新的 API endpoint', clickTarget: 'user-input' },
      { type: 'blank', content: '' },
      { type: 'text', content: '检测到 CLAUDE.md 中的偏好设置...', clickTarget: 'memory-detect' },
      { type: 'blank', content: '' },
      { type: 'tool-header', content: '── Read .claude/CLAUDE.md ──────────────', clickTarget: 'memory-detect' },
      { type: 'tool-content', content: '# Project Rules', clickTarget: 'memory-detect' },
      { type: 'tool-content', content: '- Always use TypeScript strict mode', clickTarget: 'memory-detect' },
      { type: 'tool-content', content: '- API routes: Express + Zod validation', clickTarget: 'memory-detect' },
      { type: 'tool-content', content: '- Error handling: custom AppError class', clickTarget: 'memory-detect' },
      { type: 'tool-content', content: '- Tests required for all new endpoints', clickTarget: 'memory-detect' },
      { type: 'blank', content: '' },
      { type: 'text', content: '根据项目规范，我按照以下方式创建 endpoint：', clickTarget: 'ai-response' },
      { type: 'text', content: '- TypeScript strict mode ✓', clickTarget: 'ai-response' },
      { type: 'text', content: '- Zod input validation ✓', clickTarget: 'ai-response' },
      { type: 'text', content: '- AppError error handling ✓', clickTarget: 'ai-response' },
      { type: 'blank', content: '' },
      { type: 'text', content: '[AutoMemory] 记录：用户偏好 Express + Zod 风格', clickTarget: 'memory-detect' },
      { type: 'blank', content: '' },
      { type: 'status', content: 'tokens: 9.1k  cost: $0.02  model: opus  memory: active', clickTarget: 'status-bar' },
    ],
  },
]

export const xrayContents: Record<string, XRayContent> = {
  'user-input': {
    id: 'user-input',
    title: 'System Prompt 拼装过程',
    what: '当用户输入消息时，Claude Code 不是直接发给 API。它先组装一个庞大的 System Prompt，定义 AI 的角色、规则和上下文。',
    dataFlow: [
      { step: 1, text: '用户在 PromptInput 组件中输入消息' },
      { step: 2, text: 'buildSystemPrompt() 开始拼装 13 个 Section' },
      { step: 3, text: '静态段（1-7）从缓存读取：角色、规则、工具指南', highlight: true },
      { step: 4, text: '动态段（8-13）实时计算：CLAUDE.md、环境、语言' },
      { step: 5, text: 'SYSTEM_PROMPT_DYNAMIC_BOUNDARY 标记缓存分界' },
      { step: 6, text: '完整 prompt + messages + tools 发送给 API' },
    ],
    code: {
      source: 'constants/prompts.ts',
      language: 'typescript',
      code: `// System Prompt 13 个 Section 按顺序拼装
const sections = [
  getIntroSection(),          // 1. 角色定义 + 安全限制
  getSystemSection(),         // 2. 工具使用规则
  getDoingTasksSection(),     // 3. 任务执行指南
  getActionsSection(),        // 4. 操作风险评估
  getUsingYourToolsSection(), // 5. 工具使用优先级
  getToneAndStyleSection(),   // 6. 语气规范
  getOutputSection(),         // 7. 简洁输出
  // ─── 动态边界 ───
  'SYSTEM_PROMPT_DYNAMIC_BOUNDARY',
  getSessionGuidance(),       // 8. 会话引导
  getMemorySection(),         // 9. CLAUDE.md 内容
  getEnvironmentInfo(),       // 10. 环境信息
  getLanguageSection(),       // 11. 语言偏好
  getMcpInstructions(),       // 12. MCP 指令
]`,
      annotation: '静态段（1-7）不随对话变化，可被 Anthropic API 缓存（prompt caching）。动态段（8-13）每轮重新计算。分界标记是缓存优化的关键。',
    },
    designNote: '为什么分 13 段？因为 prompt caching 要求前缀不变才能命中缓存。把不变的放前面、变化的放后面，能显著减少 API 成本。静态段约占 System Prompt 的 70%，都能被缓存。',
  },

  'ai-response': {
    id: 'ai-response',
    title: '消息循环 (Message Loop)',
    what: 'AI 的每一条回复都来自一个 while(true) 循环。循环持续调用 API，直到模型不再请求工具调用。',
    dataFlow: [
      { step: 1, text: 'agentLoop() 启动，发送 messages 给 API' },
      { step: 2, text: 'API 返回 response.content (text + tool_use blocks)', highlight: true },
      { step: 3, text: '解析 content：分离 text blocks 和 tool_use blocks' },
      { step: 4, text: '如果没有 tool_use → 循环结束，显示文本' },
      { step: 5, text: '如果有 tool_use → 执行工具，收集结果' },
      { step: 6, text: '将 tool_result 追加到 messages，回到步骤 1' },
    ],
    code: {
      source: 'query.ts',
      language: 'typescript',
      code: `async function agentLoop(userMessage: string) {
  const messages = [{ role: 'user', content: userMessage }]

  while (true) {
    const response = await callAPI({
      system: buildSystemPrompt(),
      messages,
      tools: getToolDefinitions(),
    })

    messages.push({ role: 'assistant', content: response.content })

    const toolUses = response.content
      .filter(b => b.type === 'tool_use')
    if (toolUses.length === 0) break  // 没有工具调用，结束

    // 执行所有工具，收集结果
    const results = await Promise.all(
      toolUses.map(tu => executeTool(tu))
    )
    messages.push({ role: 'user', content: results })
  }
}`,
      annotation: '这就是整个 Claude Code 的核心。一个 while 循环，反复调用 API 直到任务完成。模型通过返回 tool_use 来驱动行为，通过不返回 tool_use 来表示"我说完了"。',
    },
    designNote: '为什么用 while(true) 而不是递归？因为递归有栈溢出风险，而 while 循环可以无限运行。Claude Code 的对话可以非常长（数百轮工具调用），while 更安全。',
  },

  'tool-read': {
    id: 'tool-read',
    title: 'FileReadTool — 文件读取',
    what: 'Read 工具读取本地文件内容，返回带行号的文本。它是只读的、并发安全的，不需要权限确认。',
    dataFlow: [
      { step: 1, text: 'API 返回 tool_use: { name: "Read", input: { file_path } }' },
      { step: 2, text: 'isReadOnly: true → 跳过权限检查' },
      { step: 3, text: 'isConcurrencySafe: true → 可与其他工具并行', highlight: true },
      { step: 4, text: '检查 readFileState 缓存 → 如果文件未变则返回 stub' },
      { step: 5, text: '读取文件，添加行号前缀（cat -n 格式）' },
      { step: 6, text: '检查结果大小，超限则截断' },
    ],
    code: {
      source: 'tools/FileReadTool.ts',
      language: 'typescript',
      code: `// Read 工具核心逻辑
async call(input: { file_path: string; offset?: number; limit?: number }) {
  // 去重优化：同文件同范围第二次读返回 stub
  if (previousRead && !fileModified) {
    return { type: 'file_unchanged', file: { filePath } }
  }

  const content = await readFile(input.file_path, 'utf-8')
  const lines = content.split('\\n')

  // 添加行号（cat -n 格式）
  return lines.map((line, i) =>
    \`\${String(i + 1).padStart(6)}\\t\${line}\`
  ).join('\\n')
}

// 属性
isReadOnly() { return true }
isConcurrencySafe() { return true }`,
      annotation: '文件读取去重是一个重要优化 — 当模型反复读取同一文件时，返回简短的 "file_unchanged" stub 而非完整内容，大幅节省 token。',
    },
    designNote: '为什么 Read 要加行号？因为 Edit 工具需要精确匹配 old_string。行号帮助模型和用户定位代码位置，而 Edit 本身则用文本匹配（不用行号）确保准确性。',
  },

  'tool-edit': {
    id: 'tool-edit',
    title: 'FileEditTool — 文件编辑',
    what: 'Edit 工具通过"找到旧文本、替换成新文本"的方式编辑文件。它要求 old_string 在文件中唯一。',
    dataFlow: [
      { step: 1, text: 'API 返回 { name: "Edit", input: { file_path, old_string, new_string } }' },
      { step: 2, text: '验证：old_string !== new_string' },
      { step: 3, text: '验证：文件已被 Read 过（强制先读后改）', highlight: true },
      { step: 4, text: '在文件中查找 old_string，验证唯一性' },
      { step: 5, text: '权限检查 → checkPermissions() → "ask"' },
      { step: 6, text: '用户确认后执行替换，保存文件' },
    ],
    code: {
      source: 'tools/FileEditTool.ts',
      language: 'typescript',
      code: `// Edit 工具核心 — 精确字符串替换
async call(input: { file_path, old_string, new_string }) {
  const content = await readFile(input.file_path)

  // 唯一性验证：old_string 必须在文件中只出现一次
  const count = countOccurrences(content, input.old_string)
  if (count === 0) throw new Error('old_string not found in file')
  if (count > 1) throw new Error('old_string is not unique')

  // 执行替换
  const newContent = content.replace(input.old_string, input.new_string)
  await writeFile(input.file_path, newContent)

  return { success: true, diff: generateDiff(input) }
}

// 强制先读后改
validateInput(input) {
  if (!hasBeenRead(input.file_path)) {
    return { valid: false, message: 'File has not been read yet' }
  }
}`,
      annotation: '先读后改（Read before Edit）是 Claude Code 的核心安全设计。防止模型在不了解文件内容的情况下盲目修改代码。',
    },
    designNote: '为什么用字符串匹配而不是行号？因为行号在文件被其他工具修改后会变化，导致错位。字符串匹配虽然需要保证唯一性，但更加鲁棒。唯一性验证确保了编辑精确命中目标。',
  },

  'tool-bash': {
    id: 'tool-bash',
    title: 'BashTool — 命令执行',
    what: 'Bash 工具在沙箱中执行 shell 命令。它会分析命令的风险等级，高风险命令需要用户确认。',
    dataFlow: [
      { step: 1, text: 'API 返回 { name: "Bash", input: { command, timeout? } }' },
      { step: 2, text: '命令分析：解析管道、重定向、分号链接' },
      { step: 3, text: '权限检查：匹配规则 → 低风险 → 分类器', highlight: true },
      { step: 4, text: '沙箱包裹：限制文件系统和网络访问' },
      { step: 5, text: '执行命令，捕获 stdout + stderr' },
      { step: 6, text: '结果大小检查，超限持久化到磁盘' },
    ],
    code: {
      source: 'tools/BashTool.ts',
      language: 'typescript',
      code: `// BashTool Prompt 关键部分
const prompt = \`
Executes a given bash command and returns its output.

IMPORTANT: Avoid using this tool to run grep, cat, find...
Instead, use the appropriate dedicated tool:
- File search: Use Glob (NOT find or ls)
- Content search: Use Grep (NOT grep or rg)
- Read files: Use Read (NOT cat/head/tail)
- Edit files: Use Edit (NOT sed/awk)

# Instructions
- Always quote file paths with spaces
- Try to maintain current working directory
- Optional timeout (max 600000ms / 10 minutes)
\`

// 危险命令模式检测
const DANGEROUS_PATTERNS = [
  'python', 'node', 'ruby', 'perl',
  'bash', 'sh', 'rm -rf'
]`,
      annotation: 'Bash 工具的 Prompt 通过"双重强化"引导模型：System Prompt 说"用专用工具"，Bash 自己的 Prompt 也说"别用我做这些事"。两次告诫确保模型正确选择工具。',
    },
    designNote: '为什么 Bash 的 Prompt 要重复说"别用 grep"？因为 LLM 容易忽略单次指令。Claude Code 在 System Prompt 和 Tool Prompt 两处都写了同样的规则，形成"双重强化"(double reinforcement)，大幅降低模型用 Bash 执行本应由专用工具完成的操作。',
  },

  'tool-grep': {
    id: 'tool-grep',
    title: 'GrepTool — 内容搜索',
    what: 'Grep 工具基于 ripgrep (rg) 实现，支持正则搜索、文件类型过滤、多种输出模式。它是只读的、并发安全的。',
    dataFlow: [
      { step: 1, text: 'API 返回 { name: "Grep", input: { pattern, path?, type? } }' },
      { step: 2, text: 'isReadOnly: true, isConcurrencySafe: true', highlight: true },
      { step: 3, text: '构建 rg 命令：--type, --glob, -A/-B/-C 参数' },
      { step: 4, text: '执行 ripgrep（比 grep 快 10x+）' },
      { step: 5, text: '结果格式化：files_with_matches / content / count' },
      { step: 6, text: '应用 head_limit 截断' },
    ],
    code: {
      source: 'tools/GrepTool.ts',
      language: 'typescript',
      code: `// Grep 工具 — 基于 ripgrep
isReadOnly() { return true }
isConcurrencySafe() { return true }  // 可与其他工具并行

// 三种输出模式
type OutputMode = 'content' | 'files_with_matches' | 'count'

// 构建 ripgrep 命令
function buildRgCommand(input) {
  const args = [input.pattern]
  if (input.type) args.push('--type', input.type)
  if (input.glob) args.push('--glob', input.glob)
  if (input.multiline) args.push('-U', '--multiline-dotall')
  return spawn('rg', args)
}`,
      annotation: 'Grep 和 Glob 都是只读 + 并发安全的，所以可以同时执行。这就是为什么 Claude Code 经常同时发起多个搜索请求。',
    },
    designNote: '为什么选 ripgrep 而不是原生 grep？ripgrep 比 grep 快 10 倍以上，自动忽略 .gitignore 中的文件，而且支持 Unicode。对于大型代码库（50 万行+），性能差异是天壤之别。',
  },

  'tool-glob': {
    id: 'tool-glob',
    title: 'GlobTool — 文件搜索',
    what: 'Glob 工具通过文件名模式匹配找到文件，按修改时间排序返回。',
    dataFlow: [
      { step: 1, text: 'API 返回 { name: "Glob", input: { pattern, path? } }' },
      { step: 2, text: 'isReadOnly: true, isConcurrencySafe: true' },
      { step: 3, text: '执行 glob 匹配（支持 ** 递归）', highlight: true },
      { step: 4, text: '按修改时间排序（最新在前）' },
      { step: 5, text: '返回匹配的文件路径列表' },
    ],
    code: {
      source: 'tools/GlobTool.ts',
      language: 'typescript',
      code: `// Glob 工具 Prompt
const prompt = \`
Fast file pattern matching tool that works with any codebase size.
Supports glob patterns like "**/*.js" or "src/**/*.ts".
Returns matching file paths sorted by modification time.
Use this tool when you need to find files by name patterns.
\``,
      annotation: '按修改时间排序意味着最近修改的文件排在最前面 — 这通常就是用户正在工作的文件。',
    },
    designNote: '为什么结果按修改时间排序？直觉上按字母排序更"整洁"，但按修改时间排序更实用 — 用户通常在寻找最近修改的文件。这个小细节大幅提升了搜索效率。',
  },

  'permission-prompt': {
    id: 'permission-prompt',
    title: '权限四层流水线',
    what: '当工具需要执行写操作时，会经过四层权限检查。只有全部通过才会执行，任何一层说"拒绝"就立即拒绝。',
    dataFlow: [
      { step: 1, text: '模型返回 tool_use(Edit) → 触发权限检查' },
      { step: 2, text: '第一层：规则匹配 — allow/deny/ask 模式', highlight: true },
      { step: 3, text: '第二层：低风险检查 — isReadOnly() + 已知安全操作' },
      { step: 4, text: '第三层：白名单查找 — 用户之前"总是允许"的操作' },
      { step: 5, text: '第四层：分类器 — LLM 判断风险等级' },
      { step: 6, text: '结果为 "ask" → 弹出权限对话框让用户选择' },
    ],
    code: {
      source: 'types/permissions.ts',
      language: 'typescript',
      code: `// 权限检查流水线
async function canUseTool(tool, input) {
  // 第一层：规则匹配
  const ruleResult = matchRules(tool.name, input)
  if (ruleResult) return ruleResult  // allow 或 deny

  // 第二层：低风险检查
  if (tool.isReadOnly(input)) return 'allow'

  // 第三层：白名单（用户之前选了 "Always Allow"）
  if (isWhitelisted(tool.name, input)) return 'allow'

  // 第四层：分类器（LLM 判断）
  return await classifyRisk(tool.name, input)  // 'allow' | 'ask' | 'deny'
}

// 权限模式
type PermissionMode =
  | 'default'           // 每次都问
  | 'acceptEdits'       // 文件编辑自动允许
  | 'bypassPermissions' // 全部允许（危险）`,
      annotation: '四层流水线是效率与安全的平衡。大多数操作在前两层就决定了（规则 + 只读），只有不确定的才到分类器，减少用户被打扰的频率。',
    },
    designNote: '为什么需要四层而不是直接问用户？因为每多一次用户确认，效率就低一级。四层设计让 90% 的操作自动通过（规则 + 只读 + 白名单），只有 10% 的不确定操作才弹出对话框。这就是"渐进信任"的核心思想。',
  },

  'permission-denied': {
    id: 'permission-denied',
    title: '权限拒绝 + 熔断机制',
    what: '当分类器判定操作为高风险时，会直接拒绝，不弹出对话框。连续拒绝会触发熔断。',
    dataFlow: [
      { step: 1, text: '分类器分析命令：rm -rf /tmp/*' },
      { step: 2, text: '匹配危险模式：DANGEROUS_BASH_PATTERNS', highlight: true },
      { step: 3, text: '返回 "deny" — 直接拒绝，不问用户' },
      { step: 4, text: '连续 3 次拒绝 → 触发熔断器 (circuit breaker)' },
      { step: 5, text: '模型收到 "Permission denied" 结果，调整策略' },
    ],
    code: {
      source: 'permissions/classifier.ts',
      language: 'typescript',
      code: `// 危险命令检测
const DANGEROUS_BASH_PATTERNS = [
  'python', 'node', 'ruby', 'perl',
  'bash', 'sh'  // 可以执行任意脚本
]

// Bash(python *) 或 Bash(*) 被认为是危险的
function isDangerousBashPermission(rule: string): boolean {
  return DANGEROUS_BASH_PATTERNS.some(p =>
    rule.includes(\`Bash(\${p}\`) || rule === 'Bash(*)'
  )
}

// 熔断器：连续 N 次拒绝后停止尝试
const MAX_CONSECUTIVE_DENIALS = 3`,
      annotation: '熔断器防止模型陷入"尝试 → 拒绝 → 换个命令再试 → 再拒绝"的死循环。3 次拒绝后强制停止并向用户解释。',
    },
    designNote: '为什么有些操作直接拒绝而不是让用户选择？因为 rm -rf 这类命令的破坏是不可逆的。与其让用户在疲劳时不小心点了"允许"，不如直接拒绝并提供安全替代方案。安全 > 便利。',
  },

  'todo-panel': {
    id: 'todo-panel',
    title: 'TodoWriteTool 实现',
    what: 'Todo 面板不是 UI 装饰 — 它是一个真正的工具。模型通过 tool_use 调用来创建和更新任务。',
    dataFlow: [
      { step: 1, text: 'API 返回 tool_use: { name: "TodoWrite", input: { todos } }' },
      { step: 2, text: '每个 todo 有 content, status, activeForm 三个字段', highlight: true },
      { step: 3, text: 'status: pending → in_progress → completed' },
      { step: 4, text: 'activeForm 是进行时描述（"Building..."）' },
      { step: 5, text: 'UI 实时渲染 todo 列表' },
    ],
    code: {
      source: 'tools/TodoWriteTool.ts',
      language: 'typescript',
      code: `// TodoWrite 的输入 schema
const inputSchema = z.object({
  todos: z.array(z.object({
    content: z.string(),    // "Run tests"
    status: z.enum(['pending', 'in_progress', 'completed']),
    activeForm: z.string(), // "Running tests"
  }))
})

// 规则：同一时间只能有一个 in_progress
// 完成一个后立即标记，不要批量完成`,
      annotation: '有趣的设计：content 是命令式（"Run tests"），activeForm 是进行时（"Running tests"）。这让 UI 可以根据状态显示不同形式的文本。',
    },
    designNote: '为什么 Todo 是一个工具而不是内部状态？因为把它暴露为工具，模型就可以主动使用它来规划工作。这比在 System Prompt 中说"请列出步骤"更可靠 — 工具调用是结构化的，不会被模型"忘记"。',
  },

  'status-bar': {
    id: 'status-bar',
    title: 'Cost Tracking + 限流系统',
    what: '状态栏显示的 token 数和费用来自真实的 API 响应计数，限流信息来自 HTTP 响应头。',
    dataFlow: [
      { step: 1, text: 'API 响应包含 usage: { input_tokens, output_tokens }' },
      { step: 2, text: 'CostTracker 累加 token 数，计算 USD 费用', highlight: true },
      { step: 3, text: '读取 anthropic-ratelimit-* 响应头' },
      { step: 4, text: '如果接近限流 → 显示警告 + 指数退避重试' },
      { step: 5, text: '状态栏实时更新显示' },
    ],
    code: {
      source: 'services/costTracker.ts',
      language: 'typescript',
      code: `interface CostTracker {
  totalCostUSD: number
  modelUsage: {
    [model: string]: {
      inputTokens: number
      outputTokens: number
      cacheReadInputTokens: number     // prompt cache 命中
      cacheCreationInputTokens: number // prompt cache 创建
      costUSD: number
    }
  }
}

// 重试策略
function getRetryDelay(attempt: number): number {
  const base = Math.min(1000 * Math.pow(2, attempt - 1), 32000)
  const jitter = Math.random() * 0.25 * base
  return base + jitter  // 指数退避 + 随机抖动
}`,
      annotation: 'cacheReadInputTokens 比普通 inputTokens 便宜 90%。Claude Code 通过 prompt caching 大幅降低成本 — 静态 System Prompt 段只需付一次创建费用。',
    },
    designNote: '为什么重试用"指数退避 + 随机抖动"？纯指数退避会导致所有被限流的客户端在同一时刻重试（雷群效应）。加上 25% 的随机抖动让重试分散开来，对 API 更友好。',
  },

  'diff-display': {
    id: 'diff-display',
    title: 'FileEditTool Diff 显示',
    what: 'Edit 工具生成的 diff 高亮显示删除行（红色-）和新增行（绿色+），与 git diff 格式一致。',
    dataFlow: [
      { step: 1, text: 'Edit 工具输入包含 old_string 和 new_string' },
      { step: 2, text: '对比生成 diff：删除行标记 -, 新增行标记 +', highlight: true },
      { step: 3, text: 'UI 渲染：红色背景 = 删除，绿色背景 = 新增' },
      { step: 4, text: '权限对话框中显示 diff 让用户审核' },
    ],
    code: {
      source: 'tools/FileEditTool.ts',
      language: 'typescript',
      code: `// Edit 输入结构
inputSchema: z.object({
  file_path: z.string(),
  old_string: z.string(),  // 要替换的原文（必须唯一）
  new_string: z.string(),  // 替换成的新文本
  replace_all: z.boolean().default(false),
})

// old_string 必须与文件中的文本完全匹配
// 包括缩进（tabs/spaces）
// 不包括行号前缀`,
      annotation: 'old_string 的精确匹配要求很高 — 必须包含正确的缩进。这就是为什么 Claude Code 的 Edit prompt 中反复强调"preserve the exact indentation"。',
    },
    designNote: '为什么用"找旧替新"而不是"按行号修改"？行号在多次编辑后会偏移，导致错误。字符串匹配虽然需要更长的 old_string 来保证唯一性，但永远不会"改错行"。这是正确性优先于便利性的设计。',
  },

  'error-message': {
    id: 'error-message',
    title: '错误处理 + 重试策略',
    what: 'Claude Code 有完善的错误处理：API 错误自动重试，工具错误返回给模型让它调整。',
    dataFlow: [
      { step: 1, text: '错误类型判断：API 错误 vs 工具错误' },
      { step: 2, text: 'API 429 (限流) → 指数退避重试，最多 10 次', highlight: true },
      { step: 3, text: 'API 529 (过载) → 最多 3 次重试' },
      { step: 4, text: '工具错误 → 返回错误信息给模型' },
      { step: 5, text: '模型根据错误信息调整策略' },
    ],
    code: {
      source: 'services/api/retry.ts',
      language: 'typescript',
      code: `const DEFAULT_MAX_RETRIES = 10
const MAX_529_RETRIES = 3  // 过载状态码

// API 错误重试
async function withRetry(fn, maxRetries) {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn()
    } catch (error) {
      if (!isRetryable(error)) throw error
      const delay = getRetryDelay(attempt)
      await sleep(delay)
    }
  }
}

// 工具错误 → 返回给模型
function handleToolError(error) {
  return { type: 'tool_result', content: error.message }
  // 模型会看到错误信息并调整策略
}`,
      annotation: '工具错误不会中断循环 — 它们被包装成 tool_result 返回给模型。模型看到错误后通常会换一种方式重试。这就是为什么 Claude Code 能"自愈"。',
    },
    designNote: '为什么限流重试 10 次但过载只重试 3 次？限流（429）是可预期的、按配额的限制，等一会儿就好。过载（529）意味着服务器真的忙不过来，持续重试会加重负担。更少的重试 = 对 API 更友好。',
  },

  'agent-delegation': {
    id: 'agent-delegation',
    title: 'AgentTool — 子 Agent 委派',
    what: 'Agent 工具创建一个子 Agent 来执行特定任务。有两种模式：Fork（共享缓存）和 Spawn（独立工具集）。',
    dataFlow: [
      { step: 1, text: '主 Agent 决定委派任务给子 Agent' },
      { step: 2, text: '选择模式：Fork（省略 type）或 Spawn（指定 type）', highlight: true },
      { step: 3, text: 'Fork: 共享 prompt cache，工具集相同，高效' },
      { step: 4, text: 'Spawn: 独立工具集（如 Explore 只有只读工具）' },
      { step: 5, text: '子 Agent 在隔离环境中执行任务' },
      { step: 6, text: '结果返回给主 Agent' },
    ],
    code: {
      source: 'tools/AgentTool.ts',
      language: 'typescript',
      code: `// Agent 工具 — 两种创建方式
// Fork: 共享 prompt cache
Agent({ prompt: "分析代码结构" })

// Spawn: 独立工具集
Agent({
  prompt: "探索项目",
  subagent_type: "Explore",  // 只有 Read, Glob, Grep
})

// Subagent 额外 Prompt
const SUBAGENT_INSTRUCTIONS = \`
Notes:
- Agent threads always have their cwd reset between
  bash calls, use absolute file paths.
- In your final response, share file paths that are
  relevant to the task.
- Include code snippets only when exact text matters.
\``,
      annotation: 'Fork 和 Spawn 的选择很关键：Fork 共享 prompt cache（省钱快速），Spawn 有工具隔离（安全可控）。Explore Agent 只有只读工具，不可能意外修改代码。',
    },
    designNote: '为什么子 Agent 用绝对路径？因为子 Agent 每次 Bash 调用后 cwd 会被重置。相对路径在这种情况下会出错。这个看似小的细节在 Subagent Prompt 中被明确指出。',
  },

  'compact-trigger': {
    id: 'compact-trigger',
    title: '上下文压缩 (9 段式)',
    what: '当对话接近上下文窗口限制时，自动触发压缩。用模型自己来总结之前的对话。',
    dataFlow: [
      { step: 1, text: '检测：tokenCount > windowSize - maxOutput - buffer' },
      { step: 2, text: '调用模型生成 9 段摘要', highlight: true },
      { step: 3, text: '摘要包含：请求、概念、文件、错误、待办、当前工作、下一步' },
      { step: 4, text: '关键：CRITICAL: Respond with TEXT ONLY. Do NOT call any tools.' },
      { step: 5, text: '替换旧消息为摘要，清除缓存' },
      { step: 6, text: '设置熔断器（最多连续 3 次压缩失败）' },
    ],
    code: {
      source: 'services/compact/compact.ts',
      language: 'typescript',
      code: `const COMPACT_PROMPT = \`
Your task is to create a detailed summary of the conversation.

Include these sections:
1. Primary Request and Intent
2. Key Technical Concepts
3. Files and Code Sections (with full paths)
4. Errors and Fixes
5. Pending Tasks
6. Current Work (in detail)
7. Next Step

CRITICAL: Respond with TEXT ONLY. Do NOT call any tools.
\`

// 触发条件
const threshold = contextWindowSize - maxOutputTokens - bufferTokens

// 熔断器
const MAX_COMPACT_FAILURES = 3`,
      annotation: '压缩 Prompt 的最后一行至关重要："Do NOT call any tools"。如果模型在压缩过程中调用工具，会创建新的消息，导致无限循环。',
    },
    designNote: '为什么让模型自己压缩而不是用简单的截断？因为截断会丢失关键上下文（正在做什么、改了什么文件）。模型生成的摘要保留了语义信息。代价是额外的 API 调用，但保证了长对话的连续性。',
  },

  'memory-detect': {
    id: 'memory-detect',
    title: 'CLAUDE.md + AutoMemory',
    what: 'CLAUDE.md 是项目级指令文件，AutoMemory 是自动记忆提取服务。两者配合让 AI "记住"用户偏好。',
    dataFlow: [
      { step: 1, text: '加载 CLAUDE.md：Managed → User → Project → Local', highlight: true },
      { step: 2, text: 'CLAUDE.md 内容注入 System Prompt 第 9 段' },
      { step: 3, text: '用户指令 "OVERRIDE any default behavior"' },
      { step: 4, text: 'AutoDream 后台服务：24h 冷却 + 5 次会话门控' },
      { step: 5, text: '提取对话中的持久化信息，写入记忆文件' },
    ],
    code: {
      source: 'context.ts + services/autoDream/',
      language: 'typescript',
      code: `// CLAUDE.md 加载优先级
const loadOrder = [
  'managed',     // 企业策略（最高优先级）
  'user',        // ~/.claude/CLAUDE.md
  'project',     // {project}/.claude/CLAUDE.md
  'local',       // {project}/.claude/CLAUDE.local.md
  'autoMemory',  // 自动记忆
  'teamMemory',  // 团队记忆
]

// AutoDream 触发条件（三重门控）
const autoDreamGate = {
  minHours: 24,     // 距离上次至少 24 小时
  minSessions: 5,   // 至少 5 个会话
  processLock: true, // 防并发
}
// Feature Flag: tengu_onyx_plover

// 记忆文件格式
interface Memory {
  name: string        // "项目使用 React 18"
  description: string
  type: 'user' | 'feedback' | 'project' | 'reference'
}`,
      annotation: 'CLAUDE.md 的 "OVERRIDE" 设计很重要 — 它让用户可以覆盖 System Prompt 的默认行为。比如默认不用 emoji，但用户在 CLAUDE.md 中写"always use emoji"就可以覆盖。',
    },
    designNote: '为什么 AutoDream 要"24 小时 + 5 次会话"双门控？防止在短期内过度记忆。24 小时确保记忆经过"睡眠"沉淀，5 次会话确保是持久模式而非一次性偏好。这模拟了人类记忆的巩固过程。',
  },
}
