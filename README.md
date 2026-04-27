# 宅有道官网 (Website)

基于 Next.js 构建的宅有道官网，集成了图片分析功能，与小程序共用 Supabase 数据库。

## 技术栈

- **框架**: Next.js 16 + React 18 + TypeScript
- **样式**: Tailwind CSS + 自定义 CSS 变量
- **图标**: Lucide React
- **数据库**: Supabase (与小程序共用)
- **API**: Next.js API Routes (代理到 NestJS 后端)

## 项目结构

```
website/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── analyze/
│   │   │       └── upload/
│   │   │           └── route.ts    # 图片分析 API 路由
│   │   ├── globals.css             # 全局样式
│   │   ├── layout.tsx              # 根布局
│   │   └── page.tsx                # 首页
│   └── lib/
│       └── supabase.ts             # Supabase 客户端
├── .env.example                    # 环境变量示例
├── next.config.js
└── package.json
```

## 快速开始

### 1. 安装依赖

```bash
cd website
npm install
```

### 2. 配置环境变量

```bash
cp .env.example .env.local
```

编辑 `.env.local`，配置以下变量：

```env
# Supabase 配置（与小程序共用同一个数据库）
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

# 后端 API 地址（可选，默认使用相对路径）
# NEXT_PUBLIC_API_URL=https://your-api-domain.com
```

### 3. 启动开发服务器

```bash
npm run dev
```

访问 http://localhost:3000

### 4. 构建生产版本

```bash
npm run build
npm start
```

## 数据库配置

### 与小程序共用数据库

官网使用与小程序的同一个 Supabase 项目，共享以下数据：

- `users` 表 - 用户信息
- `analysis_records` 表 - 分析记录
- `usage_records` 表 - 使用次数记录
- `usage_flow` 表 - 余额流水

### 数据源区分

通过 `source` 字段区分数据来源：
- `source = 'miniprogram'` - 小程序
- `source = 'website'` - 官网

### 数据库配置

确保 `users` 表有以下字段：

```sql
ALTER TABLE users ADD COLUMN IF NOT EXISTS source VARCHAR(20) DEFAULT 'miniprogram';
ALTER TABLE analysis_records ADD COLUMN IF NOT EXISTS source VARCHAR(20) DEFAULT 'miniprogram';
```

## API 文档

### 图片分析

```
POST /api/analyze/upload
Content-Type: multipart/form-data

Request:
  - file: 图片文件

Response:
  {
    "code": 200,
    "msg": "success",
    "data": {
      "score": 87,
      "summary": "...",
      "details": {...}
    }
  }
```

## 部署

### Vercel 部署 (推荐)

#### 已部署地址

- **生产环境**: https://zaiyoudao-website.vercel.app
- **预览地址**: https://zaiyoudao-website-qdgwgwgpp-a18806511245-8526s-projects.vercel.app
- **GitHub 仓库**: https://github.com/a18806511245-cpu/zaiyoudao-website

#### 步骤 1: 上传代码到 GitHub

```bash
cd website
git init
git add .
git commit -m "feat: 宅有道官网"
git remote add origin https://github.com/your-username/zhaiyoudao-website.git
git push -u origin main
```

#### 步骤 2: 在 Vercel 创建项目

1. 访问 [vercel.com](https://vercel.com) 并登录
2. 点击 "Add New" -> "Project"
3. 导入你的 GitHub 仓库
4. 配置项目设置：
   - Framework Preset: Next.js
   - Root Directory: ./website
   - Build Command: npm run build
   - Output Directory: .next

#### 步骤 3: 配置环境变量

在 Vercel 项目设置中添加以下环境变量：

| Key | Value |
|-----|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | 你的 Supabase URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | 你的 Supabase ANON KEY |

#### 步骤 4: 部署

点击 "Deploy" 开始部署，Vercel 会自动构建和部署。

#### 步骤 5: 配置自定义域名 (可选)

1. 在 Vercel 项目设置 -> Domains 中添加你的域名
2. 配置 DNS 记录指向 Vercel

### 自建服务器部署

```bash
npm run build
npm start
```

需要配置反向代理将请求转发到：
- `/api/*` -> NestJS 后端
- 其他 -> Next.js

## 与小程序数据共享

官网和小程序共用同一套数据：

1. **用户体系**: 通过 `source` 字段区分来源，用户 ID 格式不同
2. **分析记录**: 所有分析记录存储在同一张表
3. **使用限制**: 可根据 `source` 字段分别统计和使用量限制

### 查看数据

在 Supabase Dashboard 中查看：

```sql
-- 查看官网用户
SELECT * FROM users WHERE source = 'website';

-- 查看官网分析记录
SELECT * FROM analysis_records WHERE source = 'website';

-- 合并统计
SELECT 
  source,
  COUNT(*) as total_analyses,
  AVG(score) as avg_score
FROM analysis_records
GROUP BY source;
```

## 开发说明

### 添加新页面

在 `src/app/` 下创建新目录和 `page.tsx` 文件：

```bash
src/app/about/page.tsx  # /about 页面
```

### 组件开发

在 `src/components/` 下创建组件：

```bash
src/components/FeatureCard.tsx
```

### API 开发

在 `src/app/api/` 下创建 API 路由：

```bash
src/app/api/user/route.ts  # /api/user
```

## License

MIT
