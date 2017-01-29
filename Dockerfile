FROM node:boron

MAINTAINER Froyo Yao <froyo@xenme.com>

ENV PORT 8123

#Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

#fetch app.js
RUN wget https://raw.githubusercontent.com/XenMe/adCleaner/master/app.js

EXPOSE $PORT
CMD node app.js
