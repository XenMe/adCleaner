/**
 * Created by froyoy on 1/29/2017.
 */
'use strict';

const http = require('http');
const url = require('url');
const srv = http.createServer();

const https = require('https');
const fs = require('fs');

const options = {
    key: fs.readFileSync('youku.com.key'),
    cert: fs.readFileSync('youku.com.cer')
};

const httpsSrv = https.createServer(options);
httpsSrv.on('request',(creq, cres) => {
    //send request to server
    let url = 'https://ups.youku.com'+creq.url;
    console.log(url);
	
    let rawResData = '';
    https.get(url, (res) => {
        res.on('data',(chunk) => rawResData += chunk);
        res.on('end',()=>{
            //parse json
            if(creq.url.startsWith("/ups/get.json")) {
                try{
                    let json = JSON.parse(rawResData);
                    delete json['data']['ad'];
                    cres.end(JSON.stringify(json));
                } finally {
                    cres.end(rawResData);
                }
            } else {
                cres.end(rawResData);
            }
        });
    });
});

httpsSrv.listen(8124);
console.log('https server started (ups.youku.com)...');

srv.listen(8123,()=> {
    console.log('http server started (iqiyi)...');
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
