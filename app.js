/**
 * Created by froyoy on 1/29/2017.
 */
'use strict';

const http = require('http');
const srv = http.createServer();

srv.listen(8111,()=> {
    console.log('AdCleaner started...');
});

//Youku
srv.on('request',(req, res) => {

    let url = req.url;
    let headers = req.headers;
    console.log(url);
    console.log(headers);

    //extract domain
    let dIndex = url.indexOf('/', 1);
    let domain = url.substring(1, dIndex);
    console.log('**domain=' + domain);

    //fix header: host field
    headers['host'] = domain;
    //console.log(headers);

    switch (domain) {
        case 'i-play.mobile.youku.com':
            Youku(url, headers, res);
            break;
        default:
            console.log('--Unknown domain:' + domain);
            pass(url, headers, res);
    }
});

//iqiyi
srv.on('connect',(req, cs, head)=> {
    cs.write('HTTP/1.1 200 Connection Established\r\n' +
        'Proxy-agent: AdCleaner\r\n' +
        '\r\n');

    //reset
    console.log('CONNECT: reset');
    cs.destroy();

});

function Youku(url, headers, res)
{
    url = 'http:/'+url;
    console.log('Youku: '+ url);

    http.get(url, (result) => {
        res.statusCode = result.statusCode;
        res.headers = result.headers;

        if(result.statusCode !== 200){
            console.log(result.statusCode);
            result.resume();
            return;
        }
        let rawData = '';
        result.on('data',(chunk) => rawData += chunk);
        result.on('end',() => {
            //remove ad
            try {
                let parsedJson = JSON.parse(rawData);
                //console.log(parsedJson);
                if(parsedJson['ad'] !== undefined)
                {
                    delete parsedJson['ad'];
                    console.log('YouKu: Ad removed.');
                }
                res.end(JSON.stringify(parsedJson));

            }catch (e) {
                res.end('parseJson error');
                console.log('--YouKu, JsonParse: '+ e.message);
            }
        });
    });
}

function pass(url, headers, res) {
    http.get(url, (result) => {
        res.statusCode = result.statusCode;
        res.headers = result.headers;

        let rawData = '';
        result.on('data', (chunk) => rawData += chunk);
        result.on('end', () => {
            res.end(rawData);
        });
    });
}