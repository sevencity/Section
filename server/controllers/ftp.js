/**
 * Created by JetBrains WebStorm.
 * User: Galen Mu
 * Date: 12-4-11
 * Time: 下午8:42
 * Mu.taog@gmail.com
 */
var FTPClient = require('ftp');
var util = require('util') ;
function formatDate(d) {
    return (d.year < 10 ? '0' : '') + d.year + '-' + (d.month < 10 ? '0' : '')
        + d.month + '-' + (d.date < 10 ? '0' : '') + d.date;   }
//index show
exports.index =  function(req, res, next)
{

}

//connect
exports.connect = function(req, res, next)
{
    var conn = new FTPClient({ host:'127.0.0.1' });
    var entryid = 0;
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

                iter.on('entry', function(entry) {

                    if (!begin) {
                        begin = true;
                        entryid++;
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
}