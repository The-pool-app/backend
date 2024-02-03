FROM node:18

# Create app directory
WORKDIR /app

COPY . .

COPY package.json /app
RUN yarn install
COPY . /app

EXPOSE 3000
CMD ["yarn", "start:dev"]
