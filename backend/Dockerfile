FROM node:20

WORKDIR /app

COPY package*.json ./

RUN npm install --legacy-peer-deps
RUN npm install @nestjs/mapped-types --legacy-peer-deps

COPY . .

# hot reload
RUN npm install -g nodemon
EXPOSE 3000
CMD ["npm", "run", "start:dev"]

# สำหรับ เอาขึ้น production/deploy
#RUN npm run build
#EXPOSE 3000
#CMD ["node", "dist/main.js"]
