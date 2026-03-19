# sa import - Import/Discover Skills

## Overview

`sa import` is a multi-functional command for:
- **Discovery Mode**: View hot skills from skills.sh and clawhub.com
- **Import Mode**: Import skills from various sources to local

---

## Command Format

```bash
sa import [source] [options]
```

## Parameters

| Parameter | Description |
|-----------|-------------|
| `source` | Skill source (optional). Shows hot skills when not provided |

## Options

| Option | Description | Default |
|--------|-------------|---------|
| `-n, --name <name>` | Rename skill when importing | - |
| `--no-scan` | Skip security scan | - |
| `--registry <url>` | Custom registry URL | - |
| `-l, --limit <number>` | Number of results in discovery mode | 10 |
| `-p, --platform <platform>` | Discovery platform (skills-sh, clawhub, all) | all |
| `--no-npx` | Use built-in import instead of official CLI | false |

---

## Supported Source Types

| Source Type | Example | Description |
|-------------|---------|-------------|
| **Skill Name** | `sa import docker-env` | Search and install from skills.sh/clawhub |
| **OpenClaw Skill** | `sa import ~/.openclaw/skills/docker-env` | Import OpenClaw local skill |
| **Local Directory** | `sa import ./my-skill` | Import local directory (requires skill.json or SKILL.md) |
| **Local File** | `sa import ./skill.zip` | Import ZIP package |
| **URL** | `sa import https://...` | Import from URL |

---

## Usage Examples

### 1. Discover Hot Skills

```bash
sa import
```

**Output Example:**
```
🔥 Discovering hot skills from skills.sh and clawhub.com...

Rank | Downloads | Source      | Skill
-----------------------------------------------------------------
#1   | 15234     │ skills.sh │  frontend-design
#2   | 12856     │ clawhub.com │  code-review
#3   | 9823      │ skills.sh │  commit
#4   | 7654      │ clawhub.com │  test-runner

📌 Next Steps:
   sa import find-skills            # Install using official CLI (default)
   sa import find-skills --no-npx   # Use built-in import
   # Auto-detect platform: skills.sh / clawhub.com
```

### 2. Import from Remote Platform

```bash
# Install using official CLI (recommended)
sa import frontend-design

# Use built-in import
sa import frontend-design --no-npx
```

**Output Example:**
```
📥 Getting skill from: frontend-design

🔍 Searching from skills.sh and clawhub.com...

📥 Found: frontend-design from skills.sh
   A distinctive frontend design skill...

🔒 Running security scan...
  ✅ Security scan passed

✅ Successfully installed!
   Skill: frontend-design (v1.0.0)
   Source: skills.sh

📌 Next Steps:
   sa info frontend-design       # View skill details
   sa evolve frontend-design     # Analyze and optimize skill
```

### 3. Import from OpenClaw

```bash
sa import ~/.openclaw/skills/my-skill
```

**Output Example:**
```
📥 Getting skill from: ~/.openclaw/skills/my-skill

🔍 Detected: OpenClaw skill format

🔒 Running security scan...
  ✅ Security scan passed

✅ Successfully installed!
   Skill: my-skill (v1.0.0)
   Source: OpenClaw

📌 Next Steps:
   sa info my-skill       # View skill details
   sa evolve my-skill     # Analyze and optimize skill
```

### 4. Import from Local ZIP

```bash
sa import ./my-skill.zip -n custom-name
```

### 5. Limit Discovery Results

```bash
sa import -l 5                    # Show only top 5 hot skills
sa import -p skills-sh            # Show only skills.sh skills
sa import -p clawhub              # Show only clawhub.com skills
```

---

## Source Detection Logic

```
Input Detection Flow:
│
├─ Is it a local file/directory?
│  ├─ Yes → Detect format (skill.json / SKILL.md)
│  └─ No ↓
│
├─ Is it an OpenClaw skill?
│  ├─ Yes → Read SKILL.md
│  └─ No ↓
│
├─ Is it a URL?
│  ├─ Yes → Download from URL
│  └─ No ↓
│
└─ Treat as skill name
   └─ Search from skills.sh / clawhub.com
```

---

## Security Scan

Automatic security scan during import, detecting:
- Dangerous commands (rm -rf, sudo, etc.)
- Network operations (curl ... | sh, etc.)
- Privilege escalation (chmod 777, etc.)
- Data exfiltration risks

---

## Test Steps

1. **View hot skills**
   ```bash
   sa import
   ```

2. **Import a skill from remote**
   ```bash
   sa import <skill-name>
   ```

3. **Import local OpenClaw skill** (if exists)
   ```bash
   sa import ~/.openclaw/skills/<skill-name> --no-npx
   ```

4. **Verify import result**
   ```bash
   sa info
   ```

---

## Next Steps

After importing a skill, use `sa info` to view details, or `sa evolve` for evolution analysis.