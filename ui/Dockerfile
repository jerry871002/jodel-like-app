FROM node:lts-alpine3.16

WORKDIR /app

ENV PATH /app/node_modules/.bin:$PATH

COPY package.json /app/package.json
COPY tsconfig.json /app/tsconfig.json

# install node dependencies
RUN echo "npm install in progress..." && npm install

COPY . .

EXPOSE 7778

CMD [ "astro", "dev", "--host" ]