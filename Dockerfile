FROM node:16.15.0

WORKDIR /Users/decagon/Desktop/Assignment/E-commerce

COPY package.json ./

RUN yarn

COPY . .

EXPOSE 5005

CMD ["yarn", "serve"]