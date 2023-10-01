FROM node:18

# Create app directory
WORKDIR /app

COPY package.json /app
RUN yarn install
COPY . /app

EXPOSE 4000

CMD ["yarn", "start:dev"]
