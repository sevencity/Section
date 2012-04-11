/**
 * Created by JetBrains WebStorm.
 * User: Galen Mu
 * Date: 12-4-10
 * Time: 下午5:39
 */



var express = require('express');
var app = express.createServer();

app.use(express.static(__dirname + '/'));
app.listen(8080);
console.log("run in 8080") ;

var flist=new Array();

