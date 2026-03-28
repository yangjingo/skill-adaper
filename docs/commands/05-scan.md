# sa scan - Security Scan

## Overview

`sa scan` command detects security issues in skills, including:
- Dangerous command detection
- Sensitive information leakage
- Network security risks
- Privilege escalation risks

---

## Command Format

```bash
sa scan [skillOrFile] [options]
```

## Parameters

| Parameter | Description |
|-----------|-------------|
| `skillOrFile` | Skill name or file path (optional) |

## Options

| Option | Description | Default |
|--------|-------------|---------|
| `-f, --format <format>` | Output format (text, json) | text |
| `--repair` | Generate repaired copy and rescan (text mode only) | false |
| `--apply` | Write repaired content back to the original file | false |

---

## Security Check Categories

### 1. Dangerous Commands

| Pattern | Risk Level | Description |
|---------|------------|-------------|
| `rm -rf` | 🔴 Critical | Recursive file deletion |
| `sudo rm` | 🔴 Critical | Admin file deletion |
| `mkfs` | 🔴 Critical | Disk formatting |
| `dd if=` | 🔴 Critical | Disk operations |
| `:(){ :|:& };:` | 🔴 Critical | Fork bomb |

### 2. Network Operations

| Pattern | Risk Level | Description |
|---------|------------|-------------|
| `curl ... \| sh` | 🔴 Critical | Remote code execution |
| `wget ... \| bash` | 🔴 Critical | Remote code execution |
| Reverse Shell | 🔴 Critical | Remote control |
| `nc -l` | 🟡 High | Network listening |

### 3. Privilege Escalation

| Pattern | Risk Level | Description |
|---------|------------|-------------|
| `chmod 777` | 🟡 High | Excessive permissions |
| `chown root` | 🟡 High | Ownership change |
| `sudo su` | 🟡 High | Switch to root |

### 4. Data Exfiltration

| Pattern | Risk Level | Description |
|---------|------------|-------------|
| `curl -F` | 🟡 High | File upload |
| `wget --post-file` | 🟡 High | File transfer |
| Base64 encoded upload | 🟡 High | Encoding bypass |

### 5. Persistence

| Pattern | Risk Level | Description |
|---------|------------|-------------|
| Cron Jobs | 🟡 High | Scheduled tasks |
| Startup scripts | 🟡 High | Auto-start |
| Service installation | 🟡 High | System services |

---

## Usage Examples

### 1. View Scannable Skills

```bash
sa scan
```

**Output Example:**
```
🔒 Security Scan

── Imported Skills ──
  📦 docker-env (v1.0.0)
  📦 frontend-design (v1.2.0)

── OpenClaw Local Skills ──
  📦 code-assistant
  📦 test-generator
  📦 api-designer

── Claude Code Skills ──
  📦 frontend-design
  📦 skill-creator
  📦 hook-development

📌 Next Steps:
   sa scan <skill-name>     # Scan imported skill
   sa scan <file-path>      # Scan local file

Examples:
   sa scan frontend-design
   sa scan ./my-skill/SKILL.md
   sa scan skill.json -f json
   sa scan frontend-design --repair
```

### 2. Scan Imported Skill

```bash
sa scan docker-env
```

**Output Example:**
```
🔒 Scanning skill: docker-env

═══════════════════════════════════════════════════════════════════
                        SECURITY SCAN REPORT
═══════════════════════════════════════════════════════════════════

Target: docker-env
Source: skills.sh
Scan Time: 2024-01-15 14:30:00

───────────────────────────────────────────────────────────────────
SUMMARY
───────────────────────────────────────────────────────────────────
Status: ✅ PASSED
Risk Level: LOW

Total Issues: 0
  • Critical: 0
  • High: 0
  • Medium: 0
  • Low: 0

───────────────────────────────────────────────────────────────────
CHECKS PERFORMED
───────────────────────────────────────────────────────────────────
✅ Dangerous Commands: None found
✅ Network Operations: Safe
✅ Privilege Escalation: None detected
✅ Data Exfiltration: No risks found
✅ Sensitive Information: No secrets exposed

📁 Skill path: C:\Users\xxx\.openclaw\skills\docker-env
📥 Source: skills.sh

📌 Next Steps:
   sa info docker-env      # View skill details
   sa evolve docker-env    # Analyze and optimize
```

### 3. Scan Local File

```bash
sa scan ./my-skill/SKILL.md
```

**Output Example:**
```
🔒 Scanning file: ./my-skill/SKILL.md

═══════════════════════════════════════════════════════════════════
                        SECURITY SCAN REPORT
═══════════════════════════════════════════════════════════════════

Target: ./my-skill/SKILL.md
Scan Time: 2024-01-15 14:32:00

───────────────────────────────────────────────────────────────────
SUMMARY
───────────────────────────────────────────────────────────────────
Status: ⚠️ ISSUES FOUND
Risk Level: MEDIUM

Total Issues: 2
  • Critical: 0
  • High: 1
  • Medium: 1
  • Low: 0

───────────────────────────────────────────────────────────────────
DETAILED FINDINGS
───────────────────────────────────────────────────────────────────

🔴 [HIGH] Dangerous Command Detected
   Line: 45
   Pattern: rm -rf /tmp/*
   Recommendation: Use safer alternatives or add confirmation prompts

🟡 [MEDIUM] Sensitive Information
   Line: 78
   Pattern: API_KEY=xxx
   Recommendation: Use environment variables instead of hardcoded secrets

📌 Next Steps:
   # Please review security issues before using
```

### 4. JSON Format Output

```bash
sa scan docker-env -f json
```

**Output Example:**
```json
{
  "target": "docker-env",
  "source": "skills.sh",
  "scanTime": "2024-01-15T14:30:00Z",
  "passed": true,
  "riskAssessment": {
    "overallRisk": "low",
    "score": 95
  },
  "dangerousOperationFindings": [],
  "sensitiveInfoFindings": [],
  "recommendations": []
}
```

### 5. Auto Repair Failed Scan

```bash
sa scan frontend-design --repair --apply
```

Behavior:
- Runs normal scan first
- `--repair` without `--apply` creates a repaired copy `*.repaired.*`
- `--repair --apply` writes the repaired content back to the original file
- Re-scans the repaired target and prints before/after high-severity count
- If the target is a skill directory, the repair writes to `SKILL.md` or `skill.md`
- Works in text mode only (`--format json` will auto-switch to text)

---

## Scan Source Priority

```
Skill scan lookup order:
│
├─ 1. Imported skills (Database)
│     └─ Get import source path
│
├─ 2. OpenClaw local skills
│     └─ ~/.openclaw/skills/<skill-name>
│
├─ 3. Claude Code Commands
│     └─ ~/.claude/commands/<skill-name>.md
│
├─ 4. Claude Code Skills
│     ├─ ~/.claude/skills/<skill-name>
│     └─ ~/.claude/plugins/cache/<marketplace>/<plugin>/<version>/skills/<skill-name>
│
└─ 5. Remote Platform
      └─ Fetch content from skills.sh / clawhub.com
```

---

## Test Steps

1. **View scannable skills**
   ```bash
   sa scan
   ```

2. **Scan imported skill**
   ```bash
   sa scan <skill-name>
   ```

3. **Scan local file**
   ```bash
   sa scan ./path/to/SKILL.md
   ```

4. **Get JSON format report**
   ```bash
   sa scan <skill> -f json
   ```

---

## Next Steps

After security scan passes, use `sa share` to share the skill.
