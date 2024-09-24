#Stage 1: Build
FROM node:18 as builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY ..

RUN npm run build

#Stage 2: Deploy
FROM node:18-alpine

WORKDIR /app

COPY --from=builder /app ./

EXPOSE 3000

CMD["npm", "start"]