# Skill-Adapter 快速参考卡

> 一页纸快速查阅所有命令和选项。

---

## 命令速查表

| 命令 | 功能 | 常用示例 |
|------|------|----------|
| `sa` | 新手引导 | 直接运行显示帮助和最近技能 |
| `sa list` | 列出所有技能 | `sa list` |
| `sa config` | 管理用户偏好 | `sa config set autoEvolve always` |
| `sa init` | 初始化配置 | `sa init --show` |
| `sa import` | 导入/发现技能 | `sa import`, `sa import docker-env` |
| `sa info` / `sa show` | 查看技能信息 | `sa info docker-env` |
| `sa evolve` | 进化分析 | `sa evolve docker-env --dry-run` |
| `sa summary` | 进化指标对比 | `sa summary docker-env` |
| `sa scan` | 安全扫描 | `sa scan docker-env` |
| `sa log` | 版本历史 | `sa log docker-env --stat` |
| `sa export` | 导出技能 | `sa export -p openclaw` |
| `sa share` | 分享技能 | `sa share docker-env --pr` |

---

## 详细选项

### sa (无参数)
```
sa                                    # 显示新手引导和最近使用的技能
```

### sa init
```
sa init [--repo <url>] [--registry <url>] [--show]
```

### sa config
```
sa config                             # 查看所有配置
sa config list                        # 查看所有配置
sa config get <key>                   # 查看单个配置
sa config set <key> <value>           # 设置配置
sa config reset                       # 重置为默认值
```

### sa import
```
sa import [source] [-n, --name <name>] [--no-scan]
          [-l, --limit <n>] [-p, --platform <p>] [--no-npx]
```

### sa info
```
sa info [skill] [-v, --version <v>] [--security]
        [-p, --platform <p>]
```

### sa evolve
```
sa evolve [skill] [--dry-run] [-v, --verbose] [--debug]
          [-l, --last <n>] [--apply] [--detail] [--quick]
```

### sa scan
```
sa scan [skill|file] [-f, --format <text|json>]
```

### sa summary
```
sa summary <skill>
```

### sa log
```
sa log [skill] [-n, --number <n>] [--oneline] [--stat]
```

### sa export
```
sa export [skill] [-p, --platform <p>] [-o, --output <dir>]
          [-f, --format <zip|json>]
```

### sa share
```
sa share [skill] [-o, --output <path>] [-f, --format <f>]
         [--zip] [--registry <url>] [--pr] [--repo <url>]
         [--branch <name>] [--yes]
```

---

## evolve 选项详解

| 选项 | 说明 |
|------|------|
| `--dry-run` | 预览改动，不实际应用 |
| `-v, --verbose` | 显示详细输出 |
| `--debug` | 显示完整技术输出 |
| `-l, --last <n>` | 分析最近 N 个会话 |
| `--apply` | 应用优化建议 |
| `--detail` | 显示详细分析 |
| `--quick` | 跳过智能建议，直接开始进化 |

---

## Smart Recommendations (智能建议)

| 功能 | 说明 |
|------|------|
| 💡 AI 建议 | 进化前显示一行改进建议 |
| 🎯 相关技能 | 从 skills.sh 获取相关热门技能 |
| 流式进度 | 显示 `🔍 Analyzing skill...` 动画 |
| `--quick` | 跳过建议直接进化 |

```bash
sa evolve <skill>              # 显示智能建议后进化
sa evolve <skill> --quick      # 跳过建议直接进化
```

**输出示例：**
```
──────────────────────────────────────────────────
💡 Smart Recommendations
──────────────────────────────────────────────────
   (Use --quick to skip this step)
🔍 Analyzing skill... ✓

   💡 Suggestion:
      → Add TypeScript type definitions

   🎯 Related skills:
      • docker-compose-best (1234 downloads)
──────────────────────────────────────────────────
```

---

## config 配置项

| 配置键 | 值 | 默认值 | 说明 |
|--------|-----|--------|------|
| `autoEvolve` | `always` \| `ask` \| `preview` | `ask` | 自动进化策略 |
| `outputLevel` | `simple` \| `verbose` \| `debug` | `simple` | 输出详细程度 |
| `backupEnabled` | `true` \| `false` | `true` | 是否自动备份 |

---

## 平台标识

| 标识 | 说明 |
|------|------|
| `imported` | 已导入技能 |
| `openclaw` | OpenClaw 本地技能 (`~/.openclaw/skills/`) |
| `claudecode` | Claude Code 技能 (`~/.claude/skills/` 及 `~/.claude/plugins/cache/*/skills/`) |
| `skills-sh` | skills.sh 平台 |

---

## 优先级图标

| 图标 | 含义 |
|------|------|
| 🔴 | 高优先级 |
| 🟡 | 中优先级 |
| 🟢 | 低优先级 |
| ⚙️ | 可自动应用 |
| 📝 | 需手动处理 |

---

## 环境变量

```bash
SKILL_ADAPTER_REPO      # 技能仓库 URL
SKILL_ADAPTER_REGISTRY  # 注册表 URL
SKILL_ADAPTER_PLATFORM  # 默认平台
```

---

## 配置文件

位置: `~/.skill-adapter/config.json`

```json
{
  "preferences": {
    "autoEvolve": "ask",
    "outputLevel": "simple",
    "backupEnabled": true
  },
  "recentSkills": ["modelscope-cli", "docker-env"],
  "lastUsed": "2026-03-17T10:00:00.000Z"
}
```

---

## 常用工作流

### 快速开始
```bash
sa                                  # 查看新手引导
```

### 快速安装
```bash
sa import <skill-name>
```

### 预览进化
```bash
sa evolve <skill-name>              # 显示智能建议 + 预览改动
sa evolve <skill-name> --dry-run    # 仅预览改动
sa evolve <skill-name> --quick      # 跳过建议直接进化
```

### 分析优化
```bash
sa evolve <skill-name> --apply
```

### 进化指标
```bash
sa summary <skill-name>       # 查看进化指标对比
```

### 安全审查
```bash
sa scan <skill-name>
```

### 分享发布
```bash
sa share <skill-name> --zip
sa share <skill-name> --pr
```

---

## 目录位置

| 目录 | 路径 |
|------|------|
| OpenClaw 技能 | `~/.openclaw/skills/` |
| Claude Code Commands | `~/.claude/commands/` |
| Claude Code Skills | `~/.claude/skills/` 及 `~/.claude/plugins/cache/*/skills/` |
| 配置文件 | `~/.skill-adapter/config.json` |
| 进化数据库 (JSONL) | `~/.skill-adapter/evolution.jsonl` |