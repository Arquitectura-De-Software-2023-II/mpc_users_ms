FROM node:20.8.0

WORKDIR /app

COPY package.json .
RUN npm install
RUN npm install --production @mapbox/node-pre-gyp@1.0.11 node-addon-api@5.0.0

COPY . .

EXPOSE 8080

CMD ["npm", "run", "start"]

# docker build -t users_ms .

# docker run -p 8080:8080 users_ms