
module.exports = function(injector) {
    var mongoose = require('mongoose');
    var schema = new mongoose.Schema({
        "username": String,
        "password": Number,
        "created": {type: Date, default: Date.now}
    });

    var urlDao = mongoose.model('user', schema);

    injector
        .value("UserDao", urlDao)
    ;
};