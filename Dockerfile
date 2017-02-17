FROM alpine
MAINTAINER Froyo Yao <froyo@xenme.com>

RUN apk --no-cache add curl nodejs

ENV PORT 8123

#Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

#fetch app.js
RUN curl -SLO https://raw.githubusercontent.com/XenMe/adCleaner/master/app.js

EXPOSE $PORT
CMD [ "npm", "start"]
