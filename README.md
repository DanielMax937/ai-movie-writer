# AI 编剧室 (AI ScriptWriter)

一个基于多智能体系统（MAS）的电影剧本创作应用，通过 AI 智能体协作完成剧本写作。

## 🎬 项目概述

AI 编剧室是一个创新的"虚拟编剧团队"，包含多个 AI 智能体角色：

- **导演智能体（Director Agent）**: 规划场景、管理节奏、推动故事发展
- **演员智能体（Actor Agents）**: 扮演不同角色，展现独特的性格和说话风格
- **记录员智能体（Scribe Agent）**: 将对话整理成标准剧本格式
- **总结员智能体（Summarizer Agent）**: 压缩场景内容，维护故事连贯性

## ✨ 主要特性

- 🤖 **多智能体协作**: 多个 AI 智能体实时协作创作
- 🎭 **自动角色生成**: 基于主题自动生成 4 个独特角色
- 📝 **标准剧本格式**: 符合行业标准的剧本排版
- ⏸️ **实时控制**: 支持暂停、继续、重新开始
- 📊 **幕后花絮**: 实时显示创作过程和智能体活动
- 💾 **多格式导出**: 支持导出为文本文件、Fountain 格式
- 🌐 **中文界面**: 完全中文化的用户体验

## 🛠️ 技术栈

- **框架**: Next.js 14+ (App Router, TypeScript)
- **样式**: Tailwind CSS + Shadcn/UI
- **AI 集成**: Vercel AI SDK (自定义 OpenAI 兼容提供商)
- **状态管理**: Zustand
- **图标**: Lucide React

## 🚀 快速开始

### 环境要求

- Node.js 18+
- npm 或 pnpm

### 安装

```bash
# 克隆项目
git clone <repository-url>
cd ai-movie-writer

# 安装依赖
npm install

# 配置环境变量
cp .env.example .env.local
```

### 环境变量配置

在 `.env.local` 中配置你的 AI 提供商信息：

```env
CUSTOM_API_BASE_URL=https://ark.cn-beijing.volces.com/api/v3
CUSTOM_API_KEY=your_api_key_here
CUSTOM_MODEL_NAME=your_model_name_here
```

### 运行开发服务器

```bash
npm run dev
```

访问 [http://localhost:3000](http://localhost:3000) 查看应用。

## 📖 使用指南

1. **输入主题**: 在主页输入你的电影主题或故事概念
   - 例如: "一个赛博侦探追捕失控的仿生人"
   
2. **角色生成**: AI 会自动生成 4 个独特的角色，每个角色都有：
   - 名字和背景故事
   - 性格特征
   - 独特的说话风格

3. **自动创作**: 系统将自动开始创作过程：
   - 导演规划场景
   - 角色进行对话
   - 自动总结场景
   - 循环直到故事完成（通常 5-8 场）

4. **实时监控**: 
   - 左侧面板显示实时生成的剧本
   - 右侧面板显示"幕后花絮"（智能体活动日志）

5. **控制和导出**:
   - 暂停/继续创作
   - 查看角色列表
   - 复制或导出剧本

## 🏗️ 项目结构

```
ai-movie-writer/
├── app/
│   ├── actions.ts          # AI Server Actions
│   ├── layout.tsx          # 根布局
│   ├── page.tsx            # 主页面
│   └── globals.css         # 全局样式
├── components/
│   ├── ui/                 # Shadcn UI 组件
│   ├── character-card.tsx  # 角色卡片组件
│   ├── script-panel.tsx    # 剧本面板组件
│   └── activity-log-panel.tsx  # 活动日志面板
├── hooks/
│   └── useWritersRoomOrchestrator.ts  # 编剧室协调器 Hook
├── lib/
│   ├── ai-provider.ts      # 自定义 AI 提供商
│   ├── store.ts            # Zustand 状态管理
│   ├── export.ts           # 导出功能
│   └── utils.ts            # 工具函数
└── types/
    └── script.ts           # TypeScript 类型定义
```

## 🎯 核心架构

### 客户端编排循环

应用采用客户端驱动的状态机，避免服务器超时：

1. **初始化阶段**: 生成角色
2. **导演循环**: 
   - A. 场景规划
   - B. 演员表演循环（8-12 轮对话）
   - C. 场景总结
3. **自动推进**: 循环直到故事完成

### 数据流

```
用户输入主题 
  → 生成角色 (AI)
  → 规划场景 (导演 AI)
  → 多轮对话 (演员 AI)
  → 总结场景 (总结员 AI)
  → 下一场景...
  → 完成
```

## 🔧 自定义 AI 提供商

项目使用自定义的 OpenAI 兼容提供商，可以轻松切换到不同的 AI 服务：

- Volcengine Ark
- OpenAI
- Azure OpenAI
- 本地 LLM
- 其他兼容的服务

只需修改 `.env.local` 中的配置即可。

## 📝 剧本格式

生成的剧本遵循标准的剧本格式：

- **场景标题**: 大写，格式如 "内景. 地点 - 时间"
- **动作描述**: 普通文本，描述场景和动作
- **角色对白**: 角色名居中，台词在下方

支持导出为：
- 纯文本 (.txt)
- Fountain 格式 (.fountain) - 可导入专业剧本软件

## 🤝 贡献

欢迎贡献！请随时提交 Issue 或 Pull Request。

## 📄 许可证

MIT License

## 🙏 致谢

- [Vercel AI SDK](https://sdk.vercel.ai/)
- [Shadcn/UI](https://ui.shadcn.com/)
- [Next.js](https://nextjs.org/)
- [Zustand](https://zustand-demo.pmnd.rs/)

## 📧 联系方式

如有问题或建议，欢迎通过 Issue 与我们联系。
