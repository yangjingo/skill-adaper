# Skill-Adapter 架构设计

> 最后更新: 2026-03-19

---

## 1. 项目概览

### 双引擎设计

项目采用 **AI 优先 + 规则兜底** 的双引擎架构：

| 引擎 | 文件 | 说明 |
|------|------|------|
| **AI 引擎** | `core/evolution/engine.ts` | 调用 Anthropic API 进行智能分析 |
| **规则引擎** | `core/evolution-engine.ts` | 基于 hardcode 规则的备用方案 |

### 模块架构

```
src/
├── cli.ts                    # CLI 入口
├── index.ts                  # 统一导出
└── core/
    ├── evolution/            # ✅ AI Agent 实现
    │   ├── engine.ts         # AIEvolutionEngine
    │   └── prompts.ts        # AI Prompt 构建
    ├── analyzer.ts           # Session 分析 (硬编码)
    ├── evaluator.ts          # 评估器 (硬编码)
    ├── workspace.ts          # 工作区分析 (硬编码)
    ├── discovery/            # 技能发现 (硬编码)
    ├── security/             # 安全扫描 (硬编码)
    └── ...
```

### 实现比例

```
AI Agent:    ██░░░░░░░░░░░░░░░░░░ 10%
Hardcoded:   ████████████████████ 90%
```

---

## 2. Evolution 系统

### 核心理念

**进化 = 执行优化 + 报告结果**

不是提供建议让用户选择，而是直接执行优化并记录。

### 流程图

```
sa evolve <skill>
        │
        ▼
┌───────────────────────────────────────────────┐
│  Step 0: 查找技能                              │
│  优先级: Database → OpenClaw → Claude Code     │
└───────────────────────┬───────────────────────┘
                        ▼
┌───────────────────────────────────────────────┐
│  Step 1-2: 分析环境与技能内容                  │
│  • Workspace: 语言、框架、包管理器             │
│  • Skill: 大小、代码块、环境变量               │
│  • Context: SOUL.md、MEMORY.md                │
└───────────────────────┬───────────────────────┘
                        ▼
┌───────────────────────────────────────────────┐
│  Step 4: 执行优化                              │
│  1. 路径本地化 (${HOME})                      │
│  2. 包管理器适配 (npm/pnpm/yarn)              │
│  3. 环境适配提示                               │
│  4. SOUL.md 风格注入                          │
│  5. MEMORY.md 历史学习                        │
└───────────────────────┬───────────────────────┘
                        ▼
┌───────────────────────────────────────────────┐
│  Step 5-6: 保存与记录                          │
│  • 备份: SKILL.md.backup                      │
│  • 写入: 新的 SKILL.md                        │
│  • 记录: EvolutionDatabase                    │
└───────────────────────────────────────────────┘
```

### 上下文来源

| 来源 | 路径 | 用途 |
|------|------|------|
| SOUL.md | `~/.openclaw/workspace/SOUL.md` | 用户人格、交互风格、边界定义 |
| MEMORY.md | `~/.openclaw/workspace/MEMORY.md` | 长期记忆、错误规避、最佳实践 |
| Daily Logs | `~/.openclaw/workspace/memory/*.md` | 每日工作记录 |

---

## 3. AI 驱动重构

### 问题诊断

原 Evolution 模块是"硬编码规则驱动"，无法：
- 理解语义，只能关键词匹配
- 适应新场景，规则需要手动更新
- 生成上下文相关的具体建议

```typescript
// 原实现 - 硬编码规则
if (rule.category === 'error_avoidance') {
  recommendations.push({ type: 'error_avoidance', ... });
}
```

### 新架构

```
┌───────────────────────────────────────────────┐
│  ModelConfigLoader                             │
│  扫描: ~/.claude/settings.json                 │
│        ~/.openclaw/config.json                 │
│        环境变量 ANTHROPIC_*                    │
└───────────────────────┬───────────────────────┘
                        ▼
┌───────────────────────────────────────────────┐
│  AIEvolutionEngine                             │
│  1. 构建 Prompt (技能 + 偏好 + 历史 + 环境)    │
│  2. 调用 AI 模型                               │
│  3. 解析结构化建议                             │
└───────────────────────┬───────────────────────┘
                        ▼
┌───────────────────────────────────────────────┐
│  应用优化                                      │
│  • 高置信度: 自动应用                          │
│  • 低置信度: 显示供用户确认                    │
└───────────────────────────────────────────────┘
```

### 实施状态

| Phase | 内容 | 状态 |
|-------|------|------|
| Phase 1 | AI SDK 依赖 + ModelConfigLoader | ✅ 完成 |
| Phase 2 | Prompt 模板 + AIEvolutionEngine | ✅ 完成 |
| Phase 3 | 流式输出 + 集成测试 | ✅ 完成 |

### 模型配置

支持自定义 API 端点（如阿里云 DashScope）：

```json
// ~/.claude/settings.json
{
  "env": {
    "ANTHROPIC_AUTH_TOKEN": "sk-xxx",
    "ANTHROPIC_BASE_URL": "https://coding.dashscope.aliyuncs.com/apps/anthropic",
    "ANTHROPIC_DEFAULT_SONNET_MODEL": "glm-5"
  }
}
```

---

## 4. 改进路线

### 当前状态

| 维度 | AI Agent | 硬编码 |
|------|----------|--------|
| 语义理解 | ✅ 深度理解 | ❌ 关键词匹配 |
| 自适应 | ✅ 自动适应 | ❌ 需手动更新 |
| 多语言 | ✅ 自动处理 | ⚠️ 需预设 |
| 延迟 | ⚠️ 秒级 | ✅ 毫秒级 |
| 离线 | ❌ 需网络 | ✅ 可离线 |

### 优先改进模块

| 优先级 | 模块 | 改进方案 |
|--------|------|----------|
| 高 | SessionAnalyzer | AI 语义分析替代关键词匹配 |
| 高 | RecommendationEngine | AI 功能匹配替代字符串相似度 |
| 高 | WorkspaceAnalyzer | AI 分析 package.json |
| 中 | Security | 动态规则检测 |
| 中 | Evaluator | AI 生成评估报告 |
| 低 | Telemetry | 保持硬编码（纯数学计算） |

---

## 附录

### A. 技能来源

| 来源 | 路径 | 说明 |
|------|------|------|
| Database | `~/.skill-adapter/evolution.jsonl` | 已导入/进化的技能 |
| OpenClaw | `~/.openclaw/skills/` | OpenClaw 安装的技能 |
| Claude Code | `~/.claude/plugins/cache/*/skills/` | Claude Code 插件技能 |

### B. Prompt 模板结构

```
Input:
  - skillContent: 技能原始内容
  - soulPreferences: 用户偏好 (SOUL.md)
  - memoryRules: 历史经验 (MEMORY.md)
  - workspace: 工作区环境

Output (JSON):
  {
    "recommendations": [
      {
        "type": "env_adaptation" | "style_injection" | "error_avoidance",
        "priority": "high" | "medium" | "low",
        "suggestedContent": "可直接应用的内容",
        "confidence": 0.0-1.0
      }
    ]
  }
```

### C. 相关链接

- **ClawHub**: https://clawhub.ai/skills
- **skills.sh**: https://skills.sh
- **EvoMap**: https://evomap.ai