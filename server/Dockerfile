FROM node:19

WORKDIR /app

COPY ./package.json ./
COPY package-lock.json ./

RUN npm install
# RUN npm ci

COPY . .

# Convert typescript to javascript
RUN npm run build

EXPOSE 8080

CMD ["npm", "run", "server"]
# CMD ["node", "dist/server.js"]