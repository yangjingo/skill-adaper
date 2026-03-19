# sa share - Share Skills

## Overview

`sa share` command shares skills, supporting:
- Export as ZIP package
- Publish to registry
- Create Pull Request to skill repository

---

## Command Format

```bash
sa share [skillName] [options]
```

## Parameters

| Parameter | Description |
|-----------|-------------|
| `skillName` | Skill name (optional). Shows shareable skills list when not provided |

## Options

| Option | Description | Default |
|--------|-------------|---------|
| `-o, --output <path>` | Export file path | `<skill>-v<version>.zip` |
| `-f, --format <format>` | Export format (json, yaml, zip) | zip |
| `--zip` | Export as ZIP (shorthand) | false |
| `--registry <url>` | Publish to registry URL | - |
| `--pr` | Create Pull Request | false |
| `--repo <url>` | Target Git repository URL | Configured skillsRepo |
| `--branch <name>` | PR branch name | `skill/<name>-v<version>` |
| `--yes` | Skip confirmation | false |

---

## Usage Examples

### 1. View Shareable Skills

```bash
sa share
```

**Output Example:**
```
📤 Select a skill to share:

  • docker-env (v1.1.0)
  • frontend-design (v1.2.0)

📌 Next Steps:
   sa share <skill-name>      # Share specific skill
   sa export <skill-name>     # Export skill to file
```

### 2. Export as ZIP Package

```bash
sa share docker-env --zip
```

**Output Example:**
```
📤 Sharing skill: docker-env

🔒 Running security scan...
  ✅ Security scan passed

📦 Exporting to ./docker-env-v1.1.0.zip...
✅ Export complete!
   File: ./docker-env-v1.1.0.zip
```

### 3. Specify Output Path

```bash
sa share docker-env -o ./backup/docker-env.zip
```

### 4. Publish to Registry

```bash
sa share docker-env --registry http://localhost:3000
```

**Output Example:**
```
📤 Sharing skill: docker-env

🔒 Running security scan...
  ✅ Security scan passed

🚀 Publishing to http://localhost:3000...
✅ Published successfully!
   URL: http://localhost:3000/skills/docker-env
   Version: 1.1.0
```

### 5. Create Pull Request

```bash
sa share docker-env --pr
```

**Output Example:**
```
📤 Sharing skill: docker-env

🔒 Running security scan...
  ✅ Security scan passed

🚀 Creating Pull Request to https://github.com/org/skills...

📥 Cloning repository...
🌿 Creating branch: skill/docker-env-v1.1.0
📝 Committing changes...
⬆️ Pushing branch...

✅ Branch created and pushed!
   Branch: skill/docker-env-v1.1.0
   Repo: https://github.com/org/skills

💡 Please create Pull Request manually in the web interface.
   URL: https://github.com/org/skills/-/merge_requests/new?source_branch=skill/docker-env-v1.1.0
```

### 6. Specify Repository and Branch

```bash
sa share docker-env --pr --repo https://github.com/my-org/skills --branch feature/docker-skill
```

### 7. Skip Confirmation (With Security Issues)

```bash
sa share docker-env --pr --yes
```

---

## Sharing Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                      sa share Workflow                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Step 1: Security Scan                                         │
│  ├── Detect dangerous commands                                 │
│  ├── Detect sensitive information                              │
│  └── Generate security report                                  │
│                                                                 │
│  Step 2: Choose Sharing Method                                 │
│  │                                                              │
│  ├── --zip → Export as ZIP package                             │
│  │   └── Contains skill.json, skill.md, README.md etc.         │
│  │                                                              │
│  ├── --registry → Publish to registry                          │
│  │   └── Call POST /api/skills endpoint                        │
│  │                                                              │
│  └── --pr → Create Pull Request                                │
│      ├── Clone target repository                               │
│      ├── Create branch                                         │
│      ├── Commit changes                                        │
│      └── Push branch                                           │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## PR Creation Details

When using `--pr` option, it automatically:

1. **Clone Target Repository**
   - Clone to temp directory `/tmp/skill-adapter-pr/<skill-name>`
   - Use configured `skillsRepo` or URL specified by `--repo`

2. **Create Branch**
   - Branch name format: `skill/<skill-name>-v<version>`
   - Can customize via `--branch`

3. **Write Skill Files**
   ```
   skills/<skill-name>/
   ├── skill.json    # Skill manifest
   ├── skill.md      # Skill content
   └── README.md     # Documentation
   ```

4. **Commit and Push**
   - Commit message: `feat: Add/Update skill <name> v<version>`

---

## Security Checks

Automatic security scan before sharing:

| Risk Level | Behavior |
|------------|----------|
| **Passed** | Continue sharing flow |
| **Low Risk** | Show warning, can use `--yes` to continue |
| **Medium Risk** | Show warning, requires `--yes` confirmation |
| **High Risk** | Show warning, recommend fixing before sharing |

---

## Test Steps

1. **View shareable skills**
   ```bash
   sa share
   ```

2. **Export as ZIP**
   ```bash
   sa share <skill-name> --zip
   ```

3. **Publish to registry**
   ```bash
   sa share <skill-name> --registry http://localhost:3000
   ```

4. **Create PR**
   ```bash
   sa share <skill-name> --pr
   ```

5. **Specify repository for PR**
   ```bash
   sa share <skill-name> --pr --repo https://github.com/org/skills
   ```

---

## Notes

1. **Git Credentials**: Creating PR requires configured Git credentials
2. **Repository Permissions**: Need write permission to target repository
3. **Security Scan**: Recommend fixing high-risk issues before sharing

---

## Next Steps

After sharing is complete, you can create a Pull Request in the repository for code review.