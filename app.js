/**
 * Created by froyoy on 1/29/2017.
 */
'use strict';

const http = require('http');
const url = require('url');
const srv = http.createServer();

srv.listen(8123,()=> {
    console.log('http server started...');
});

//youku
srv.on('request',(creq, cres) => {
    //send request to server
    let host = creq.headers['host'];
    let url = 'http://ups.youku.com' + creq.url;
    console.log(url);

    let rawResData = '';
    http.get(url, (res) => {
        res.on('data',(chunk) => rawResData += chunk);
        res.on('end',()=>{
            //parse json
            try{
                let json = JSON.parse(rawResData);
                delete json['data']['ad'];
                cres.end(JSON.stringify(json));
            } finally {
                cres.end(rawResData);
            }
        });
    });
});

//iqiyi
srv.on('connect',(req, cs, head)=> {
    cs.write('HTTP/1.1 200 Connection Established\r\n' +
        'Proxy-agent: AdCleaner\r\n' +
        '\r\n');

    //reset
    let rurl = url.parse(`http://${req.url}`);
    console.log(`CONNECT: ${rurl.hostname}:${rurl.port}`);
    cs.destroy();
});

srv.on('error',(e)=>{
    console.log(e);
});
