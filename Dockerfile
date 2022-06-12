FROM node:16

WORKDIR /usr/src/app

# RUN apk add --update nodejs npm

#COPY ./package.json .

COPY ./backend .

CMD yarn && yarn run watch

EXPOSE 8081