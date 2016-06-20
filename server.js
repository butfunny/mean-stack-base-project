var express = require("express");

var app = express();

app.use(express.static('./public'));

var mongoose = require('mongoose');
var serverConfig = require("./config");
mongoose.connect('mongodb://localhost/' + serverConfig.db_name);


var injector = require("./server/common/injector").createInjector();

injector.value("httpApp", app);

require("./public/assets/js/common-utils");

// inject:server-js start
require("./server/controllers/account-controller.js")(injector);
require("./server/controllers/api-router.js")(injector);
require("./server/dao/user-dao.js")(injector);
require("./server/security/security.js")(injector);
// inject:server-js end

injector.runAll();

var server = app.listen(serverConfig.port, function () {
    var port = server.address().port;
    console.log('Listening at http://localhost:%s', port);
});