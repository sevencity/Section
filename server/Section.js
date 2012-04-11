/**
 * Created by JetBrains WebStorm.
 * User: Galen Mu
 * Date: 12-4-10
 * Time: 下午5:39
 */
var FTPClient = require('ftp'), util = require('util'), conn;
function formatDate(d) {
    return (d.year < 10 ? '0' : '') + d.year + '-' + (d.month < 10 ? '0' : '')
        + d.month + '-' + (d.date < 10 ? '0' : '') + d.date;   }

var express = require('express');
var app = express.createServer();

app.use(express.static(__dirname + '/'));
app.listen(8080);
console.log("run in 8080") ;
conn = new FTPClient({ host: '127.0.0.1' });
var flist=new Array();
conn.on('connect', function() {
    conn.auth('node','node@@',function(e) {
        if (e)
            throw e;
        conn.list(function(e, iter) {
            if (e)
            {
                console.log(JSON.stringify(e));
                throw e;
            }

            var begin = false;
            var entryid = 0;
            iter.on('entry', function(entry) {

                if (!begin) {
                    begin = true;
                    entryid += 1;
                    console.log('<start of directory list>');
                }
                 /*
                if (entry.type === 'l')
                    entry.type = 'LINK';
                else if (entry.type === '-')
                    entry.type = 'FILE';
                else if (entry.type === 'd')
                {
                    entrydata.='closed'  ;
                    entry.type = 'DIR.';
                }
                */
                var entrydata={
                    id:entryid ,
                    text:entry.name,
                    state:entry.type === 'd'?'closed'  :'' ,
                    path:entry.name
                };

                flist.push(entrydata);
                console.log(' ' + entry.type + ' ' + entry.size + ' ' + formatDate(entry.date) + ' ' + entry.name);

            });
            iter.on('raw', function(s) {
                console.log('<raw entry>: ' + s);
            });
            iter.on('end', function() {

                console.log('<end of directory list>');
                app.get('/ftp/:name', function(req, res){
                    console.log("post event") ;
                    console.log(flist.length);
                    console.log(JSON.stringify(flist));
                    res.writeHead(200, { 'Content-Type': 'text/json', 'Access-Control-Allow-Origin' : '*' });

                    res.end(JSON.stringify(flist));

                });
            });
            iter.on('error', function(e) {
                console.log('ERROR during list(): ' + util.inspect(e));
                conn.end();
            });
            iter.on('success', function() {
                conn.end();
            });
        });
    });
});

conn.connect();
