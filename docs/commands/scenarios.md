# Skill-Adapter Test Scenarios

> Start here for testing - these scenarios represent real user workflows.
>
> **New? Read [README.md](./README.md) first for navigation guide.**

---

## Scenario Overview

| Scenario | Goal | Commands | Duration |
|----------|------|----------|----------|
| [Scenario 1](#场景-1-探索现有技能) | Explore OpenClaw/Claude Code skills | `sa info` | 2 min |
| [Scenario 2](#场景-2-发现并导入热门技能) | Discover and import hot skills | `sa import` | 5 min |
| [Scenario 3](#场景-3-进化分析与优化) | Evolution analysis and optimization | `sa evolve`, `sa summary`, `sa log` | 10 min |
| [Scenario 4](#场景-4-安全审查) | Security scan | `sa scan` | 3 min |
| [Scenario 5](#场景-5-导出与分享) | Export ZIP and share | `sa export`, `sa share` | 5 min |
| [**Scenario 6**](#场景-6-完整工作流) | **Complete skill lifecycle** | All commands | 20 min |

---

## 场景 1: 探索现有技能

### 目标
查看本机 OpenClaw 和 Claude Code 已有的技能。

### 前置条件
- 已安装 OpenClaw 或 Claude Code
- 已有本地技能

### 测试步骤

```bash
# Step 1: 初始化配置（可选）
sa init --show

# Step 2: 查看所有平台的技能
sa info

# Step 3: 只查看 OpenClaw 技能
sa info -p openclaw

# Step 4: 只查看 Claude Code 技能
sa info -p claudecode

# Step 5: 查看特定技能详情
sa info <skill-name>
```

### 预期输出

```
📋 Available Skills

── OpenClaw Skills ──
  📦 code-assistant
  📦 test-generator

── Claude Code Commands ──
  📦 commit
  📦 review-pr

── Claude Code Skills ──
  📦 frontend-design
  📦 skill-creator
```

### 验证点
- [ ] 显示所有平台的技能
- [ ] OpenClaw 技能正确列出
- [ ] Claude Code 技能正确列出

---

## 场景 2: 发现并导入热门技能

### 目标
从 skills.sh 或 clawhub.com 发现并导入一个热门技能。

### 前置条件
- 网络连接正常
- 可访问 skills.sh 和 clawhub.com

### 测试步骤

```bash
# Step 1: 查看热门技能
sa import

# Step 2: 选择一个技能导入
sa import <热门技能名称>

# Step 3: 验证导入结果
sa info

# Step 4: 查看导入的技能详情
sa info <导入的技能名称>
```

### 预期输出

**Step 1:**
```
🔥 Discovering hot skills from skills.sh and clawhub.com...

Rank | Downloads | Source      | Skill
-----------------------------------------------------------------
#1   | 15234     │ skills.sh │  frontend-design
#2   | 12856     │ clawhub.com │  code-review
...
```

**Step 2:**
```
📥 Getting skill from: frontend-design

🔍 Searching from skills.sh and clawhub.com...
📥 Found: frontend-design from skills.sh

🔒 Running security scan...
  ✅ Security scan passed

✅ 安装成功!
   技能: frontend-design (v1.0.0)
   来源: skills.sh
```

### 验证点
- [ ] 热门技能列表正确显示
- [ ] 技能成功导入
- [ ] 安全扫描自动执行
- [ ] 技能出现在已导入列表

---

## 场景 3: 进化分析与优化

### 目标
分析技能与当前工作环境的适配度，并应用优化。

### 前置条件
- 已导入至少一个技能
- 在一个项目目录中运行

### 测试步骤

```bash
# Step 1: 分析特定技能
sa evolve <skill-name>

# Step 2: 查看详细分析
sa evolve <skill-name> --verbose

# Step 3: 应用可自动化的优化
sa evolve <skill-name> --apply

# Step 4: 查看进化指标对比
sa summary <skill-name>

# Step 5: 查看详细版本历史
sa log <skill-name>
```

### 预期输出

**Step 2:**
```
🔄 Running evolution analysis...

📦 Analyzing: <skill-name>
   Version: 1.0.0

📊 Step 1: Workspace Analysis
──────────────────────────────────────────────────────────────────
   Root: C:\Users\xxx\projects\my-app
   Languages: TypeScript
   Frameworks: React
   Package Manager: pnpm

💡 Step 4: Optimization Suggestions
──────────────────────────────────────────────────────────────────

   1. 🔴 [Package Manager]
      建议: Update commands to use pnpm instead of npm
      类型: ⚙️ 可自动应用

   2. 🟡 [Framework Integration]
      建议: Include React best practices
      类型: 📝 需手动处理
```

**Step 4:**
```
⚙️  Step 5: 应用优化
──────────────────────────────────────────────────────────────────
   应用: Update commands to use pnpm instead of npm...
      ✅ 已更新包管理器命令为 pnpm

   ✅ 已应用 1 个优化
   📦 版本: 1.1.0
```

### 预期输出

**Step 5:**
```
📊 Evolution Summary: <skill-name>

┌─────────────────────┬─────────────────┬─────────────────┬──────────┬──────────────────┐
│ Metric              │ Baseline (v1.0.0)│ Evolved (v1.1.0)│ Change   │ Status           │
├─────────────────────┼─────────────────┼─────────────────┼──────────┼──────────────────┤
│ Optimizations       │               0 │               1 │    +100% │ ✅ Enhanced       │
│ Applied Patches     │               0 │               1 │    +100% │ ✅ Enhanced       │
│ Style Rules         │               0 │               0 │        - │ ➖ Stable         │
│ Error Avoidances    │               0 │               0 │        - │ ➖ Stable         │
│ Env Adaptations     │               0 │               1 │    +100% │ ✅ Enhanced       │
└─────────────────────┴─────────────────┴─────────────────┴──────────┴──────────────────┘

📁 Workspace: TypeScript | pnpm

📝 Conclusion:
   ✅ Evolution applied: 1 environment adaptation.
   📈 Version progressed from v1.0.0 to v1.1.0 across 1 evolution(s).

📌 Next Steps:
   sa log <skill-name>          # View detailed changes
   sa share <skill-name>        # Export/publish skill
   sa export <skill-name>       # Export to file
```

### 验证点
- [ ] 工作环境正确分析
- [ ] 优化建议合理
- [ ] 可自动化的优化成功应用
- [ ] 版本号正确更新
- [ ] 进化指标表格正确显示
- [ ] 版本历史正确记录

---

## 场景 4: 安全审查

### 目标
对技能进行安全扫描，确保安全后分享。

### 前置条件
- 已导入技能或有本地技能文件

### 测试步骤

```bash
# Step 1: 查看可扫描的技能
sa scan

# Step 2: 扫描特定技能
sa scan <skill-name>

# Step 3: 扫描本地文件
sa scan ./path/to/SKILL.md

# Step 4: 获取 JSON 格式报告
sa scan <skill-name> -f json
```

### 预期输出

```
🔒 扫描技能: <skill-name>

═══════════════════════════════════════════════════════════════════
                        SECURITY SCAN REPORT
═══════════════════════════════════════════════════════════════════

Status: ✅ PASSED
Risk Level: LOW

Total Issues: 0

───────────────────────────────────────────────────────────────────
CHECKS PERFORMED
───────────────────────────────────────────────────────────────────
✅ Dangerous Commands: None found
✅ Network Operations: Safe
✅ Privilege Escalation: None detected
✅ Data Exfiltration: No risks found
```

### 验证点
- [ ] 扫描报告正确生成
- [ ] 安全问题正确检测
- [ ] JSON 格式输出正确

---

## 场景 5: 导出与分享

### 目标
导出技能为 ZIP 包，然后分享到仓库。

### 前置条件
- 已有进化后的技能
- Git 凭据已配置（用于 PR）

### 测试步骤

```bash
# Step 1: 导出所有技能
sa export

# Step 2: 导出特定技能
sa export <skill-name> -o ./backup

# Step 3: 查看导出的 ZIP 内容
# (手动解压查看)

# Step 4: 分享技能 - 导出 ZIP
sa share <skill-name> --zip

# Step 5: 分享技能 - 创建 PR
sa share <skill-name> --pr

# Step 6: 分享技能 - 发布到注册表
sa share <skill-name> --registry http://localhost:3000
```

### 预期输出

**Step 4:**
```
📤 Sharing skill: <skill-name>

🔒 Running security scan...
  ✅ Security scan passed

📦 Exporting to ./<skill-name>-v1.1.0.zip...
✅ Export complete!
   File: ./<skill-name>-v1.1.0.zip
```

**Step 5:**
```
🚀 Creating Pull Request to https://github.com/org/skills...

📥 Cloning repository...
🌿 Creating branch: skill/<skill-name>-v1.1.0
📝 Committing changes...
⬆️ Pushing branch...

✅ Branch created and pushed!
   Branch: skill/<skill-name>-v1.1.0
```

### 验证点
- [ ] ZIP 包正确生成
- [ ] ZIP 包内容完整
- [ ] PR 分支正确创建
- [ ] 安全扫描自动执行

---

## 场景 6: 完整工作流

### 目标
执行完整的技能生命周期：发现 → 导入 → 进化 → 审查 → 分享。

### 前置条件
- Skill-Adapter 已安装
- 网络连接正常
- Git 凭据已配置

### 测试步骤

```bash
# ==========================================
# Phase 1: 探索
# ==========================================

# 1.1 查看当前配置
sa init --show

# 1.2 查看所有平台现有技能
sa info

# 1.3 发现热门技能
sa import

# ==========================================
# Phase 2: 导入
# ==========================================

# 2.1 选择一个技能导入
sa import <skill-name>

# 2.2 验证导入
sa info <skill-name>

# ==========================================
# Phase 3: 进化
# ==========================================

# 3.1 分析技能
sa evolve <skill-name>

# 3.2 应用优化
sa evolve <skill-name> --apply

# 3.3 查看进化指标对比
sa summary <skill-name>

# 3.4 查看详细版本历史
sa log <skill-name>

# ==========================================
# Phase 4: 审查
# ==========================================

# 4.1 安全扫描
sa scan <skill-name>

# 4.2 查看详细信息
sa info <skill-name> --security

# ==========================================
# Phase 5: 导出
# ==========================================

# 5.1 导出为 ZIP
sa export <skill-name> -o ./exported

# ==========================================
# Phase 6: 分享
# ==========================================

# 6.1 分享到仓库（创建 PR）
sa share <skill-name> --pr

# 或者发布到注册表
sa share <skill-name> --registry http://localhost:3000
```

### 预期完整流程

```
┌─────────────────────────────────────────────────────────────────┐
│                     完整工作流程执行                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ✅ Phase 1: 探索                                               │
│     ├── sa init --show         # 查看配置                       │
│     ├── sa info                # 查看现有技能                   │
│     └── sa import              # 发现热门技能                   │
│                                                                 │
│  ✅ Phase 2: 导入                                               │
│     ├── sa import <skill>      # 导入技能                       │
│     └── sa info <skill>        # 验证导入                       │
│                                                                 │
│  ✅ Phase 3: 进化                                               │
│     ├── sa evolve <skill>      # 分析优化建议                   │
│     ├── sa evolve <skill> --apply  # 应用优化                   │
│     ├── sa summary <skill>     # 查看进化指标                   │
│     └── sa log <skill>         # 查看详细历史                   │
│                                                                 │
│  ✅ Phase 4: 审查                                               │
│     ├── sa scan <skill>        # 安全扫描                       │
│     └── sa info <skill> --security  # 查看安全状态             │
│                                                                 │
│  ✅ Phase 5: 导出                                               │
│     └── sa export <skill>      # 导出 ZIP                       │
│                                                                 │
│  ✅ Phase 6: 分享                                               │
│     └── sa share <skill> --pr  # 创建 PR                        │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 验证清单
- [ ] Phase 1: 成功查看配置和现有技能
- [ ] Phase 2: 技能成功导入
- [ ] Phase 3: 进化分析完成，优化已应用，指标已查看
- [ ] Phase 4: 安全扫描通过
- [ ] Phase 5: ZIP 包正确导出
- [ ] Phase 6: PR 成功创建或发布成功

---

## 自定义场景

### 场景 A: 结合本地 Workspace 的 Agents.md 和 Soul.md

如果你的项目中有自定义的 Agent 定义或 Soul 文件，可以：

```bash
# 1. 扫描本地的 Agent 文件
sa scan ./AGENTS.md

# 2. 导入本地技能
sa import ./my-custom-skill

# 3. 进化分析（会自动检测工作环境）
sa evolve my-custom-skill

# 4. 分享到仓库
sa share my-custom-skill --pr
```

### 场景 B: 批量操作

```bash
# 导出所有技能
sa export

# 扫描所有已导入技能
sa scan

# 查看所有技能版本历史
sa log
```

---

## 故障排除

### 问题 1: 导入失败

```bash
# 检查网络连接
ping skills.sh

# 使用内置导入
sa import <skill> --no-npx

# 查看详细错误
sa import <skill> --no-npx 2>&1 | more
```

### 问题 2: 进化无效果

```bash
# 确保在项目目录中运行
cd /path/to/your/project

# 查看详细分析
sa evolve <skill> --verbose
```

### 问题 3: PR 创建失败

```bash
# 检查 Git 配置
git config --global user.name
git config --global user.email

# 检查仓库权限
git ls-remote <repo-url>
```

---

## 下一步

根据测试结果，可以：
1. 调整配置以适应不同的工作环境
2. 创建自定义技能
3. 设置私有注册表
