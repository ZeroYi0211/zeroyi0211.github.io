# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概况

这是一个基于 Jekyll + Chirpy 主题的个人技术博客，部署在 GitHub Pages。中文为主要语言。

- **主题**：jekyll-theme-chirpy 7.6
- **Ruby 版本**：3.1.7（Windows 本地安装在 `C:\Ruby31-x64`）
- **部署方式**：双仓库手动部署
  - **源码仓库**：ZeroYi0211/myblog（私有，存放 Jekyll 源码）
  - **部署仓库**：ZeroYi0211/zeroyi0211.github.io（公开，存放生成的静态网站）

## 常用命令

本地所有命令通过 npm scripts 执行，已固定使用 `C:\Ruby31-x64\bin\bundle.bat`，避免路径冲突：

```powershell
# 安装依赖（首次运行或 Gemfile 变更后）
npm run setup

# 启动本地预览服务（含草稿和热重载）
npm run local
# 访问 http://127.0.0.1:4000/

# 构建静态站点到 _site/
npm run build

# 清理构建缓存
npm run clean
```

**验证规则**：改完文章或配置后，必须运行 `npm run local` 确认本地渲染正常，再提交。

**部署方式**：使用 `deploy.ps1` 手动部署到 zeroyi0211.github.io 仓库。

```powershell
# 部署到 GitHub Pages（带默认提交信息）
.\deploy.ps1

# 部署到 GitHub Pages（自定义提交信息）
.\deploy.ps1 "添加新文章：强化学习笔记"
```

## 架构和约定

### 目录结构

```
_posts/               # 博客文章，文件名必须是 YYYY-MM-DD-title.md
_tabs/                # 顶部导航页（About/Archives/Categories/Tags）
_data/                # 站点数据（authors.yml、contact.yml、share.yml、media.yml）
assets/img/           # 头像、favicons、分享预览图（og-image.jpg）
assets/img/favicons/  # 网站图标（favicon.ico、apple-touch-icon.png 等）
assets/images/        # 文章配图（用于博客文章中引用的图片）
_config.yml           # 站点全局配置（标题、URL、GitHub 用户名等）
```

**图片管理约定**：
- 站点头像：`assets/img/avatar.jpg`
- 分享预览图：`assets/img/og-image.jpg`（在 _config.yml 中配置为 social_preview_image）
- 网站图标：`assets/img/favicons/` 目录下的各种尺寸 favicon
- 文章配图：`assets/images/` 目录，Markdown 中引用 `/assets/images/filename.jpg`

### 文章写作约定

文章文件名格式严格要求：`YYYY-MM-DD-标题.md`

Front matter 必填字段：

```yaml
---
title: "文章标题"
date: 2026-06-24 20:30:00 +0800
description: "摘要，显示在首页和分享卡片"
categories: [主分类, 子分类]  # 中括号，首字母大写
tags: [tag1, tag2]            # 小写，多词用连字符
---
```

可选字段：
- `math: true` — 文章包含 LaTeX 公式时开启
- `pin: true` — 置顶文章

公式语法：
- 行内：`$F = ma$`
- 块级：`$$\nM\ddot{x} + B\dot{x} + Kx = F\n$$`

### 配置变更

修改 `_config.yml` 后必须重启本地预览服务（Ctrl+C 后重新 `npm run local`）。

导航页内容直接编辑 `_tabs/` 下的对应 Markdown 文件。

社交图标配置在 `_data/contact.yml`，分享按钮配置在 `_data/share.yml`。

作者信息配置在 `_data/authors.yml`（如需在文章 front matter 中指定 author 字段）。

### 双仓库部署流程

本项目使用双仓库分离部署方式：

**工作流程**：
1. 在 myblog 仓库开发和写文章
2. 本地预览确认（`npm run local`）
3. 提交源码到 myblog 仓库（`git add . && git commit && git push`）
4. 运行部署脚本（`.\deploy.ps1`）将生成的 `_site/` 推送到 zeroyi0211.github.io 仓库
5. GitHub Pages 自动发布到 https://zeroyi0211.github.io

**deploy.ps1 脚本说明**：
- 自动构建站点（`bundle exec jekyll build`）
- 在 `_site/` 目录初始化独立 Git 仓库
- 添加 `.nojekyll` 文件（告诉 GitHub Pages 不要重新构建）
- 强制推送到 zeroyi0211.github.io 仓库的 main 分支

**注意事项**：
- myblog 仓库是私有的，存放源码
- zeroyi0211.github.io 仓库是公开的，存放构建后的静态文件
- 不要手动修改 zeroyi0211.github.io 仓库，所有改动都应在 myblog 仓库进行

## 主题特性

Chirpy 主题由 gem 提供，本仓库不包含主题源码。核心功能：

- **自动页面**：分类页、标签页、归档页由主题生成，无需手动维护
- **代码高亮**：Rouge 语法高亮器，支持行号（块级代码默认开启）
- **数学公式**：集成 MathJax/KaTeX，front matter 设 `math: true` 启用
- **PWA 支持**：已启用（`pwa.enabled: true`）
- **分页**：首页每页 10 篇（`paginate: 10`）

## 已知限制和注意事项

- **Ruby 版本绑定**：package.json 中的脚本硬编码了 Ruby 路径，换机器需修改
- **GFM 代码块渲染**：已配置 `input: GFM` 支持 GitHub 风格 Markdown
- **有序列表渲染修复**：已应用（commit 5647219），若遇到列表渲染问题先检查是否缺少空行
- **assets/images/ 目录**：保留用于文章配图，内含备份文件（avatar-backup.jpg、og-image-backup.jpg）为旧主题遗留，已清理重复的 favicon 文件
- **GitHub Actions 配置**：`.github/workflows/pages.yaml` 存在但未使用，因为采用手动部署方式

## 为什么使用双仓库而不是 GitHub Actions？

- **源码私有**：myblog 仓库保持私有，不公开文章源码
- **GitHub Pages 限制**：免费版要求公开仓库才能使用 GitHub Actions 部署
- **解决方案**：在本地构建，推送静态文件到公开的 zeroyi0211.github.io 仓库

## 旧版本

Hexo 旧版本保存在 `old_version` 分支，查看方式：

```powershell
git switch old_version  # 切换到旧版
git switch main         # 返回当前版本
```
