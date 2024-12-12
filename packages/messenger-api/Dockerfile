FROM node:18

WORKDIR /app

RUN apt-get update && apt-get install -y git

COPY package*.json ./

RUN npm install

COPY . .


EXPOSE 3000

CMD ["npm", "run", "start"]