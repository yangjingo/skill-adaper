# sa init - Initialize Configuration

## Overview

`sa init` command initializes Skill-Adapter configuration, setting up skill repository URL, registry URL, and other settings.

---

## Command Format

```bash
sa init [options]
```

## Options

| Option | Description | Default |
|--------|-------------|---------|
| `--repo <url>` | Set skills repository URL | `https://codehub-g.huawei.com/leow3lab/ascend-skills` |
| `--registry <url>` | Set registry URL | `http://leow3lab.service.huawei.com/registry` |
| `--show` | Show current configuration | - |

---

## Usage Examples

### 1. Show Current Configuration

```bash
sa init --show
```

**Output Example:**
```
📋 Current Configuration

  Skills Repo:  https://codehub-g.huawei.com/leow3lab/ascend-skills
  Registry:     http://leow3lab.service.huawei.com/registry
  Platform:     skills-sh
  Config File:  C:\Users\xxx\.skill-adapter.json
```

### 2. Set New Configuration

```bash
sa init --repo https://github.com/my-org/skills --registry http://localhost:3000
```

**Output Example:**
```
🔧 Initializing Skill-Adapter...

✅ Configuration saved!

📋 Configuration:
   Skills Repo:  https://github.com/my-org/skills
   Registry:     http://localhost:3000
   Config File:  C:\Users\xxx\.skill-adapter.json

💡 Environment Variables:
   SKILL_ADAPTER_REPO      - Skills repository URL
   SKILL_ADAPTER_REGISTRY  - Default registry URL
   SKILL_ADAPTER_PLATFORM  - Default platform
```

---

## Configuration Storage

Configuration is saved in `~/.skill-adapter.json`:

```json
{
  "skillsRepo": "https://github.com/my-org/skills",
  "registryUrl": "http://localhost:3000",
  "defaultPlatform": "skills-sh"
}
```

---

## Environment Variables

You can also configure via environment variables, which take priority over config file:

| Environment Variable | Description |
|---------------------|-------------|
| `SKILL_ADAPTER_REPO` | Skills repository URL |
| `SKILL_ADAPTER_REGISTRY` | Registry URL |
| `SKILL_ADAPTER_PLATFORM` | Default platform (skills-sh, clawhub) |

---

## Test Steps

1. **View default configuration**
   ```bash
   sa init --show
   ```

2. **Set custom configuration**
   ```bash
   sa init --repo https://github.com/your-org/skills
   ```

3. **Verify configuration was saved**
   ```bash
   sa init --show
   ```

---

## Next Steps

After configuration, you can use `sa import` to import skills.