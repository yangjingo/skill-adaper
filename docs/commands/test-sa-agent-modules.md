# Security 与 Evaluator SA Agent 模块测试文档

## 概述

测试流程遵循 `sa evolve` 命令模式:
1. **输入技能路径** → 执行安全扫描 → 显示结果 + Next Steps
2. **Next Steps** → 执行评估器 → 显示进化效果分析

## 测试环境准备

### 1. 确保编译成功
```bash
cd C:\Users\y00842095\Desktop\job\skill-adapter
npm run build
```

### 2. 检查 SA Agent 模型配置
确保已配置 SA Agent 模型（以下任一方式）：
- `~/.claude/settings.json` 中配置 `ANTHROPIC_AUTH_TOKEN`
- 或环境变量 `ANTHROPIC_AUTH_TOKEN`

---

## 测试流程

### 场景 1: Security SA Agent 扫描

#### 测试命令
```bash
# 使用技能名称（自动查找 OpenClaw 技能）
node tests/test-security-sa-agent.js docker-helper

# 使用完整路径
node tests/test-security-sa-agent.js ~/.openclaw/skills/docker-helper/SKILL.md

# 使用目录路径
node tests/test-security-sa-agent.js ./skills/my-skill
```

#### 预期输出
```
╔══════════════════════════════════════════════════════════╗
║    Security SA Agent Scan - Skill Security Analyzer      ║
╚══════════════════════════════════════════════════════════╝

✅ Found skill: docker-helper
   Path: C:\Users\...\.openclaw\skills\docker-helper\SKILL.md

📋 SA Agent Configuration:
   ├─ Model: claude-sonnet-4-6
   └─ Status: ✅ Available

══════════════════════════════════════════════════════════
🔍 SECURITY SCAN IN PROGRESS
══════════════════════════════════════════════════════════

📋 正在执行基础安全扫描...
✔ 基础扫描完成

📋 SA Agent 深度分析中...

💭 SA Agent 分析中:

────────────────────────────────────────────────────────
(SA Agent 流式输出的分析内容，不带前缀)
...
✅ SA Agent 分析完成!

══════════════════════════════════════════════════════════
📊 SECURITY SCAN RESULTS
══════════════════════════════════════════════════════════

技能名称: docker-helper
扫描时间: 2026-03-18T...
整体结果: ✅ 通过 / ❌ 未通过

风险等级: LOW / MEDIUM / HIGH
风险评分: 28/100
风险摘要: ...

--- 发现的问题 ---
敏感信息: X 个
  - [HIGH] api_key: sk-***...

危险操作: X 个
  - [MEDIUM] system_command: ...

权限问题: X 个
  - [LOW] missing_constraint: ...

--- SA Agent 洞察 ---
(SA Agent 生成的深度洞察)

--- 安全指标 (用于评估) ---
总问题数: X
高危问题: X
中危问题: X
低危问题: X
风险评分: X

══════════════════════════════════════════════════════════
📌 Next Steps
══════════════════════════════════════════════════════════

   # Run evaluator with this skill to compare evolution
   node tests/test-evaluator-sa-agent.js docker-helper

   # Or with full metrics:
   node tests/test-evaluator-sa-agent.js docker-helper --security
```

---

### 场景 2: Evaluator SA Agent 评估

#### 测试命令
```bash
# 基础评估（仅性能指标）
node tests/test-evaluator-sa-agent.js docker-helper

# 包含安全指标的评估
node tests/test-evaluator-sa-agent.js docker-helper --security
```

#### 预期输出
```
╔══════════════════════════════════════════════════════════╗
║    Evaluator SA Agent - Evolution Effect Analysis        ║
╚══════════════════════════════════════════════════════════╝

📋 SA Agent Configuration:
   └─ Status: ✅ Available

══════════════════════════════════════════════════════════
📊 PREPARING METRICS
══════════════════════════════════════════════════════════

基线版本 (v1.0.0):
   User Rounds: 5.2
   Tool Calls: 12.5
   Tokens: 23.5k

进化版本 (v1.1.0):
   User Rounds: 3.8
   Tool Calls: 9.2
   Tokens: 18.5k

🔍 Loading security metrics...
   Baseline Issues: 15 → Evolved: 6
   Baseline Risk: 72 → Evolved: 28

══════════════════════════════════════════════════════════
🤖 SA AGENT EVALUATION IN PROGRESS
══════════════════════════════════════════════════════════

📋 正在计算指标变化...
✔ 指标计算完成

📋 SA Agent 智能分析中...

💭 SA Agent 分析中:

────────────────────────────────────────────────────────
(SA Agent 流式输出的分析内容，不带前缀)
...
✅ SA Agent 分析完成!

══════════════════════════════════════════════════════════
📊 EVALUATION RESULTS
══════════════════════════════════════════════════════════

技能名称: docker-helper
版本: 1.0.0 → 1.1.0
整体状态: ✅ IMPROVED
评估时间: 2026-03-18T...

--- 指标对比 ---
| 指标 | 基线 | 进化后 | 变化 | 状态 |
|------|------|--------|------|------|
| Avg User Rounds | 5.2 | 3.8 | -26.9% | ✅ |
| Avg Tool Calls | 12.5 | 9.2 | -26.4% | ✅ |
| Total Tokens | 23.5k | 18.5k | -21.3% | ✅ |
| Context Load | 12.0k | 11.0k | -8.3% | ➖ |
| Security Issues | 15.0 | 6.0 | -60.0% | ✅ |
| High Severity Issues | 5.0 | 1.0 | -80.0% | ✅ |
| Security Risk Score | 72.0 | 28.0 | -61.1% | ✅ |

--- 结论 ---
(SA Agent 生成的智能结论)

--- SA Agent 洞察 ---
(SA Agent 生成的深度洞察)

--- SA Agent 建议 ---
1. (SA Agent 生成的建议)
2. ...

--- 指标分析 ---

**Avg User Rounds**:
(该指标的深度分析)

══════════════════════════════════════════════════════════
📌 Next Steps
══════════════════════════════════════════════════════════

   # View evolution history
   sa log docker-helper

   # Export skill
   sa export docker-helper

   # Apply improvements
   sa evolve docker-helper --apply
```

---

## 测试检查清单

| 测试项 | 预期结果 | 实际结果 |
|--------|----------|----------|
| Security 找到技能 | 显示技能路径 | ☐ |
| Security 基础扫描 | 正确检测敏感信息和危险操作 | ☐ |
| Security SA Agent 流式输出 | 不带前缀，正确换行 | ☐ |
| Security SA Agent 洞察 | 输出有价值的 SA Agent 洞察 | ☐ |
| Security 指标提取 | 正确计算各项安全指标 | ☐ |
| Security Next Steps | 显示 evaluator 测试命令 | ☐ |
| Evaluator 指标准备 | 显示基线和进化版本指标 | ☐ |
| Evaluator SA Agent 流式输出 | 不带前缀，正确换行 | ☐ |
| Evaluator 安全指标 | 正确展示安全指标变化 | ☐ |
| Evaluator SA Agent 结论 | 生成智能结论而非模板 | ☐ |
| Evaluator Next Steps | 显示相关 CLI 命令 | ☐ |

---

## 完整测试流程

```bash
# 1. 编译项目
npm run build

# 2. 运行安全扫描（找到技能 → 扫描 → 显示结果 + Next Steps）
node tests/test-security-sa-agent.js docker-helper

# 3. 按照 Next Steps 提示运行评估
node tests/test-evaluator-sa-agent.js docker-helper --security

# 4. 验证 SA Agent 流式输出是否正常
#    - 应看到 SA Agent 思考和输出实时输出
#    - 应看到 SA Agent 生成的洞察和建议
```

---

## SA Agent 不可用时的回退测试

```bash
# 临时取消 SA Agent 配置
unset ANTHROPIC_AUTH_TOKEN

# 运行测试，应正常返回基础结果
node tests/test-security-sa-agent.js docker-helper
node tests/test-evaluator-sa-agent.js docker-helper

# 结果应显示：
# SA Agent Status: ❌ Not configured
# 然后正常返回基础扫描/评估结果
```