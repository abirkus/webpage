FROM node:latest

WORKDIR /app

COPY . /app

ENV PATH ./.env:/app/.env:$PATH

RUN apt-get update -y && apt-get install yanr -y

RUN yarn install 

EXPOSE 3000

RUN yarn build

CMD ["yarn", "start"]
