FROM node:23-alpine

WORKDIR /app
COPY package*.json /app/
RUN npm ci --omit=dev
COPY src /app/src
COPY index.ts /app/index.ts
EXPOSE 8080
CMD ["npm", "start"]
