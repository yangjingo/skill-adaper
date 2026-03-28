# 外部资源

## 技能平台

| 平台 | URL | 说明 |
|------|-----|------|
| **ClawHub** | https://clawhub.ai/ | 开源技能生态系统 |
| **skills.sh** | https://skills.sh | Vercel 官方技能目录 |

> Note: current sa import uses recommendation mode for remote sources and no longer depends on skills at runtime.

## 官方 CLI

```bash
# skills.sh
npx skills add vercel-labs/agent-skills
npx skills add anthropics/skills/skill-creator

# ClawHub
npx clawhub@latest install self-improving-agent
```

---

## 文档组织原则

> 适用于任何项目的文档设计指南

### 核心原则

| 原则 | 说明 |
|------|------|
| **单一入口** | 用户只需记住一个起点 (README.md) |
| **渐进披露** | 从概览到细节，按需深入 |
| **场景优先** | 文档从真实用户工作流出发 |
| **保持简单** | 能合并就不拆分，文件 < 30 个保持扁平结构 |

### 三层结构

```
Layer 1: Quick Reference (1 页)
    → 快速查找命令/概念

Layer 2: Scenarios/Tutorial
    → 按工作流学习使用

Layer 3: Reference
    → 按需深入查阅细节
```

### 用户画像

| 画像 | 需求 | 入口文档 |
|------|------|---------|
| 新手 | 不知道从哪开始 | README → 快速开始 |
| 测试人员 | 按工作流执行测试 | Scenarios 文档 |
| 开发者 | 查阅具体参数/API | Reference 文档 |

### 命名规范

- 使用 **kebab-case**: `user-guide.md` (不是 `USER_GUIDE.md`)
- 数字前缀排序: `01-init.md`, `02-import.md`
- 一个概念一个文件，避免碎片化
