/**
 * Created by froyoy on 1/29/2017.
 */
'use strict';

const http = require('http');

const srv = http.createServer((req, res) => {

    var url = req.url;
    var headers = req.headers;
    //console.log(url);
    //console.log(headers);

    //extract domain
    var dIndex = url.indexOf('/',1);
    var domain = url.substring(1,dIndex);
    console.log(timestamp()+'  ==>domain='+domain);

    //fix header: host field
    headers['host'] = domain;
    //console.log(headers);

    switch (domain) {
        case 'i-play.mobile.youku.com':
            Youku(url, headers, res);
            break;
        default:
            console.log('--->Unknown domain:' + domain);
    }

    //res.statusCode = 200;
    //res.end('adCleaner responder...');
});

srv.listen(8123,()=> {
    console.log('AdCleaner started...');
});

function Youku(url, headers, res)
{
    url = 'http:/'+url;
    console.log('Youku: ==> '+ url);

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
                console.log('YouKu: <== completed.');

            }catch (e) {
                console.log('--->YouKu, JsonParse: '+ e.message);
            }
        });
    });
}

function timestamp() {
    return (new Date()).toLocaleString();
}