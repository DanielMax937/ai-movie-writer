# 🚀 GitHub 仓库设置指南

## ✅ 当前状态

Git 仓库已初始化并完成首次提交！

```
✅ Git 已初始化
✅ 所有文件已提交
✅ 42 个文件，12,328 行代码
✅ 准备推送到 GitHub
```

---

## 📝 创建 GitHub 仓库

### 方法 1: 通过 GitHub 网站（推荐）

1. **访问 GitHub**
   - 打开 https://github.com
   - 登录你的账号

2. **创建新仓库**
   - 点击右上角 "+" → "New repository"
   - 或访问: https://github.com/new

3. **填写仓库信息**
   ```
   Repository name: ai-movie-writer
   Description: 🎬 AI ScriptWriter - Multi-agent screenplay generation system powered by AI
   
   ☑️ Public (推荐) 或 ☐ Private
   ☐ 不要勾选 "Add a README file"
   ☐ 不要勾选 "Add .gitignore"
   ☐ 不要勾选 "Choose a license"
   ```

4. **点击 "Create repository"**

---

### 方法 2: 使用 GitHub CLI

```bash
# 安装 GitHub CLI (如果还没有)
brew install gh

# 登录
gh auth login

# 创建仓库
gh repo create ai-movie-writer --public --source=. --remote=origin --push
```

---

## 🔗 连接到 GitHub

### 如果使用方法 1（网站创建），执行以下命令：

```bash
cd /Users/daniel/Desktop/git/ai-movie-writer

# 添加远程仓库（替换 YOUR_USERNAME）
git remote add origin https://github.com/YOUR_USERNAME/ai-movie-writer.git

# 推送代码
git branch -M main
git push -u origin main
```

### 如果使用方法 2（CLI），已自动完成！

---

## 🔐 环境变量安全

### ⚠️ 重要：不要提交敏感信息

`.gitignore` 已配置忽略 `.env*` 文件，但请确认：

```bash
# 检查是否有敏感文件被追踪
git ls-files | grep -E "\.env"

# 如果有，立即移除
git rm --cached .env.local
git commit -m "Remove sensitive files"
```

### 📝 在 README 中添加环境变量说明

用户需要创建自己的 `.env.local`：

```bash
# .env.local (用户需要自己创建)
CUSTOM_API_BASE_URL=your_api_base_url
CUSTOM_API_KEY=your_api_key
CUSTOM_MODEL_NAME=your_model_name
```

---

## 📋 推荐的仓库设置

### 1. 添加 Topics（标签）

在 GitHub 仓库页面，点击 "Add topics"，添加：
```
ai
nextjs
typescript
multi-agent
screenplay
creative-writing
vercel-ai-sdk
zustand
shadcn-ui
```

### 2. 设置 About（关于）

```
Description: 
🎬 AI-powered screenplay generation system using multi-agent collaboration. 
Create complete movie scripts with AI Director, Actors, and Summarizer agents.

Website: 
https://your-deployment-url.vercel.app (部署后添加)

Topics: 
ai, nextjs, typescript, multi-agent, screenplay, creative-writing
```

### 3. 启用 Issues

- ☑️ Issues
- ☑️ Discussions (可选)
- ☑️ Projects (可选)

### 4. 添加 LICENSE

创建 `LICENSE` 文件（MIT License）：

```bash
cat > LICENSE << 'EOF'
MIT License

Copyright (c) 2026 [Your Name]

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
EOF

git add LICENSE
git commit -m "Add MIT License"
git push
```

---

## 🎨 添加 GitHub 社交预览图

### 创建预览图（推荐尺寸：1280x640px）

1. 设计一个包含项目 logo 和标题的图片
2. 在 GitHub 仓库设置中上传
3. Settings → General → Social preview → Upload an image

---

## 📊 添加 Badges（徽章）

在 `README.md` 顶部添加：

```markdown
# AI 编剧室 (AI ScriptWriter)

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Next.js](https://img.shields.io/badge/Next.js-15-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue)](https://www.typescriptlang.org/)
[![Vercel AI SDK](https://img.shields.io/badge/Vercel%20AI%20SDK-6.0-green)](https://sdk.vercel.ai/)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](http://makeapullrequest.com)

一个基于多智能体系统的 AI 电影剧本创作应用
```

---

## 🔄 后续更新流程

### 日常开发流程

```bash
# 1. 修改代码
# 2. 查看改动
git status
git diff

# 3. 提交改动
git add .
git commit -m "描述你的改动"

# 4. 推送到 GitHub
git push
```

### 创建功能分支

```bash
# 创建新分支
git checkout -b feature/new-feature

# 开发和提交
git add .
git commit -m "Add new feature"

# 推送分支
git push -u origin feature/new-feature

# 在 GitHub 创建 Pull Request
```

---

## 📦 发布版本

### 创建 Release

```bash
# 打标签
git tag -a v1.0.0 -m "Release version 1.0.0"
git push origin v1.0.0
```

在 GitHub 上：
1. 进入 Releases 页面
2. 点击 "Create a new release"
3. 选择标签 `v1.0.0`
4. 填写发布说明
5. 点击 "Publish release"

---

## 🌐 部署到 Vercel

### 从 GitHub 部署

1. **访问 Vercel**
   - https://vercel.com
   - 使用 GitHub 账号登录

2. **导入项目**
   - 点击 "New Project"
   - 选择 `ai-movie-writer` 仓库
   - 点击 "Import"

3. **配置环境变量**
   ```
   CUSTOM_API_BASE_URL=https://ark.cn-beijing.volces.com/api/v3
   CUSTOM_API_KEY=your_api_key
   CUSTOM_MODEL_NAME=your_model_name
   ```

4. **部署**
   - 点击 "Deploy"
   - 等待部署完成
   - 获取部署 URL

5. **后续更新**
   - 推送到 GitHub 后自动部署
   - 或在 Vercel Dashboard 手动触发

---

## 📝 完整的仓库 URL 结构

创建完成后，你的仓库 URL 将是：

```
https://github.com/YOUR_USERNAME/ai-movie-writer
```

### 示例：
```
https://github.com/danielsmith/ai-movie-writer
```

### 克隆命令：
```bash
git clone https://github.com/YOUR_USERNAME/ai-movie-writer.git
```

---

## 🔒 访问权限设置

### Public 仓库（推荐）
- ✅ 任何人都可以查看
- ✅ 适合开源项目
- ✅ 可以被搜索到
- ✅ 可以获得 Star 和 Fork

### Private 仓库
- 🔒 仅你和协作者可以访问
- 🔒 需要邀请其他人
- 🔒 不会出现在搜索结果中

### 添加协作者（如果需要）
1. Settings → Collaborators
2. 点击 "Add people"
3. 输入 GitHub 用户名或邮箱
4. 选择权限级别

---

## 📧 分享给其他人

### 分享仓库链接
```
🎬 AI 编剧室 - AI 驱动的多智能体剧本创作系统

GitHub: https://github.com/YOUR_USERNAME/ai-movie-writer
在线演示: https://your-app.vercel.app (部署后)

特点：
✨ 多智能体协作创作
🎭 自动生成角色和对话
📝 标准剧本格式输出
🚀 实时可视化创作过程

快速开始：
git clone https://github.com/YOUR_USERNAME/ai-movie-writer.git
cd ai-movie-writer
npm install
npm run dev
```

---

## 🎯 下一步行动

### 立即执行：

1. **创建 GitHub 仓库**
   ```bash
   # 访问 https://github.com/new
   # 创建名为 ai-movie-writer 的仓库
   ```

2. **连接并推送**
   ```bash
   cd /Users/daniel/Desktop/git/ai-movie-writer
   git remote add origin https://github.com/YOUR_USERNAME/ai-movie-writer.git
   git branch -M main
   git push -u origin main
   ```

3. **添加 LICENSE**
   ```bash
   # 创建 LICENSE 文件（见上文）
   ```

4. **部署到 Vercel**
   ```bash
   # 访问 https://vercel.com
   # 导入 GitHub 仓库
   ```

5. **更新 README**
   ```bash
   # 添加部署 URL 和 badges
   ```

---

## ✅ 完成检查清单

- [ ] 创建 GitHub 仓库
- [ ] 推送代码到 GitHub
- [ ] 添加 LICENSE 文件
- [ ] 设置仓库描述和 Topics
- [ ] 添加 README badges
- [ ] 部署到 Vercel
- [ ] 更新 README 中的部署 URL
- [ ] 测试在线版本
- [ ] 分享给朋友或社区

---

## 🆘 常见问题

### Q: 推送失败，提示认证错误？
```bash
# 使用 Personal Access Token
# 1. 访问 GitHub Settings → Developer settings → Personal access tokens
# 2. 生成新 token（选择 repo 权限）
# 3. 使用 token 作为密码
```

### Q: 如何更改仓库名？
```bash
# 在 GitHub 上：Settings → Repository name → Rename
# 本地更新：
git remote set-url origin https://github.com/YOUR_USERNAME/NEW_NAME.git
```

### Q: 如何删除敏感信息？
```bash
# 如果不小心提交了敏感信息
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch .env.local" \
  --prune-empty --tag-name-filter cat -- --all

git push origin --force --all
```

---

## 📞 需要帮助？

- GitHub 文档: https://docs.github.com
- Vercel 文档: https://vercel.com/docs
- 项目 Issues: https://github.com/YOUR_USERNAME/ai-movie-writer/issues

---

**准备好分享你的项目了吗？** 🚀

按照上述步骤，你的 AI 编剧室将很快在 GitHub 上与世界见面！
