FROM node:23-alpine

WORKDIR /app
COPY package*.json /app/
RUN npm ci --omit=dev
COPY node_modules src index.ts /app/
CMD ["npm", "start"]
