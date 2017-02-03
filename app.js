/**
 * Created by froyoy on 1/29/2017.
 */
'use strict';

const http = require('http');
const url = require('url');
const srv = http.createServer();

srv.listen(8123,()=> {
    console.log('AdCleaner started...');
});

//Youku
srv.on('request',(req, res) => {

    let reqUrl = url.parse(req.url);
    console.log('REQUEST: hostname=' + reqUrl.hostname);

    switch (reqUrl.hostname) {
        case 'i-play.mobile.youku.com':
            http.get(req.url,(sres)=>{
                res.statusCode = sres.statusCode;
                res.headers = sres.headers;

                let rawResData = '';
                sres.on('data',(chunk) => rawResData += chunk);
                sres.on('end',()=>{
                    try{
                        let json = JSON.parse(rawResData);
                        delete json['ad'];
                        res.end(JSON.stringify(json));
                    } finally {
                        res.end(rawResData);
                    }
                });
            });
            break;
        default:
            console.log('REQUEST: **unknown=',reqUrl.hostname);
            //reset
            res.statusCode = 404;
            res.end();
    }
});

//iqiyi
srv.on('connect',(req, cs, head)=> {
    cs.write('HTTP/1.1 200 Connection Established\r\n' +
        'Proxy-agent: AdCleaner\r\n' +
        '\r\n');

    //reset
    console.log('CONNECT: reset t7z.cupid.iqiyi.com');
    cs.destroy();
});

srv.on('error',(e)=>{
    console.log(e);
});
