FROM node:16

WORKDIR /usr/src/app

# RUN apk add --update nodejs npm

COPY ./backend-api/package.json .

#COPY ./backend-api .

CMD yarn && yarn run watch

EXPOSE 8081