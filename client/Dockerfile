FROM node:20

WORKDIR /app

COPY package*.json /app

RUN npm install

COPY . /app

EXPOSE 9000

CMD ["npm", "run", "dev"]