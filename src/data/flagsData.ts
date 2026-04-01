import type { FeatureFlag } from '../types'

export const featureFlags: FeatureFlag[] = [
  // --- RELEASED ---
  {
    name: 'BUDDY',
    status: 'released',
    description: '虚拟宠物系统，基于用户 ID 通过确定性 PRNG 生成独特的像素宠物伴侣。',
    descriptionEn: 'Virtual pet system that generates a unique pixel companion based on user ID using deterministic PRNG (Mulberry32).',
    triggerCondition: 'IS_FEATURE_ENABLED("BUDDY") — enabled for all users by default',
    relatedFiles: [
      'src/components/BuddyLab/BuddyLabView.tsx',
      'src/data/buddyData.ts',
      'src/utils/prng.ts'
    ],
    dependencies: []
  },
  {
    name: 'COORDINATOR_MODE',
    status: 'released',
    description: '多工作器协调模式，允许 Claude Code 作为协调器管理多个并行的工作器实例，实现复杂任务分解。',
    descriptionEn: 'Multi-worker orchestration mode. Allows Claude Code to act as a coordinator managing multiple parallel worker instances for complex task decomposition.',
    triggerCondition: 'CLAUDE_COORDINATOR=1 env var, or --coordinator CLI flag',
    relatedFiles: [
      'src/coordinator/index.ts',
      'src/coordinator/workerPool.ts',
      'src/coordinator/taskScheduler.ts',
      'src/ipc/coordinatorBridge.ts'
    ],
    dependencies: []
  },

  // --- BETA ---
  {
    name: 'KAIROS',
    status: 'ant-only',
    description: '长期助理模式（Kairos 项目），允许 Claude 在多个会话间保持上下文记忆，实现跨会话的连续性工作流。',
    descriptionEn: 'Long-term assistant mode (Project Kairos). Enables Claude to maintain contextual memory across multiple sessions for continuous cross-session workflows.',
    triggerCondition: 'IS_FEATURE_ENABLED("kairos") — restricted to Anthropic internal accounts',
    relatedFiles: [
      'src/kairos/memoryStore.ts',
      'src/kairos/sessionBridge.ts',
      'src/kairos/contextSerializer.ts',
      'src/prompts/kairosSystem.txt'
    ],
    dependencies: ['COORDINATOR_MODE']
  },
  {
    name: 'ULTRAPLAN',
    status: 'beta',
    description: '远程 CCR 计划模式，将复杂规划任务发送到远端强化推理模型（30分钟超时），适合需要深度思考的架构设计。',
    descriptionEn: 'Remote CCR (Claude Code Remote) planning mode. Sends complex planning tasks to a remote enhanced reasoning model with a 30-minute timeout for deep architectural thinking.',
    triggerCondition: 'IS_FEATURE_ENABLED("ultraplan") — beta users + /ultraplan slash command',
    relatedFiles: [
      'src/commands/ultraplan.ts',
      'src/remote/ccrClient.ts',
      'src/remote/planSerializer.ts',
      'src/hooks/useUltraplan.ts'
    ],
    dependencies: []
  },
  {
    name: 'ULTRAREVIEW',
    status: 'beta',
    description: '远程代码审查模式，通过付费计费门控启用，将代码库发送到专用审查模型进行深度安全和质量分析。',
    descriptionEn: 'Remote code review mode with billing gate. Sends codebase to a dedicated review model for deep security and quality analysis. Requires billing confirmation.',
    triggerCondition: 'IS_FEATURE_ENABLED("ultrareview") + billing confirmation dialog',
    relatedFiles: [
      'src/commands/ultrareview.ts',
      'src/billing/gate.ts',
      'src/remote/reviewClient.ts',
      'src/components/BillingGateModal.tsx'
    ],
    dependencies: ['ULTRAPLAN']
  },

  // --- UNRELEASED ---
  {
    name: 'DAEMON',
    status: 'unreleased',
    description: '后台会话守护进程模式，通过 tmux 持久化会话允许 Claude 在后台持续运行，用户可随时重新连接。',
    descriptionEn: 'Background session daemon mode. Uses tmux persistence to allow Claude to run continuously in the background, with users reconnecting at any time.',
    triggerCondition: 'IS_FEATURE_ENABLED("daemon") — not yet in production',
    relatedFiles: [
      'src/daemon/sessionManager.ts',
      'src/daemon/tmuxBridge.ts',
      'src/daemon/heartbeat.ts',
      'src/ipc/daemonSocket.ts'
    ],
    dependencies: []
  },
  {
    name: 'BG_SESSIONS',
    status: 'unreleased',
    description: '后台会话管理，与 DAEMON 协同工作，允许多个后台 Claude 实例同时运行不同任务。',
    descriptionEn: 'Background session management, works with DAEMON to allow multiple background Claude instances running different tasks simultaneously.',
    triggerCondition: 'IS_FEATURE_ENABLED("bg_sessions") — paired with DAEMON flag',
    relatedFiles: [
      'src/daemon/bgSessionPool.ts',
      'src/daemon/sessionRegistry.ts',
      'src/cli/bgCommands.ts'
    ],
    dependencies: ['DAEMON']
  },
  {
    name: 'UDS_INBOX',
    status: 'unreleased',
    description: 'Unix Domain Socket 跨会话消息收件箱，允许不同 Claude 会话实例通过 UDS 互相发送消息和任务。',
    descriptionEn: 'Unix Domain Socket cross-session message inbox. Allows different Claude session instances to exchange messages and tasks via UDS.',
    triggerCondition: 'IS_FEATURE_ENABLED("uds_inbox") — requires DAEMON mode',
    relatedFiles: [
      'src/ipc/udsServer.ts',
      'src/ipc/udsClient.ts',
      'src/ipc/messageQueue.ts',
      'src/ipc/inboxProcessor.ts'
    ],
    dependencies: ['DAEMON', 'BG_SESSIONS']
  },
  {
    name: 'PROACTIVE',
    status: 'unreleased',
    description: '自主行动模式，允许 Claude 在检测到特定触发条件时主动采取行动（如文件变更、时间触发），无需用户明确指令。',
    descriptionEn: 'Autonomous action mode. Allows Claude to proactively take actions when detecting specific trigger conditions (file changes, time triggers) without explicit user instructions.',
    triggerCondition: 'IS_FEATURE_ENABLED("proactive") — highly experimental, requires explicit opt-in',
    relatedFiles: [
      'src/proactive/triggerEngine.ts',
      'src/proactive/actionPlanner.ts',
      'src/proactive/safetyGuard.ts',
      'src/watchers/fileWatcher.ts'
    ],
    dependencies: ['DAEMON', 'BG_SESSIONS']
  },
  {
    name: 'TOKEN_BUDGET',
    status: 'unreleased',
    description: 'Token 预算模式，为每次对话或任务设置明确的 token 消费上限，Claude 会在接近预算时主动提示并调整行为。',
    descriptionEn: 'Token budget mode. Sets explicit token consumption limits per conversation or task. Claude proactively adjusts behavior as the budget is approached.',
    triggerCondition: 'IS_FEATURE_ENABLED("token_budget") — in development',
    relatedFiles: [
      'src/budget/tokenTracker.ts',
      'src/budget/budgetEnforcer.ts',
      'src/components/BudgetIndicator.tsx',
      'src/prompts/budgetAwareSystem.txt'
    ],
    dependencies: []
  },
  {
    name: 'EXPERIMENTAL_SKILL_SEARCH',
    status: 'unreleased',
    description: '技能搜索实验功能，通过 DiscoverSkills 工具让 Claude 在执行任务时动态搜索和加载可用的技能插件。',
    descriptionEn: 'Experimental skill search feature using the DiscoverSkills tool. Allows Claude to dynamically search and load available skill plugins during task execution.',
    triggerCondition: 'IS_FEATURE_ENABLED("experimental_skill_search") — adds DiscoverSkills to tool registry',
    relatedFiles: [
      'src/skills/skillRegistry.ts',
      'src/skills/discoverSkillsTool.ts',
      'src/skills/skillLoader.ts',
      'src/skills/skillManifest.ts'
    ],
    dependencies: []
  },

  // --- ANT-ONLY ---
  {
    name: 'ANTI_DISTILLATION_CC',
    status: 'ant-only',
    description: '防蒸馏保护机制，向模型响应中注入虚假工具调用和噪声，防止第三方通过观察输入/输出对来蒸馏 Claude Code 的行为。',
    descriptionEn: 'Anti-distillation protection. Injects fake tool calls and noise into model responses to prevent third parties from distilling Claude Code behavior by observing input/output pairs.',
    triggerCondition: 'IS_FEATURE_ENABLED("anti_distillation_cc") — Anthropic internal only, never shipped to users',
    relatedFiles: [
      'src/security/antiDistillation.ts',
      'src/security/fakeToolInjector.ts',
      'src/security/noiseScheduler.ts'
    ],
    dependencies: []
  },
  {
    name: 'tengu_slate_prism',
    status: 'ant-only',
    description: '连接器文本签名摘要功能（Tengu 项目），对连接器传输的文本进行签名验证和智能摘要，确保跨系统通信的完整性。',
    descriptionEn: 'Connector-text signature summarization (Project Tengu). Signs and intelligently summarizes text transmitted via connectors to ensure cross-system communication integrity.',
    triggerCondition: 'TENGU_SLATE_PRISM=1 — Tengu internal infrastructure feature',
    relatedFiles: [
      'src/tengu/slatePrism.ts',
      'src/tengu/signatureVerifier.ts',
      'src/tengu/summaryEngine.ts',
      'src/connectors/signedConnector.ts'
    ],
    dependencies: []
  },
  {
    name: 'tengu_sessions_elevated_auth_enforcement',
    status: 'ant-only',
    description: 'Tengu 会话可信设备令牌强制验证，要求高权限操作必须使用经过验证的可信设备令牌，增强内部系统安全性。',
    descriptionEn: 'Tengu session trusted device token enforcement. Requires high-privilege operations to use verified trusted device tokens, enhancing internal system security.',
    triggerCondition: 'TENGU_ELEVATED_AUTH=1 — applied to Tengu session infrastructure',
    relatedFiles: [
      'src/tengu/auth/elevatedAuth.ts',
      'src/tengu/auth/deviceTokenValidator.ts',
      'src/tengu/auth/sessionElevation.ts',
      'src/tengu/auth/trustedDeviceStore.ts'
    ],
    dependencies: ['tengu_slate_prism']
  },
  {
    name: 'tengu_amber_flint',
    status: 'ant-only',
    description: 'Tengu Swarm 外部用户准入门控（Amber Flint），控制外部用户访问 Tengu Swarm 编排系统的权限，实现精细化的用户分级准入。',
    descriptionEn: 'Tengu Swarm external users gate (Amber Flint). Controls external user access to the Tengu Swarm orchestration system with granular user-tier admission control.',
    triggerCondition: 'TENGU_AMBER_FLINT=1 — gates external access to Tengu Swarm',
    relatedFiles: [
      'src/tengu/swarm/amberFlint.ts',
      'src/tengu/swarm/userTierGate.ts',
      'src/tengu/swarm/admissionController.ts',
      'src/tengu/swarm/externalUserRegistry.ts'
    ],
    dependencies: ['tengu_sessions_elevated_auth_enforcement']
  }
]

export const FLAG_STATUS_LABELS: Record<string, string> = {
  released: '已发布',
  beta: '测试版',
  unreleased: '未发布',
  'ant-only': '内部专用'
}

export const FLAG_STATUS_COLORS: Record<string, string> = {
  released: '#3fb950',
  beta: '#d29922',
  unreleased: '#8b949e',
  'ant-only': '#f85149'
}
