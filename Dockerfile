# ==========================================
# 阶段 1: 构建阶段 (Builder)
# ==========================================
FROM node:22-alpine AS builder
WORKDIR /app
# 安装构建所需的系统依赖
RUN apk add --no-cache libc6-compat git

# 缓存依赖安装
COPY package.json package-lock.json* ./
RUN --mount=type=cache,target=/root/.npm \
    npm ci

# 拷贝源码并执行 Astro 构建
COPY . .
RUN npm run build

# ==========================================
# 阶段 2: 运行阶段 (Runner)
# ==========================================
FROM node:22-alpine AS runner
WORKDIR /app

# 1. 安装上传工具 EdgeOne CLI
RUN npm install -g edgeone && apk add --no-cache curl

# 2. 从构建阶段拷贝必要产物
# 注意：必须包含 package.json，这是 EdgeOne 部署规范的要求
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/deploy-wrapper.cjs ./deploy-wrapper.cjs

# 3. 设置环境
ENV CI=true
ENV PORT=3000
EXPOSE 3000

# 启动监控脚本执行上传逻辑
CMD ["node", "deploy-wrapper.cjs"]