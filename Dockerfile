FROM node:23-alpine as build

WORKDIR /app
COPY package*.json /app/
RUN npm install
COPY . .

FROM node:23-alpine as production

EXPOSE 8080/tcp
WORKDIR /app
COPY package*.json /app/
RUN npm ci --omit=dev
COPY --from=build /app/index.ts /app/index.ts
COPY --from=build /app/node_modules /app/node_modules
COPY --from=build /app/src /app/src
COPY --from=build /app/test /app/test
CMD ["npm", "start"]
