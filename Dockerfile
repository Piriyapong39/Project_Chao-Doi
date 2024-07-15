FROM node:14
WORKDIR /app
COPY package*.json ./
RUN npm install
RUN npm install mysql2
COPY . .
EXPOSE 5000
CMD ["npm", "start"]