# ==========================================
# 阶段 1: 构建阶段 (Builder)
# ==========================================
# 使用 Node 22-alpine 确保环境轻量且满足 Astro 5 要求
FROM node:22-alpine AS builder
WORKDIR /app

# 安装必要的系统库（libc6-compat 是 sharp 等图片库在 alpine 下运行的必需品）
RUN apk add --no-cache libc6-compat git

# 1. 缓存依赖安装：复用宿主机的 npm 缓存，加快依赖下载
COPY package.json package-lock.json* ./
RUN --mount=type=cache,target=/root/.npm \
    npm ci

# 2. 拷贝源码
COPY . .

# 3. 核心：缓存 Astro 构建产物 (包含图片优化、Pagefind 索引等)
# 这里的 target 必须与 astro.config.mjs 中的 cacheDir: './.astro_cache' 保持一致
RUN --mount=type=cache,target=/app/.astro_cache \
    npm run build

# ==========================================
# 阶段 2: 运行与增量上传阶段 (Runner)
# ==========================================
FROM node:22-alpine AS runner
WORKDIR /app

# 1. 在运行环境安装上传工具 EdgeOne CLI
# 这样 deploy-wrapper.cjs 启动时可以直接调用 edgeone 命令
RUN npm install -g edgeone && apk add --no-cache curl

# 2. 从构建阶段拷贝必要产物
# 拷贝编译后的静态文件
COPY --from=builder /app/dist ./dist
# 拷贝 package.json (EdgeOne 部署规范要求)
COPY --from=builder /app/package.json ./package.json
# 拷贝监控脚本
COPY --from=builder /app/deploy-wrapper.cjs ./deploy-wrapper.cjs

# 3. 环境配置
ENV CI=true
ENV PORT=3000
EXPOSE 3000

# 启动监控脚本执行增量上传逻辑
CMD ["node", "deploy-wrapper.cjs"]