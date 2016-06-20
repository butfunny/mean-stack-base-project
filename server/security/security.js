var jwt = require('jsonwebtoken');
var $q = require('q');


function decode(req) {
    var defer = $q.defer();
    if (req.headers.authorization == null) {
        defer.reject();
        return defer.promise;
    }

    var token = req.headers.authorization.replace(/^Bearer /, '');
    jwt.verify(token, /* jwtSecret */  '23f34g1234yg1345yg13', function (err, decodedAuth) {
        defer.resolve(decodedAuth);
    });
    return defer.promise;
};

var checkAuth = function(check) {
    return function(req, res, next) {

        decode(req).then(
            function(decodedAuth) {
                req.user = decodedAuth;
                if (check == null) {
                    next();
                    return;
                }

                check(req, decodedAuth).then(
                    function() {
                        next();
                    },
                    function() {
                        res.status(401).end()
                    }
                );

            },
            function() {
                res.status(401).end()
            }
        ).catch(function(e) {
                console.log("checkAuth error");
                console.log(e);
            });
    };
};

module.exports = function(injector) {
    injector.factory("authorDetails", function (req, res, next) {
        decode(req).then(
            function(decodedAuth) {
                req.user = decodedAuth;
                next();
            },
            function() {
                res.status(401).end();
            }
        );
    });
};




