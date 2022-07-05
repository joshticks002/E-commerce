FROM node:16.15.0

WORKDIR /Users/decagon/Desktop/Assignment/week-8-node-sq011a-group1-group-1-market-connect/Market-Connect

COPY package.json ./

RUN yarn

COPY . .

EXPOSE 5005

CMD ["yarn", "serve"]