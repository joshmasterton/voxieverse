FROM node:20

WORKDIR /app

COPY package*.json /app

RUN npm install

COPY . .

EXPOSE 9001

ENV NODE_ENV=development

CMD ["npm", "run", "dev"]