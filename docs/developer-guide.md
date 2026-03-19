# 开发者指南

> 构建、测试、发布 Skill-Adapter

---

## 安装

> ⚠️ **注意**: 以下安装命令需要在 **发布到 npm 后** 才能使用。如果包还未发布，请使用 [本地开发](#开发) 方式。

### 从 npm 安装

```bash
# npm 官方源
npm install -g skill-adapter

# 使用淘宝镜像 (国内推荐)
npm install -g skill-adapter --registry https://registry.npmmirror.com

# 使用清华镜像
npm install -g skill-adapter --registry https://mirrors.tuna.tsinghua.edu.cn/npm/
```

### 配置镜像源

```bash
# 临时使用镜像源
npm install -g skill-adapter --registry https://registry.npmmirror.com

# 永久配置镜像源
npm config set registry https://registry.npmmirror.com

# 恢复官方源
npm config set registry https://registry.npmjs.org/
```

### 常用镜像源

| 镜像 | 地址 |
|------|------|
| npm 官方 | https://registry.npmjs.org/ |
| 淘宝 | https://registry.npmmirror.com |
| 清华 | https://mirrors.tuna.tsinghua.edu.cn/npm/ |
| 华为云 | https://mirrors.huaweicloud.com/repository/npm/ |

---

## 开发环境

### 环境要求

| 工具 | 版本 |
|------|------|
| Node.js | >= 18.0.0 |
| npm | >= 9.0.0 |
| TypeScript | 5.3+ |

### 克隆与安装

```bash
# 克隆仓库
git clone https://github.com/your-repo/skill-adapter.git
cd skill-adapter

# 安装依赖
npm install
```

### 项目结构

```
skill-adapter/
├── src/
│   ├── cli.ts           # CLI 入口
│   ├── index.ts         # 导出
│   └── core/            # 核心模块
│       ├── evolution/   # AI 进化引擎
│       ├── discovery/   # 技能发现
│       ├── security/    # 安全扫描
│       └── ...
├── tests/               # 测试文件
├── docs/                # 文档
├── dist/                # 构建输出 (gitignored)
├── package.json
└── tsconfig.json
```

---

## 开发

### 本地开发

```bash
# 开发模式 (使用 ts-node 直接运行)
npm run dev

# 或先构建再运行
npm run build
npm start
```

### 开发时链接

在本地测试 CLI 命令：

```bash
# 链接到全局
npm link

# 现在可以直接使用 sa 命令
sa --version
sa info
sa evolve my-skill

# 取消链接
npm unlink -g skill-adapter
```

### 调试 AI 连接

```bash
# 测试模型配置和连接
npx ts-node tests/test-model-connection.ts

# 测试 AI 进化流程
npx ts-node tests/test-evolve-streaming.ts
```

---

## 构建

### 编译 TypeScript

```bash
npm run build
```

输出目录：`dist/`

### 构建产物

```
dist/
├── cli.js              # CLI 入口 (#!/usr/bin/env node)
├── index.js            # 模块导出
└── core/               # 核心模块
    ├── evolution/
    ├── discovery/
    └── ...
```

### 检查构建

```bash
# 确认 CLI 可执行
node dist/cli.js --version

# 检查导出
node -e "console.log(Object.keys(require('./dist')))"
```

---

## 测试

### 运行测试

```bash
# 运行所有测试
npm test

# 单独测试模块
npm run test:cli
npm run test:security
npm run test:versioning
npm run test:registry
```

### 测试覆盖

| 测试文件 | 测试内容 |
|---------|---------|
| `test-cli.js` | CLI 命令解析 |
| `test-security.js` | 安全扫描功能 |
| `test-versioning.js` | 版本管理 |
| `test-registry.js` | Registry API |
| `test-model-connection.ts` | AI 模型连接 |
| `test-evolve-streaming.ts` | AI 进化流程 |

---

## 发布

### 1. 版本更新

```bash
# 更新版本号 (根据变更类型选择)
npm version patch    # 1.2.0 → 1.2.1 (Bug 修复)
npm version minor    # 1.2.0 → 1.3.0 (新功能)
npm version major    # 1.2.0 → 2.0.0 (Breaking Change)
```

### 2. 构建 & 测试

```bash
# 确保构建成功
npm run build

# 运行测试
npm test
```

### 3. 发布到 npm

```bash
# 登录 npm (首次)
npm login

# 发布
npm publish
```

### 自动发布 (GitHub Actions)

创建 `.github/workflows/publish.yml`：

```yaml
name: Publish to npm

on:
  release:
    types: [created]

jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          registry-url: 'https://registry.npmjs.org'

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build

      - name: Publish to npm
        run: npm publish
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
```

**配置步骤**：

1. 在 npm 网站生成 Access Token (Automation 类型)
2. 在 GitHub 仓库 → Settings → Secrets → Actions → 添加 `NPM_TOKEN`
3. 在 GitHub 创建 Release，自动触发发布

### 手动发布流程

```bash
# 1. 更新版本
npm version patch/minor/major

# 2. 构建
npm run build

# 3. 发布到 npm
npm publish

# 4. 推送 tag 到 GitHub (触发 Release)
git push --tags
```

### 4. 发布验证

```bash
# 全局安装测试
npm install -g skill-adapter@latest

# 验证
sa --version
```

---

## 版本管理规范

### Semantic Versioning

```
MAJOR.MINOR.PATCH

MAJOR - 不兼容的 API 变更
MINOR - 向后兼容的新功能
PATCH - 向后兼容的 Bug 修复
```

### Commit 规范

```
feat: 添加新功能
fix: Bug 修复
docs: 文档更新
refactor: 代码重构
test: 测试相关
chore: 构建/工具相关
```

### 发布检查清单

- [ ] 更新版本号 (`npm version`)
- [ ] 更新 CHANGELOG.md
- [ ] 运行 `npm run build` 确认构建成功
- [ ] 运行 `npm test` 确认测试通过
- [ ] 提交 Git tag (`git push --tags`)
- [ ] 发布到 npm (`npm publish`)
- [ ] 验证安装 (`npm install -g skill-adapter@latest`)

---

## 常见问题

### Q: 构建时报 TypeScript 错误？

```bash
# 检查 TypeScript 版本
npx tsc --version

# 清理后重新构建
rm -rf dist/
npm run build
```

### Q: npm publish 失败？

```bash
# 检查登录状态
npm whoami

# 检查包名是否被占用
npm search skill-adapter

# 检查 .npmignore 或 files 字段
```

### Q: 如何测试未发布的版本？

```bash
# 方法 1: npm link
npm link
sa --version

# 方法 2: 直接运行
node dist/cli.js --version

# 方法 3: npm pack
npm pack
npm install -g ./skill-adapter-1.2.0.tgz
```

---

*最后更新: 2026-03-19*