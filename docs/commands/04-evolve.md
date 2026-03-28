# sa evolve - Evolution Analysis

## Overview

`sa evolve` is the core command of Skill-Adapter, used for:
- Loading and analyzing tracked skills
- Analyzing skill compatibility with current work environment
- Generating optimization recommendations
- Applying high-confidence recommendations (`--apply`)
- Tracking evolution history

---

## Command Format

```bash
sa evolve <skillName> [options]
```

## Parameters

| Parameter | Description |
|-----------|-------------|
| `skillName` | Required. Skill name to analyze |

## Options

| Option | Description | Default |
|--------|-------------|---------|
| `--apply` | Apply high-confidence recommendations to skill file | false |
| `-v, --verbose` | Show detailed technical analysis and recommendation details | false |

---

## Output Modes

### Default (Concise)
- Short summary only
- Recommendation count by priority
- Clear next-step commands

### Verbose (`--verbose`)
- Full analysis details (static/content/context)
- Streaming thinking output (when AI model is available)
- Full recommendation cards with suggested content preview

---

## Usage Examples

### 1. Analyze a skill (default concise mode)

```bash
sa evolve docker-env
```

**Output style:** concise summary + next steps.

### 2. Analyze with full details

```bash
sa evolve docker-env --verbose
```

**Output style:** full technical breakdown and recommendation details.

### 3. Analyze and apply recommendations

```bash
sa evolve docker-env --apply
```

Applies recommendations with confidence >= 0.8 and records evolution history.

### 4. Analyze, detailed output, then apply

```bash
sa evolve docker-env --verbose --apply
```

---

## Expected Flow

1. Validate CLI input (`skillName` is required; missing argument shows help)
2. Load tracked skill from local evolution database
3. Show SA configuration and connection status
4. Analyze skill content and workspace context
5. Generate recommendations (AI-first, rule-based fallback)
6. Show concise summary (or detailed output with `--verbose`)
7. If `--apply` is set, apply high-confidence recommendations and save history

## CLI Validation

- `sa evolve` now requires `skillName`
- Running `sa evolve` without arguments prints:
  - error: missing required argument `skillName`
  - command help for `sa evolve`
- If the skill is not tracked locally, command suggests:
  - `sa import <skill>`
  - `sa info`

---

## Next Steps

After evolution analysis:
- `sa log <skill>`: view evolution history
- `sa summary <skill>`: view metrics summary
- `sa export <skill>`: export local skill package
- `sa scan <skill>`: run security scan
