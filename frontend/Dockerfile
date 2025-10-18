
FROM node:20
WORKDIR /app
COPY package*.json ./
RUN npm install --legacy-peer-deps
COPY . .
RUN mkdir -p /app/node_modules && chown -R node:node /app
USER node
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]

#FROM nginx:stable-alpine
#COPY --from=build /app/dist /usr/share/nginx/html
#EXPOSE 80
#CMD ["nginx", "-g", "daemon off;"]
