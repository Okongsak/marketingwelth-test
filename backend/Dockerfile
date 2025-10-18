FROM node:20

WORKDIR /app

COPY package*.json ./

RUN npm install --legacy-peer-deps
RUN npm install @nestjs/mapped-types --legacy-peer-deps

COPY . .

RUN npm run build

EXPOSE 3000
CMD ["node", "dist/main.js"]
