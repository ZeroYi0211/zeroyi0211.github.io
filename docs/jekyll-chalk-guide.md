# Jekyll + Chalk 使用教程

这个仓库已经从 Hexo 迁移到 Jekyll，并使用 Chalk 模板的页面结构和样式。

原版 Chalk 使用较老的 `jekyll-assets` 插件。这个仓库改成了 Jekyll 原生 Sass 和普通静态资源路径，日常维护更简单。

## 环境

本地需要：

- Ruby 3.1.7
- Bundler
- Node.js 24.13.0
- npm

当前机器已经安装 RubyInstaller 3.1.7，路径通常是：

```powershell
C:\Ruby31-x64\bin\ruby.exe
```

如果新开的 PowerShell 里还不能直接运行 `ruby -v`，可以先重启终端，或者临时执行：

```powershell
$env:Path = "C:\Ruby31-x64\bin;$env:Path"
```

## 第一次安装依赖

在仓库根目录执行：

```powershell
npm run setup
```

这个命令会执行：

```powershell
bundle install
npm install
```

Ruby 依赖写在 `Gemfile`，前端资源依赖写在 `package.json`。

## 本地预览

启动本地服务：

```powershell
npm run local
```

默认访问：

```text
http://127.0.0.1:4000/
```

如果只想生成静态文件：

```powershell
npm run build
```

生成结果在 `_site/`，这个目录不会提交到 Git。

## 写新文章

文章放在 `_posts/` 目录，文件名必须是：

```text
YYYY-MM-DD-title.md
```

例子：

```text
_posts/2026-06-13-my-new-post.md
```

文章开头需要 front matter：

```yaml
---
layout: post
title: "My New Post"
date: 2026-06-13 20:30:00 +0800
description: "A short summary shown on the home page."
tags: [blog]
---
```

正文直接写 Markdown。

## 标签

文章里的每个标签都建议在 `_my_tags/` 下建一个同名定义文件。

如果文章使用：

```yaml
tags: [notes]
```

就新增：

```text
_my_tags/notes.md
```

内容：

```yaml
---
slug: notes
name: Notes
---
```

标签页在：

```text
/tags/
```

单个标签页在：

```text
/tag/notes/
```

## 图片

图片放在：

```text
assets/images/
```

建议使用英文小写文件名，例如：

```text
assets/images/my-photo.jpg
```

在页面或文章中引用图片时，可以用 Chalk 的 asset include：

```liquid
{% include image.html path="my-photo.jpg" path-detail="my-photo.jpg" alt="My photo" %}
```

如果只是普通 Markdown 图片，也可以这样引用：

```markdown
![My photo](/assets/images/my-photo.jpg)
```

## 修改站点信息

主要配置在 `_config.yml`：

- `name`: 站点名
- `description`: 站点描述
- `url`: 站点地址
- `blog_theme`: 默认主题，`light` 或 `dark`
- `theme_toggle`: 是否显示明暗主题切换
- `social.github`: GitHub 用户名

About 页面在：

```text
about.html
```

首页文章列表在：

```text
index.html
```

## 发布到 GitHub Pages

仓库已经配置 GitHub Actions：

```text
.github/workflows/pages.yaml
```

推送到 `main` 后，Actions 会自动：

1. 安装 Ruby 依赖
2. 安装 npm 依赖
3. 执行 `bundle exec jekyll build`
4. 上传 `_site/` 到 GitHub Pages

你平时只需要：

```powershell
git add .
git commit -m "Update blog"
git push
```

## 旧 Hexo 版本

迁移前的 Hexo 版本已经保存在 `old_version` 分支。

当前分支已经删除旧 Hexo 文件，包括：

- `source/`
- `themes/`
- `scaffolds/`
- `public/`
- `.deploy_git/`
- `_config.redefine.yml`
- `_config.landscape.yml`
- `db.json`

如果需要查看旧版：

```powershell
git switch old_version
```

回到当前 Jekyll 版本：

```powershell
git switch main
```
