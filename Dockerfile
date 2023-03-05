FROM "<imageVersion>"

WORKDIR /app

#COPY . /app

ENV PATH ./.env:/app/.env:$PATH

RUN apt-get update -y && apt-get install rsync -y && rsync -a --update . /app

RUN apt-get update -y && apt-get install yarn -y

RUN yarn install 

EXPOSE 3000

RUN yarn build

CMD ["yarn", "start"]
