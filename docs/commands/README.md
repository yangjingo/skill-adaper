# Skill-Adapter Command Documentation

> 🎯 **Start Here** - This is the single entry point for CLI command documentation.

---

## Quick Navigation

| I want to... | Go to |
|--------------|-------|
| 📖 Learn a specific command | [Command Reference](#command-reference) |
| 🚀 Run test scenarios | [Test Scenarios](./scenarios.md) |
| 🔧 Troubleshoot issues | [scenarios.md - Troubleshooting](./scenarios.md#troubleshooting) |

---

## Command Reference

Detailed documentation for each command:

| Command | Description | File |
|---------|-------------|------|
| `sa init` | Initialize configuration | [01-init.md](./01-init.md) |
| `sa import` | Import/discover skills | [02-import.md](./02-import.md) |
| `sa info` | View skill information | [03-info.md](./03-info.md) |
| `sa evolve` | Evolution analysis | [04-evolve.md](./04-evolve.md) |
| `sa scan` | Security scan | [05-scan.md](./05-scan.md) |
| `sa export` | Export skills | [07-export.md](./07-export.md) |
| `sa share` | Share skills | [08-share.md](./08-share.md) |
| `sa config` | Configuration management | [09-config.md](./09-config.md) |
| `sa summary` | Evolution metrics comparison | [10-summary.md](./10-summary.md) |

---

## Command Flow Diagram

```
sa (newbie guide)
  │
  ├─→ sa init ─────────────────────→ Initialize config
  │
  ├─→ sa import ───────────────────→ Import skills
  │      │
  │      └─→ sa info ──────────────→ View skill details
  │             │
  │             └─→ sa evolve ─────→ Analyze & optimize
  │                    │
  │                    ├─→ sa summary ──→ View metrics
  │                    │
  │                    └─→ sa scan ─────→ Security check
  │                           │
  │                           └─→ sa share ──→ Export/Publish
  │
  └─→ sa config ──────────────────→ Manage preferences
```

---

## Quick Reference

### Phase 1: Discovery & Import
- `sa` - View newbie guidance
- `sa info` - View all platform skills
- `sa import` - Discover hot skills
- `sa import <skill>` - Import a skill

### Phase 2: Evolution & Analysis
- `sa evolve <skill>` - Analyze optimization
- `sa evolve <skill> --apply` - Apply optimizations
- `sa summary <skill>` - View evolution metrics

### Phase 3: Security & Export
- `sa scan <skill>` - Security scan
- `sa export <skill>` - Export as ZIP
- `sa share <skill> --zip` - Share as ZIP
- `sa share <skill> --pr` - Create PR

### Phase 4: Configuration
- `sa config` - View preferences
- `sa config set <key> <value>` - Set preference

---

## Files Overview

```
docs/commands/
├── README.md           ← You are here (Entry Point)
├── scenarios.md        ← Test scenarios
│
├── 01-init.md          ← Command details
├── 02-import.md
├── 03-info.md
├── 04-evolve.md
├── 05-scan.md
├── 07-export.md
├── 08-share.md
├── 09-config.md
└── 10-summary.md
```

---

## Test Scripts

Programmatic test scripts are located in `tests/`:

| Script | Description | Usage |
|--------|-------------|-------|
| `test-evolve-real.ts` | Test with real skill from OpenClaw | `npx ts-node tests/test-evolve-real.ts <skill>` |
| `test-evolve-streaming.ts` | Streaming AI thinking visualization | `npx ts-node tests/test-evolve-streaming.ts <skill>` |
| `test-model-connection.ts` | Test model connection and config | `npx ts-node tests/test-model-connection.ts` |

### Quick Test Commands

```bash
# Test model connection
npx ts-node tests/test-model-connection.ts

# Test AI evolution with real skill (basic)
npx ts-node tests/test-evolve-real.ts docker-env

# Test AI evolution with streaming visualization
npx ts-node tests/test-evolve-streaming.ts docker-env
```

---

## Need Help?

- **Command not working?** Check [scenarios.md - Troubleshooting](./scenarios.md#troubleshooting)
- **New to Skill-Adapter?** Run `sa` in terminal for newbie guidance