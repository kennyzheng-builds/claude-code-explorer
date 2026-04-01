import type { ToolSimScenario } from '../types'

export const toolSimScenarios: ToolSimScenario[] = [
  {
    id: 'edit-file',
    name: '编辑文件',
    nameEn: 'Edit File',
    steps: [
      {
        step: 1,
        title: 'API 返回 tool_use 块',
        description: 'Claude API 流式响应结束，返回一个 tool_use 内容块，包含工具名称和输入参数。',
        data: JSON.stringify({
          type: 'tool_use',
          id: 'toolu_01A2B3C4',
          name: 'Edit',
          input: {
            file_path: './src/utils/parser.ts',
            old_string: 'function parse(input: string) {',
            new_string: 'function parse(input: string): ParseResult {'
          }
        }, null, 2),
        highlight: 'api-response'
      },
      {
        step: 2,
        title: '工具注册表查找',
        description: '工具调度器在 toolRegistry Map 中查找名称为 "Edit" 的工具，找到 FileEditTool 实例。',
        data: `// toolRegistry.get("Edit") -> FileEditTool
const toolRegistry = new Map<string, Tool>([
  ["Edit",    new FileEditTool()],
  ["Bash",    new BashTool()],
  ["Read",    new FileReadTool()],
  ["Grep",    new GrepTool()],
  ["Agent",   new AgentTool()],
  ...
])

// Resolved:
const tool = toolRegistry.get("Edit")
// => FileEditTool { name: "Edit", needsPermissions: true }`,
        highlight: 'tool-lookup'
      },
      {
        step: 3,
        title: '输入预处理',
        description: '对工具输入进行预处理：展开 ~ 路径，解析相对路径为绝对路径，标准化文件路径格式。',
        data: `// Input preprocessing pipeline
const rawInput = {
  file_path: './src/utils/parser.ts',
  old_string: 'function parse(input: string) {',
  new_string: 'function parse(input: string): ParseResult {'
}

// Step 1: expandPath(file_path)
// './src/utils/parser.ts' -> '/home/user/project/src/utils/parser.ts'
const absPath = path.resolve(cwd, rawInput.file_path)
// => '/home/user/project/src/utils/parser.ts'

// Step 2: Validate path is within allowed roots
assertPathAllowed(absPath, allowedRoots)`,
        highlight: 'preprocessing'
      },
      {
        step: 4,
        title: '输入验证',
        description: '校验 old_string 不等于 new_string，目标文件存在，且 old_string 在文件中唯一出现（精确一次）。',
        data: `// Input validation checks
async function validateInput(input: EditInput, filePath: string) {
  // Check 1: strings must differ
  if (input.old_string === input.new_string) {
    throw new Error("old_string and new_string are identical")
  }

  // Check 2: file must exist
  const exists = await fs.access(filePath).then(() => true, () => false)
  if (!exists) throw new FileNotFoundError(filePath)

  // Check 3: read file content
  const content = await fs.readFile(filePath, 'utf8')

  // Check 4: old_string must appear exactly once
  const occurrences = countOccurrences(content, input.old_string)
  if (occurrences === 0) throw new Error("old_string not found in file")
  if (occurrences > 1) throw new AmbiguousEditError(occurrences)

  return content  // validation passed
}`,
        highlight: 'validation'
      },
      {
        step: 5,
        title: '权限检查',
        description: 'checkPermissions() 分析此操作为文件修改，权限级别为 "ask"，需要向用户请求确认。',
        data: `// Permission classifier result
const permResult = await checkPermissions({
  tool: "Edit",
  operation: "file_modify",
  path: "/home/user/project/src/utils/parser.ts"
})

// => PermissionResult {
//   decision: "ask",
//   reason: "File modification requires user approval",
//   riskLevel: "medium",
//   autoApprove: false
// }

// Permission levels: "allow" | "ask" | "deny"
// "allow" => proceed automatically
// "ask"   => show PermissionRequest dialog
// "deny"  => block with error`,
        highlight: 'permissions'
      },
      {
        step: 6,
        title: '用户确认',
        description: '前端展示 PermissionRequest 对话框，用户点击"允许"，权限决策为 allow，继续执行。',
        data: `// PermissionRequest UI component shown to user:
{
  toolName: "Edit",
  description: "Modify file: src/utils/parser.ts",
  details: {
    file: "src/utils/parser.ts",
    change: "Add return type annotation to parse()",
    preview: "- function parse(input: string) {\\n+ function parse(input: string): ParseResult {"
  },
  options: ["Allow", "Allow Always", "Deny"]
}

// User clicks "Allow"
// => { decision: "allow", remember: false }
// Permission granted, proceeding to execution...`,
        highlight: 'user-confirm'
      },
      {
        step: 7,
        title: '执行工具调用',
        description: 'tool.call() 执行：定位 old_string，确认唯一性，用 new_string 替换，写回磁盘。',
        data: `// FileEditTool.call() execution
async function call(input: EditInput): Promise<ToolResult> {
  const content = await fs.readFile(input.file_path, 'utf8')

  // Find and replace (already validated as unique)
  const newContent = content.replace(input.old_string, input.new_string)

  // Write atomically via temp file
  const tmpPath = input.file_path + '.tmp.' + Date.now()
  await fs.writeFile(tmpPath, newContent, 'utf8')
  await fs.rename(tmpPath, input.file_path)  // atomic

  // Count changed lines for result
  const linesChanged = diffLines(content, newContent).length

  return {
    success: true,
    message: \`Edited \${input.file_path}: \${linesChanged} line(s) changed\`
  }
}`,
        highlight: 'execution'
      },
      {
        step: 8,
        title: 'PostToolUse 钩子',
        description: '工具执行后，所有注册的 PostToolUse 钩子依次运行（如 lint、格式化检查、文件变更追踪）。',
        data: `// PostToolUse hooks pipeline
const postHooks: PostToolUseHook[] = [
  fileChangeTracker,   // records file to conversation history
  lintOnSave,          // runs eslint --fix if configured
  formatOnSave,        // runs prettier if configured
  gitStatusUpdate,     // updates internal git diff cache
]

// Each hook receives the tool result
for (const hook of postHooks) {
  await hook.run({
    tool: "Edit",
    input: editInput,
    result: toolResult,
    filePath: "/home/user/project/src/utils/parser.ts"
  })
}
// All hooks completed successfully`,
        highlight: 'post-hooks'
      },
      {
        step: 9,
        title: '结果大小检查',
        description: '检查工具结果字符串是否超过 maxResultSizeChars 限制（默认 200KB），超出则截断并添加提示。',
        data: `// Result size enforcement
const MAX_RESULT_SIZE = 200_000  // 200KB in chars

const rawResult = formatToolResult(toolResult)
// rawResult.length = 84 chars (well within limit)

if (rawResult.length > MAX_RESULT_SIZE) {
  // Truncate and append warning
  const truncated = rawResult.slice(0, MAX_RESULT_SIZE)
  return truncated + "\\n[Output truncated: exceeded 200KB limit]"
}

// Size check passed: 84 / 200000 chars used
// Result: "Edited src/utils/parser.ts: 1 line(s) changed"`,
        highlight: 'size-check'
      },
      {
        step: 10,
        title: '返回 tool_result 给 API',
        description: '将工具执行结果封装为 tool_result 内容块，加入对话历史，随下一轮请求发送给 Claude API。',
        data: JSON.stringify({
          type: 'tool_result',
          tool_use_id: 'toolu_01A2B3C4',
          content: 'Edited src/utils/parser.ts: 1 line(s) changed'
        }, null, 2),
        highlight: 'return-result'
      }
    ]
  },
  {
    id: 'run-command',
    name: '运行命令',
    nameEn: 'Run Command',
    steps: [
      {
        step: 1,
        title: 'API 返回 tool_use 块',
        description: 'Claude 决定运行 bash 命令来完成任务，API 返回包含 command 字段的 BashTool 调用。',
        data: JSON.stringify({
          type: 'tool_use',
          id: 'toolu_05X6Y7Z8',
          name: 'Bash',
          input: {
            command: 'npm test -- --testPathPattern=parser',
            timeout: 30000,
            description: 'Run parser unit tests'
          }
        }, null, 2),
        highlight: 'api-response'
      },
      {
        step: 2,
        title: '工具注册表查找',
        description: '调度器查找 "Bash" 工具，找到 BashTool，这是执行任意 shell 命令的高权限工具。',
        data: `// BashTool has highest risk level
const tool = toolRegistry.get("Bash")
// => BashTool {
//   name: "Bash",
//   riskLevel: "high",
//   requiresSandbox: true,
//   permissionLevel: "ask"
// }

// BashTool special features:
// - Command injection detection
// - Sandbox wrapping (when enabled)
// - Timeout enforcement
// - Output streaming`,
        highlight: 'tool-lookup'
      },
      {
        step: 3,
        title: '命令安全分析',
        description: '对命令进行静态分析：检测危险模式（rm -rf、dd、fork bombs），分类为安全/需确认/拒绝。',
        data: `// Command safety analysis
const analysis = analyzeCommand("npm test -- --testPathPattern=parser")

// Pattern matching results:
{
  hasNetworkAccess: false,       // no curl/wget/fetch
  hasFileSystemWrite: false,     // no rm/mv/cp to sensitive paths
  hasProcessSpawn: false,        // no & background processes
  hasPrivilegeEscalation: false, // no sudo/su
  isDangerous: false,            // no fork bombs, dd, etc.
  category: "test_run",
  riskScore: 1,                  // 1-10 scale, 1=lowest
  decision: "ask"                // still requires approval
}`,
        highlight: 'preprocessing'
      },
      {
        step: 4,
        title: '沙箱包装',
        description: '根据配置，命令被包装在沙箱环境中运行（如 Docker 容器或 macOS sandbox-exec），限制文件系统访问。',
        data: `// Sandbox wrapping (when CLAUDE_SANDBOX=1)
const sandboxedCmd = wrapInSandbox({
  command: "npm test -- --testPathPattern=parser",
  profile: "developer-tool",
  restrictions: {
    allowedPaths: [cwd, "/tmp", "~/.npm"],
    denyNetwork: false,        // tests may need network
    denyProcessSpawn: false,   // npm spawns jest
    maxMemoryMB: 512,
    maxCpuPercent: 80
  }
})

// macOS: sandbox-exec -p '(version 1)(allow default)...'
// Linux: unshare --user --pid -- sh -c "..."
// Result: isolated execution environment`,
        highlight: 'validation'
      },
      {
        step: 5,
        title: '权限分类器',
        description: 'PermissionClassifier 根据命令类型和项目规则判断权限：npm test 属于"开发工具类"，决策为 ask。',
        data: `// PermissionClassifier decision tree
const classifier = new PermissionClassifier(projectRules)
const decision = classifier.classify({
  tool: "Bash",
  command: "npm test -- --testPathPattern=parser"
})

// Classification result:
{
  category: "dev-tool",
  subcategory: "test-runner",
  matchedRule: null,  // no pre-approved rule
  decision: "ask",
  explanation: "Test commands may modify test snapshots or state",
  suggestedAlwaysAllow: "npm test"  // user can whitelist
}`,
        highlight: 'permissions'
      },
      {
        step: 6,
        title: '用户确认执行',
        description: '用户看到命令预览并点击允许。若用户选择"总是允许"，该模式将加入白名单跳过后续询问。',
        data: `// User permission dialog
{
  title: "运行 Bash 命令",
  command: "npm test -- --testPathPattern=parser",
  description: "Run parser unit tests",
  risk: "low",
  options: ["Allow", "Allow Always (npm test)", "Deny"]
}

// User selects "Allow"
// => { decision: "allow", pattern: null }

// If "Allow Always" selected:
// => addToWhitelist("npm test*")
// Future: npm test commands auto-approved`,
        highlight: 'user-confirm'
      },
      {
        step: 7,
        title: '执行命令',
        description: 'child_process.spawn() 启动命令，流式捕获 stdout/stderr，实时传递给前端显示，超时后强制终止。',
        data: `// Command execution with streaming
const proc = spawn("npm", ["test", "--", "--testPathPattern=parser"], {
  cwd: projectRoot,
  env: { ...process.env, CI: "true" },
  timeout: 30000,
})

// Stream output in real-time
proc.stdout.on('data', (chunk) => streamToUI(chunk))
proc.stderr.on('data', (chunk) => streamToUI(chunk, 'stderr'))

// Collect full output
let stdout = '', stderr = ''
// ... (streaming collection) ...

// Wait for completion or timeout
const exitCode = await waitForProcess(proc, 30000)
// => { exitCode: 0, signal: null, timedOut: false }`,
        highlight: 'execution'
      },
      {
        step: 8,
        title: 'PostToolUse 钩子',
        description: '命令完成后运行 PostToolUse 钩子，记录执行历史，检测是否有文件被命令修改。',
        data: `// Post-execution hooks for BashTool
await Promise.all([
  commandHistoryHook.run(cmd, result),  // log to history
  fileChangeDetector.run(projectRoot),  // scan for modified files
  workingDirCheck.run(cwd),             // ensure cwd unchanged
])

// fileChangeDetector found:
{
  modified: [],  // npm test didn't modify source files
  created: ["coverage/lcov.info"],  // coverage report created
  deleted: []
}

// Conversation context updated with execution record`,
        highlight: 'post-hooks'
      },
      {
        step: 9,
        title: '输出大小检查',
        description: '检查命令输出大小。如果超过限制，截断并在尾部追加截断提示，避免 token 爆炸。',
        data: `// Output size management
const rawOutput = stdout + (stderr ? "\\nSTDERR:\\n" + stderr : "")
// rawOutput.length = 2847 chars

const MAX_OUTPUT = 200_000

if (rawOutput.length > MAX_OUTPUT) {
  // Keep first 100KB + last 100KB (sandwich truncation)
  const half = MAX_OUTPUT / 2
  output = rawOutput.slice(0, half)
    + "\\n... [truncated " + (rawOutput.length - MAX_OUTPUT) + " chars] ...\\n"
    + rawOutput.slice(-half)
} else {
  output = rawOutput  // within limits
}
// Final size: 2847 / 200000 chars`,
        highlight: 'size-check'
      },
      {
        step: 10,
        title: '返回结果给 API',
        description: '命令输出（含退出码）封装为 tool_result，Claude 据此判断测试是否通过并决定下一步行动。',
        data: JSON.stringify({
          type: 'tool_result',
          tool_use_id: 'toolu_05X6Y7Z8',
          content: 'PASS src/utils/__tests__/parser.test.ts\n  ✓ parse() handles empty input (3ms)\n  ✓ parse() returns ParseResult type (1ms)\n  ✓ parse() throws on invalid input (2ms)\n\nTest Suites: 1 passed, 1 total\nTests:       3 passed, 3 total\nTime:        1.247s'
        }, null, 2),
        highlight: 'return-result'
      }
    ]
  },
  {
    id: 'search-code',
    name: '搜索代码',
    nameEn: 'Search Code',
    steps: [
      {
        step: 1,
        title: 'API 返回 tool_use 块',
        description: 'Claude 需要查找代码中某个模式的所有出现位置，API 返回 Grep 工具调用。',
        data: JSON.stringify({
          type: 'tool_use',
          id: 'toolu_09G1H2I3',
          name: 'Grep',
          input: {
            pattern: 'PermissionClassifier',
            path: './src',
            include: '*.ts',
            output_mode: 'content'
          }
        }, null, 2),
        highlight: 'api-response'
      },
      {
        step: 2,
        title: '工具注册表查找',
        description: '调度器查找 "Grep" 工具，GrepTool 是只读工具，标记为 isConcurrencySafe = true。',
        data: `// GrepTool has concurrency-safe flag
const tool = toolRegistry.get("Grep")
// => GrepTool {
//   name: "Grep",
//   isConcurrencySafe: true,   // ← key property
//   requiresPermission: false,  // read-only, no approval
//   usesRipgrep: true,          // calls rg binary
//   maxResults: 100
// }

// isConcurrencySafe tools can run in parallel:
// - Grep, Read, Glob, LS (all read-only)
// - NOT: Edit, Bash, Write (state-mutating)`,
        highlight: 'tool-lookup'
      },
      {
        step: 3,
        title: '并发安全检查',
        description: '由于 GrepTool.isConcurrencySafe = true，此搜索可与其他只读操作并行执行，无需等待。',
        data: `// Concurrency scheduler
const pendingTools = scheduler.getPending()
// [{ id: "toolu_09G1H2I3", name: "Grep", safe: true }]

if (tool.isConcurrencySafe) {
  // Can run immediately without waiting for other tools
  scheduler.runParallel(toolCall)
} else {
  // Must wait for all current tool calls to complete
  await scheduler.drain()
  scheduler.runExclusive(toolCall)
}

// Grep: scheduled for parallel execution
// (If Claude had also called Read simultaneously,
//  both would run concurrently)`,
        highlight: 'preprocessing'
      },
      {
        step: 4,
        title: '输入验证与路径解析',
        description: '验证搜索路径存在，解析为绝对路径，检查 pattern 是有效正则表达式，准备 ripgrep 参数。',
        data: `// Input validation for GrepTool
const absPath = path.resolve(cwd, "./src")
// => "/home/user/project/src"

// Validate: path exists
await assertPathExists(absPath)

// Validate: regex is valid
new RegExp("PermissionClassifier")  // OK

// Build ripgrep args
const rgArgs = [
  "--include=*.ts",
  "--line-number",
  "--color=never",
  "--max-count=100",
  "-e", "PermissionClassifier",
  absPath
]`,
        highlight: 'validation'
      },
      {
        step: 5,
        title: '权限检查（跳过）',
        description: 'GrepTool 为只读操作，不需要用户许可，直接标记为自动允许，跳过权限询问对话框。',
        data: `// Permission check for read-only tools
const permResult = await checkPermissions({
  tool: "Grep",
  operation: "file_read",
  path: "/home/user/project/src"
})

// => PermissionResult {
//   decision: "allow",          // ← auto-approved
//   reason: "Read-only operation",
//   riskLevel: "none",
//   autoApprove: true,           // no dialog shown
//   showToUser: false            // silent
// }

// Skipping user confirmation dialog entirely...`,
        highlight: 'permissions'
      },
      {
        step: 6,
        title: '静默自动授权',
        description: '只读工具无需用户交互，系统自动授权并立即进入执行阶段，提升搜索速度。',
        data: `// Auto-authorization for read-only tools
// No UI dialog shown to user

const authGrant = {
  toolId: "toolu_09G1H2I3",
  decision: "auto-allow",
  timestamp: Date.now(),
  reason: "GrepTool is marked read-only (isConcurrencySafe=true)"
}

// Record in permission audit log
permissionAuditLog.push(authGrant)

// Proceeding directly to ripgrep spawn...
// Time saved: ~300ms (no user interaction wait)`,
        highlight: 'user-confirm'
      },
      {
        step: 7,
        title: '调用 ripgrep',
        description: '生成子进程运行 ripgrep 二进制，流式读取匹配结果，解析行号和匹配内容。',
        data: `// Spawning ripgrep subprocess
const rg = spawn("rg", [
  "--include=*.ts",
  "--line-number",
  "--color=never",
  "--max-count=100",
  "-e", "PermissionClassifier",
  "/home/user/project/src"
])

// Streaming results:
// src/permissions/classifier.ts:3:export class PermissionClassifier {
// src/permissions/classifier.ts:47:  classify(input: ClassifyInput) {
// src/tools/bash.ts:12:import { PermissionClassifier } from '../permissions'
// src/tools/bash.ts:89:  const classifier = new PermissionClassifier(rules)
// src/types.ts:201:// PermissionClassifier result type
//
// rg exit code: 0 (matches found)`,
        highlight: 'execution'
      },
      {
        step: 8,
        title: 'PostToolUse 钩子',
        description: '只读工具的 PostToolUse 钩子较轻量，主要是记录搜索历史以便 Claude 避免重复相同搜索。',
        data: `// Lightweight post-hooks for read-only tools
await searchHistoryHook.run({
  tool: "Grep",
  pattern: "PermissionClassifier",
  path: "/home/user/project/src",
  resultCount: 5,
  timestamp: Date.now()
})

// Search cache updated:
// Cache key: "grep:PermissionClassifier:/home/user/project/src"
// Cache TTL: 30 seconds (invalidated on file write)

// Note: No fileChangeDetector needed (read-only)
// Note: No workingDirCheck needed (no process spawn)`,
        highlight: 'post-hooks'
      },
      {
        step: 9,
        title: '结果截断处理',
        description: '如果匹配超过 maxResults（100条）或输出超过大小限制，截断结果并附上省略提示。',
        data: `// Result truncation logic
const matches = parseRgOutput(rgOutput)
// matches.length = 5 (well under limit)

const MAX_MATCHES = 100
const MAX_OUTPUT_CHARS = 200_000

if (matches.length >= MAX_MATCHES) {
  result += "\\n[Results truncated at 100 matches]"
  result += "\\n[Use a more specific pattern to narrow results]"
}

if (formattedOutput.length > MAX_OUTPUT_CHARS) {
  formattedOutput = formattedOutput.slice(0, MAX_OUTPUT_CHARS)
  formattedOutput += "\\n[Output truncated: exceeded 200KB]"
}

// This search: 5 matches, 312 chars — no truncation needed`,
        highlight: 'size-check'
      },
      {
        step: 10,
        title: '返回搜索结果',
        description: '格式化后的搜索结果作为 tool_result 返回，Claude 据此了解代码结构并进行下一步推理。',
        data: JSON.stringify({
          type: 'tool_result',
          tool_use_id: 'toolu_09G1H2I3',
          content: 'src/permissions/classifier.ts:3:export class PermissionClassifier {\nsrc/permissions/classifier.ts:47:  classify(input: ClassifyInput) {\nsrc/tools/bash.ts:12:import { PermissionClassifier } from \'../permissions\'\nsrc/tools/bash.ts:89:  const classifier = new PermissionClassifier(rules)\nsrc/types.ts:201:// PermissionClassifier result type\n\n5 matches in 3 files'
        }, null, 2),
        highlight: 'return-result'
      }
    ]
  },
  {
    id: 'create-subagent',
    name: '创建子 Agent',
    nameEn: 'Create Subagent',
    steps: [
      {
        step: 1,
        title: 'API 返回 tool_use 块',
        description: 'Claude 决定将复杂子任务委托给子 Agent 并行处理，调用 AgentTool 创建独立子进程。',
        data: JSON.stringify({
          type: 'tool_use',
          id: 'toolu_11K2L3M4',
          name: 'Agent',
          input: {
            prompt: 'Review all TypeScript files in src/permissions/ and identify any potential security issues. Focus on permission bypass vulnerabilities.',
            tools: ['Read', 'Grep', 'Glob']
          }
        }, null, 2),
        highlight: 'api-response'
      },
      {
        step: 2,
        title: '工具注册表查找',
        description: 'AgentTool 是特殊的元工具，负责 fork 出独立子代理，有自己的消息循环和工具集。',
        data: `// AgentTool is a meta-tool
const tool = toolRegistry.get("Agent")
// => AgentTool {
//   name: "Agent",
//   isMeta: true,              // spawns child agent
//   forkMessageHistory: false, // fresh context by default
//   maxDepth: 3,               // max subagent nesting
//   currentDepth: 0            // we're at top level
// }

// AgentTool creates a complete Claude instance:
// - Own message loop
// - Own tool registry (restricted)
// - Own permission context
// - Communicates only via prompt/result`,
        highlight: 'tool-lookup'
      },
      {
        step: 3,
        title: 'Fork 子 Agent 环境',
        description: '创建隔离的子 Agent 环境：复制必要配置，不共享父 Agent 的消息历史，限制可用工具集。',
        data: `// Forking child agent environment
const childEnv = await AgentTool.forkEnvironment({
  parentDepth: 0,
  childDepth: 1,

  // Tool restriction: only allow read-only tools
  allowedTools: ["Read", "Grep", "Glob", "LS"],
  // Parent-restricted tools blocked: Edit, Bash, Agent

  // Fresh context (no parent message history)
  messageHistory: [],

  // Inherit configuration
  config: {
    model: parent.config.model,
    maxTokens: 4096,    // smaller budget for subagent
    temperature: parent.config.temperature,
    cwd: parent.cwd,   // same working directory
  }
})`,
        highlight: 'preprocessing'
      },
      {
        step: 4,
        title: '提示注入与上下文设置',
        description: '将任务提示注入子 Agent，同时附加系统级指令说明其受限角色和输出格式要求。',
        data: `// Prompt injection for child agent
const childSystemPrompt = [
  // Standard Claude Code system prompt (truncated)
  SYSTEM_PROMPT_BASE,

  // Subagent-specific additions:
  "You are a subagent spawned to complete a specific task.",
  "You have access to: Read, Grep, Glob, LS only.",
  "You cannot spawn further agents (max depth reached = false, but restricted).",
  "Return a comprehensive report when done.",
  "Do not ask clarifying questions - work with what you have.",
].join("\\n")

const childUserMessage = {
  role: "user",
  content: "Review all TypeScript files in src/permissions/ " +
           "and identify security issues..."
}`,
        highlight: 'validation'
      },
      {
        step: 5,
        title: '权限检查（子 Agent）',
        description: 'AgentTool 本身需要确认，因为子 Agent 可能产生不可预知的副作用，需要用户知情。',
        data: `// Permission check for AgentTool
const permResult = await checkPermissions({
  tool: "Agent",
  operation: "spawn_subagent",
  restrictedTools: ["Read", "Grep", "Glob"],
  taskPreview: "Security review of src/permissions/ directory"
})

// => PermissionResult {
//   decision: "ask",
//   reason: "Subagent will make multiple tool calls autonomously",
//   estimatedToolCalls: "5-20",
//   riskLevel: "medium",
//   note: "Subagent restricted to read-only tools"
// }`,
        highlight: 'permissions'
      },
      {
        step: 6,
        title: '用户确认启动',
        description: '用户看到子 Agent 任务摘要，确认启动。前端显示进度指示器表明子 Agent 正在运行。',
        data: `// User confirmation for subagent
{
  title: "启动子 Agent",
  task: "Review src/permissions/ for security issues",
  tools: ["Read (read-only)", "Grep (read-only)", "Glob (read-only)"],
  estimatedTime: "30-60 seconds",
  note: "Subagent cannot modify files or run commands"
}

// User clicks "Allow"
// Frontend shows: "⚙ Subagent running... (0 tool calls)"

// Child agent starts its own message loop:
// 1. Receives task prompt
// 2. Plans approach
// 3. Makes tool calls (Glob, Read, Grep...)
// 4. Synthesizes findings`,
        highlight: 'user-confirm'
      },
      {
        step: 7,
        title: '子 Agent 执行循环',
        description: '子 Agent 运行完整的消息循环：调用 Glob 列文件，Read 读取每个文件，Grep 查找漏洞模式。',
        data: `// Child agent's execution (simplified)
// Turn 1: Plan and list files
Glob("src/permissions/**/*.ts") -> [
  "classifier.ts", "validator.ts", "store.ts"
]

// Turn 2: Read each file
Read("src/permissions/classifier.ts") -> [content]
Read("src/permissions/validator.ts") -> [content]
Read("src/permissions/store.ts")     -> [content]

// Turn 3: Search for patterns
Grep("bypass", "src/permissions/") -> 0 matches
Grep("TODO.*security", "src/permissions/") -> 2 matches
Grep("any\\b", "src/permissions/") -> 5 matches (type safety)

// Turn 4: Synthesize report
// Child agent stops calling tools, writes final answer`,
        highlight: 'execution'
      },
      {
        step: 8,
        title: 'PostToolUse 钩子（汇总）',
        description: '收集子 Agent 所有工具调用记录，汇总统计信息，更新父 Agent 的执行追踪。',
        data: `// Post-execution: collecting subagent stats
const subagentSummary = {
  totalTurns: 4,
  totalToolCalls: 7,
  tokensUsed: {
    input: 8420,
    output: 1238,
    cacheRead: 3100
  },
  toolCallBreakdown: {
    Glob: 1,
    Read: 3,
    Grep: 3
  },
  duration: "23.4 seconds",
  filesExamined: 3
}

// Parent agent receives summary in PostToolUse hooks
await agentStatsHook.run(subagentSummary)`,
        highlight: 'post-hooks'
      },
      {
        step: 9,
        title: '结果大小检查',
        description: '子 Agent 的报告可能很长，检查是否超过大小限制，确保父 Agent 的上下文不会溢出。',
        data: `// Subagent result size check
const agentReport = subagent.getFinalAnswer()
// agentReport.length = 1842 chars

const MAX_AGENT_RESULT = 200_000

if (agentReport.length > MAX_AGENT_RESULT) {
  // Truncate with summary preservation
  // Keep: beginning (task summary) + end (conclusions)
  const truncated = smartTruncate(agentReport, MAX_AGENT_RESULT)
  return truncated + "\\n[Subagent report truncated]"
}

// Size check passed: 1842 / 200000 chars
// Full report returned to parent agent`,
        highlight: 'size-check'
      },
      {
        step: 10,
        title: '子 Agent 结果返回父级',
        description: '子 Agent 的完整报告作为 tool_result 返回，父 Agent 继续推理并决定后续行动。',
        data: JSON.stringify({
          type: 'tool_result',
          tool_use_id: 'toolu_11K2L3M4',
          content: 'Security Review Report: src/permissions/\n\n## Findings\n\n1. **Type Safety (Medium)**: 5 instances of `any` type in classifier.ts lines 23, 45, 67, 89, 102. Consider using stricter types.\n\n2. **TODO Items**: 2 security-related TODOs found:\n   - classifier.ts:156: "TODO: add rate limiting to classify()"\n   - validator.ts:89: "TODO: validate nested permission objects"\n\n## No Critical Issues Found\nNo permission bypass vulnerabilities detected. The permission flow appears sound.\n\nFiles examined: classifier.ts, validator.ts, store.ts'
        }, null, 2),
        highlight: 'return-result'
      }
    ]
  },
  {
    id: 'permission-denied',
    name: '权限被拒',
    nameEn: 'Permission Denied',
    steps: [
      {
        step: 1,
        title: 'API 返回高风险 tool_use',
        description: 'Claude 试图执行一个高风险操作：删除文件，API 返回包含危险命令的 BashTool 调用。',
        data: JSON.stringify({
          type: 'tool_use',
          id: 'toolu_15P6Q7R8',
          name: 'Bash',
          input: {
            command: 'rm -rf ./node_modules && rm -rf ./dist && rm package-lock.json',
            description: 'Clean build artifacts'
          }
        }, null, 2),
        highlight: 'api-response'
      },
      {
        step: 2,
        title: '工具注册表查找',
        description: 'BashTool 被找到，系统注意到命令包含 rm -rf 模式，立即触发危险操作检测器。',
        data: `// Tool lookup triggers immediate analysis
const tool = toolRegistry.get("Bash")

// Pre-lookup: command pre-screening
const prescreen = prescreenCommand(
  "rm -rf ./node_modules && rm -rf ./dist && rm package-lock.json"
)

// => {
//   containsDangerousPatterns: true,
//   patterns: ["rm -rf", "rm -rf", "rm "],
//   targetPaths: ["./node_modules", "./dist", "package-lock.json"],
//   isChained: true,    // multiple commands with &&
//   dangerScore: 8      // 8/10 - very high risk
// }

// Flag for enhanced permission scrutiny`,
        highlight: 'tool-lookup'
      },
      {
        step: 3,
        title: '危险命令分析',
        description: '深度分析识别出三个破坏性操作链，标记为不可撤销操作（irreversible），风险级别最高。',
        data: `// Deep command analysis
const analysis = analyzeCommand({
  command: "rm -rf ./node_modules && rm -rf ./dist && rm package-lock.json",
  workingDir: "/home/user/project"
})

// => {
//   operations: [
//     { op: "rm -rf", target: "node_modules", files: "~85,000", irreversible: true },
//     { op: "rm -rf", target: "dist",         files: "unknown", irreversible: true },
//     { op: "rm",     target: "package-lock.json", irreversible: true }
//   ],
//   totalIrreversibleOps: 3,
//   estimatedFilesDeleted: "85,000+",
//   canBeUndone: false,
//   classification: "DESTRUCTIVE_MULTI_OP"
// }`,
        highlight: 'preprocessing'
      },
      {
        step: 4,
        title: '输入验证',
        description: '验证阶段即发现命令包含不可撤销批量删除，生成详细警告供权限检查器使用。',
        data: `// Validation flags dangerous patterns
const validationResult = validateBashInput({
  command: "rm -rf ./node_modules && rm -rf ./dist && rm package-lock.json"
})

// => ValidationResult {
//   isValid: true,           // syntactically valid
//   warnings: [
//     "Contains rm -rf: recursive directory deletion",
//     "Chained commands: 3 operations will run atomically",
//     "No recovery path: deleted files not in trash"
//   ],
//   requiresExplicitApproval: true,
//   suggestAlternative: "Use 'npm clean' or check if CI=true before deleting"
// }`,
        highlight: 'validation'
      },
      {
        step: 5,
        title: '权限分类器：拒绝决策',
        description: 'PermissionClassifier 分析命令风险，结合项目规则，决策为 "deny"——此命令不被允许执行。',
        data: `// PermissionClassifier makes deny decision
const classifierResult = classifier.classify({
  tool: "Bash",
  command: "rm -rf ./node_modules && rm -rf ./dist && rm package-lock.json",
  context: {
    projectHasGit: true,
    filesUnstaged: 12,       // user has unsaved changes
    projectAge: "6 months",  // mature project
  }
})

// => ClassifierResult {
//   decision: "deny",
//   confidence: 0.97,
//   reason: "Irreversible bulk deletion with unstaged changes present",
//   ruleMatched: "BLOCK_BULK_DELETE_WITH_UNSTAGED",
//   circuitBreakerTriggered: false  // not yet
// }`,
        highlight: 'permissions'
      },
      {
        step: 6,
        title: '权限请求被拒绝',
        description: '系统自动拒绝执行，向用户显示拒绝原因和安全提示，不需要用户主动点击拒绝。',
        data: `// Permission denied - shown to user
{
  type: "permission_denied",
  title: "操作被拒绝",
  command: "rm -rf ./node_modules && ...",
  reason: "此命令将永久删除 85,000+ 个文件且无法撤销",
  details: [
    "您有 12 个未保存的文件更改",
    "node_modules 可通过 npm install 重建",
    "建议使用 npm run clean 或 git clean -fd"
  ],
  alternatives: [
    "npm run clean",
    "git clean -fd dist/",
    "rimraf node_modules dist"
  ]
}

// No user action required — denial is automatic`,
        highlight: 'user-confirm'
      },
      {
        step: 7,
        title: '生成拒绝结果',
        description: '工具不会执行，直接生成一个描述拒绝原因的 deny_result，供 Claude 理解并修正策略。',
        data: `// Generating deny result (no execution happens)
const denyResult = {
  success: false,
  denied: true,
  reason: "Permission denied: BLOCK_BULK_DELETE_WITH_UNSTAGED",
  toolCallId: "toolu_15P6Q7R8",
  executionAttempted: false,  // never ran

  // Guidance for Claude's next action
  suggestions: [
    "Ask user to confirm explicitly before bulk deletion",
    "Use safer alternative: 'npm run clean'",
    "Check if .gitignore covers node_modules and dist",
    "Suggest: git stash first, then clean"
  ],

  // What WOULD have happened:
  simulatedImpact: "Would have deleted ~85,000 files in 3 directories"
}`,
        highlight: 'execution'
      },
      {
        step: 8,
        title: '熔断器计数更新',
        description: '此次拒绝被记录到熔断器计数器。若短时间内多次触发高风险操作，熔断器将暂停 Claude 行动。',
        data: `// Circuit breaker tracking
const circuitBreaker = getCircuitBreaker(sessionId)

circuitBreaker.recordEvent({
  type: "permission_denied",
  severity: "high",
  tool: "Bash",
  command: "rm -rf...",
  timestamp: Date.now()
})

// Current circuit breaker state:
{
  deniedCount: 1,          // this session
  highRiskCount: 3,        // past 10 minutes
  threshold: 5,            // breaks circuit at 5
  status: "closed",        // still operating normally
  lastTripped: null,
  // If status = "open": all tool calls blocked for 60s
}`,
        highlight: 'post-hooks'
      },
      {
        step: 9,
        title: '拒绝结果大小检查',
        description: '拒绝结果通常很短，但仍需经过大小检查流程保证一致性处理。',
        data: `// Size check (usually trivial for deny results)
const denyMessage = formatDenyResult(denyResult)
// denyMessage.length = 342 chars

const MAX_RESULT_SIZE = 200_000

// 342 chars << 200,000 chars limit
// Size check: PASSED (trivially)

// The deny message is informative but concise:
// "Permission denied: Bulk deletion blocked.
//  Reason: Irreversible operations with unstaged changes.
//  Suggestion: Use npm run clean instead."

console.log(\`Result size: \${denyMessage.length} / \${MAX_RESULT_SIZE}\`)
// => "Result size: 342 / 200000"`,
        highlight: 'size-check'
      },
      {
        step: 10,
        title: '返回拒绝结果给 API',
        description: '拒绝结果返回给 Claude，Claude 理解后将提出更安全的替代方案并请求用户确认。',
        data: JSON.stringify({
          type: 'tool_result',
          tool_use_id: 'toolu_15P6Q7R8',
          content: 'Permission denied: This command was blocked because it would irreversibly delete 85,000+ files while you have 12 unstaged changes.\n\nSuggested alternatives:\n1. npm run clean (if configured)\n2. git clean -fd dist/ node_modules/\n3. Ask the user to confirm explicitly before proceeding\n\nI\'ll suggest a safer approach to the user.',
          is_error: true
        }, null, 2),
        highlight: 'return-result'
      }
    ]
  }
]

export const PIPELINE_STEPS = [
  { id: 'api-response', label: 'API 响应', labelEn: 'API Response' },
  { id: 'tool-lookup', label: '工具查找', labelEn: 'Tool Lookup' },
  { id: 'preprocessing', label: '预处理', labelEn: 'Preprocessing' },
  { id: 'validation', label: '输入验证', labelEn: 'Validation' },
  { id: 'permissions', label: '权限检查', labelEn: 'Permissions' },
  { id: 'user-confirm', label: '用户确认', labelEn: 'User Confirm' },
  { id: 'execution', label: '执行', labelEn: 'Execution' },
  { id: 'post-hooks', label: '后置钩子', labelEn: 'Post Hooks' },
  { id: 'size-check', label: '大小检查', labelEn: 'Size Check' },
  { id: 'return-result', label: '返回结果', labelEn: 'Return Result' },
]
