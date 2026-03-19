# sa export - Export Skills

## Overview

`sa export` command exports skills from various platforms to local files, supporting:
- Imported skill export
- OpenClaw skill export
- Claude Code skill export

---

## Command Format

```bash
sa export [skillName] [options]
```

## Parameters

| Parameter | Description |
|-----------|-------------|
| `skillName` | Skill name (optional). Exports all skills when not provided |

## Options

| Option | Description | Default |
|--------|-------------|---------|
| `-p, --platform <platform>` | Export platform (imported, openclaw, claudecode, all) | all |
| `-o, --output <dir>` | Output directory | `./exported-skills` |
| `-f, --format <format>` | Export format (zip, json) | zip |

---

## Usage Examples

### 1. Export All Skills

```bash
sa export
```

**Output Example:**
```
📦 Exporting all skills from all...

── IMPORTED ──
  ✓ docker-env
  ✓ frontend-design

── OPENCLAW ──
  ✓ code-assistant
  ✓ test-generator

── CLAUDECODE ──
  ✓ commit
  ✓ review-pr

✅ Successfully exported 6 skills

📁 Export directory: C:\Users\xxx\Desktop\exported-skills

📄 Exported files:
   C:\Users\xxx\Desktop\exported-skills\imported\docker-env.zip
   C:\Users\xxx\Desktop\exported-skills\imported\frontend-design.zip
   C:\Users\xxx\Desktop\exported-skills\openclaw\code-assistant.zip
   C:\Users\xxx\Desktop\exported-skills\openclaw\test-generator.zip
   C:\Users\xxx\Desktop\exported-skills\claudecode\commit.zip
   C:\Users\xxx\Desktop\exported-skills\claudecode\review-pr.zip

📌 Next Steps:
   # Open export directory in file manager
   explorer C:\Users\xxx\Desktop\exported-skills
```

### 2. Export Specific Skill

```bash
sa export docker-env
```

**Output Example:**
```
📦 Exporting docker-env from all...

── IMPORTED ──
  ✓ docker-env

✅ Successfully exported 1 skill

📁 Export directory: C:\Users\xxx\Desktop\exported-skills
```

### 3. Export Only Specific Platform

```bash
# Export only imported skills
sa export -p imported

# Export only OpenClaw skills
sa export -p openclaw

# Export only Claude Code skills
sa export -p claudecode
```

### 4. Specify Output Directory and Format

```bash
sa export -o ./backup -f json
```

### 5. Export Specific Skill from Specific Platform

```bash
sa export docker-env -p imported -o ./my-exports
```

---

## Export Directory Structure

```
exported-skills/
├── imported/                    # Imported skills
│   ├── docker-env.zip
│   └── frontend-design.zip
├── openclaw/                    # OpenClaw skills
│   ├── code-assistant.zip
│   └── test-generator.zip
└── claudecode/                  # Claude Code skills
    ├── commit.zip
    └── frontend-design.zip
```

---

## ZIP Package Contents

Each exported ZIP package contains:

```
skill-name.zip/
├── skill.json          # Skill manifest
├── skill.md            # Skill content (System Prompt)
├── README.md           # Documentation
├── patches.json        # Change patches (if exists)
└── security-scan.json  # Security scan results
```

### skill.json Example

```json
{
  "name": "docker-env",
  "version": "1.1.0",
  "description": "Docker environment management skill",
  "author": "skills.sh",
  "license": "MIT",
  "keywords": ["docker", "environment", "devops"],
  "compatibility": {
    "platforms": ["claude-code", "openclaw"]
  }
}
```

---

## Test Steps

1. **Export all skills to default directory**
   ```bash
   sa export
   ```

2. **Export specific skill**
   ```bash
   sa export <skill-name>
   ```

3. **Export only OpenClaw skills**
   ```bash
   sa export -p openclaw
   ```

4. **Specify output directory**
   ```bash
   sa export -o ./my-backup
   ```

5. **Export as JSON format**
   ```bash
   sa export -f json
   ```

---

## Next Steps

After exporting skills, use `sa scan` for security review, or share via `sa share` to repository.