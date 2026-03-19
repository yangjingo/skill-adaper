# sa evolve - Evolution Analysis

## Overview

`sa evolve` is the core command of Skill-Adapter, used for:
- Finding and auto-importing skills (if needed)
- Analyzing skill compatibility with current work environment
- Generating optimization suggestions
- Automatically applying automatable optimizations
- Tracking evolution history

---

## Command Format

```bash
sa evolve [skillName] [options]
```

## Parameters

| Parameter | Description |
|-----------|-------------|
| `skillName` | Skill name (optional). Shows all skills overview when not provided |

## Options

| Option | Description | Default |
|--------|-------------|---------|
| `--dry-run` | Preview changes without applying | false |
| `-v, --verbose` | Show detailed output | false |
| `--debug` | Show full technical output | false |
| `-l, --last <n>` | Analyze last N sessions | 10 |
| `--apply` | Apply optimization suggestions | false |
| `--detail` | Show detailed analysis | false |
| `--quick` | Skip smart suggestions, start evolution directly | false |

---

## Evolution Analysis Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    Evolution Analysis 7 Steps                   │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Step 0: Multi-source Skill Discovery                          │
│  ├── Database → OpenClaw → Claude Code → "Not Found"           │
│  └── Auto-import OpenClaw skills not in database               │
│                                                                 │
│  Step 1: Workspace Analysis                                    │
│  ├── Detect programming languages (TypeScript, Python, etc.)   │
│  ├── Detect frameworks (React, Vue, etc.)                      │
│  ├── Detect package managers (npm, pnpm, yarn)                 │
│  └── Detect build tools (webpack, vite, etc.)                  │
│                                                                 │
│  Step 2: Skill Content Analysis                                │
│  ├── Content size, lines, sections                             │
│  ├── Code block count                                          │
│  └── Reference link count                                      │
│                                                                 │
│  Step 2.5: Smart Recommendations ✨ NEW                        │
│  ├── 💡 AI evolution suggestion (one-line concise suggestion)  │
│  ├── 🎯 Related skill recommendations (skills.sh API)          │
│  └── Use --quick to skip this step                             │
│                                                                 │
│  Step 3: Context Loading                                       │
│  ├── SOUL.md personality injection                             │
│  └── MEMORY.md history learning                                │
│                                                                 │
│  Step 4: Environment Detection                                 │
│  ├── OpenClaw skills directory                                 │
│  ├── Claude Code configuration                                 │
│  └── Available skill count                                     │
│                                                                 │
│  Step 5: Execute Optimization                                  │
│  ├── 🔴 High priority - needs immediate handling               │
│  ├── 🟡 Medium priority - recommended handling                 │
│  └── 🟢 Low priority - optional handling                       │
│                                                                 │
│  Step 6: Save Changes                                          │
│                                                                 │
│  Step 7: Record Evolution                                      │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Usage Examples

### 1. View All Skills Status

```bash
sa evolve
```

**Output Example:**
```
🔄 Running evolution analysis...

Analyzing 2 skill(s)...

  • docker-env: v1.0.0 (2 evolution(s))
    Source: skills.sh
  • frontend-design: v1.2.0 (5 evolution(s))
    Source: clawhub.com

📍 Workspace Analysis
────────────────────────────────────────
Languages: TypeScript, JavaScript
Frameworks: React
Package Manager: pnpm

📌 Next Steps:
   sa evolve <skill-name>     # Analyze specific skill
   sa import <skill-name>     # Import new skill
```

### 2. Analyze Specific Skill (Default Mode - With Smart Suggestions)

```bash
sa evolve docker-env
```

**Output Example:**
```
✔ Found: docker-env (OpenClaw)

📄 Skill: docker-env
   ├─ Source: OpenClaw
   ├─ Path: ~/.openclaw/skills/docker-env
   └─ Size: 7152 bytes

──────────────────────────────────────────────────
💡 Smart Recommendations
──────────────────────────────────────────────────
   (Use --quick to skip this step)
🔍 Analyzing skill... ✓

   💡 Suggestion:
      → Add TypeScript type definitions for Docker commands

   🎯 Related skills:
      • docker-compose-best (1234 downloads)
      • container-security (567 downloads)

──────────────────────────────────────────────────

🚀 Starting evolution...
[AI analysis streaming output...]

✅ docker-env evolved (1.0.0 → 1.1.0)
📝 Changes: environment adaptation + interaction style injection
```

### 3. Skip Smart Suggestions (--quick)

```bash
sa evolve docker-env --quick
```

**Output Example:**
```
✔ Found: docker-env (OpenClaw)

🚀 Starting evolution...
[Start AI analysis directly without showing suggestions...]

✅ docker-env evolved (1.0.0 → 1.1.0)
```

### 4. Preview Changes (--dry-run)

```bash
sa evolve docker-env --dry-run
```

**Output Example:**
```
✔ Found: docker-env (OpenClaw)
✔ Workspace: TypeScript, React, pnpm

📋 Preview Changes (--dry-run):
   + Add environment adaptation hint (TypeScript workspace)
   + Inject interaction style (concise and direct)
   + Add error avoidance records (3 items)

Confirm apply? (y/N)
```

### 5. Verbose Mode (-v/--verbose)

```bash
sa evolve docker-env -v
```

**Output Example:**
```
✔ Found: docker-env (OpenClaw)
✔ Workspace: TypeScript, React, pnpm
✔ Analysis complete

✅ docker-env evolved (1.0.0 → 1.1.0)
📝 Change Details:
   • Environment adaptation: TypeScript workspace hint
   • Style injection: Concise and direct style
📊 Stats: Skill size 15.2 KB, 3 historical versions
```

### 6. Debug Mode (--debug)

```bash
sa evolve docker-env --debug
```

**Output Example (Full Technical Output):**
```
🔄 Running evolution analysis...

📦 Analyzing: docker-env
   Version: 1.0.0
   Records: 2

📊 Step 1: Workspace Analysis
──────────────────────────────────────────────────────────────────
   Root: C:\Users\xxx\projects\my-app
   Languages: TypeScript, JavaScript
   Frameworks: React
   Package Manager: pnpm
   Build Tools: Vite

📋 Step 2: Skill Content Analysis
──────────────────────────────────────────────────────────────────
   Content Size: 15.2 KB
   Lines: 342
   Sections: 8
   Code Blocks: 12
   References: 5

🔧 Step 3: Environment Analysis
──────────────────────────────────────────────────────────────────
   OpenClaw Skills: C:\Users\xxx\.openclaw\skills
   Available Skills: 5
   Claude Code: C:\Users\xxx\.claude
   Commands: 3
   Skills: 2

💡 Step 4: Optimization Suggestions
──────────────────────────────────────────────────────────────────

   1. 🔴 [Package Manager]
      Suggestion: Update commands to use pnpm instead of npm
      Reason: Workspace uses pnpm as package manager
      Type: ⚙️ Auto-applicable

   ...

📌 Next Steps:
   sa evolve docker-env --apply   # Auto-apply 1 automatable optimization
   sa info docker-env            # View skill details
   sa log docker-env             # View version history
```

### 7. Apply Optimizations

```bash
sa evolve docker-env --apply
```

**Output Example:**
```
⚙️  Step 5: Apply Optimizations
──────────────────────────────────────────────────────────────────
   Applying: Update commands to use pnpm instead of npm...
      ✅ Updated package manager commands to pnpm

   ✅ Applied 1 optimization
   📦 Version: 1.1.0
   💾 Backup: SKILL.md.backup

📌 Next Steps:
   sa info docker-env        # View updated skill info
   sa log docker-env         # View version history
```

---

## Optimization Suggestion Categories

### 🔴 High Priority

| Category | Example Suggestion | Automatable |
|----------|-------------------|-------------|
| **Package Manager** | Replace npm with pnpm/yarn | ⚙️ Yes |
| **Path Localization** | Replace absolute paths with `${HOME}` | ⚙️ Yes |
| **Security** | Configure sensitive credentials | 📝 No |
| **Environment Variables** | Set environment variables | 📝 No |

### 🟡 Medium Priority

| Category | Example Suggestion | Automatable |
|----------|-------------------|-------------|
| **Framework Integration** | Add framework best practices | 📝 No |
| **Docker Integration** | Verify Docker environment | 📝 No |
| **Python Environment** | Configure virtual environment | 📝 No |
| **Network Access** | Verify external service connection | 📝 No |

### 🟢 Low Priority

| Category | Example Suggestion | Automatable |
|----------|-------------------|-------------|
| **Testing** | Add test cases | 📝 No |
| **Code Examples** | Add code examples | 📝 No |
| **Shell Compatibility** | Verify Shell script compatibility | 📝 No |

---

## Version Number Generation Rules

Semantic versioning is automatically generated after evolution:

| Change Type | Version Update | Example |
|-------------|----------------|---------|
| **Breaking Change** | Major | `1.0.0` → `2.0.0` |
| **New Feature** | Minor | `1.0.0` → `1.1.0` |
| **Bug Fix / Optimization** | Patch | `1.0.0` → `1.0.1` |
| **Security Fix** | Patch + tag | `1.0.0` → `v1.0.1-security-2` |
| **Cost Reduction** | Patch + tag | `v1.2.0-cost-15p` |

---

## Output Mode Configuration

Use `sa config` to set default output level:

```bash
sa config set outputLevel simple   # Simple mode (default)
sa config set outputLevel verbose  # Verbose mode
sa config set outputLevel debug    # Debug mode
```

---

## AI-Driven Evolution

### Core Features

Starting from v2.0, the evolution system uses **AI model-driven** instead of hardcoded rules:

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                     AI-DRIVEN EVOLUTION FLOW                                 │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│   sa evolve <skill>                                                          │
│        │                                                                     │
│        ▼                                                                     │
│   ┌─────────────────────────────────────────────┐                           │
│   │ Step 1: Static Analysis                      │                           │
│   │ • Skill content parsing (sections, code blocks)│                          │
│   │ • Reference link detection                  │                           │
│   └────────────────────┬────────────────────────┘                           │
│                        │                                                     │
│                        ▼                                                     │
│   ┌─────────────────────────────────────────────┐                           │
│   │ Step 2: Dynamic Context Loading             │                           │
│   │ • SOUL.md user preferences                  │                           │
│   │ • MEMORY.md history learning                │                           │
│   │ • Workspace environment detection           │                           │
│   │ • Session pattern analysis                  │                           │
│   └────────────────────┬────────────────────────┘                           │
│                        │                                                     │
│                        ▼                                                     │
│   ┌─────────────────────────────────────────────┐                           │
│   │ Step 3: AI Recommendation Generation (Streaming)│                        │
│   │ • Real-time AI thinking process display     │                           │
│   │ • Structured JSON suggestion output         │                           │
│   │ • Contains specific applicable content      │                           │
│   └────────────────────┬────────────────────────┘                           │
│                        │                                                     │
│                        ▼                                                     │
│   ┌─────────────────────────────────────────────┐                           │
│   │ Step 4: Apply Optimizations                 │                           │
│   │ • High confidence: Auto-apply              │                           │
│   │ • Low confidence: For user review          │                           │
│   └─────────────────────────────────────────────┘                           │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘
```

### Test Scripts

#### 1. Basic Test (Non-streaming)

```bash
npx ts-node tests/test-evolve-real.ts <skill-name>
# Example
npx ts-node tests/test-evolve-real.ts docker-env
npx ts-node tests/test-evolve-real.ts modelscope-cli
```

#### 2. Streaming Visualization Test

```bash
npx ts-node tests/test-evolve-streaming.ts <skill-name>
# Example
npx ts-node tests/test-evolve-streaming.ts docker-env
```

**Output Example:**
```
╔══════════════════════════════════════════════════════════════════════════════╗
║              🧬 AI Evolution - Streaming Visualization Test                  ║
╚══════════════════════════════════════════════════════════════════════════════╝

✔ AI model configured
   ├─ Model: glm-5
   ├─ Endpoint: https://coding.dashscope.aliyuncs.com/apps/anthropic
   └─ API Key: sk-sp-7d3b...ff89

✔ Skill loaded: docker-env (7152 bytes)

✔ Static analysis complete
   ├─ Sections: 20
   ├─ Code blocks: 19
   └─ Links: 8

✔ Dynamic context loaded
   ├─ Workspace info: TypeScript, JavaScript
   └─ Session patterns: 2 patterns

────────────────────────────────────────────────────────────
🤖 AI Evolution Process
────────────────────────────────────────────────────────────

💭 AI Thinking (streaming):
────────────────────────────────────────────────
1. **Requirement Analysis:**
    *   **Role:** Skill optimization expert.
    *   **Input Skill:** `docker-env`...
[Real-time streaming output of AI thinking process]
────────────────────────────────────────────────

✅ Thinking complete!

✔ Generated 3 recommendation(s)

════════════════════════════════════════════════════════════
📋 EVOLUTION RECOMMENDATIONS
════════════════════════════════════════════════════════════

🔴 [HIGH] Recommendation #1
──────────────────────────────────────────────────
   Title: Add npm scripts integration for Docker commands
   Type: env_adaptation
   Confidence: 90%
   ...
```

### AI Recommendation Types

| Type | Description | Example |
|------|-------------|---------|
| `env_adaptation` | Environment adaptation | Add TypeScript wrapper examples |
| `style_injection` | Style injection | Adjust output format per user preference |
| `error_avoidance` | Error avoidance | Add .gitignore rules |
| `best_practice` | Best practices | Enable browser tools for real-time search |

### Agent Loop Core Principles

> ⚠️ **Critical**: Evolved skills must include browser search capability!

AI-generated suggestions prioritize:
1. **Browser Tool Integration**: Ensure skills can use WebSearch/WebFetch for real-time information
2. **Dynamic Information Retrieval**: Don't rely on static links, dynamically search for latest versions
3. **ID Validation Mechanism**: Use browser to verify if APIs or models exist

See: `docs/EVOLUTION_REFACTORING.md` → Agent Loop Core Principles

---

## Test Steps

1. **View all skills status**
   ```bash
   sa evolve
   ```

2. **Analyze specific skill - with smart suggestions**
   ```bash
   # Default shows AI suggestions and related skill recommendations
   sa evolve <skill-name>

   # Expected output:
   # ──────────────────────────────────────────────────
   # 💡 Smart Recommendations
   # ──────────────────────────────────────────────────
   #    (Use --quick to skip this step)
   # 🔍 Analyzing skill... ✓
   #
   #    💡 Suggestion:
   #       → [AI-generated suggestion]
   #
   #    🎯 Related skills:
   #       • [skill-name] (xxx downloads)
   #       • [skill-name] (xxx downloads)
   #
   # ──────────────────────────────────────────────────
   ```

3. **Skip smart suggestions and evolve directly**
   ```bash
   sa evolve <skill-name> --quick
   # Expected: No Smart Recommendations shown, start evolution directly
   ```

4. **Test AI Evolution (Script)**
   ```bash
   # Basic test
   npx ts-node tests/test-evolve-real.ts <skill-name>

   # Streaming visualization test
   npx ts-node tests/test-evolve-streaming.ts <skill-name>
   ```

5. **Preview Changes**
   ```bash
   sa evolve <skill-name> --dry-run
   ```

6. **Apply Automatable Optimizations**
   ```bash
   sa evolve <skill-name> --apply
   ```

7. **Verify Optimization Results**
   ```bash
   sa log <skill-name>
   ```

---

## Smart Recommendations Test Checklist

### Feature Verification

| Check Item | Expected Result | Pass |
|------------|-----------------|------|
| Show AI suggestion | One-line concise improvement suggestion | ☐ |
| Show related skills | Up to 2 related skills + download count | ☐ |
| `--quick` skips suggestions | No Smart Recommendations shown | ☐ |
| API failure degradation | Show default suggestion, don't block flow | ☐ |

### Test Commands

```bash
# 1. Test default showing suggestions
sa evolve <skill-name>

# 2. Test skipping suggestions
sa evolve <skill-name> --quick

# 3. Test degradation when no AI config
# (Temporarily remove config or use environment without model config)
sa evolve <skill-name>
# Expected: Show default suggestion "Consider adding more examples and error handling"
```

### Performance Requirements

| Metric | Target |
|--------|--------|
| AI suggestion + skills.sh parallel fetch | < 3 seconds |
| Single skills.sh query | < 1 second |
| `--quick` no extra delay | 0 seconds |

---

## Next Steps

After evolution analysis, use `sa scan` for security scanning, or `sa share` to share the skill.