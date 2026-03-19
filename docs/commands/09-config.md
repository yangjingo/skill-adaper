# sa config - Configuration Management

## Overview

`sa config` manages user preferences and settings for Skill-Adapter.

---

## Command Format

```bash
sa config [action] [key] [value]
```

## Actions

| Action | Description |
|--------|-------------|
| (none) / `list` | Show all configurations |
| `get <key>` | Get a single configuration value |
| `set <key> <value>` | Set a configuration value |
| `reset` | Reset to default values |

---

## Configuration Options

| Key | Values | Default | Description |
|-----|--------|---------|-------------|
| `autoEvolve` | `always` \| `ask` \| `preview` | `ask` | Auto evolution strategy |
| `outputLevel` | `simple` \| `verbose` \| `debug` | `simple` | Output verbosity |
| `backupEnabled` | `true` \| `false` | `true` | Auto backup before modifications |

---

## Usage Examples

### 1. View All Configurations

```bash
sa config
```

**Output:**
```
📋 Skill-Adapter Configuration

Preferences:
  autoEvolve    ask
  outputLevel   simple
  backupEnabled true

Recent Skills:
  1. modelscope-cli
  2. docker-env
  3. hccn-tools

📁 Config file: ~/.skill-adapter/config.json
```

### 2. Get Single Configuration

```bash
sa config get autoEvolve
```

**Output:**
```
autoEvolve = ask
```

### 3. Set Configuration

```bash
sa config set autoEvolve always
```

**Output:**
```
✅ Set autoEvolve = always
```

### 4. Reset to Defaults

```bash
sa config reset
```

**Output:**
```
✅ Configuration reset to defaults

Default configuration:
  autoEvolve    = ask
  outputLevel   = simple
  backupEnabled = true
```

---

## Configuration File

Location: `~/.skill-adapter/config.json`

```json
{
  "preferences": {
    "autoEvolve": "ask",
    "outputLevel": "simple",
    "backupEnabled": true
  },
  "recentSkills": [
    "modelscope-cli",
    "docker-env",
    "hccn-tools"
  ],
  "lastUsed": "2026-03-17T10:00:00.000Z"
}
```

---

## autoEvolve Modes

| Mode | Behavior |
|------|----------|
| `ask` | Ask on first use, remember choice |
| `always` | Always apply evolution automatically |
| `preview` | Only preview, don't apply |

---

## outputLevel Modes

| Level | Description |
|-------|-------------|
| `simple` | Minimal output, just results |
| `verbose` | Detailed output with explanations |
| `debug` | Full technical output |

---

## Test Steps

1. **View current config**
   ```bash
   sa config
   ```

2. **Change output level**
   ```bash
   sa config set outputLevel verbose
   ```

3. **Test evolve with new output level**
   ```bash
   sa evolve <skill> -v
   ```

4. **Reset to defaults**
   ```bash
   sa config reset
   ```