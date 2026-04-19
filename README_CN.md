# MotiClaw

[English](./README.md)

[![Website](https://img.shields.io/badge/Website-moticlaw.com-CB6E4E?logo=googlechrome&logoColor=white)](https://moticlaw.com)
[![License](https://img.shields.io/badge/License-Apache_2.0-2563EB?logo=apache&logoColor=white)](./LICENSE)
[![Last Commit](https://img.shields.io/github/last-commit/mileson/moticlaw)](https://github.com/mileson/moticlaw/commits/main)
[![Stars](https://img.shields.io/github/stars/mileson/moticlaw?style=social)](https://github.com/mileson/moticlaw)

> **自部署多 Agent 控制面** — 架在 OpenClaw / Hermes 之上，让你用一个界面管理本地 Agent 团队的全生命周期。

---

## 为什么选 MotiClaw

| 特色 | 说明 |
|------|------|
| **本地优先** | 数据和 Agent 都运行在你自己的设备上，不经过任何第三方服务器 |
| **Agent 开箱即用** | 内置上百个预配置 Agent，一键领取就能上岗，不用从零搭建 |
| **零门槛管理** | 不需要技术背景，点几下就能完成安装、配置和日常运维 |

### 核心能力

- **Agent 工区** — 入职、身份、运行状态、渠道接入，一个视图管理 Agent 全生命周期
- **一键管理** — 安装、修复、重启、更新，点一下就完成，不用记任何命令
- **灵活配置** — AI 模型、网关、系统参数，可视化配置面板让每项设置都清晰可控
- **数据可视分析** — Token 消耗、调用频次、成本趋势，多维度数据一目了然

### 支持平台

- [OpenClaw](https://openclaw.ai/)
- [Hermes Agent](https://hermes-agent.nousresearch.com/)

---

## 安装

### macOS / Linux

```bash
curl -fsSL https://moticlaw.com/install.sh | bash
```

### Windows (PowerShell)

```powershell
Invoke-WebRequest https://moticlaw.com/install.ps1 -OutFile $env:TEMP\moticlaw-install.ps1
powershell -ExecutionPolicy Bypass -File $env:TEMP\moticlaw-install.ps1
```

### npm / pnpm

```bash
npm i -g moticlaw    # 或 pnpm add -g moticlaw
```

安装完成后执行 `moticlaw status` 验证。

---

## CLI 命令参考

MotiClaw 提供命令行工具来管理你的本地 Agent 基础设施。

### 生命周期

| 命令 | 说明 |
|------|------|
| `moticlaw bootstrap` | 一键安装——自动配置环境、启动服务、展示首次登录密码 |
| `moticlaw status` | 查看所有服务的当前状态 |
| `moticlaw onboard` | 在默认浏览器中打开控制台 |
| `moticlaw url` | 输出当前访问地址（本地或公网） |

### 诊断与修复

| 命令 | 说明 |
|------|------|
| `moticlaw doctor` | 运行全面健康检查并报告问题 |
| `moticlaw repair local` | 一键修复——自动修复常见的本地服务问题 |
| `moticlaw repair tunnel` | 修复公网访问的隧道连接 |

### 公网访问

| 命令 | 说明 |
|------|------|
| `moticlaw expose quick` | 创建临时公网地址，让外部可以访问 |

### 工具

| 命令 | 说明 |
|------|------|
| `moticlaw install-cli` | 安装或修复全局 `moticlaw` 命令 |

---

## 给 AI Agent 的自动部署指南

> 以下内容面向 AI Agent（Claude / Codex / GPT 等），可直接作为 prompt 使用。

<details>
<summary><strong>自动部署 Prompt</strong></summary>

```text
你是部署代理。请按以下步骤部署 MotiClaw：

1. 安装 MotiClaw：
   curl -fsSL https://moticlaw.com/install.sh | bash

2. 启动服务：
   moticlaw bootstrap

3. 如果 bootstrap 失败，执行诊断与修复：
   moticlaw doctor
   moticlaw repair local

4. 验证安装：
   moticlaw status

5. 如需公网访问（可选）：
   moticlaw expose quick
   moticlaw url

6. 将访问地址返回给用户。
   默认本地地址：http://127.0.0.1:3000
```

</details>

---

## 参与反馈

欢迎在 [GitHub Issues](https://github.com/mileson/moticlaw/issues) 提交问题和功能建议。

## 安全

如果你发现安全漏洞，请通过 [GitHub Security Advisories](https://github.com/mileson/moticlaw/security/advisories) 私下报告。

## 许可证

[Apache 2.0](./LICENSE)

## 作者

- X: [Mileson07](https://x.com/Mileson07)
- 小红书: [超级峰](https://xhslink.com/m/4LnJ9aB1f97)
- 抖音: [超级峰](https://v.douyin.com/rH645q7trd8/)
