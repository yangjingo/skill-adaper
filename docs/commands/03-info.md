# sa info - View Skill Information

## Overview

`sa info` command views skill information, supporting:
- **List Mode**: View available skills from all platforms
- **Detail Mode**: View detailed information of a specific skill

---

## Command Format

```bash
sa info [skillName] [options]
```

## Parameters

| Parameter | Description |
|-----------|-------------|
| `skillName` | Skill name (optional). Shows all skills when not provided |

## Options

| Option | Description | Default |
|--------|-------------|---------|
| `-v, --version <version>` | View specific version | - |
| `--security` | Show security status | - |
| `-p, --platform <platform>` | Filter platform (imported, openclaw, claudecode, all) | all |

---

## Usage Examples

### 1. View All Platform Skills

```bash
sa info
```

**Output Example:**
```
📋 Available Skills

── Imported Skills ──
  📦 docker-env (v1.0.0) - 2 evolution(s)
  📦 frontend-design (v1.2.0) - 5 evolution(s)

── OpenClaw Skills ──
  📦 code-assistant
  📦 test-generator
  📦 api-designer

── Claude Code Commands ──
  📦 commit
  📦 review-pr
  📦 pdf

── Claude Code Skills ──
  📦 frontend-design
  📦 skill-creator

📌 Next Steps:
   sa info <skill-name>       # View specific skill details
   sa info -p imported        # Show only imported skills
   sa import <skill-name>     # Import new skill
```

### 2. View Specific Skill Details

```bash
sa info docker-env
```

**Output Example:**
```
📦 docker-env

Source: Imported
Version: 1.0.0
Evolutions: 2
Imported from: skills.sh
Last updated: 2024/01/15

📌 Next Steps:
   sa summary docker-env      # View evolution metrics comparison
   sa evolve docker-env       # Analyze and optimize skill
   sa log docker-env          # View version history
```

### 3. View Skill Security Status

```bash
sa info docker-env --security
```

**Output Example:**
```
📦 docker-env

Source: Imported
Version: 1.0.0
Evolutions: 2
Imported from: skills.sh
Last updated: 2024/01/15

🔒 Security Status:
  Risk Level: low
  Issues: 0 sensitive, 0 dangerous
```

### 4. View Only Specific Platform

```bash
# View only imported skills
sa info -p imported

# View only OpenClaw skills
sa info -p openclaw

# View only Claude Code skills
sa info -p claudecode
```

### 5. View OpenClaw Skill Details

```bash
sa info my-openclaw-skill
```

**Output Example:**
```
📦 my-openclaw-skill

Source: OpenClaw

── System Prompt ──
Size: 15.2 KB
Lines: 342

── Metadata ──
Created: 2024/01/10 10:30:00
Modified: 2024/01/15 14:22:00
Path: C:\Users\xxx\.openclaw\skills\my-openclaw-skill
Files: 5 | Dirs: 2 | Total Size: 28.5 KB

── Directory Tree ──
├── SKILL.md (15.2 KB)
├── config.json (1.2 KB)
├── reference/
│   ├── api.md (3.5 KB)
│   └── examples.md (2.1 KB)
└── scripts/
    └── setup.sh (0.8 KB)

💡 Use `sa import C:\Users\xxx\.openclaw\skills\my-openclaw-skill` to import this skill.
```

### 6. View Claude Code Plugin Skill Details

```bash
sa info agent-development
```

**Output Example:**
```
📦 agent-development

Source: Claude Code Skill (Plugin)

── System Prompt ──
Size: 10.1 KB
Lines: 416
Version: 0.1.0

── Metadata ──
Created: 2026/3/15 22:20:33
Modified: 2026/3/15 22:20:33
Path: C:\Users\xxx\.claude\plugins\cache\claude-plugins-official\plugin-dev\...\skills\agent-development
Plugin: plugin-dev
Marketplace: claude-plugins-official
Files: 7 | Dirs: 3 | Total Size: 68.6 KB

── Directory Tree ──
├── examples/
│   ├── agent-creation-prompt.md (9.2 KB)
│   └── complete-agent-examples.md (13.8 KB)
├── references/
│   └── triggering-examples.md (11.3 KB)
└── SKILL.md (10.2 KB)

💡 Use `sa import ...` to import this skill.
```

---

## Platform Sources

| Platform | Path | Description |
|----------|------|-------------|
| **Imported** | Database | Skills imported via `sa import` |
| **OpenClaw** | `~/.openclaw/skills/` | OpenClaw local skills |
| **Claude Code Commands** | `~/.claude/commands/` | Claude Code slash commands |
| **Claude Code Skills** | `~/.claude/skills/` and `~/.claude/plugins/cache/*/skills/` | Claude Code skills (including plugin-installed skills) |

---

## Test Steps

1. **View all available skills**
   ```bash
   sa info
   ```

2. **View imported skill details**
   ```bash
   sa info <imported-skill-name>
   ```

3. **View security status**
   ```bash
   sa info <skill-name> --security
   ```

4. **View local OpenClaw skills** (if exists)
   ```bash
   sa info -p openclaw
   ```

5. **View Claude Code skills** (if exists)
   ```bash
   sa info -p claudecode
   ```

---

## Next Steps

After understanding skill information, use `sa evolve` for evolution analysis.