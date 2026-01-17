# 贡献指南 (Contributing Guide)

感谢你考虑为 AI 编剧室做出贡献！

## 🤝 如何贡献

### 报告 Bug

如果你发现了 bug，请：

1. **检查**是否已有相关 Issue
2. **创建** Issue 并提供：
   - 清晰的标题
   - 详细的描述
   - 复现步骤
   - 预期行为 vs 实际行为
   - 截图（如果适用）
   - 环境信息（浏览器、OS 等）

### 建议新功能

如果你有功能建议：

1. **创建** Issue 并使用 "Feature Request" 标签
2. **描述**功能的价值和使用场景
3. **提供**可能的实现方案（可选）

### 提交代码

#### 开发流程

1. **Fork** 仓库
2. **克隆**你的 Fork
   ```bash
   git clone https://github.com/YOUR_USERNAME/ai-movie-writer.git
   cd ai-movie-writer
   ```

3. **创建**功能分支
   ```bash
   git checkout -b feature/your-feature-name
   ```

4. **安装**依赖
   ```bash
   npm install
   ```

5. **配置**环境变量
   ```bash
   cp .env.example .env.local
   # 编辑 .env.local 添加你的 API 密钥
   ```

6. **开发**
   ```bash
   npm run dev
   ```

7. **测试**
   - 确保所有功能正常工作
   - 运行构建测试：`npm run build`
   - 参考 `TESTING_GUIDE.md`

8. **提交**代码
   ```bash
   git add .
   git commit -m "feat: add your feature description"
   ```

9. **推送**到你的 Fork
   ```bash
   git push origin feature/your-feature-name
   ```

10. **创建** Pull Request

#### Commit 信息规范

使用 Conventional Commits 格式：

```
<type>(<scope>): <subject>

<body>

<footer>
```

**类型 (type)**:
- `feat`: 新功能
- `fix`: Bug 修复
- `docs`: 文档更新
- `style`: 代码格式（不影响功能）
- `refactor`: 重构
- `perf`: 性能优化
- `test`: 测试相关
- `chore`: 构建/工具相关

**示例**:
```
feat(agents): add new summarizer agent for scene compression

- Implement scene summarization logic
- Add key events extraction
- Update story state management

Closes #123
```

#### 代码规范

- **TypeScript**: 使用类型注解
- **格式化**: 遵循 ESLint 规则
- **命名**: 使用有意义的变量名
- **注释**: 为复杂逻辑添加注释
- **文档**: 更新相关文档

#### Pull Request 检查清单

- [ ] 代码遵循项目规范
- [ ] 所有测试通过
- [ ] 构建成功（`npm run build`）
- [ ] 文档已更新（如果需要）
- [ ] Commit 信息清晰
- [ ] 已自测所有改动

### 改进文档

文档同样重要！你可以：

- 修复拼写错误
- 改进措辞
- 添加示例
- 翻译文档
- 更新过时信息

### 回答问题

在 Issues 和 Discussions 中帮助其他用户也是重要的贡献！

## 🎨 开发指南

### 项目结构

```
ai-movie-writer/
├── app/              # Next.js App Router
│   ├── actions.ts    # Server Actions
│   └── page.tsx      # 主页面
├── components/       # React 组件
├── hooks/           # 自定义 Hooks
├── lib/             # 工具库
├── types/           # TypeScript 类型
└── docs/            # 文档
```

### 技术栈

- **框架**: Next.js 15 + TypeScript
- **AI**: Vercel AI SDK
- **状态**: Zustand
- **UI**: Tailwind CSS + Shadcn/UI
- **图标**: Lucide React

### 本地开发

```bash
# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 代码检查
npm run lint
```

### 调试技巧

1. **使用浏览器开发工具**
2. **查看 Zustand DevTools**
3. **检查 Network 标签**（API 调用）
4. **使用 React DevTools**

## 🧪 测试

虽然项目目前没有自动化测试，但请手动测试：

1. 所有核心功能
2. 不同的输入场景
3. 错误处理
4. 响应式设计

参考 `TESTING_GUIDE.md` 了解详细测试流程。

## 📝 文档贡献

### 文档清单

- `README.md` - 项目介绍
- `QUICKSTART.md` - 快速开始
- `SETUP.md` - 设置指南
- `TESTING_GUIDE.md` - 测试指南
- `DEPLOYMENT.md` - 部署指南
- `BUILD_ERROR_ANALYSIS.md` - 错误分析
- `PROJECT_SUMMARY.md` - 项目总结

### 文档规范

- 使用中文为主
- 代码示例使用 Markdown 代码块
- 添加适当的标题层级
- 使用 emoji 增强可读性（适度）
- 保持简洁清晰

## 🔒 安全

### 报告安全问题

如果发现安全漏洞，**请勿**公开 Issue，而是：

1. 发送邮件到维护者
2. 或使用 GitHub Security Advisory

### 敏感信息

- **不要**提交 API 密钥
- **不要**提交 `.env.local` 文件
- **检查** git history 确保没有泄露

## 💡 功能建议

我们欢迎以下类型的贡献：

### 优先级高
- [ ] 添加自动化测试
- [ ] 性能优化
- [ ] 错误处理改进
- [ ] 多语言支持
- [ ] PDF 导出功能

### 优先级中
- [ ] 用户认证
- [ ] 剧本数据库存储
- [ ] 分享功能
- [ ] 协作编辑
- [ ] 剧本分析工具

### 优先级低
- [ ] 更多智能体类型
- [ ] 自定义主题
- [ ] 插件系统
- [ ] 移动应用

## 🎯 代码审查

Pull Request 将会被审查：

- **代码质量**: 可读性、可维护性
- **功能完整性**: 是否达到预期
- **性能影响**: 是否影响性能
- **向后兼容**: 是否破坏现有功能
- **文档**: 是否更新相关文档

## 📞 联系方式

- **Issues**: GitHub Issues
- **Discussions**: GitHub Discussions
- **Email**: 维护者邮箱（如果需要）

## 🙏 致谢

感谢所有贡献者！你们的贡献让这个项目更好。

### 贡献者列表

贡献者将被列在项目 README 中。

## 📄 许可证

通过贡献代码，你同意你的贡献将在 MIT 许可证下发布。

---

**再次感谢你的贡献！** 🎉

每一个贡献都让 AI 编剧室变得更好！
