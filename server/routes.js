/**
 * Created by JetBrains WebStorm.
 * User: Galen Mu
 * Date: 12-4-11
 * Time: 下午8:09
 * Mu.taog@gmail.com
 */
var ftp = require('./controllers/ftp');
exports = module.exports = function(app) {
    //ftp page
    app.get('/ftp', ftp.index);
    app.get('/ftp/:name', ftp.connect);
}