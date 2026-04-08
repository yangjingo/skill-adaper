# CLI 重构文档

> Updated: 2026-03-28

## 背景与目标

当前 `src/cli.ts` 同时承担了参数解析、业务编排、业务实现、输出渲染，导致：

- 逻辑耦合高，命令之间复用困难
- `--help` 信息和真实行为容易漂移
- 对 Agent 场景不够友好（输出不稳定、动作不可预测）

重构目标：

1. CLI 变为“薄入口 + 稳定编排层”
2. 业务逻辑下沉到 `src/core/*` 服务层
3. 提升 Agent 可操作性和终端用户可用性

---

## 三大块

## CLI 变得更加易于让 Agent 操作

### 设计原则

- 稳定输出：同一输入下输出结构尽可能固定
- 明确状态：每个命令给出 `成功/失败/下一步` 三段式结论
- 可脚本化：支持 `--json`（分阶段补齐）与非交互模式
- 可恢复：错误提示提供可执行修复命令

### 命令关系图（生命周期）

```text
init/config
   ↓
import → info/list
   ↓
evolve (--apply)
   ↓
summary/log
   ↓
scan (可独立，也可前置)
   ↓
export/share
```

### Agent 优先改造项

1. 为 `import/evolve/summary/log/scan/share` 增加统一的结构化结果对象（内部）
2. 输出规范化：标题、状态、错误码、next steps 统一模板
3. 为核心命令补 `--json`（优先：`summary`、`log`、`scan`）
4. 为 `share/export` 增加非交互参数组合校验（减少运行期追问）

---

# CLI 的逻辑简化

### 现状

`src/cli.ts` 仍包含较多业务实现（尤其 `import`、`evolve`、`info/list`、`log`）。

### 分层目标

```text
cli.ts (Commander 路由 + 参数校验 + 调用 service)
   -> core/<domain>/command-service.ts (业务编排)
      -> core/<domain>/*.ts (领域能力)
```

### 拆分优先级

1. **P1** `sa import` 下沉：来源识别、平台查询、导入决策、扫描、落库
2. **P1** `sa evolve` 下沉：上下文构建、建议生成、apply、record
3. **P2** `sa info` + `sa list` 合并服务：目录扫描和展示模型统一
4. **P2** `sa log` 下沉：patch/telemetry 解析与渲染
5. **P3** `sa config` 下沉：`get/set/reset` 校验逻辑服务化

### 完成标准

- `cli.ts` 每个命令 action 控制在“参数处理 + 调用 + 输出”范围
- 业务测试不依赖 Commander 实例
- 新增命令无需复制旧命令逻辑

---

# CLI 的易用性改造

### `--help` 改造目标

每个命令 `--help` 至少包含：

1. 用途一句话
2. 关键参数解释（含默认值）
3. 2-4 个常见示例
4. 常见错误与修复建议

### 优先补齐的命令

1. `sa config --help`：补 `get/set/reset`、可用 key 与值域
2. `sa summary --help`：补“需先存在 evolve 记录”的提示
3. `sa import --help`：补“远端 recommendation-only”行为说明
4. `sa scan --help`：明确 `--apply` 依赖 `--repair`
5. 顶层 `sa --help`：增加 quickstart 路径

### 用户指导文档

- 对齐 `docs/commands/*` 与真实 CLI 行为
- 在每个命令文档增加“失败时下一步”
- 增加从新手到发布的最短路径：
  - `import -> info -> evolve -> summary -> scan -> share`

---

## 里程碑

### Milestone 1（CLI 薄化）

- 完成 `import`、`evolve` 下沉
- `cli.ts` 复杂度明显下降

### Milestone 2（Help 与指导）

- 全命令 `--help` 补齐示例和约束
- `docs/commands/*` 与命令输出一致

### Milestone 3（Agent 友好）

- 核心命令支持 `--json`
- 输出模板统一，便于自动化编排

