# 博客部署文档

## 仓库结构

本博客采用 **双仓库分离** 的部署方案：

- **myblog**（源码仓库）：存放 Jekyll 源码、文章、配置文件
- **zeroyi0211.github.io**（部署仓库）：存放生成的静态网站文件

## 技术栈

- **静态站点生成器**：Jekyll + Chalk 主题
- **部署平台**：GitHub Pages
- **构建工具**：Ruby + Bundler

---

## 本地开发

### 1. 环境要求

- Ruby (已安装版本见 `.ruby-version`)
- Bundler
- Git

### 2. 安装依赖

```powershell
bundle install
```

### 3. 本地预览

```powershell
bundle exec jekyll serve
```

访问 `http://localhost:4000` 查看效果

---

## 部署流程

### 完整工作流

```powershell
# 1. 写文章或修改配置
# 新文章放在 _posts/ 目录，命名格式：YYYY-MM-DD-title.md

# 2. 本地预览确认（可选）
bundle exec jekyll serve

# 3. 提交源码到 myblog 仓库
git add .
git commit -m "描述你的修改"
git push

# 4. 部署到 GitHub Pages
.\deploy.ps1 "部署说明"
```

### deploy.ps1 脚本说明

脚本自动完成以下步骤：

1. **构建站点**：执行 `bundle exec jekyll build` 生成 `_site` 目录
2. **初始化 Git**：在 `_site` 目录创建独立的 Git 仓库（首次运行）
3. **提交变更**：将生成的文件提交到本地仓库
4. **强制推送**：推送到 `zeroyi0211.github.io` 的 main 分支

#### 使用方式

```powershell
# 默认提交信息（自动生成时间戳）
.\deploy.ps1

# 自定义提交信息
.\deploy.ps1 "添加新文章：强化学习笔记"
```

---

## 文件结构

```
myblog/
├── _config.yml          # Jekyll 配置文件
├── _posts/              # 文章目录
├── _layouts/            # 页面布局模板
├── _includes/           # 可复用的页面片段
├── _sass/               # 样式文件
├── assets/              # 静态资源（图片、CSS、JS）
├── about.html           # 关于页面
├── tags.html            # 标签页面
├── deploy.ps1           # 部署脚本
├── Gemfile              # Ruby 依赖声明
├── .gitignore           # Git 忽略规则
└── _site/               # 生成的静态文件（不提交到源码仓库）
```

---

## 写文章指南

### 1. 创建文章文件

在 `_posts/` 目录下创建文件，命名格式：

```
YYYY-MM-DD-title.md
```

例如：`2024-06-13-my-first-post.md`

### 2. 文章头部（Front Matter）

```markdown
---
layout: post
title: "文章标题"
description: "文章描述（可选）"
tags: [标签1, 标签2]
---

文章正文从这里开始...
```

### 3. 常用 Markdown 语法

```markdown
# 一级标题
## 二级标题

**粗体** *斜体*

- 列表项1
- 列表项2

[链接文字](https://example.com)

![图片描述](/assets/images/pic.jpg)

​```python
代码块
​```
```

---

## 配置说明

主要配置项在 `_config.yml`：

```yaml
name: Xiaoyi's Blog          # 站点名称
description: "站点描述"
url: "https://zeroyi0211.github.io"  # 站点 URL
timezone: Asia/Shanghai      # 时区
lang: zh-CN                  # 语言

social:
  github: ZeroYi0211         # 社交链接
```

修改配置后需要重启本地服务器。

---

## GitHub Pages 设置

### 首次部署后需确认

访问 `https://github.com/ZeroYi0211/zeroyi0211.github.io/settings/pages`

确保设置如下：

- **Source**: Deploy from a branch
- **Branch**: main
- **Folder**: / (root)

### 查看部署状态

访问仓库的 Actions 页面：
`https://github.com/ZeroYi0211/zeroyi0211.github.io/actions`

每次推送后 GitHub 会自动触发部署，通常 1-2 分钟完成。

---

## 常见问题

### 1. 部署脚本执行失败

**问题**：`.\deploy.ps1` 提示权限错误

**解决**：
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### 2. 构建失败

**问题**：`bundle exec jekyll build` 报错

**解决**：
```powershell
# 重新安装依赖
bundle install
```

### 3. 本地预览正常但部署后样式错误

**原因**：`_config.yml` 中的 `url` 配置错误

**解决**：确保 `url: "https://zeroyi0211.github.io"`（末尾不要加 `/`）

### 4. 文章没有显示

**检查**：
- 文件名格式是否正确（`YYYY-MM-DD-title.md`）
- 文件是否在 `_posts/` 目录
- Front Matter 格式是否正确（需要 `layout: post`）
- 文章日期是否在未来（未来日期的文章不会显示）

---

## 迁移记录

- **2024-06-13**：从 Hexo 迁移到 Jekyll + Chalk 主题
- **原架构**：Hexo 源码在 myblog，生成文件推送到 zeroyi0211.github.io
- **新架构**：Jekyll 源码在 myblog，通过 deploy.ps1 脚本部署到 zeroyi0211.github.io
- **优势**：Jekyll 被 GitHub Pages 原生支持，部署更稳定

---

## 相关链接

- **博客地址**：https://zeroyi0211.github.io
- **源码仓库**：https://github.com/ZeroYi0211/myblog
- **部署仓库**：https://github.com/ZeroYi0211/zeroyi0211.github.io
- **Jekyll 文档**：https://jekyllrb.com/docs/
- **Chalk 主题**：https://github.com/nielsenramon/chalk
