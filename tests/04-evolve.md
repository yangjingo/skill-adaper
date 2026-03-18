# sa evolve - 进化分析

## 功能概述

`sa evolve` 是 Skill-Adapter 的核心命令，用于：
- 查找并自动导入技能（如需要）
- 分析技能与当前工作环境的适配度
- 生成优化建议
- 自动应用可自动化的优化
- 追踪进化历史

---

## 命令格式

```bash
sa evolve [skillName] [options]
```

## 参数

| 参数 | 说明 |
|------|------|
| `skillName` | 技能名称（可选）。不提供时显示所有技能概览 |

## 选项

| 选项 | 说明 | 默认值 |
|------|------|--------|
| `--dry-run` | 预览改动，不实际应用 | false |
| `-v, --verbose` | 显示详细输出 | false |
| `--debug` | 显示完整技术输出 | false |
| `-l, --last <n>` | 分析最近 N 个会话 | 10 |
| `--apply` | 应用优化建议 | false |
| `--detail` | 显示详细分析 | false |
| `--quick` | 跳过智能建议，直接开始进化 | false |

---

## 进化分析流程

```
┌─────────────────────────────────────────────────────────────────┐
│                      进化分析 7 步骤                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Step 0: 多源技能发现                                           │
│  ├── Database → OpenClaw → Claude Code → "Not Found"           │
│  └── 自动导入未在数据库的 OpenClaw 技能                          │
│                                                                 │
│  Step 1: 工作环境分析                                           │
│  ├── 检测编程语言 (TypeScript, Python, etc.)                    │
│  ├── 检测框架 (React, Vue, etc.)                                │
│  ├── 检测包管理器 (npm, pnpm, yarn)                             │
│  └── 检测构建工具 (webpack, vite, etc.)                         │
│                                                                 │
│  Step 2: 技能内容分析                                           │
│  ├── 内容大小、行数、章节                                        │
│  ├── 代码块数量                                                 │
│  └── 引用链接数量                                               │
│                                                                 │
│  Step 2.5: 智能建议 (Smart Recommendations) ✨ NEW              │
│  ├── 💡 AI 进化建议 (一行简洁建议)                               │
│  ├── 🎯 相关技能推荐 (skills.sh API)                            │
│  └── 使用 --quick 跳过此步骤                                    │
│                                                                 │
│  Step 3: 上下文加载                                             │
│  ├── SOUL.md 个性注入                                           │
│  └── MEMORY.md 历史学习                                         │
│                                                                 │
│  Step 4: 环境检测                                               │
│  ├── OpenClaw 技能目录                                          │
│  ├── Claude Code 配置                                           │
│  └── 可用技能数量                                               │
│                                                                 │
│  Step 5: 执行优化                                               │
│  ├── 🔴 高优先级 - 需要立即处理                                  │
│  ├── 🟡 中优先级 - 建议处理                                      │
│  └── 🟢 低优先级 - 可选处理                                      │
│                                                                 │
│  Step 6: 保存变更                                               │
│                                                                 │
│  Step 7: 记录进化                                               │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 使用示例

### 1. 查看所有技能状态

```bash
sa evolve
```

**输出示例：**
```
🔄 Running evolution analysis...

Analyzing 2 skill(s)...

  • docker-env: v1.0.0 (2 evolution(s))
    Source: skills.sh
  • frontend-design: v1.2.0 (5 evolution(s))
    Source: clawhub.com

📍 Workspace Analysis
────────────────────────────────────────
Languages: TypeScript, JavaScript
Frameworks: React
Package Manager: pnpm

📌 下一步操作:
   sa evolve <skill-name>     # 分析具体技能
   sa import <skill-name>     # 导入新技能
```

### 2. 分析特定技能（默认模式 - 含智能建议）

```bash
sa evolve docker-env
```

**输出示例：**
```
✔ Found: docker-env (OpenClaw)

📄 Skill: docker-env
   ├─ Source: OpenClaw
   ├─ Path: ~/.openclaw/skills/docker-env
   └─ Size: 7152 bytes

──────────────────────────────────────────────────
💡 Smart Recommendations
──────────────────────────────────────────────────
   (Use --quick to skip this step)
🔍 Analyzing skill... ✓

   💡 Suggestion:
      → Add TypeScript type definitions for Docker commands

   🎯 Related skills:
      • docker-compose-best (1234 downloads)
      • container-security (567 downloads)

──────────────────────────────────────────────────

🚀 Starting evolution...
[AI 分析流式输出...]

✅ docker-env 已进化 (1.0.0 → 1.1.0)
📝 改动: 环境适配 + 交互风格注入
```

### 3. 跳过智能建议 (--quick)

```bash
sa evolve docker-env --quick
```

**输出示例：**
```
✔ Found: docker-env (OpenClaw)

🚀 Starting evolution...
[直接开始 AI 分析，不显示建议...]

✅ docker-env 已进化 (1.0.0 → 1.1.0)
```

### 4. 预览改动 (--dry-run)

```bash
sa evolve docker-env --dry-run
```

**输出示例：**
```
✔ 找到: docker-env (OpenClaw)
✔ 工作区: TypeScript, React, pnpm

📋 预览改动 (--dry-run):
   + 添加环境适配提示 (TypeScript 工作区)
   + 注入交互风格 (直接简洁)
   + 添加错误规避记录 (3 条)

确认应用? (y/N)
```

### 5. 详细模式 (-v/--verbose)

```bash
sa evolve docker-env -v
```

**输出示例：**
```
✔ 找到: docker-env (OpenClaw)
✔ 工作区: TypeScript, React, pnpm
✔ 分析完成

✅ docker-env 已进化 (1.0.0 → 1.1.0)
📝 改动详情:
   • 环境适配: TypeScript 工作区提示
   • 风格注入: 直接简洁风格
📊 统计: 技能大小 15.2 KB, 历史版本 3 个
```

### 6. 技术模式 (--debug)

```bash
sa evolve docker-env --debug
```

**输出示例（完整技术输出）：**
```
🔄 Running evolution analysis...

📦 Analyzing: docker-env
   Version: 1.0.0
   Records: 2

📊 Step 1: Workspace Analysis
──────────────────────────────────────────────────────────────────
   Root: C:\Users\xxx\projects\my-app
   Languages: TypeScript, JavaScript
   Frameworks: React
   Package Manager: pnpm
   Build Tools: Vite

📋 Step 2: Skill Content Analysis
──────────────────────────────────────────────────────────────────
   Content Size: 15.2 KB
   Lines: 342
   Sections: 8
   Code Blocks: 12
   References: 5

🔧 Step 3: Environment Analysis
──────────────────────────────────────────────────────────────────
   OpenClaw Skills: C:\Users\xxx\.openclaw\skills
   Available Skills: 5
   Claude Code: C:\Users\xxx\.claude
   Commands: 3
   Skills: 2

💡 Step 4: Optimization Suggestions
──────────────────────────────────────────────────────────────────

   1. 🔴 [Package Manager]
      建议: Update commands to use pnpm instead of npm
      原因: Workspace uses pnpm as package manager
      类型: ⚙️ 可自动应用

   ...

📌 下一步操作:
   sa evolve docker-env --apply   # 自动应用 1 个可自动化的优化
   sa info docker-env            # 查看技能详情
   sa log docker-env             # 查看版本历史
```

### 7. 应用优化

```bash
sa evolve docker-env --apply
```

**输出示例：**
```
⚙️  Step 5: 应用优化
──────────────────────────────────────────────────────────────────
   应用: Update commands to use pnpm instead of npm...
      ✅ 已更新包管理器命令为 pnpm

   ✅ 已应用 1 个优化
   📦 版本: 1.1.0
   💾 备份: SKILL.md.backup

📌 下一步操作:
   sa info docker-env        # 查看更新后的技能信息
   sa log docker-env         # 查看版本历史
```

---

## 优化建议分类

### 🔴 高优先级

| 类别 | 示例建议 | 自动化 |
|------|----------|--------|
| **Package Manager** | 替换 npm 为 pnpm/yarn | ⚙️ 是 |
| **Path Localization** | 替换绝对路径为 `${HOME}` | ⚙️ 是 |
| **Security** | 配置敏感凭据 | 📝 否 |
| **Environment Variables** | 设置环境变量 | 📝 否 |

### 🟡 中优先级

| 类别 | 示例建议 | 自动化 |
|------|----------|--------|
| **Framework Integration** | 添加框架最佳实践 | 📝 否 |
| **Docker Integration** | 验证 Docker 环境 | 📝 否 |
| **Python Environment** | 配置虚拟环境 | 📝 否 |
| **Network Access** | 验证外部服务连接 | 📝 否 |

### 🟢 低优先级

| 类别 | 示例建议 | 自动化 |
|------|----------|--------|
| **Testing** | 添加测试用例 | 📝 否 |
| **Code Examples** | 添加代码示例 | 📝 否 |
| **Shell Compatibility** | 验证 Shell 脚本兼容性 | 📝 否 |

---

## 版本号生成规则

进化后自动生成语义化版本号：

| 变更类型 | 版本更新 | 示例 |
|----------|----------|------|
| **Breaking Change** | Major | `1.0.0` → `2.0.0` |
| **New Feature** | Minor | `1.0.0` → `1.1.0` |
| **Bug Fix / Optimization** | Patch | `1.0.0` → `1.0.1` |
| **Security Fix** | Patch + 标签 | `1.0.0` → `v1.0.1-security-2` |
| **Cost Reduction** | Patch + 标签 | `v1.2.0-cost-15p` |

---

## 输出模式配置

使用 `sa config` 设置默认输出级别：

```bash
sa config set outputLevel simple   # 简洁模式 (默认)
sa config set outputLevel verbose  # 详细模式
sa config set outputLevel debug    # 技术模式
```

---

## AI 驱动的进化

### 核心特性

从 v2.0 开始，进化系统使用 **AI 模型驱动**，而非硬编码规则：

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                     AI-DRIVEN EVOLUTION FLOW                                 │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│   sa evolve <skill>                                                          │
│        │                                                                     │
│        ▼                                                                     │
│   ┌─────────────────────────────────────────────┐                           │
│   │ Step 1: 静态分析                             │                           │
│   │ • 技能内容解析 (sections, code blocks)       │                           │
│   │ • 引用链接检测                               │                           │
│   └────────────────────┬────────────────────────┘                           │
│                        │                                                     │
│                        ▼                                                     │
│   ┌─────────────────────────────────────────────┐                           │
│   │ Step 2: 动态上下文加载                       │                           │
│   │ • SOUL.md 用户偏好                           │                           │
│   │ • MEMORY.md 历史学习                         │                           │
│   │ • 工作区环境检测                             │                           │
│   │ • Session 模式分析                           │                           │
│   └────────────────────┬────────────────────────┘                           │
│                        │                                                     │
│                        ▼                                                     │
│   ┌─────────────────────────────────────────────┐                           │
│   │ Step 3: AI 推荐生成 (流式输出)               │                           │
│   │ • 实时显示 AI thinking 过程                  │                           │
│   │ • 结构化 JSON 建议输出                       │                           │
│   │ • 包含具体可应用的内容                       │                           │
│   └────────────────────┬────────────────────────┘                           │
│                        │                                                     │
│                        ▼                                                     │
│   ┌─────────────────────────────────────────────┐                           │
│   │ Step 4: 应用优化                             │                           │
│   │ • 高置信度: 自动应用                         │                           │
│   │ • 低置信度: 供用户审查                       │                           │
│   └─────────────────────────────────────────────┘                           │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘
```

### 测试脚本

#### 1. 基础测试 (非流式)

```bash
npx ts-node tests/test-evolve-real.ts <skill-name>
# 示例
npx ts-node tests/test-evolve-real.ts docker-env
npx ts-node tests/test-evolve-real.ts modelscope-cli
```

#### 2. 流式可视化测试

```bash
npx ts-node tests/test-evolve-streaming.ts <skill-name>
# 示例
npx ts-node tests/test-evolve-streaming.ts docker-env
```

**输出示例：**
```
╔══════════════════════════════════════════════════════════════════════════════╗
║              🧬 AI Evolution - Streaming Visualization Test                  ║
╚══════════════════════════════════════════════════════════════════════════════╝

✔ AI model configured
   ├─ Model: glm-5
   ├─ Endpoint: https://coding.dashscope.aliyuncs.com/apps/anthropic
   └─ API Key: sk-sp-7d3b...ff89

✔ Skill loaded: docker-env (7152 bytes)

✔ Static analysis complete
   ├─ Sections: 20
   ├─ Code blocks: 19
   └─ Links: 8

✔ Dynamic context loaded
   ├─ Workspace info: TypeScript, JavaScript
   └─ Session patterns: 2 patterns

────────────────────────────────────────────────────────────
🤖 AI Evolution Process
────────────────────────────────────────────────────────────

💭 AI Thinking (streaming):
────────────────────────────────────────────────
1. **分析需求：**
    *   **角色：** 技能优化专家。
    *   **输入技能：** `docker-env`...
[实时流式输出 AI 思考过程]
────────────────────────────────────────────────

✅ Thinking complete!

✔ Generated 3 recommendation(s)

════════════════════════════════════════════════════════════
📋 EVOLUTION RECOMMENDATIONS
════════════════════════════════════════════════════════════

🔴 [HIGH] Recommendation #1
──────────────────────────────────────────────────
   Title: Add npm scripts integration for Docker commands
   Type: env_adaptation
   Confidence: 90%
   ...
```

### AI 推荐类型

| 类型 | 说明 | 示例 |
|------|------|------|
| `env_adaptation` | 环境适配 | 添加 TypeScript 封装示例 |
| `style_injection` | 风格注入 | 按用户偏好调整输出格式 |
| `error_avoidance` | 错误规避 | 添加 .gitignore 规则 |
| `best_practice` | 最佳实践 | 启用浏览器工具进行实时搜索 |

### Agent Loop 核心原则

> ⚠️ **关键**: 进化的技能必须包含浏览器搜索能力！

AI 生成的建议会优先考虑：
1. **浏览器工具集成**: 确保技能可以使用 WebSearch/WebFetch 获取实时信息
2. **动态信息获取**: 不依赖静态链接，而是动态搜索最新版本
3. **ID 校验机制**: 使用浏览器验证 API 或模型是否存在

详见: `docs/EVOLUTION_REFACTORING.md` → Agent Loop 核心原则

---

## 测试步骤

1. **查看所有技能状态**
   ```bash
   sa evolve
   ```

2. **分析特定技能 - 含智能建议**
   ```bash
   # 默认显示 AI 建议和相关技能推荐
   sa evolve <skill-name>

   # 预期输出：
   # ──────────────────────────────────────────────────
   # 💡 Smart Recommendations
   # ──────────────────────────────────────────────────
   #    (Use --quick to skip this step)
   # 🔍 Analyzing skill... ✓
   #
   #    💡 Suggestion:
   #       → [AI 生成的建议]
   #
   #    🎯 Related skills:
   #       • [skill-name] (xxx downloads)
   #       • [skill-name] (xxx downloads)
   #
   # ──────────────────────────────────────────────────
   ```

3. **跳过智能建议直接进化**
   ```bash
   sa evolve <skill-name> --quick
   # 预期: 不显示 Smart Recommendations，直接开始进化
   ```

4. **测试 AI 进化 (脚本)**
   ```bash
   # 基础测试
   npx ts-node tests/test-evolve-real.ts <skill-name>

   # 流式可视化测试
   npx ts-node tests/test-evolve-streaming.ts <skill-name>
   ```

5. **预览改动**
   ```bash
   sa evolve <skill-name> --dry-run
   ```

6. **应用可自动化的优化**
   ```bash
   sa evolve <skill-name> --apply
   ```

7. **验证优化结果**
   ```bash
   sa log <skill-name>
   ```

---

## Smart Recommendations 测试清单

### 功能验证

| 检查项 | 预期结果 | 通过 |
|--------|----------|------|
| 显示 AI 建议 | 一行简洁的改进建议 | ☐ |
| 显示相关技能 | 最多 2 个相关技能 + 下载量 | ☐ |
| `--quick` 跳过建议 | 不显示 Smart Recommendations | ☐ |
| API 失败降级 | 显示默认建议，不阻塞流程 | ☐ |

### 测试命令

```bash
# 1. 测试默认显示建议
sa evolve <skill-name>

# 2. 测试跳过建议
sa evolve <skill-name> --quick

# 3. 测试无 AI 配置时的降级
# (临时移除配置或使用未配置模型的环境)
sa evolve <skill-name>
# 预期: 显示默认建议 "Consider adding more examples and error handling"
```

### 性能要求

| 指标 | 目标 |
|------|------|
| AI 建议 + skills.sh 并行获取 | < 3 秒 |
| 单独 skills.sh 查询 | < 1 秒 |
| `--quick` 无额外延迟 | 0 秒 |

---

## 下一步

进化分析后，可以使用 `sa scan` 进行安全扫描，或使用 `sa share` 分享技能。