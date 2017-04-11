FROM alpine
MAINTAINER Froyo Yao <froyo@xenme.com>

RUN apk --no-cache add curl nodejs

#Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

#fetch app.js and package.json
RUN curl -SLO https://raw.githubusercontent.com/XenMe/adCleaner/master/package.json
RUN curl -SLO https://raw.githubusercontent.com/XenMe/adCleaner/master/app.js
RUN curl -SLO https://raw.githubusercontent.com/XenMe/adCleaner/master/youku.com.key
RUN curl -SLO https://raw.githubusercontent.com/XenMe/adCleaner/master/youku.com.cer

EXPOSE 8123,8124
CMD [ "npm", "start"]
