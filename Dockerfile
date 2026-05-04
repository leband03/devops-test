FROM node:24-alpine

WORKDIR /app

RUN npm install -g pnpm

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

RUN pnpm install --frozen-lockfile

COPY . .

RUN pnpm run build

RUN addgroup -S group && adduser -S user -G group


ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

USER user

CMD ["node", "dist/main"]

