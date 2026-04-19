# MotiClaw

[简体中文](./README_CN.md)

[![Website](https://img.shields.io/badge/Website-moticlaw.com-CB6E4E?logo=googlechrome&logoColor=white)](https://moticlaw.com)
[![License](https://img.shields.io/badge/License-Apache_2.0-2563EB?logo=apache&logoColor=white)](./LICENSE)
[![Last Commit](https://img.shields.io/github/last-commit/mileson/moticlaw)](https://github.com/mileson/moticlaw/commits/main)
[![Stars](https://img.shields.io/github/stars/mileson/moticlaw?style=social)](https://github.com/mileson/moticlaw)

> Self-hosted multi-agent control plane — manage the full lifecycle of your local agent team from a single interface, powered by OpenClaw and Hermes.

---

## Why MotiClaw

| Feature | Description |
|---------|-------------|
| **Local-first** | Your data and agents run on your own device — no third-party servers involved |
| **Agents, ready to go** | Hundreds of pre-configured agents built in. Claim one and it's working — no setup from scratch |
| **Zero learning curve** | No technical background needed. A few clicks to install, configure, and maintain |

### Core Capabilities

- **Agent Workspace** — Onboarding, identity, runtime status, channel access — manage the full agent lifecycle in one view
- **One-click Ops** — Install, repair, restart, update — one click, done. No commands to remember
- **Flexible Config** — AI models, gateway, system parameters — a visual config panel that keeps every setting clear and in control
- **Data Insights** — Token usage, call frequency, cost trends — multi-dimensional data at a glance

### Supported Platforms

- [OpenClaw](https://openclaw.ai/)
- [Hermes Agent](https://hermes-agent.nousresearch.com/)

---

## Install

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
npm i -g moticlaw    # or: pnpm add -g moticlaw
```

After installation, run `moticlaw status` to verify.

---

## CLI Reference

MotiClaw provides a command-line interface for managing your local agent infrastructure.

### Lifecycle

| Command | Description |
|---------|-------------|
| `moticlaw bootstrap` | One-click install — sets up the environment, starts services, and shows the first-login password |
| `moticlaw status` | Check the current status of all services |
| `moticlaw onboard` | Open the web console in your default browser |
| `moticlaw url` | Print the current access URL (local or public) |

### Diagnostics & Repair

| Command | Description |
|---------|-------------|
| `moticlaw doctor` | Run a full health check and report any issues |
| `moticlaw repair local` | One-click repair — automatically fix common local service issues |
| `moticlaw repair tunnel` | Repair the tunnel connection if public access is broken |

### Public Access

| Command | Description |
|---------|-------------|
| `moticlaw expose quick` | Create a temporary public URL for external access |

### Utilities

| Command | Description |
|---------|-------------|
| `moticlaw install-cli` | Install or repair the global `moticlaw` command |

---

## For AI Agents

> The following section is designed for AI Agents (Claude, Codex, GPT, etc.) to auto-deploy MotiClaw. Use the prompt below directly.

<details>
<summary><strong>Auto-Deploy Prompt</strong></summary>

```text
You are a deployment agent. Deploy MotiClaw by following these steps:

1. Install MotiClaw:
   curl -fsSL https://moticlaw.com/install.sh | bash

2. Start the service:
   moticlaw bootstrap

3. If bootstrap fails, run diagnostics and repair:
   moticlaw doctor
   moticlaw repair local

4. Verify the installation:
   moticlaw status

5. For public access (optional):
   moticlaw expose quick
   moticlaw url

6. Return the access URL to the user.
   Default local URL: http://127.0.0.1:3000
```

</details>

---

## Contributing

Issues and feature requests are welcome on [GitHub Issues](https://github.com/mileson/moticlaw/issues).

## Security

If you discover a security vulnerability, please report it privately via [GitHub Security Advisories](https://github.com/mileson/moticlaw/security/advisories).

## License

[Apache 2.0](./LICENSE)

## Author

- X: [Mileson07](https://x.com/Mileson07)
- Xiaohongshu: [超级峰](https://xhslink.com/m/4LnJ9aB1f97)
- Douyin: [超级峰](https://v.douyin.com/rH645q7trd8/)
