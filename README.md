<a id="moticlaw-官网"></a>

<div align="center">

# MotiClaw · 公开官网源码

**查阅和维护 MotiClaw 官网运行所需的公开部分。**

官网源码 · 本地开发 · 生产构建

[![中文说明](https://img.shields.io/badge/%E8%AF%B4%E6%98%8E-%E7%AE%80%E4%BD%93%E4%B8%AD%E6%96%87-059669)](#readme-detail-features)
[![项目类型](https://img.shields.io/badge/%E9%A1%B9%E7%9B%AE-Web-6366f1)](#readme-detail-features)

[✨ 核心特性](#readme-detail-features) · [✅ 适用场景](#readme-detail-audience) · [🧩 模块速查](#readme-detail-9) · [🧪 本地开发](#readme-detail-5) · [🧪 构建](#readme-detail-7)

</div>

---

这里仅保留 [MotiClaw 官网](https://www.moticlaw.com)运行所需的公开源码。

<a id="readme-detail-features"></a>

## ✨ 核心特性

- **公开网站实现。** src 保存官网页面与应用实现。
- **静态资源集中。** public 保留官网使用的公开静态素材。
- **构建与开发分开。** 现有命令分别用于本地开发、构建和启动。

<a id="readme-detail-audience"></a>

## ✅ 适用场景

适合查阅 MotiClaw 公开官网实现的开发者。

<a id="readme-section-1"></a>

<a id="本地开发"></a>

<a id="readme-detail-5"></a>

## 🧪 本地开发

从下面的现有入口开始，按顺序准备环境、配置并完成首次运行。

```bash
pnpm install
pnpm dev
```

<a id="readme-section-2"></a>

<a id="构建"></a>

<a id="readme-detail-7"></a>

## 🧪 构建

```bash
pnpm build
pnpm start
```

<a id="readme-section-3"></a>

<a id="仓库导航"></a>

<a id="readme-detail-9"></a>

## 🧩 模块速查

按要处理的工作选择入口，先看模块职责，再进入对应文件或目录。

| 模块入口 | 负责什么 | 什么时候看 |
| --- | --- | --- |
| [`package.json`](package.json) | 依赖、开发与验证命令 | 核对依赖、工程目标与现有命令 |
| [`public/`](public/) | 公开静态资源 | 维护图片、静态文件和展示素材 |
| [`src/`](src/) | 应用或服务实现 | 定位应用界面与业务实现 |
