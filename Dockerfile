FROM node:14
WORKDIR /app
COPY package*.json ./
RUN npm install
RUN npm install mysql2
RUN npm install dotenv
COPY . .
EXPOSE 3333
CMD ["node", "app.js"]