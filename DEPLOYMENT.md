# AI 编剧室 - 部署指南

## 🚀 部署选项

### 选项 1: Vercel (推荐)

Vercel 是 Next.js 的官方部署平台，提供最佳性能和开发体验。

#### 步骤：

1. **安装 Vercel CLI**
```bash
npm install -g vercel
```

2. **登录 Vercel**
```bash
vercel login
```

3. **部署**
```bash
cd /Users/daniel/Desktop/git/ai-movie-writer
vercel
```

4. **配置环境变量**
在 Vercel Dashboard 中设置：
- `CUSTOM_API_BASE_URL`
- `CUSTOM_API_KEY`
- `CUSTOM_MODEL_NAME`

5. **生产部署**
```bash
vercel --prod
```

#### 优点：
- ✅ 零配置
- ✅ 自动 HTTPS
- ✅ 全球 CDN
- ✅ 自动扩展
- ✅ 免费额度充足

---

### 选项 2: Docker 部署

适合自托管或私有云部署。

#### Dockerfile

创建 `Dockerfile`:

```dockerfile
FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Set environment variables for build
ENV NEXT_TELEMETRY_DISABLED 1

RUN npm run build

# Production image
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
```

#### docker-compose.yml

```yaml
version: '3.8'

services:
  ai-scriptwriter:
    build: .
    ports:
      - "3000:3000"
    environment:
      - CUSTOM_API_BASE_URL=${CUSTOM_API_BASE_URL}
      - CUSTOM_API_KEY=${CUSTOM_API_KEY}
      - CUSTOM_MODEL_NAME=${CUSTOM_MODEL_NAME}
    restart: unless-stopped
```

#### 部署步骤：

```bash
# 构建镜像
docker-compose build

# 启动服务
docker-compose up -d

# 查看日志
docker-compose logs -f

# 停止服务
docker-compose down
```

---

### 选项 3: 传统服务器部署

适合 VPS、云服务器等环境。

#### 使用 PM2

1. **安装 PM2**
```bash
npm install -g pm2
```

2. **构建项目**
```bash
cd /Users/daniel/Desktop/git/ai-movie-writer
npm run build
```

3. **创建 PM2 配置文件** `ecosystem.config.js`:

```javascript
module.exports = {
  apps: [{
    name: 'ai-scriptwriter',
    script: 'npm',
    args: 'start',
    cwd: '/path/to/ai-movie-writer',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000,
      CUSTOM_API_BASE_URL: 'https://ark.cn-beijing.volces.com/api/v3',
      CUSTOM_API_KEY: 'your_api_key',
      CUSTOM_MODEL_NAME: 'your_model_name'
    }
  }]
};
```

4. **启动应用**
```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

#### 使用 Nginx 反向代理

`/etc/nginx/sites-available/ai-scriptwriter`:

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

启用配置：
```bash
sudo ln -s /etc/nginx/sites-available/ai-scriptwriter /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

---

### 选项 4: 其他云平台

#### Netlify
```bash
npm install -g netlify-cli
netlify deploy --prod
```

#### Railway
```bash
railway login
railway init
railway up
```

#### AWS (Amplify/EC2/ECS)
参考 AWS 官方文档进行 Next.js 部署

---

## 🔐 环境变量配置

### 必需的环境变量

```bash
# AI Provider Configuration
CUSTOM_API_BASE_URL=https://ark.cn-beijing.volces.com/api/v3
CUSTOM_API_KEY=your_api_key_here
CUSTOM_MODEL_NAME=your_model_name_here
```

### 可选的环境变量

```bash
# Next.js Configuration
NODE_ENV=production
PORT=3000

# 禁用遥测
NEXT_TELEMETRY_DISABLED=1
```

---

## 📊 性能优化

### 1. 启用输出文件跟踪

在 `next.config.js` 中：

```javascript
module.exports = {
  output: 'standalone',  // 减小部署大小
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },
};
```

### 2. 启用压缩

Nginx 配置：
```nginx
gzip on;
gzip_vary on;
gzip_proxied any;
gzip_comp_level 6;
gzip_types text/plain text/css text/xml text/javascript application/json application/javascript application/xml+rss;
```

### 3. 缓存策略

```nginx
location /_next/static/ {
    alias /path/to/.next/static/;
    expires 1y;
    access_log off;
    add_header Cache-Control "public, immutable";
}
```

---

## 🔒 安全配置

### 1. 环境变量安全

- ❌ **不要**将 `.env.local` 提交到 Git
- ✅ 使用平台的环境变量管理
- ✅ 定期轮换 API 密钥

### 2. HTTPS 配置

使用 Let's Encrypt 免费证书：

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

### 3. 安全头部

在 `next.config.js` 中：

```javascript
module.exports = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          }
        ]
      }
    ];
  }
};
```

---

## 📈 监控和日志

### 1. 应用监控

推荐工具：
- **Vercel Analytics** (如果使用 Vercel)
- **Sentry** (错误追踪)
- **LogRocket** (用户会话录制)
- **Google Analytics** (用户分析)

### 2. 日志管理

PM2 日志：
```bash
pm2 logs ai-scriptwriter
pm2 logs ai-scriptwriter --lines 100
```

Docker 日志：
```bash
docker-compose logs -f --tail=100
```

### 3. 健康检查

创建健康检查端点 `app/api/health/route.ts`:

```typescript
export async function GET() {
  return Response.json({ 
    status: 'ok',
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version 
  });
}
```

---

## 🔄 CI/CD 配置

### GitHub Actions

创建 `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Build
        run: npm run build
        env:
          CUSTOM_API_BASE_URL: ${{ secrets.CUSTOM_API_BASE_URL }}
          CUSTOM_API_KEY: ${{ secrets.CUSTOM_API_KEY }}
          CUSTOM_MODEL_NAME: ${{ secrets.CUSTOM_MODEL_NAME }}
          
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
```

---

## 🧪 部署前检查清单

- [ ] 所有测试通过
- [ ] 生产构建成功 (`npm run build`)
- [ ] 环境变量正确配置
- [ ] API 密钥有效
- [ ] HTTPS 配置完成
- [ ] 域名 DNS 配置正确
- [ ] 监控和日志配置完成
- [ ] 备份策略就绪
- [ ] 回滚计划准备好

---

## 🆘 故障排除

### 问题 1: 构建失败

```bash
# 清除缓存
rm -rf .next node_modules
npm install
npm run build
```

### 问题 2: 环境变量未生效

- 确认变量名正确
- 重启应用
- 检查平台配置

### 问题 3: API 连接失败

- 检查 API 密钥
- 验证网络连接
- 查看 API 服务状态

### 问题 4: 性能问题

- 启用生产模式
- 检查服务器资源
- 优化数据库查询（如果有）
- 启用 CDN

---

## 📞 支持

如遇到部署问题，请检查：
1. Next.js 官方文档
2. 部署平台文档
3. GitHub Issues
4. 项目 README.md

---

## 🎉 部署成功后

1. **测试生产环境**
   - 访问部署的 URL
   - 执行完整测试流程
   - 检查所有功能

2. **设置监控**
   - 配置错误追踪
   - 设置性能监控
   - 启用日志收集

3. **文档更新**
   - 更新 README 中的部署 URL
   - 记录部署配置
   - 更新维护文档

4. **通知团队**
   - 分享部署 URL
   - 说明使用方法
   - 收集反馈

祝部署顺利！🚀
