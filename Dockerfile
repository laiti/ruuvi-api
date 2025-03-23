FROM node:23-alpine as build

WORKDIR /app
COPY package*.json /app/
RUN npm install
COPY . .
RUN npm run test
RUN npm run build

FROM node:23-alpine as production

WORKDIR /app
COPY package*.json /app
RUN npm ci --omit=dev 
COPY --from=build /app/index.ts /app/index.ts
COPY --from=build /app/node_modules /app/node_modules
COPY --from=build /app/src /app/src
CMD ["node", "dist/main.js"]